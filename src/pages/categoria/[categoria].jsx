import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import LiveExploreArea from "@containers/live-explore/layout-02";
import CategoryArea from "@containers/category/layout-01";
import { useEffect } from "react";

// Función mejorada para crear URL de imagen desde Odoo
const crearUrlImagenOdoo = (base64Data) => {
  if (!base64Data || base64Data === false || typeof base64Data !== 'string') {
    console.log("📸 [DEBUG] No hay datos de imagen o no es string válido");
    return null;
  }
  
  // Limitar tamaño para debugging
  const preview = base64Data.length > 100 ? 
    `${base64Data.substring(0, 100)}...` : 
    base64Data;
  
  console.log(`📸 [DEBUG] Base64 data recibida: ${preview}`);
  
  // Si ya tiene el prefijo data:image, devolverlo directamente
  if (base64Data.startsWith('data:image/')) {
    console.log("✅ [DEBUG] Imagen ya viene con prefijo data:image");
    return base64Data;
  }
  
  // Detectar formato por los primeros caracteres del base64
  let mimeType = 'image/png'; // Por defecto
  
  if (base64Data.startsWith('/9j') || base64Data.startsWith('/9J')) {
    // JPEG
    mimeType = 'image/jpeg';
    console.log("📸 [DEBUG] Formato detectado: JPEG");
  } else if (base64Data.startsWith('iVBORw')) {
    // PNG
    mimeType = 'image/png';
    console.log("📸 [DEBUG] Formato detectado: PNG");
  } else if (base64Data.startsWith('R0lGOD')) {
    // GIF
    mimeType = 'image/gif';
    console.log("📸 [DEBUG] Formato detectado: GIF");
  } else if (base64Data.startsWith('UklGR')) {
    // WebP
    mimeType = 'image/webp';
    console.log("📸 [DEBUG] Formato detectado: WebP");
  } else if (base64Data.startsWith('PHN2Zy') || base64Data.startsWith('PD94')) {
    // SVG
    mimeType = 'image/svg+xml';
    console.log("📸 [DEBUG] Formato detectado: SVG");
  } else if (base64Data.startsWith('Qk')) {
    // BMP
    mimeType = 'image/bmp';
    console.log("📸 [DEBUG] Formato detectado: BMP");
  } else {
    // Para otros formatos, intentar detectar por contenido
    console.warn("⚠️ [DEBUG] Formato no reconocido, intentando detectar...");
    
    // Si tiene caracteres extraños al inicio (posiblemente de Odoo), limpiar
    const cleanBase64 = base64Data.trim();
    
    // Intentar con los formatos más comunes
    if (cleanBase64.startsWith('iVBOR')) {
      mimeType = 'image/png';
    } else if (cleanBase64.startsWith('/9')) {
      mimeType = 'image/jpeg';
    } else {
      console.warn("⚠️ [DEBUG] Formato no reconocido, usando PNG por defecto");
    }
  }
  
  // Limitar tamaño si es muy grande (para rendimiento)
  const base64Limpiado = base64Data.trim();
  
  // Crear la URL data:image
  const imageUrl = `data:${mimeType};base64,${base64Limpiado}`;
  console.log(`✅ [DEBUG] URL de imagen creada: ${imageUrl.substring(0, 80)}...`);
  
  return imageUrl;
};

// Componente para manejar errores de carga de imágenes
const ImagenSegura = ({ src, alt, className, defaultImage = "/images/default-image.jpg" }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <img src={defaultImage} alt={alt} className={className} />;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => {
        console.warn(`⚠️ Error cargando imagen: ${src?.substring(0, 50)}...`);
        setError(true);
      }}
    />
  );
};

const Categoria = ({ productos, subcategorias, categoriaNombre, className }) => {
 
  console.log("📊 [LOG FRONTEND] Productos recibidos:", productos?.length || 0);
  console.log("📊 [LOG FRONTEND] Subcategorías recibidas:", subcategorias?.length || 0);
  console.log("📊 [LOG FRONTEND] Nombre categoría:", categoriaNombre);

  // Transformar subcategorías para incluir URLs de imagen
  const subcategoriasConImagen = subcategorias?.map(cat => {
    // Verificar si tiene imagen
    if (cat.cover_image) {
      // Usar la función mejorada para crear URL
      return {
        ...cat,
        image_url: crearUrlImagenOdoo(cat.cover_image)
      };
    } else {
      // Si no tiene imagen, usar null
      return {
        ...cat,
        image_url: null
      };
    }
  }) || [];

  console.log("✅ [LOG FRONTEND] Subcategorías procesadas:", subcategoriasConImagen);

  // Debugging de imágenes en el cliente
  useEffect(() => {
    if (subcategoriasConImagen.length > 0) {
      console.log("🔍 [DEBUG CLIENTE] Revisando formato de imágenes de subcategorías:");
      subcategoriasConImagen.forEach((cat, idx) => {
        if (cat.cover_image) {
          console.log(`📸 Subcategoría ${idx} (${cat.name}):`, {
            tieneImagen: !!cat.cover_image,
            longitudBase64: cat.cover_image?.length || 0,
            prefijoBase64: cat.cover_image?.substring(0, 30),
            urlGenerada: cat.image_url?.substring(0, 80)
          });
        }
      });
    }
    
    if (productos?.length > 0) {
      console.log("🔍 [DEBUG CLIENTE] Revisando formato de imágenes de productos:");
      productos.forEach((prod, idx) => {
        if (prod.image) {
          console.log(`📸 Producto ${idx} (${prod.name}):`, {
            urlGenerada: prod.image?.substring(0, 80)
          });
        }
      });
    }
  }, [subcategoriasConImagen, productos]);

  const titulo = categoriaNombre
    ? categoriaNombre.charAt(0).toUpperCase() + categoriaNombre.slice(1).toLowerCase()
    : "Categoría";

  if (subcategorias?.length > 0) {
    return (
      <Wrapper>
        <SEO pageTitle={titulo} />
        <Header />
        <main id="main-content">
          <Breadcrumb pageTitle={titulo} currentPage={titulo} />
          
          <CategoryArea
            className="d-none d-lg-block"
            data={{
              section_title: { title: titulo },
              categorias: subcategoriasConImagen
            }}
          />
        </main>
        <Footer />
      </Wrapper>
    );
  }

  if (productos?.length > 0) {
    return (
      <Wrapper>
        <SEO pageTitle={titulo} />
        <Header />
        <main id="main-content">
          <Breadcrumb pageTitle={titulo} currentPage={titulo} />
          <LiveExploreArea
            data={{
              section_title: { title: titulo },
              products: productos,
            }}
          />
        </main>
        <Footer />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle={titulo} />
      <Header />
      <main id="main-content">
        <Breadcrumb pageTitle={titulo} currentPage={titulo} />
        <div className="text-center py-5">
          <h2>No hay subcategorías ni productos en esta categoría.</h2>
        </div>
      </main>
      <Footer />
    </Wrapper>
  );
};

Categoria.propTypes = {
  productos: PropTypes.array,
  subcategorias: PropTypes.array,
  categoriaNombre: PropTypes.string,
  className: PropTypes.string,
};

ImagenSegura.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  defaultImage: PropTypes.string,
};

export const getServerSideProps = async (context) => {
  console.log("🔍 [LOG] Entrando a getServerSideProps");
  const { categoria } = context.query;
  console.log("🔍 [LOG] Parámetro recibido:", { categoria });

  if (!categoria) {
    return {
      props: {
        productos: null,
        subcategorias: null,
        categoriaNombre: "Categoría no especificada",
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
    console.log("✅ [OK] Autenticación exitosa. UID:", uid);

    // === 2. DETERMINAR SI ES ID O NOMBRE ===
    let categoriaId = null;
    let categoriaNombre = "";
    
    // Verificar si es un número (ID)
    if (!isNaN(categoria) && categoria.trim() !== '') {
      // Es un ID numérico
      categoriaId = parseInt(categoria);
      console.log("🔍 [LOG] Parámetro es un ID:", categoriaId);
      
      // Obtener nombre de la categoría por ID
      const catRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
              'product.public.category',
              'read',
              [[categoriaId]],
              { fields: ['id', 'name', 'cover_image'] }
            ]
          },
          id: 2
        })
      });
      
      const catData = await catRes.json();
      if (catData.result && catData.result.length > 0) {
        categoriaNombre = catData.result[0].name || "Categoría";
      } else {
        throw new Error(`No se encontró categoría con ID: ${categoriaId}`);
      }
      
    } else {
      // Es un nombre de categoría
      const nombreCategoria = categoria.trim();
      console.log("🔍 [LOG] Parámetro es un nombre:", nombreCategoria);
      
      // Buscar categoría por nombre
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
              'product.public.category',
              'search_read',
              [
                [['name', '=ilike', `%${nombreCategoria}%`]]
              ],
              { fields: ['id', 'name', 'cover_image'], limit: 1 }
            ]
          },
          id: 3
        })
      });
      
      const searchData = await searchRes.json();
      console.log("📊 [LOG] Resultado búsqueda categoría:", searchData);
      
      if (searchData.result && searchData.result.length > 0) {
        categoriaId = searchData.result[0].id;
        categoriaNombre = searchData.result[0].name;
        console.log("✅ [OK] Categoría encontrada:", { id: categoriaId, nombre: categoriaNombre });
      } else {
        // Intentar búsqueda más flexible
        console.log("🔍 [LOG] Intentando búsqueda flexible...");
        const flexibleSearchRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                'product.public.category',
                'search_read',
                [
                  [['name', 'ilike', nombreCategoria]]
                ],
                { fields: ['id', 'name', 'cover_image'], limit: 5 }
              ]
            },
            id: 4
          })
        });
        
        const flexibleSearchData = await flexibleSearchRes.json();
        if (flexibleSearchData.result && flexibleSearchData.result.length > 0) {
          categoriaId = flexibleSearchData.result[0].id;
          categoriaNombre = flexibleSearchData.result[0].name;
          console.log("✅ [OK] Categoría encontrada (búsqueda flexible):", categoriaNombre);
        } else {
          // Último intento: buscar todas y hacer match en JS
          console.log("🔍 [LOG] Buscando todas las categorías...");
          const allCategoriesRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                  'product.public.category',
                  'search_read',
                  [[]],
                  { fields: ['id', 'name', 'cover_image'], limit: 50 }
                ]
              },
              id: 5
            })
          });
          
          const allCategoriesData = await allCategoriesRes.json();
          const foundCategory = allCategoriesData.result?.find(cat => 
            cat.name.toLowerCase().includes(nombreCategoria.toLowerCase())
          );
          
          if (foundCategory) {
            categoriaId = foundCategory.id;
            categoriaNombre = foundCategory.name;
            console.log("✅ [OK] Categoría encontrada (búsqueda en memoria):", categoriaNombre);
          } else {
            throw new Error(`No se encontró la categoría: "${nombreCategoria}"`);
          }
        }
      }
    }

    console.log("🎯 [OK] Categoría a procesar:", { id: categoriaId, nombre: categoriaNombre });

    // === 3. BUSCAR SUBCATEGORÍAS ===
    console.log("🔍 [LOG] Buscando subcategorías de ID:", categoriaId);
    const subcatRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
            'product.public.category',
            'search_read',
            [
              [['parent_id', '=', categoriaId]]
            ],
            { 
              fields: ['id', 'name', 'cover_image'],
              order: 'sequence asc',
              limit: 20
            }
          ]
        },
        id: 6
      })
    });
    
    const subcatData = await subcatRes.json();
    const subcategorias = subcatData.result || [];
    console.log("✅ [OK] Subcategorías encontradas:", subcategorias.length);

    // Si hay subcategorías, retornarlas
    if (subcategorias.length > 0) {
      const subcategoriasLigeras = subcategorias.map(cat => ({
        id: cat.id,
        name: cat.name,
        cover_image: cat.cover_image ? cat.cover_image : null
      }));
      
      return {
        props: {
          productos: null,
          subcategorias: subcategoriasLigeras,
          categoriaNombre,
          className: "template-color-1",
        },
      };
    }

    // === 4. BUSCAR PRODUCTOS ===
    console.log("🔍 [LOG] Buscando productos en categoría ID:", categoriaId);
    const prodRes = await fetch(`${ODOO_URL}/jsonrpc`, {
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
                ['public_categ_ids', 'in', [categoriaId]],
                ['website_published', '=', true]
              ]
            ],
            { 
              fields: [
                'id', 
                'name', 
                'list_price',
                'image_512'
              ],
              order: 'name asc',
              limit: 30
            }
          ]
        },
        id: 7
      })
    });
    
    const prodData = await prodRes.json();
    console.log("📊 [LOG] Productos brutos encontrados:", prodData.result?.length || 0);

    // Procesar productos usando la función mejorada
    const productosLigeros = (prodData.result || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.list_price || 0,
      image: crearUrlImagenOdoo(p.image_512) // Usar función mejorada
    }));

    console.log("✅ [OK] Productos procesados:", productosLigeros.length);
    console.log("📦 [INFO] Tamaño estimado de datos:", 
      JSON.stringify(productosLigeros).length / 1024, "KB");

    return {
      props: {
        productos: productosLigeros.length > 0 ? productosLigeros : null,
        subcategorias: null,
        categoriaNombre,
        className: "template-color-1",
      },
    };

  } catch (error) {
    console.error("💥 [ERROR CRÍTICO] En getServerSideProps:", error.message);
    return {
      props: {
        productos: null,
        subcategorias: null,
        categoriaNombre: categoria || "Error al cargar la categoría",
        error: error.message,
        className: "template-color-1",
      },
    };
  }
};

export default Categoria;