// pages/api/cotizacion.js - VERSIÓN CORREGIDA
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const {
        nombre,
        contacto,
        correo,
        telefono,
        direccion,
        mensaje,
        productos
    } = req.body;

    if (!nombre || !correo || !telefono || !productos || productos.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Faltan campos requeridos'
        });
    }

    const ODOO_CONFIG = {
        url: 'https://fabmetal.odoo.com',
        db: 'fabmetal',
        username: "admin@fabmetal.com.pa",
        password: "#Fabmetal1*/"
    };

    try {
        console.log('🚀 Iniciando creación de cotización en Odoo...');

        // === 1. AUTENTICACIÓN ===
        console.log('🔐 Autenticando en Odoo...');
        const authRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'common',
                    method: 'authenticate',
                    args: [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.password, {}]
                },
                id: 1
            })
        });

        const authData = await authRes.json();
        const uid = authData.result;
        
        if (!uid || typeof uid !== 'number') {
            throw new Error('Autenticación fallida en Odoo');
        }
        console.log('✅ Autenticación exitosa, UID:', uid);

        // === 2. BUSCAR O CREAR CLIENTE ===
        console.log('👤 Buscando cliente por email:', correo);
        let partnerId;
        
        const searchPartnerRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        ODOO_CONFIG.db,
                        uid,
                        ODOO_CONFIG.password,
                        'res.partner',
                        'search_read',
                        [[['email', '=', correo]]],
                        { fields: ['id', 'name'], limit: 1 }
                    ]
                },
                id: 2
            })
        });

        const searchPartnerData = await searchPartnerRes.json();
        
        if (searchPartnerData.result && searchPartnerData.result.length > 0) {
            partnerId = searchPartnerData.result[0].id;
            console.log(`✅ Cliente encontrado, ID: ${partnerId}`);
        } else {
            console.log('👤 Creando nuevo cliente...');
            const partnerData = {
                name: nombre,
                email: correo,
                phone: telefono,
                street: direccion || '',
                type: 'contact'
            };
            
            if (contacto && contacto !== nombre) {
                partnerData.contacto = contacto;
            }
            
            const createPartnerRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'res.partner',
                            'create',
                            [partnerData]
                        ]
                    },
                    id: 3
                })
            });

            const createPartnerData = await createPartnerRes.json();
            partnerId = createPartnerData.result;
            console.log(`✅ Cliente creado, ID: ${partnerId}`);
        }

        // === 3. PREPARAR LÍNEAS DE PRODUCTOS ===
        console.log(`🛒 Procesando ${productos.length} productos...`);
        const orderLines = [];

        for (const [index, producto] of productos.entries()) {
            console.log(`🔍 Buscando variante para producto template ID: ${producto.id}`);
            
            const variantRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            ODOO_CONFIG.db,
                            uid,
                            ODOO_CONFIG.password,
                            'product.product',
                            'search_read',
                            [[['product_tmpl_id', '=', producto.id]]],
                            { 
                                fields: ['id', 'display_name', 'lst_price', 'default_code', 'uom_id'],
                                limit: 1 
                            }
                        ]
                    },
                    id: 4 + index
                })
            });

            const variantData = await variantRes.json();

            if (variantData.result && variantData.result.length > 0) {
                const variant = variantData.result[0];
                const productVariantId = variant.id;
                const productName = producto.name || variant.display_name;
                const price = producto.price || variant.lst_price || 0;
                
                // *** CORRECCIÓN AQUÍ ***
                // El campo 'uom_id' puede venir como un arreglo [id, nombre]. 
                // Solo necesitamos el ID numérico.
                let productUomId = 1; // Valor por defecto seguro
                if (variant.uom_id) {
                    if (Array.isArray(variant.uom_id)) {
                        // Si es un arreglo, toma el primer elemento (el ID)
                        productUomId = variant.uom_id[0];
                    } else if (typeof variant.uom_id === 'number') {
                        // Si ya es un número, úsalo directamente
                        productUomId = variant.uom_id;
                    }
                }
                
                // En Odoo 19, el campo correcto es 'product_uom_id' no 'product_uom'
                const lineData = {
                    product_id: productVariantId,
                    product_uom_qty: producto.cantidad || 1,
                    price_unit: price,
                    name: productName,
                    product_uom_id: productUomId || 1, // Campo CORREGIDO
                };
                
                if (variant.default_code && variant.default_code !== false) {
                    lineData.product_code = variant.default_code;
                }
                
                orderLines.push([0, 0, lineData]);
                console.log(`✅ Producto ${index + 1} agregado: ${productName}`);
            } else {
                console.warn(`⚠️ No se encontró variante para producto template ID: ${producto.id}`);
                // Crear línea con datos mínimos
                orderLines.push([0, 0, {
                    name: producto.name || 'Producto',
                    product_uom_qty: producto.cantidad || 1,
                    price_unit: producto.price || 0,
                    product_uom_id: 1 // Unidad de medida por defecto
                }]);
            }
        }

        if (orderLines.length === 0) {
            throw new Error('No se pudo procesar ningún producto válido');
        }

        // === 4. CREAR COTIZACIÓN ===
        console.log('📄 Creando cotización en Odoo...');
        
        // Obtener la tarifa por defecto (pricelist)
        const pricelistRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        ODOO_CONFIG.db,
                        uid,
                        ODOO_CONFIG.password,
                        'product.pricelist',
                        'search_read',
                        [[['active', '=', true]]],
                        { fields: ['id'], limit: 1 }
                    ]
                },
                id: 100
            })
        });

        const pricelistData = await pricelistRes.json();
        const pricelistId = pricelistData.result && pricelistData.result.length > 0 
            ? pricelistData.result[0].id 
            : 1;

        // Datos de la cotización
        const orderData = {
            partner_id: partnerId,
            date_order: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
            note: mensaje || `Cotización web - ${nombre}`,
            client_order_ref: `WEB-${Date.now()}`,
            order_line: orderLines,
            state: 'draft',
            pricelist_id: pricelistId,
            user_id: uid,
        };

        console.log('📦 Datos de la cotización a enviar:', JSON.stringify(orderData, null, 2));
        
        const createOrderRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        ODOO_CONFIG.db,
                        uid,
                        ODOO_CONFIG.password,
                        'sale.order',
                        'create',
                        [orderData]
                    ]
                },
                id: 101
            })
        });

        const createOrderData = await createOrderRes.json();
        console.log('📊 Respuesta de creación de cotización:', createOrderData);
        
        if (createOrderData.error) {
            console.error('❌ Error de Odoo:', createOrderData.error);
            throw new Error(`Error de Odoo: ${createOrderData.error.message}`);
        }
        
        let orderId = createOrderData.result;
        
        if (!orderId) {
            throw new Error('No se pudo crear la cotización en Odoo');
        }
        
        console.log(`✅ Cotización creada, ID: ${orderId}`);

        // === 5. CONFIRMAR COTIZACIÓN ===
        console.log('✅ Confirmando cotización...');
        const confirmRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        ODOO_CONFIG.db,
                        uid,
                        ODOO_CONFIG.password,
                        'sale.order',
                        'action_confirm',
                        [[orderId]]
                    ]
                },
                id: 102
            })
        });

        const confirmData = await confirmRes.json();
        console.log('📊 Respuesta de confirmación:', confirmData);

        // === 6. OBTENER NÚMERO DE COTIZACIÓN ===
        console.log('🔍 Obteniendo número de cotización...');
        const readOrderRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        ODOO_CONFIG.db,
                        uid,
                        ODOO_CONFIG.password,
                        'sale.order',
                        'read',
                        [[orderId]],
                        { fields: ['name', 'state', 'amount_total'] }
                    ]
                },
                id: 103
            })
        });

        const readOrderData = await readOrderRes.json();
        
        const orderInfo = readOrderData.result && readOrderData.result.length > 0 
            ? readOrderData.result[0] 
            : { name: `SO${orderId}`, state: 'draft', amount_total: 0 };
        
        const orderNumber = orderInfo.name || `SO${orderId}`;
        console.log(`✅ Cotización confirmada, Número: ${orderNumber}`);

        // === 7. RESPUESTA EXITOSA ===
        return res.status(200).json({
            success: true,
            message: 'Cotización creada exitosamente en Odoo',
            orderNumber: orderNumber,
            orderId: orderId,
            details: {
                cliente: nombre,
                email: correo,
                telefono: telefono,
                numeroProductos: productos.length,
                estado: orderInfo.state,
                total: orderInfo.amount_total,
                fecha: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error en la API de cotización:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error interno del servidor',
            timestamp: new Date().toISOString()
        });
    }
}