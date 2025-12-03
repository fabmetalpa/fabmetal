import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import BlogArea from "@containers/blog/layout-02";

const POSTS_PER_PAGE = 8;

const Blog = ({ articulos, className }) => (
    <Wrapper>
        <SEO pageTitle="Blog" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="Nuestro Blog" currentPage="Blog" />
            <BlogArea data={ articulos } />
        </main>
        <Footer />
    </Wrapper>
);


export const getServerSideProps = async () => {



    var myHeaders = new Headers();


    const data = await fetch("https://puromusculos.com/wordpress/wp-json/wp/v2/posts");
    const result = await data.json();
 

    return {
        props: {
            articulos: result,
            className: "template-color-1",
        },
    };



};




export default Blog;
