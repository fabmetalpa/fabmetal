// pages/api/categorias.js - VERSIÓN MODIFICADA
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
    console.log('🔍 API Categorías: Autenticando...');
    
    // 1. Autenticar
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

    console.log('✅ API Categorías: Autenticado, UID:', uid);

    // 2. Obtener SUBCATEGORÍAS de "Equipamiento" (parent_id = 9)
    const catRes = await fetch(`${ODOO_CONFIG.url}/jsonrpc`, {
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
            'product.public.category',
            'search_read',
            [
              [['parent_id', '=', 9]] // ← BUSCAR HIJAS DE EQUIPAMIENTO (ID: 9)
            ],
            { 
              fields: ['id', 'name', 'cover_image', 'parent_id'],
              limit: 20,
              order: 'name asc' // Orden alfabético
            }
          ]
        },
        id: 2
      })
    });

    const catData = await catRes.json();
    const categories = catData.result || [];
    
    console.log(`✅ API Categorías: ${categories.length} subcategorías de Equipamiento encontradas`);
    
    // 3. Si no hay subcategorías, obtener TODAS las categorías principales
    let finalCategories = categories;
    
    if (categories.length === 0) {
      console.log('⚠️ No hay subcategorías, obteniendo todas las categorías principales');
      
      const allCatRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
              'product.public.category',
              'search_read',
              [
                [['parent_id', '=', false]] // Categorías principales
              ],
              { 
                fields: ['id', 'name', 'cover_image'],
                limit: 20
              }
            ]
          },
          id: 3
        })
      });
      
      const allCatData = await allCatRes.json();
      finalCategories = allCatData.result || [];
    }
    
    res.status(200).json({
      success: true,
      categories: finalCategories,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ API Categorías Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      categories: []
    });
  }
}