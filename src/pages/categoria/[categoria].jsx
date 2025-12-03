import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";

import { normalizedData } from "@utils/methods";
import { useState } from "react";
import LiveExploreArea from "@containers/live-explore/layout-02";
import CategoryArea from "@containers/category/layout-01";

const categoria = ({ productos, categorias, categoriaMadre, agregarCarrito }) => {

    const [productFuerza, setProduct] = useState(productos);
    const [categoriasVista, setCategorias] = useState(categorias);
    const [madre, setMadre] = useState('');
    const [isLoad, setIsLoad] = useState(false);

    console.log(productFuerza);
    console.log(categoriasVista);

    if (productFuerza) {

        console.log(productFuerza)
        return (
            <>
                <Wrapper>
                    <SEO pageTitle={categoriaMadre[0].toUpperCase() + categoriaMadre.toLowerCase().slice(1)} />
                    <Header />
                    <main id="main-content">
                        <Breadcrumb
                            pageTitle={categoriaMadre[0].toUpperCase() + categoriaMadre.toLowerCase().slice(1)}
                            currentPage={categoriaMadre[0].toUpperCase() + categoriaMadre.toLowerCase().slice(1)}
                        />

                        <LiveExploreArea
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


    if (categoriasVista) {

        return (
            <>
                <Wrapper>
                    <SEO pageTitle={categoriaMadre[0].toUpperCase() + categoriaMadre.toLowerCase().slice(1)} />
                    <Header />
                    <main id="main-content">
                        <Breadcrumb
                            pageTitle={categoriaMadre[0].toUpperCase() + categoriaMadre.toLowerCase().slice(1)}
                            currentPage={categoriaMadre[0].toUpperCase() + categoriaMadre.toLowerCase().slice(1)}
                        />

                        <CategoryArea
                            className="d-none d-lg-block"
                            data={{
                                section_title: { title: categoriaMadre },
                                categorias: categoriasVista,
                                agregarCarrito: agregarCarrito
                            }}

                        />





                    </main>
                    <Footer />
                </Wrapper>
            </>
        )
    }


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

    const data = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products/categories?search=" + context.query.categoria + "", requestOptions);
    const result = await data.json();
    console.log(result);


    const catParent = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products/categories?per_page=99&parent=" + result[0].id + "", requestOptions);
    const resultCat = await catParent.json();
    console.log(resultCat)

    if (resultCat.length > 0) {
        return {
            props: {
                productos: null,
                categorias: resultCat,
                categoriaMadre: category.query.categoria,
                className: "template-color-1",
            },
        };
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic Y2tfM2Q5MjA1YjBmNzIwMjM5ZWRkMDJhYTRiOGY1ZjVkOGZkNWUwZDhjODpjc181OWMxYzY3NjExZTE1NGY1MjFiNzNjOTM5MjgxOTIwM2QyNWM3MDQ4");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const dataP = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=" + result[0].id + "", requestOptions);
    const resultP = await dataP.json();
    console.log(resultP)

    return {
        props: {
            productos: resultP,
            categorias: null,
            categoriaMadre: category.query.categoria,
            className: "template-color-1",
        },
    };


};

export default categoria;
