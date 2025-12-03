import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import BlogDetailsArea from "@containers/blog-details";


const BlogDetails = ({ articulo, nombre, agregarCarrito }) => (

    <Wrapper>
        <SEO pageTitle={nombre} />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle={nombre} currentPage="Blog Detalle" />
            <div className="rn-blog-area rn-blog-details-default rn-section-gapTop">
                <div className="container">
                    <div className="row g-6">
                        <div className="col-xl-12 col-lg-12">
                            <BlogDetailsArea post={articulo} />
                            {/*    <CommentsArea />
                            <CommentForm />
                        <RelatedPostsArea relatedPosts={relatedPosts} />*/}
                        </div>
                        <div className="col-xl-4 col-lg-4 mt_md--40 mt_sm--40">
                            {/* <BlogSidebar
                                categories={categories}
                                recentPosts={recentPosts}
                                tags={tags}
                            />*/}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </Wrapper>
);

export const getServerSideProps = async (context) => {


    const data = await fetch("https://puromusculos.com/wordpress/wp-json/wp/v2/posts?search=" + context.query.slug + "");
    const result = await data.json();


    return {
        props: {
            articulo: result[0],
            nombre: context.query.slug,
            className: "template-color-1",
        },
    };

};

export default BlogDetails;
