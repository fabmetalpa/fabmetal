import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";

import LiveExploreArea from "@containers/live-explore/layout-01";
import VideoArea from "@containers/video/layout-01";
import { normalizedData } from "@utils/methods";

import HeroArea from "@containers/hero/layout-06";

// Demo Data
import homepageData from "../data/homepages/home-06.json";
//import homepageData from "../data/homepages/home-10.json";
import { useEffect, useState } from "react";



const Home = ({ odooCategories }) => {

    console.log(odooCategories);

    const [destacados1, setDestacados1] = useState([]);
    const [destacados2, setDestacados2] = useState([]);
    const [destacados3, setDestacados3] = useState([]);
    const [destacados4, setDestacados4] = useState([]);
    const [destacados5, setDestacados5] = useState([]);
    const [destacados6, setDestacados6] = useState([]);

    const [isLoad, setIsLoad] = useState(false);

    const content = normalizedData(homepageData?.content || []);



    useEffect(() => {
        obtenerDatos();

        const fetchData = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic Y2tfM2Q5MjA1YjBmNzIwMjM5ZWRkMDJhYTRiOGY1ZjVkOGZkNWUwZDhjODpjc181OWMxYzY3NjExZTE1NGY1MjFiNzNjOTM5MjgxOTIwM2QyNWM3MDQ4");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            try {
                const dataP = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=138", requestOptions);
                const destacados1Data = await dataP.json();
                setDestacados1(destacados1Data);

                const data = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=140", requestOptions);
                const destacados2Data = await data.json();
                setDestacados2(destacados2Data);

                const dataE = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=110", requestOptions);
                const destacados3Data = await dataE.json();
                setDestacados3(destacados3Data);

                const data4 = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=157", requestOptions);
                const destacados4Data = await data4.json();
                setDestacados4(destacados4Data);

                const data5 = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=159", requestOptions);
                const destacados5Data = await data5.json();
                setDestacados5(destacados5Data);

                const data6 = await fetch("https://fabmetal.com.pa/wooco/index.php/wp-json/wc/v3/products?per_page=99&category=158", requestOptions);
                const destacados6Data = await data6.json();
                setDestacados6(destacados6Data);

                //setIsLoading(false); // Marca como cargado
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                //setIsLoading(false);
            }
        };

        fetchData();

    }, []);

    const obtenerDatos = async () => {


        setIsLoad(true);
    }


    return (
        <Wrapper>
            <SEO pageTitle="Inicio" />
            <Header odooCategories={odooCategories}/>
            <main id="main-content">

                <HeroArea data={content["hero-section"]} />


                {destacados1 && (
                    <LiveExploreArea
                        data={{
                            ...content["Productos Destacados"],
                            products: destacados1,
                            titulo: "Productos Destacados",
                        }}
                    />
                )}
                <VideoArea data={{
                    ...content["video-section"],
                    imagen: "/images/banner/Alimentaria.webp",
                    title: "INDUSTRIA ALIMENTARIA",
                    subtitle: "Industria Alimentaria",
                    icon: "<GiFrozenBlock />",
                }} />

                {destacados2 && (
                    <LiveExploreArea className=""
                        data={{
                            ...content[""],
                            products: destacados2,
                            titulo: "",
                        }}
                    />
                )}

                <VideoArea data={{
                    ...content["video-section"],
                    imagen: "/images/banner/Constructora.webp",
                    title: "INDUSTRIA CONSTRUCTORA",
                    subtitle: "Industria Constructora",
                    icon: "<GiFrozenBlock />",
                }} />


                {destacados3 && (
                    <LiveExploreArea
                        data={{
                            ...content[""],
                            products: destacados3,
                            titulo: "",
                        }}
                    />
                )}


                <VideoArea data={{
                    ...content["video-section"],
                    imagen: "/images/banner/Funeraria.webp",
                    title: "INDUSTRIA FUNERARIA",
                    subtitle: "Industria Funeraria",
                    icon: "<GiFrozenBlock />",
                }} />


                {destacados4 && (
                    <LiveExploreArea
                        data={{
                            ...content[""],
                            products: destacados4,
                            titulo: "",
                        }}
                    />
                )}



                <VideoArea data={{
                    ...content["video-section"],
                    imagen: "/images/banner/Hosteleria-1.webp",
                    title: "INDUSTRIA HOSTELERIA",
                    subtitle: "Industria Hosteleria",
                    icon: "<GiFrozenBlock />",
                }} />


                {destacados4 && (
                    <LiveExploreArea
                        data={{
                            ...content[""],
                            products: destacados5,
                            titulo: "",
                        }}
                    />
                )}




                <VideoArea data={{
                    ...content["video-section"],
                    imagen: "/images/banner/Veterinaria.webp",
                    title: "INDUSTRIA VETERINARIA",
                    subtitle: "Industria Veterinaria",
                    icon: "<GiFrozenBlock />",
                }} />


                {destacados4 && (
                    <LiveExploreArea
                        data={{
                            ...content[""],
                            products: destacados6,
                            titulo: "",
                        }}
                    />
                )}


            </main>
            <Footer />
        </Wrapper>
    );
}





export const getServerSideProps = async () => {
  const ODOO_URL = 'https://fabmetal.odoo.com';
  const DB = 'fabmetal';
  const USERNAME = "admin@fabmetal.com.pa";
  const PASSWORD = "#Fabmetal1*/";

  let rootCategories = [];

  try {
    // 1. Autenticar
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
    const { result: uid } = await authRes.json();
    if (!uid || typeof uid !== 'number') {
      throw new Error('Autenticación fallida');
    }

    // 2. Obtener TODAS las categorías (sin filtro en dominio)
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
            'search_read',
            [] // ← dominio vacío = todas
          ],
          kwargs: {
            fields: ['id', 'name', 'parent_id'] 
          }
        },
        id: 2
      })
    });
    const { result } = await catRes.json();
    const allCategories = Array.isArray(result) ? result : [];

    // 3. Filtrar EN EL SERVIDOR de Next.js
    rootCategories = allCategories;

  } catch (error) {
    console.error('Error al obtener categorías:', error.message);
  }

  return {
    props: {
      className: "template-color-1",
      odooCategories: rootCategories,
    },
  };
};


export default Home;
