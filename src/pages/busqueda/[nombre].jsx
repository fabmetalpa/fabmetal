import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/product/layout-03";

const Busqueda = ({ productos, categoriaMadre, error, className }) => {
    console.log("🔍 Resultados de búsqueda:", productos);
    
    const titulo = categoriaMadre 
        ? `Resultados para: "${categoriaMadre}"` 
        : "Búsqueda de productos";

    return (
        <Wrapper>
            <SEO pageTitle={titulo} />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle={titulo}
                    currentPage={titulo}
                />

                {error ? (
                    <div className="text-center py-5">
                        <h3 className="text-danger">Error: {error}</h3>
                        <p>Intenta con otros términos de búsqueda</p>
                    </div>
                ) : productos && productos.length > 0 ? (
                    <ProductArea
                        data={{
                            section_title: { title: `${productos.length} productos encontrados` },
                            products: productos,
                        }}
                    />
                ) : (
                    <div className="text-center py-5">
                        <h3>No se encontraron productos para: "{categoriaMadre}"</h3>
                        <p>Prueba con palabras más generales o revisa la ortografía</p>
                    </div>
                )}

            </main>
            <Footer />
        </Wrapper>
    );
};

export const getServerSideProps = async (context) => {
    console.log("🔍 Iniciando búsqueda en Odoo...");
    
    const { nombre } = context.query;
    
    if (!nombre || nombre.trim() === '') {
        return {
            props: {
                productos: [],
                categoriaMadre: "Búsqueda vacía",
                error: "Por favor ingresa un término de búsqueda",
                className: "template-color-1",
            },
        };
    }

    const terminoBusqueda = nombre.trim();
    console.log("🔍 Buscando:", terminoBusqueda);

    const ODOO_URL = 'https://fabmetal.odoo.com';
    const DB = 'fabmetal';
    const USERNAME = "admin@fabmetal.com.pa";
    const PASSWORD = "#Fabmetal1*/";

    try {
        // === 1. AUTENTICACIÓN ===
        console.log("🔐 Autenticando en Odoo...");
        const authRes = await fetch(`${ODOO_URL}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'common',
                    method: 'authenticate',
                    args: [DB, USERNAME, PASSWORD, {}]
                },
                id: 1
            })
        });

        const authData = await authRes.json();
        const uid = authData.result;
        
        if (!uid || typeof uid !== 'number') {
            throw new Error('Autenticación fallida');
        }
        console.log("✅ Autenticación exitosa, UID:", uid);

        // === 2. BÚSQUEDA DE PRODUCTOS (SINTAXIS CORRECTA) ===
        console.log("🔍 Buscando productos que coincidan con:", terminoBusqueda);
        
        // CORRECCIÓN: Sintaxis correcta del dominio
        const searchRes = await fetch(`${ODOO_URL}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        DB,
                        uid,
                        PASSWORD,
                        'product.template',
                        'search_read',
                        [
                            [
                                ['website_published', '=', true],
                                '|', // Operador OR (debe ser string, no array)
                                ['name', 'ilike', `%${terminoBusqueda}%`],
                                ['default_code', 'ilike', `%${terminoBusqueda}%`]
                            ]
                        ],
                        { 
                            fields: [
                                'id', 'name', 'list_price', 'default_code',
                                'description', 'description_sale',
                                'image_1920', 'image_512', 'image_128',
                                'qty_available', 'categ_id'
                            ],
                            limit: 50,
                            order: 'name asc'
                        }
                    ]
                },
                id: 2
            })
        });

        const searchData = await searchRes.json();
        console.log("📊 Respuesta de búsqueda:", searchData);
        
        // Verificar si hay error en la respuesta
        if (searchData.error) {
            console.error("❌ Error en búsqueda:", searchData.error);
            
            // Intentar búsqueda más simple (solo por nombre)
            console.log("🔄 Intentando búsqueda simple...");
            const simpleSearchRes = await fetch(`${ODOO_URL}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            DB,
                            uid,
                            PASSWORD,
                            'product.template',
                            'search_read',
                            [
                                [
                                    ['website_published', '=', true],
                                    ['name', 'ilike', `%${terminoBusqueda}%`]
                                ]
                            ],
                            { 
                                fields: ['id', 'name', 'list_price', 'image_1920'],
                                limit: 30
                            }
                        ]
                    },
                    id: 3
                })
            });
            
            const simpleSearchData = await simpleSearchRes.json();
            console.log("📊 Respuesta búsqueda simple:", simpleSearchData);
            
            const resultados = simpleSearchData.result || [];
            console.log(`✅ Productos encontrados (simple): ${resultados.length}`);
        } else {
            const resultados = searchData.result || [];
            console.log(`✅ Productos encontrados: ${resultados.length}`);
        }

        // === 3. PROCESAR RESULTADOS ===
        const resultados = searchData.result || [];
        // En tu página de búsqueda, dentro de productosProcesados.map():
const productosProcesados = resultados.map(producto => {
    // Función para crear URL de imagen
    const crearUrlImagen = (base64Data) => {
        if (!base64Data || base64Data === false) return null;
        
        if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
            return base64Data;
        }
        
        let mimeType = 'image/png';
        if (typeof base64Data === 'string') {
            if (base64Data.startsWith('/9j')) mimeType = 'image/jpeg';
            else if (base64Data.startsWith('iVBORw')) mimeType = 'image/png';
            else if (base64Data.startsWith('R0lGOD')) mimeType = 'image/gif';
        }
        
        return `data:${mimeType};base64,${base64Data}`;
    };

    // Obtener la mejor imagen disponible
    const mainImage = crearUrlImagen(producto.image_1920) || 
                     crearUrlImagen(producto.image_512) || 
                     crearUrlImagen(producto.image_128);

    return {
        id: producto.id,
        name: producto.name,
        price: producto.list_price || 0,
        code: producto.default_code || '',
        description: producto.description || producto.description_sale || '',
        category: producto.categ_id ? {
            id: producto.categ_id[0],
            name: producto.categ_id[1]
        } : null,
        stock: producto.qty_available || 0,
        // ESTRUCTURA QUE ESPERA TU COMPONENTE:
        images: mainImage ? [{ 
            src: mainImage, 
            alt: producto.name,
            width: 430,
            height: 430 
        }] : [],
        image: mainImage, // También mantener por compatibilidad
        // Si tu componente necesita slug (para la URL)
        slug: `producto-${producto.id}` // O crea un slug del nombre
    };
});

        console.log(`✅ Total productos procesados: ${productosProcesados.length}`);

        return {
            props: {
                productos: productosProcesados,
                categoriaMadre: terminoBusqueda,
                error: null,
                className: "template-color-1",
            },
        };

    } catch (error) {
        console.error("💥 Error en búsqueda Odoo:", error);
        
        return {
            props: {
                productos: [],
                categoriaMadre: terminoBusqueda,
                error: `Error al buscar productos: ${error.message}`,
                className: "template-color-1",
            },
        };
    }
};

Busqueda.propTypes = {
    productos: PropTypes.array,
    categoriaMadre: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
};

export default Busqueda;