import PropTypes from "prop-types";
import clsx from "clsx";
import Product from "@components/product/layout-01";
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";



const CountdownTimer = dynamic(() => import("@ui/countdown/layout-01"), {
    ssr: false,
});

const ShareDropdown = dynamic(() => import("@components/share-dropdown"), {
    ssr: false,
});


const ProductArea = ({ space, className, data, productos, agregarCarrito }) => {

    const [allProducts, setProducts] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    console.log(data.agregarCarrito);
    useEffect(() => {
        obtenerDatos();

    }, []);

    const obtenerDatos = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic Y2tfMjU3YTQ2YjgzY2RlNjc3MGY4MWFkZDRkZmM2MjI0YmExOGMxNWY5Mjpjc18xZjlhZThiZjA5MDNmNTZmNjVjZWVhODVjNGY3MmVhMjExNjlhZTli");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };


        const data = await fetch("https://puromusculos.com/wordpress/index.php/wp-json/wc/v3/products?category=47&per_page=50", requestOptions)
        const result = await data.json();
        setProducts(result)
        setIsLoad(true)

    }


    console.log(data)

    return (
        < >

            < div
                className={
                    clsx(
                        "rn-new-items",
                        space === 1 && "rn-section-gapTop",
                        className
                    )}
            >
                <div className="container">
                    <div className="row mt--100 mb--50 align-items-center">
                        <br />
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">

                            <div className="section-title text-left">

                                <h3
                                    className={clsx("title mb--0 live-bidding-title")}
                                    data-sal-delay="150"
                                    data-sal="slide-up"
                                    data-sal-duration="800"
                                >
                                    Productos Destacados
                                </h3>

                            </div>


                        </div>


                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                            <div
                                className="view-more-btn text-start text-sm-end"
                                data-sal-delay="150"
                                data-sal="slide-up"
                                data-sal-duration="800"
                            >
                                {/* 
                                <Anchor className="btn-transparent" path="">
                                    VER TODOS
                                    <i className="feather feather-arrow-right" />
                                </Anchor>
                                */}
                            </div>
                        </div>
                    </div>

                    <div className="row g-5">




                        {allProducts.map((prod) => (

                            <div key={prod.id} className="col-lg-3 col-md-3 col-sm-6 col-12 mt_mobile--15">
                                <div
                                    className={clsx(
                                        "product-style-one no-overlay with-placeBid"
                                    )}
                                >
                                    <div className="card-thumbnail">
                                        <Anchor path={`/producto/${prod.name}`}>
                                            <img
                                                src={prod.images[0].src}
                                                alt="NFT_portfolio"
                                                width={533}
                                                height={533}
                                            />
                                        </Anchor>

                                    </div>
                                    <div className="product-share-wrapper">

                                    </div>
                                    <Anchor path={`/producto/${prod.name}`}>
                                        <span className="product-name">{prod.name}</span>
                                    </Anchor>

                                    <strike><span className="">{prod.regular_price} €</span></strike>
                                    <span> </span><span> </span>
                                    <span className="latest-bid mr--20"> {prod.price} €</span>
                                    <div className="share-wrapper d-flex">
                                        <div className="react-area mr--15">
                                            <h5>
                                                <FaCartArrowDown className="" onClick={() => data.agregarCarrito(prod)} />
                                            </h5>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}


                    </div>

                </div >
            </div >
        </>
    )
}

export default ProductArea;
