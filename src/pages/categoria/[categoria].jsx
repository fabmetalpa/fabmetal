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
              categorias: subcategorias,
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
            { fields: ['id', 'name'] }
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
              [['parent_id', '=', id]] // La sintaxis correcta del dominio
            ],
            { fields: ['id', 'name'] }
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
            ],
            { fields: ['id', 'name', 'list_price'], limit: 100 }
          ]
        },
        id: 4
      })
    });
    const prodData = await prodRes.json();
    console.log("🔍 [LOG] Respuesta de productos:", prodData);
    const productos = (prodData.result || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.list_price,
    }));
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