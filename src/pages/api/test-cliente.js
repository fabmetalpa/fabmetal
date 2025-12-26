// pages/api/test-cliente.js
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
        console.log('🧪 Probando conexión con Odoo...');

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

        // Crear cliente de prueba
        const createRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
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
                        [{
                            name: 'Cliente Prueba Web - ' + new Date().toISOString(),
                            email: 'test-web@fabmetal.com',
                            phone: '999888777'
                        }]
                    ]
                },
                id: 2
            })
        });

        const createData = await createRes.json();
        
        return res.status(200).json({
            success: true,
            clienteId: createData.result,
            mensaje: 'Cliente de prueba creado exitosamente',
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