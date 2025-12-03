import Head from "next/head";
import PropTypes from "prop-types";

const SEO = ({ pageTitle, url }) => {
    const title = `${pageTitle} || FabMetal`;
    return (
        <Head>
            <title> FABMETAL | Soluciones Metálicas para Industrias en Panamá. - {pageTitle}</title>
            <meta property="og:title" content="FABMETAL | Soluciones Metálicas para Industrias en Panamá."></meta>
            <link rel="canonical" href="https://www.fabmetal.com.pa/nosotros" />
            <meta property="og:type" content="website" ></meta>
            <meta property="og:url" content="https://www.fabmetal.com.pa" ></meta>
            <meta lang="es"></meta>
            <meta property="og:site_name" content="FabMetal"></meta>

            <meta httpEquiv="x-ua-compatible" content="ie=edge" />
            <meta name="description" content="Fabricaciones metálicas y soluciones en acero inoxidable en Panamá. Calidad y personalización en equipos y mobiliario para cada industria." />
            <meta property="og:description" content="Fabricaciones metálicas y soluciones en acero inoxidable en Panamá. Calidad y personalización en equipos y mobiliario para cada industria."></meta>
            <meta name="keywords" content="Acero inox, Inox Acero, Carritos de acero inoxidable, Acero inoxidable para funerarias, Acero inoxidable para veterinarias, Anaqueles en acero inoxidable, Asadores en acero inoxidable, Barandas en acero inoxidable, Equipos para industria alimentaria, Fabricación de muebles en acero inoxidable, Aluminio, Fabricaciones Metalicas"></meta>
            <meta name="author" content="Irving salcedo - irvng1364@gmail.com"></meta>
            <meta name="google-site-verification" content="UBC8EyRl0-D06NDrMLOgHXjX2AWzRUZC2v0s6TNYtdg" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <link rel="icon" href="/favicon.ico" />
            <meta property="og:image" content="/favicon.ico"></meta>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>

        </Head>
    );
};

SEO.propTypes = {
    pageTitle: PropTypes.string.isRequired,
};

export default SEO;
