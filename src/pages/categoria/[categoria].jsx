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

  if (!categoria || isNaN(categoria)) {
    console.log("❌ [ERROR] Categoría no válida:", categoria);
    return {
      props: {
        productos: null,
        subcategorias: null,
        categoriaNombre: "Categoría no válida",
        className: "template-color-1",
      },
    };
  }

  const id = parseInt(categoria);
  console.log("🔍 [LOG] ID numérico:", id);

  const ODOO_URL = 'https://fabmetal.odoo.com';
  const DB = 'fabmetal';
  const USERNAME = "admin@fabmetal.com.pa";
  const PASSWORD = "#Fabmetal1*/";

  try {
    // === 1. Autenticación ===
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
    console.log("🔍 [LOG] Respuesta de autenticación:", authData);

    const uid = authData.result;
    if (!uid || typeof uid !== 'number') {
      throw new Error('Autenticación fallida: UID no válido');
    }
    console.log("✅ [OK] Autenticación exitosa. UID:", uid);

    // === 2. Nombre de la categoría ===
    console.log("🔍 [LOG] Obteniendo nombre de la categoría ID:", id);
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
            [[id]], // Cambiado a 'read' en lugar de 'search_read'
            { fields: ['id', 'name', 'cover_image'] }
          ]
        },
        id: 2
      })
    });
    const catData = await catRes.json();
    console.log("🔍 [LOG] Respuesta de categoría:", catData);
    const nombre = catData.result?.[0]?.name || "Categoría";
    console.log("✅ [OK] Nombre de categoría:", nombre);

    // === 3. Subcategorías ===
    console.log("🔍 [LOG] Buscando subcategorías de ID:", id);
    // Buscar subcategorías con parent_id = id
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
              [['parent_id', '=', id]] 
            ],
            { fields: ['id', 'name', 'cover_image'] }
          ]
        },
        id: 3
      })
    });
    const subcatData = await subcatRes.json();
    console.log("🔍 [LOG] Respuesta de subcategorías:", subcatData);
    const subcategorias = subcatData.result || [];
    console.log("✅ [OK] Subcategorías encontradas:", subcategorias.length);

    if (subcategorias.length > 0) {
      return {
        props: {
          productos: null,
          subcategorias,
          categoriaNombre: nombre,
          className: "template-color-1",
        },
      };
    }

    // === 4. Productos ===
    console.log("🔍 [LOG] Buscando productos en categoría ID:", id);
    // Buscar productos con public_categ_ids que incluyan el id
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
              [['public_categ_ids', 'in', [id]], ['website_published', '=', true]]
            ]
          ]
        },
        id: 4
      })
    });
    const prodData = await prodRes.json();
    console.log("🔍 [LOG] Respuesta de productos:", prodData);

    const productos = (prodData.result || []).map(p => {
    // Función para crear URL de imagen
    const crearUrlImagen = (base64Data) => {
      if (!base64Data || base64Data === false) return null;
      
      // Verificar si ya tiene el prefijo
      if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
        return base64Data;
      }
      
      // Determinar el tipo de imagen basado en el primer carácter del base64
      let mimeType = 'image/png'; // Por defecto
      if (typeof base64Data === 'string') {
        if (base64Data.startsWith('/9j') || base64Data.startsWith('/9J')) {
          mimeType = 'image/jpeg';
        } else if (base64Data.startsWith('iVBORw')) {
          mimeType = 'image/png';
        } else if (base64Data.startsWith('R0lGOD')) {
          mimeType = 'image/gif';
        } else if (base64Data.startsWith('UklGR')) {
          mimeType = 'image/webp';
        }
      }
      
      return `data:${mimeType};base64,${base64Data}`;
    };

    return {
      id: p.id,
      name: p.name,
      price: p.list_price,
      // Imágenes con URLs completas
      image_128: crearUrlImagen(p.image_128),
      image_1920: crearUrlImagen(p.image_1920),
      image_512: crearUrlImagen(p.image_512),
      image_1024: crearUrlImagen(p.image_1024),
      
      // O crear una propiedad genérica 'image' con la mejor disponible
      image: crearUrlImagen(p.image_1920) || crearUrlImagen(p.image_512) || 
            crearUrlImagen(p.image_1024) || crearUrlImagen(p.image_128)
    };
  });

  
    console.log("✅ [OK] Productos encontrados:", productos.length);

    return {
      props: {
        productos: productos.length > 0 ? productos : null,
        subcategorias: null,
        categoriaNombre: nombre,
        className: "template-color-1",
      },
    };

  } catch (error) {
    console.error("💥 [ERROR CRÍTICO] En getServerSideProps:", error.message);
    return {
      props: {
        productos: null,
        subcategorias: null,
        categoriaNombre: "Error al cargar la categoría",
        className: "template-color-1",
      },
    };
  }
};

export default Categoria;