import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Button from "@ui/button";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const ErrorPage = () => (
    <Wrapper>
        <SEO pageTitle="404" />
        <Header />
        <div className="rn-not-found-area rn-section-gapTop">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="rn-not-found-wrapper">
                            <h2 className="large-title">404</h2>
                            <h3 className="title">Pagina no Encontrada!</h3>
                            <p>La pagina no esta disponible en estos momentos.</p>
                            <Button path="/">Vuelve al Inicio</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </Wrapper>
);

export default ErrorPage;
