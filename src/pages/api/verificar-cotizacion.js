// pages/api/verificar-cotizacion.js
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const ODOO_CONFIG = {
        url: 'https://fabmetal.odoo.com',
        db: 'fabmetal',
        username: "admin@fabmetal.com.pa",
        password: "#Fabmetal1*/"
    };

    try {
        console.log('🔍 Verificando cotizaciones en Odoo...');

        // Autenticar
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

        if (!uid) {
            throw new Error('Autenticación fallida');
        }

        // Buscar últimas 20 cotizaciones
        const searchRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
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
                        'search_read',
                        [[]],
                        { 
                            fields: ['id', 'name', 'partner_id', 'date_order', 'state', 'amount_total', 'client_order_ref'],
                            order: 'id desc',
                            limit: 20
                        }
                    ]
                },
                id: 2
            })
        });

        const searchData = await searchRes.json();
        console.log('📊 Cotizaciones encontradas:', searchData.result?.length || 0);
        
        // Buscar específicamente cotizaciones web
        const webOrdersRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
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
                        'search_read',
                        [[['client_order_ref', 'ilike', 'WEB-']]],
                        { 
                            fields: ['id', 'name', 'partner_id', 'date_order', 'state', 'client_order_ref'],
                            order: 'id desc',
                            limit: 10
                        }
                    ]
                },
                id: 3
            })
        });

        const webOrdersData = await webOrdersRes.json();
        
        return res.status(200).json({
            success: true,
            totalCotizaciones: searchData.result?.length || 0,
            ultimasCotizaciones: searchData.result || [],
            cotizacionesWeb: webOrdersData.result || [],
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}