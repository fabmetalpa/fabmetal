import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import LiveExploreArea from "@containers/live-explore/layout-02";
import CategoryArea from "@containers/category/layout-01";

const Categoria = ({ productos, subcategorias, categoriaNombre, className }) => {
 
  console.log(productos)
  console.log(subcategorias)
  console.log(categoriaNombre)


  // Transformar subcategorías para incluir URLs de imagen
  const subcategoriasConImagen = subcategorias?.map(cat => {
    // Verificar si tiene imagen
    if (cat.cover_image) {
      // Crear la URL base64 completa
      // Nota: cat.cover_image ya debería venir como string base64
      return {
        ...cat,
        image_url: `data:image/png;base64,${cat.cover_image}`
      };
    } else {
      // Si no tiene imagen, usar una por defecto o null
      return {
        ...cat,
        image_url: null // o URL de una imagen por defecto
      };
    }
  }) || [];

  console.log("Subcategorías procesadas:", subcategoriasConImagen);

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
      // Es un nombre de categoría (CORREGIDO: sin website_published)
      const nombreCategoria = categoria.trim();
      console.log("🔍 [LOG] Parámetro es un nombre:", nombreCategoria);
      
      // Buscar categoría por nombre (CORRECCIÓN: eliminado website_published)
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
                // REMOVIDO: ['website_published', '=', true] - Este campo no existe
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
        // Intentar búsqueda más flexible (sin website_published)
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

    // === 3. BUSCAR SUBCATEGORÍAS (CORREGIDO: sin website_published) ===
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
              // REMOVIDO: ['website_published', '=', true]
            ],
            { 
              fields: ['id', 'name', 'cover_image'],
              order: 'sequence asc',
              limit: 20 // LIMIT para reducir datos
            }
          ]
        },
        id: 6
      })
    });
    
    const subcatData = await subcatRes.json();
    const subcategorias = subcatData.result || [];
    console.log("✅ [OK] Subcategorías encontradas:", subcategorias.length);

    // Si hay subcategorías, retornarlas (CON DATOS REDUCIDOS)
    if (subcategorias.length > 0) {
      // Reducir tamaño de datos enviados al frontend
      const subcategoriasLigeras = subcategorias.map(cat => ({
        id: cat.id,
        name: cat.name,
        cover_image: cat.cover_image ? cat.cover_image.substring(0, 1000) : null // Limitar tamaño de base64
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

    // === 4. BUSCAR PRODUCTOS (OPTIMIZADO para reducir datos) ===
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
              // SOLO CAMPOS ESENCIALES para reducir datos
              fields: [
                'id', 
                'name', 
                'list_price',
                'image_512' // Solo una imagen (la más pequeña)
              ],
              order: 'name asc',
              limit: 30 // LIMIT para reducir datos
            }
          ]
        },
        id: 7
      })
    });
    
    const prodData = await prodRes.json();
    console.log("📊 [LOG] Productos brutos encontrados:", prodData.result?.length || 0);

    // Función optimizada para crear URL de imagen
    const crearUrlImagenOptimizada = (base64Data) => {
      if (!base64Data || base64Data === false || typeof base64Data !== 'string') {
        return null;
      }
      
      // Limitar tamaño del base64 (solo primeros 5000 chars para thumbnails)
      const base64Limitado = base64Data.length > 5000 ? 
        base64Data.substring(0, 5000) : base64Data;
      
      // Determinar tipo MIME rápido
      let mimeType = 'image/png';
      if (base64Limitado.startsWith('/9j')) {
        mimeType = 'image/jpeg';
      }
      
      return `data:${mimeType};base64,${base64Limitado}`;
    };

    // Procesar productos con datos mínimos
    const productosLigeros = (prodData.result || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.list_price || 0,
      image: crearUrlImagenOptimizada(p.image_512) // Solo una imagen
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