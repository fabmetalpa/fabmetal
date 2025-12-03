import PropTypes from "prop-types";
import clsx from "clsx";
import Product from "@components/product/layout-01";
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import { ProductType, SectionTitleType } from "@utils/types";
import { useEffect, useState } from "react";


    const ProductArea = ({ space, className, data, productos, agregarCarrito }) => {

        const [allProducts, setProducts] = useState([]);
        const [isLoad, setIsLoad] = useState(false);
       
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
    
    
            const data = await fetch("https://puromusculos.com/wordpress/wp-json/wp/v2/posts?categories=51")
            const result = await data.json();
            setProducts(result)
            setIsLoad(true)
    
        }
    
    
        console.log(allProducts)
    
        return (
    


    <div
        className={clsx(
            "rn-new-items",
            space === 1 && "rn-section-gapTop",
            className
        )}
    >
        <div className="container">
            <div className="row mt--100 mb--50 align-items-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="section-title text-left">

                            <h3
                                className={clsx("title mb--0 live-bidding-title")}
                                data-sal-delay="150"
                                data-sal="slide-up"
                                data-sal-duration="800"
                            >
                                Articulos Destacados
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
                        <Anchor className="btn-transparent" path="/blog">
                            VER TODOS
                            <i className="feather feather-arrow-right" />
                        </Anchor>
                    </div>
                </div>
            </div>
            
            
            
                <div className="row g-5">
                    {allProducts.map((prod) => (
                       <div className="col-lg-3 col-md-3 col-sm-3 col-12 mt_mobile--15"> 
                        <div
                            key={prod.id}
                            className="product-style-one no-overlay with-placeBid"
                        >
                            <div className="card-thumbnail">
                                    <Anchor path={`/blogs/${prod.title.rendered}`}>
                                        <img
                                            src={prod.featured_media_src_url}
                                            alt="NFT_portfolio"
                                            width={533}
                                            height={533}
                                        />
                                    </Anchor>
                                

                            </div>
                            <div className="product-share-wrapper">

                            </div>
                            <Anchor path={`/blogs/${prod.title.rendered}`}>
                                <span className="product-name">{prod.title.rendered}</span>
                            </Anchor>
                            <span className="latest-bid"  dangerouslySetInnerHTML={{ __html: prod.excerpt.rendered }}></span>
                        </div>
                        </div>
                    ))}
                </div>
            
        </div>
    </div>
)
                    }
export default ProductArea;
