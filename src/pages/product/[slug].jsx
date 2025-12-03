
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ProductDetailsArea from "@containers/product-details";
import ProductArea from "@containers/product/layout-03";


const categoria = ({ productos, categorias, categoriaMadre }) => (
    <Wrapper>
        <SEO pageTitle="Product Details" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="Product Details"
                currentPage="Product Details"
            />
            <ProductDetailsArea product={product} />
            <ProductArea
                data={{
                    section_title: { title: "Recent View" },
                    products: recentViewProducts,
                }}
            />
            <ProductArea
                data={{
                    section_title: { title: "Related Item" },
                    products: relatedProducts,
                }}
            />
        </main>
        <Footer />
    </Wrapper>
);


export const getServerSideProps = async (context) => {

    console.log(context)
    var category = context;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic Y2tfMzQ1MTY4ZDVhY2UyNzliM2Y0ZGE0ZTYxYTcxZmIwYTgwN2U1ZWJiNDpjc19mZmQ5Yjk4NjQ0MmYzNDBmNTYxY2Y2NGRhYTU4NDdiMTliZTUxZjA5");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const data = await fetch("https://fadimet.com.pa/woocoo/index.php/wp-json/wc/v3/products/categories?search=" + context.query.categorianombre + "", requestOptions);
    const result = await data.json();
    console.log(result);


    const catParent = await fetch("https://fadimet.com.pa/woocoo/index.php/wp-json/wc/v3/products/categories?per_page=99&parent=" + result[0].id + "", requestOptions);
    const resultCat = await catParent.json();
    console.log(resultCat)

    if (resultCat.length > 0) {
        return {
            props: {
                productos: null,
                categorias: resultCat,
                categoriaMadre: category.query.categorianombre
            },
        };
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic Y2tfMzQ1MTY4ZDVhY2UyNzliM2Y0ZGE0ZTYxYTcxZmIwYTgwN2U1ZWJiNDpjc19mZmQ5Yjk4NjQ0MmYzNDBmNTYxY2Y2NGRhYTU4NDdiMTliZTUxZjA5");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const dataP = await fetch("https://fadimet.com.pa/woocoo/index.php/wp-json/wc/v3/products?per_page=99&category=" + result[0].id + "", requestOptions);
    const resultP = await dataP.json();
    console.log(resultP)

    return {
        props: {
            productos: resultP,
            categorias: null,
            categoriaMadre: category.query.categorianombre
        },
    };



};

export default categoria;
