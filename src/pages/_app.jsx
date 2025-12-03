import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import sal from "sal.js";
import { ThemeProvider } from "next-themes";
import "../assets/css/bootstrap.min.css";
import "../assets/css/feather.css";
import "../assets/css/modal-video.css";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../assets/scss/style.scss";
import Link from 'next/link';
import { FloatingWhatsApp } from 'react-floating-whatsapp';


import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const MyApp = ({ Component, pageProps }) => {
    const [productosGlobal, setProductosGlobal] = useState([]);
    const [totalProds, setTotal] = useState(0);

    const router = useRouter();

    const CustomToastWithLink = () => (
        <div>
            <Link legacyBehavior href="/carrito">
                <a>Ver carrito</a>
            </Link>
        </div>
    );

    useEffect(() => {
        const productosGlobalLS = JSON.parse(localStorage.getItem("productosGlobal")) ?? [];
        setProductosGlobal(productosGlobalLS);
        localStorage.setItem('totalProds', productosGlobalLS.length)
        setTotal(productosGlobalLS.length);
        console.log(productosGlobal)

        sal({ threshold: 0.1, once: true });
    }, [router.asPath]);


    useEffect(() => {
        localStorage.setItem('productosGlobal', JSON.stringify(productosGlobal))
        localStorage.setItem('totalProds', productosGlobal.length)
        setTotal(productosGlobal.length);
    }, [productosGlobal])



    useEffect(() => {
        sal();
    }, []);

    useEffect(() => {
        document.body.className = `${pageProps.className}`;
    });

    useEffect(() => {
        /*    const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-L1SQCGY4MV';
    
            document.head.appendChild(script);
    
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments) };
            gtag('js', new Date());
            gtag('config',
                'G-L1SQCGY4MV');*/
    });

    const agregarCarrito = (producto) => {
        //console.log(producto)
        //console.log(productosGlobal)

        if (productosGlobal.some((articulo) => articulo.id === producto.id)) {
            //  console.log("duplicado")
            producto.cantidad = producto.cantidad + 1;
            producto.precioTotal = producto.price * producto.cantidad;

            const productosActualizado = productosGlobal.filter((articulo) => articulo.id !== producto.id);

            setProductosGlobal([...productosActualizado, producto]);
            setTotal(productosActualizado.length);

            toast("Producto existente, se aumenta la Cantidad");
        } else {
            producto.cantidad = 1;
            producto.precioTotal = producto.price * producto.cantidad;

            setProductosGlobal([...productosGlobal, producto]);
            setTotal(productosGlobal.length);

            toast(CustomToastWithLink);
        }
    }

    const vaciarCarrito = () => {

        setProductosGlobal([]);
        setTotal(0);

    }

    const eliminarProducto = (id) => {
        const productosActualizado = productosGlobal.filter((articulo) => articulo.id !== id);
        setProductosGlobal(productosActualizado);
        setTotal(productosActualizado.length);
        toast("Se elimino del Carrito");
    }

    return (
        <ThemeProvider defaultTheme="dark">
            <Component {...pageProps}
                productosGlobal={productosGlobal}
                agregarCarrito={agregarCarrito}
                eliminarProducto={eliminarProducto}
                vaciarCarrito={vaciarCarrito} />
            <FloatingWhatsApp phoneNumber={"50767268167"} accountName={"FABMETAL"}
                statusMessage={"Normalmente responde en 5 min"}
                chatMessage={"¡hola! 🤝 ¿Cómo podemos ayudarte?"}
                placeholder={"Escribe tu mensaje"}
                avatar={"/favicon2.webp"}
                darkMode={false}

            />
            <ProgressBar
                height="4px"
                color="#2c4874"
                options={{ showSpinner: true }}
                shallowRouting
            />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </ThemeProvider>
    );
};

MyApp.propTypes = {
    Component: PropTypes.elementType,
    pageProps: PropTypes.shape({
        className: PropTypes.string,
    }),
};

export default MyApp;
