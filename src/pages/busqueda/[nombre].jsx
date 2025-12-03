import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";

import ProductArea from "@containers/product/layout-03";



const categoria = ({ productos, categorias, categoriaMadre, agregarCarrito }) => {
    console.log(productos);

    return (
        <>
            <Wrapper>
                <SEO pageTitle="Busqueda" />
                <Header />
                <main id="main-content">
                    <Breadcrumb
                        pageTitle="Busqueda"
                        currentPage={categoriaMadre}
                    />

                    <ProductArea
                        data={{
                            section_title: { title: categoriaMadre },
                            products: productos,
                            agregarCarrito: agregarCarrito
                        }}
                    />

                </main>
                <Footer />
            </Wrapper>


        </>
    )
}


export const getServerSideProps = async (context) => {

    console.log(context)
    var category = context;



    var myHeaders = new Headers();

    myHeaders.append("Authorization", "Basic Y2tfM2Q5MjA1YjBmNzIwMjM5ZWRkMDJhYTRiOGY1ZjVkOGZkNWUwZDhjODpjc181OWMxYzY3NjExZTE1NGY1MjFiNzNjOTM5MjgxOTIwM2QyNWM3MDQ4");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const data = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&search=" + context.query.nombre + "", requestOptions);
    const result = await data.json();





    return {
        props: {
            productos: result,
            categorias: null,
            categoriaMadre: context.query.nombre,
            className: "template-color-1",
        },
    };



};

export default categoria;
