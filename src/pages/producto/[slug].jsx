import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ProductDetailsArea from "@containers/product-details";
import ProductArea from "@containers/product/layout-02";


const ProductDetails = ({ producto, productoOdoo, nombre, agregarCarrito, error }) => {

    console.log(producto);
    console.log("AQUIIIIII");
    
    console.log(productoOdoo);
    console.log(nombre);

    


    return (
        <Wrapper>
            <SEO pageTitle={nombre} />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle={nombre}
                    currentPage={nombre}
                />

                <ProductDetailsArea product={producto} agregarCarrito={agregarCarrito} />
                
            {/*     
            <ProductArea
                data={{
                    section_title: { title: "Recent View" },
                    products: [],
                }}
            />
            <ProductArea
                data={{
                    section_title: { title: "Related Item" },
                    products: [],
                }}
            />
            */}

            
            </main>
            <Footer />
        </Wrapper>

    )
}


export const getServerSideProps = async (context) => {
    console.log("🔍 [LOG] Buscando producto:", context.query.slug);
    
    const nombreProducto = context.query.slug;
    
    if (!nombreProducto || nombreProducto.trim() === '') {
        return {
            props: {
                producto: null,
                nombre: "Producto no encontrado",
                error: "No se especificó un nombre de producto",
                className: "template-color-1",
            },
        };
    }

    const ODOO_URL = 'https://fabmetal.odoo.com';
    const DB = 'fabmetal';
    const USERNAME = "admin@fabmetal.com.pa";
    const PASSWORD = "#Fabmetal1*/";

    try {
        // === 1. AUTENTICACIÓN ===
        console.log("🔍 [LOG] Autenticando en Odoo...");
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
        console.log("✅ [OK] Autenticación exitosa");

        // === 2. BUSCAR PRODUCTO ===
        console.log(`🔍 [LOG] Buscando producto: "${nombreProducto}"`);
        
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
                                ['name', 'ilike', nombreProducto],
                                ['website_published', '=', true]
                            ]
                        ],
                        { 
                            fields: [
                                'id', 'name', 'display_name', 'list_price', 'default_code',
                                'description', 'description_sale', 'categ_id', 'qty_available',
                                'weight', 'volume', 'type',
                                // Campos de imagen PRINCIPALES
                                'image_1920', 'image_1024', 'image_512', 'image_256', 'image_128',
                                // Campos para imágenes adicionales
                                'product_template_image_ids', 'product_variant_ids'
                            ],
                            limit: 5
                        }
                    ]
                },
                id: 2
            })
        });

        const searchData = await searchRes.json();
        console.log("🔍 [LOG] Respuesta de búsqueda:", searchData);
        
        const resultados = searchData.result || [];
        
        if (resultados.length === 0) {
            console.log("⚠️ [WARNING] No se encontraron productos");
            return {
                props: {
                    producto: null,
                    nombre: nombreProducto,
                    error: `No se encontró el producto "${nombreProducto}"`,
                    className: "template-color-1",
                },
            };
        }

        // === 3. PROCESAR PRODUCTO ===
        const productoOdoo = resultados[0];
        console.log(`✅ [OK] Producto encontrado: ${productoOdoo.name}`);
        
        // Función para crear URLs de imagen
        const crearUrlImagen = (base64Data) => {
            if (!base64Data || base64Data === false) return null;
            if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
                return base64Data;
            }
            return `data:image/png;base64,${base64Data}`;
        };

        // === 4. OBTENER TODAS LAS IMÁGENES ===
let todasLasImagenes = [];

// 4.1. Imágenes PRINCIPALES - Solo agregar UNA (la de mejor calidad)
const imagenPrincipal = crearUrlImagen(productoOdoo.image_1920);
if (imagenPrincipal) {
    todasLasImagenes.push({
        id: `principal`,
        src: imagenPrincipal,
        alt: productoOdoo.name,
        tipo: 'principal',
        es_principal: true,
        orden: 1
    });
    console.log("✅ [OK] Imagen principal agregada");
}

// 4.2. Imágenes ADICIONALES de "product.image" (Galería del producto)
console.log(`🖼️ [LOG] Buscando imágenes adicionales del producto...`);

// IMPORTANTE: Buscar imágenes en el modelo product.image que estén asociadas a este product.template
const buscarImagenesAdicionales = async () => {
    try {
        const imagenesRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                        'product.image',
                        'search_read',
                        [
                            [
                                ['product_tmpl_id', '=', productoOdoo.id],
                                ['image_1920', '!=', false]
                            ]
                        ],
                        { 
                            fields: ['id', 'name', 'sequence', 'image_1920', 'image_1024', 'image_512'],
                            order: 'sequence asc', // Ordenar por secuencia
                            limit: 20
                        }
                    ]
                },
                id: 3
            })
        });
        
        const imagenesData = await imagenesRes.json();
        const imagenesAdicionales = imagenesData.result || [];
        
        console.log(`✅ [OK] ${imagenesAdicionales.length} imágenes adicionales encontradas`);
        
        imagenesAdicionales.forEach((img, index) => {
            const url = crearUrlImagen(img.image_1920 || img.image_1024 || img.image_512);
            if (url) {
                // Verificar que no sea la misma imagen principal
                if (url !== imagenPrincipal) {
                    todasLasImagenes.push({
                        id: `galeria_${img.id}`,
                        src: url,
                        alt: img.name || `${productoOdoo.name} - Imagen ${index + 1}`,
                        tipo: 'galeria',
                        es_principal: false,
                        orden: 100 + (img.sequence || index)
                    });
                    console.log(`📸 [LOG] Imagen adicional agregada: ${img.name || `Imagen ${index + 1}`}`);
                }
            }
        });
        
        return imagenesAdicionales;
    } catch (error) {
        console.error("❌ [ERROR] Al obtener imágenes adicionales:", error);
        return [];
    }
};

// Ejecutar búsqueda de imágenes adicionales
await buscarImagenesAdicionales();

// 4.3. SI NO HAY IMÁGENES ADICIONALES, intentar con product_template_image_ids (método alternativo)
if (todasLasImagenes.length <= 1 && productoOdoo.product_template_image_ids && productoOdoo.product_template_image_ids.length > 0) {
    console.log("🔍 [LOG] Buscando imágenes por product_template_image_ids...");
    
    try {
        const galleryRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                        'product.image',
                        'read',
                        [productoOdoo.product_template_image_ids],
                        { 
                            fields: ['id', 'name', 'sequence', 'image_1920', 'image_1024', 'image_512'],
                            order: 'sequence asc',
                            limit: 20
                        }
                    ]
                },
                id: 4
            })
        });
        
        const galleryData = await galleryRes.json();
        const imagenesGaleria = galleryData.result || [];
        
        imagenesGaleria.forEach((img, index) => {
            const url = crearUrlImagen(img.image_1920 || img.image_1024 || img.image_512);
            if (url && url !== imagenPrincipal) {
                // Verificar si ya existe
                const existe = todasLasImagenes.some(existente => existente.src === url);
                if (!existe) {
                    todasLasImagenes.push({
                        id: `alternativo_${img.id}`,
                        src: url,
                        alt: img.name || `${productoOdoo.name} - Galería ${index + 1}`,
                        tipo: 'galeria',
                        es_principal: false,
                        orden: 200 + (img.sequence || index)
                    });
                    console.log(`📸 [LOG] Imagen por template_id agregada: ${img.name}`);
                }
            }
        });
    } catch (error) {
        console.error("❌ [ERROR] Al obtener imágenes por template_ids:", error);
    }
}

// 4.4. Imágenes de VARIANTES (si existen y son diferentes)
if (productoOdoo.product_variant_ids && productoOdoo.product_variant_ids.length > 0) {
    console.log(`🔄 [LOG] Buscando imágenes de variantes...`);
    
    try {
        const variantsRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                        'product.product',
                        'read',
                        [productoOdoo.product_variant_ids],
                        { 
                            fields: ['id', 'name', 'image_1920', 'image_1024', 'image_512'],
                            limit: 10
                        }
                    ]
                },
                id: 5
            })
        });
        
        const variantsData = await variantsRes.json();
        const variantes = variantsData.result || [];
        
        variantes.forEach((variante, vIndex) => {
            const url = crearUrlImagen(variante.image_1920 || variante.image_1024 || variante.image_512);
            if (url && url !== imagenPrincipal) {
                const existe = todasLasImagenes.some(existente => existente.src === url);
                if (!existe) {
                    todasLasImagenes.push({
                        id: `variante_${variante.id}`,
                        src: url,
                        alt: `${productoOdoo.name} - Variante ${vIndex + 1}`,
                        tipo: 'variante',
                        es_principal: false,
                        orden: 300 + vIndex
                    });
                }
            }
        });
    } catch (error) {
        console.error("❌ [ERROR] Al obtener imágenes de variantes:", error);
    }
}

console.log(`🎯 [OK] Total imágenes procesadas: ${todasLasImagenes.length}`);
console.log(`📊 [DETALLE] ${todasLasImagenes.filter(img => img.tipo === 'principal').length} principal(es), ${todasLasImagenes.filter(img => img.tipo === 'galeria').length} adicionales`);

// Si solo tenemos la imagen principal, mostrar un warning
if (todasLasImagenes.length <= 1) {
    console.warn("⚠️ [WARNING] Solo se encontró la imagen principal. Verifica en Odoo que el producto tenga imágenes adicionales en la pestaña 'eCommerce' o en 'Imágenes'.");
}

        // === 5. BUSCAR DOCUMENTOS PDF ===
        let documentos = [];

        const listAllAttachments = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                        'ir.attachment',
                        'search_read',
                        [
                            [
                                ['res_id', '=', productoOdoo.id],
                                ['res_model', '=', 'product.template']
                            ]
                        ],
                        {
                            fields: ['id', 'name', 'mimetype', 'datas', 'file_size'],
                            limit: 20
                        }
                    ]
                },
                id: 5
            })
        });

        const allAttachments = await listAllAttachments.json();
        
        if (allAttachments.result) {
            documentos = allAttachments.result
                .filter(att => {
                    const nombre = (att.name || '').toLowerCase();
                    const mime = (att.mimetype || '').toLowerCase();
                    return nombre.includes('.pdf') || mime.includes('pdf');
                })
                .map(att => ({
                    id: att.id,
                    name: att.name || 'documento.pdf',
                    mimetype: 'application/pdf',
                    file_size: att.file_size || 0,
                    download_url: att.datas ? `data:application/pdf;base64,${att.datas}` : null,
                    es_pdf_real: true
                }));
            
            console.log(`📄 [OK] ${documentos.length} documentos PDF encontrados`);
        }

        // === 6. CREAR OBJETO PRODUCTO FINAL ===
        const productoFinal = {
            // Información básica
            id: productoOdoo.id,
            name: productoOdoo.name,
            display_name: productoOdoo.display_name || productoOdoo.name,
            price: productoOdoo.list_price || 0,
            code: productoOdoo.default_code || '',
            
            // Descripciones
            description: productoOdoo.description || productoOdoo.description_sale || '',
            
            // ✅ TODAS LAS IMÁGENES EN FORMATO PARA GalleryTab
            images: todasLasImagenes,
            
            // También mantener formato original para compatibilidad
            images_original: {
                main: crearUrlImagen(productoOdoo.image_1920) || null,
                image_1920: crearUrlImagen(productoOdoo.image_1920),
                image_512: crearUrlImagen(productoOdoo.image_512),
                image_128: crearUrlImagen(productoOdoo.image_128)
            },
            
            // Categorías
            category: productoOdoo.categ_id ? {
                id: productoOdoo.categ_id[0],
                name: productoOdoo.categ_id[1]
            } : null,
            
            // Inventario
            stock: productoOdoo.qty_available || 0,
            
            // Documentos
            documents: documentos,
            
            // Datos técnicos
            weight: productoOdoo.weight || 0,
            volume: productoOdoo.volume || 0,
            type: productoOdoo.type || 'consu',
            
            // Metadata
            has_documents: documentos.length > 0,
            total_documents: documentos.length,
            total_images: todasLasImagenes.length,
            has_multiple_images: todasLasImagenes.length > 1
        };

        console.log(`✅ [OK] Producto finalizado con ${todasLasImagenes.length} imágenes y ${documentos.length} documentos`);

        // === 7. RETORNAR AL FRONTEND ===
        return {
            props: {
                producto: productoFinal,
                nombre: productoFinal.name || nombreProducto,
                error: null,
                className: "template-color-1",
            },
        };

    } catch (error) {
        console.error("💥 [ERROR CRÍTICO] En getServerSideProps:", error.message);
        
        return {
            props: {
                producto: null,
                nombre: nombreProducto,
                error: `Error al buscar el producto: ${error.message}`,
                className: "template-color-1",
            },
        };
    }
};

ProductDetails.propTypes = {
    producto: PropTypes.object,
    nombre: PropTypes.string,
    agregarCarrito: PropTypes.func,
    error: PropTypes.string,
    className: PropTypes.string,
};

export default ProductDetails;