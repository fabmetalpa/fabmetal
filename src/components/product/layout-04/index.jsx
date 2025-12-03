import { useState } from "react";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import Button from "@ui/button";


import { MdDelete } from "react-icons/md";

const Product = ({
    title,
    slug,
    price,
    latestBid,
    image,
    authors,
    bitCount,
    likeCount,
    className,
    cantidad,
    precioTotal,
    producto,
    eliminarProducto
}) => {
    /*
    const [showBidModal, setShowBidModal] = useState(false);
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };*/
    return (
        <>
            <div className={clsx("lg-product-wrapper", className)}>
                <div className="inner">
                    <p></p>
                    <div className="lg-left-content">
                        {image?.src && (
                            <Anchor
                                path={`/product/${slug}`}
                                className="thumbnail"
                            >
                                <img
                                    src={image.src}
                                    alt={image?.alt || "NFT_portfolio"}
                                    width={image?.width ? image.width : 430}
                                    height={image?.height ? image.height : 430}
                                />
                            </Anchor>
                        )}
                        <div className="read-content">
                            <div className="product-share-wrapper">
                                <div className="profile-share">


                                </div>
                                <div className="last-bid">
                                    {price}$
                                </div>
                            </div>
                            <Anchor path={`/product/${slug}`}>
                                <h4 className="title">{title}</h4>
                            </Anchor>
                            
                            <h6 className="title">Cantidad: {cantidad}</h6>
                            <h6 className="title">Total: {precioTotal}</h6>
                            
                            {/* 
                            <div className="share-wrapper d-flex">
                                <div className="react-area mr--15">
                                    <span className="number">-</span>
                                </div>
                                <span className="latest-bid">
                                    Cantidad: {cantidad}
                                </span>
                                <div className="react-area ml--15">
                                    <span className="number">+</span>
                                </div>
                            </div>



                            <br />

                            <span className="latest-bid">
                                Total: {price * cantidad}
                            </span>
                            */}
                            <Button onClick={() => eliminarProducto(producto.id)} color="primary-alta" size="small">
                                Eliminar <MdDelete />
                            </Button>


                        </div>
                    </div>

                    <div className="product-share-wrapper">
                        {/*
                        <Button
                            color="primary"
                            size=""
                            className="mr--10 "
                            onClick={handleBidModal}
                        >
                            Eliminar
                        </Button>*/}
                    </div>



                </div>
            </div>
        </>
    );
};



export default Product;
