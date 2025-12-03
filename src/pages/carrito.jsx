import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ProductArea from "@containers/product/layout-01";

// Demo data
import sellerData from "../data/sellers.json";
import productData from "../data/products-02.json";
import notificationData from "../data/notifications.json";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Carrito = ({ eliminarProducto, productosGlobal, vaciarCarrito }) => (
    <Wrapper>
        <SEO pageTitle="Carrito" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="Carrito"
                currentPage="Carrito"
            />
            <ProductArea
                data={{
                    section_title: {
                        title: "OUR All NFT'S",
                    },
                    products: productosGlobal,
                    notifications: notificationData,
                    creators: sellerData,
                    eliminarProducto: eliminarProducto,
                    vaciarCarrito: vaciarCarrito
                }}
            />
        </main>
        <Footer />
    </Wrapper>
);

export default Carrito;
