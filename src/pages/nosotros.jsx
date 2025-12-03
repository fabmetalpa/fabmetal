
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import AboutArea from "@containers/about/layout-02";
import QuoteArea from "@containers/quote-area";

import CTAArea from "@containers/cta";

import { normalizedData } from "@utils/methods";

// Demo data
import aboutData from "../data/innerpages/about.json";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Nosotros = ({ posts }) => {
    const content = normalizedData(aboutData?.content || []);
    return (
        <Wrapper>
            <SEO pageTitle="Nosotros" />
            <Header />
            <main id="main-content">
                <AboutArea data={content["about-section"]} />
                <QuoteArea data={content["quote-section"]} />
                {/*<FunfactArea data={content["funfact-section"]} />*/}
                <CTAArea data={content["cta-section"]} />
            </main>
            <Footer />
        </Wrapper>
    );
};



export default Nosotros;
