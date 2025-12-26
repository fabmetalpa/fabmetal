import PropTypes from "prop-types";
import clsx from "clsx";
import Sticky from "@ui/sticky";
import Button from "@ui/button";
import GalleryTab from "@components/product-details/gallery-tab";
import ProductTitle from "@components/product-details/title";
import ProductCategory from "@components/product-details/category";
import ProductCollection from "@components/product-details/collection";
import BidTab from "@components/product-details/bid-tab";
import PlaceBet from "@components/product-details/place-bet";
import { ImageType } from "@utils/types";
import PlaceBidModal from "@components/modals/placebid-modal";
import React, { useState } from "react";


// Demo Image

const ProductDetailsArea22 = ({ space, className, product, agregarCarrito }) => {

    const [showBidModal, setShowBidModal] = useState(false);
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };

     const imagesArray = product.images 
        ? Object.entries(product.images).map(([key, src]) => ({
              id: key,
              src: src,
              alt: `${product.name} - ${key}`
          }))
        : [];

    const galleryImages = React.useMemo(() => {
        // Si images ya es un array, usarlo directamente
        if (Array.isArray(product.images)) {
            return product.images;
        }
        
        // Si es un objeto, convertirlo a array
        if (typeof product.images === 'object') {
            return Object.entries(product.images || {})
                .filter(([key, value]) => value && typeof value === 'string')
                .map(([key, src], index) => ({
                    id: index,
                    src: src,
                    alt: `${product.name} - ${key}`
                }));
        }
        
        return [];
    }, [product.images, product.name]);

    console.log("📸 Imágenes para galería:", galleryImages.length);

    // O si solo quieres las imágenes principales (sin el campo "main")
    const filteredImages = Object.entries(product.images || {})
        .filter(([key]) => key !== 'main') // Excluir el campo "main" si no es una imagen
        .map(([key, src]) => ({
            id: key,
            src: src,
            alt: `${product.name} - ${key}`
        }));

    
    const descargarPDF = (documento) => {
        if (!documento || !documento.download_url) {
            console.error("No hay URL para descargar");
            return;
        }
        
        // Crear enlace temporal
        const link = document.createElement('a');
        link.href = documento.download_url;
        link.download = documento.name || 'documento.pdf';
        link.target = '_blank'; // Abrir en nueva pestaña
        link.rel = 'noopener noreferrer';
        
        // Agregar al DOM y hacer clic
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    };


    return (


        <div
            className={clsx(
                "product-details-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-7 col-md-12 col-sm-12">
                        <Sticky>
                            <GalleryTab images={galleryImages} />
                        </Sticky>
                    </div>
                    <div className="col-lg-5 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
                        <div className="rn-pd-content-area mt--10">
                            <ProductTitle
                                title={product.name}

                            />
                            
                            <div className="row mt-4">
                                <div className="col-12">
                                    
                                    {product.documents && product.documents.length > 0 && (
                                        <div className="d-grid gap-2">
                                            <a 
                                                href={product.documents[0].download_url}
                                                download={product.documents[0].name}
                                                className="btn btn-lg btn-outline-success"
                                            >
                                                <i className="bi bi-file-arrow-down me-2"></i>
                                                Click aquí para descargar "{product.documents[0].name}"
                                            </a>
                                           
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 
                            <div  className="price" dangerouslySetInnerHTML={{ __html: product.acf.especificaciones_tecnicas }}></div>
                            */}
                            
                            {/* 
                            <div className="rn-pd-sm-property-wrapper">
                                
                                
                                <div className="catagory-wrapper">
                                    {product.acf.codigo != '' &&
                                        <>     
                                            <div  className="pd-property-inner">
                                                <span className="color-body type">Código</span>
                                                <span className="color-white value">
                                                    {product.acf.codigo}
                                                </span>
                                            </div>
                                        </>
                                    }
                                        

                                    {product.acf.marca != '' &&
                                        <>     
                                            <div  className="pd-property-inner">
                                                <span className="color-body type">Marca</span>
                                                <span className="color-white value">
                                                    {product.acf.marca}
                                                </span>
                                            </div>
                                        </>
                                    }

                                    {product.acf.origen != '' &&
                                        <>     
                                            <div  className="pd-property-inner">
                                                <span className="color-body type">Origen</span>
                                                <span className="color-white value">
                                                    {product.acf.origen}
                                                </span>
                                            </div>
                                        </>
                                    }

                                    {product.acf.material != '' &&
                                        <>     
                                            <div  className="pd-property-inner">
                                                <span className="color-body type">Material</span>
                                                <span className="color-white value">
                                                    {product.acf.material}
                                                </span>
                                            </div>
                                        </>
                                    }


                                    {product.acf.dimensiones_ != '' &&
                                        <>     
                                            <div  className="pd-property-inner">
                                                <span className="color-body type">Dimensiones</span>
                                                <span className="color-white value">
                                                    {product.acf.dimensiones_}
                                                </span>
                                            </div>
                                        </>
                                    }

                                    {product.acf.estructura_ != '' &&
                                        <>     
                                            <div  className="pd-property-inner">
                                                <span className="color-body type">Estructura</span>
                                                <span className="color-white value">
                                                    {product.acf.estructura_}
                                                </span>
                                            </div>
                                        </>
                                    }


                                
                                </div>
                                
                                


                            </div>

*/}

                            {/*
                            <div className="catagory-collection">
                                 <ProductCategory owner={product.owner} /> 
                            <ProductCollection
                                collection={product.collection}
                            /> 
                            </div>

                            <Button
                                color="primary-alta mt--10"
                                className=""
                                onClick={handleBidModal}
                            >
                                Agregar al Carrito
                            </Button>*/}

                            <div className="rn-bid-details">
                                {/*
                            <BidTab
                                bids={product?.bids}
                                owner={product.owner}
                                properties={product?.properties}
                                tags={product?.tags}
                                history={product?.history}
                            />*/}
                                <PlaceBet
                                    highest_bid={product.highest_bid}
                                    auction_date={product?.auction_date}
                                    prod={product}
                                    agregarCarrito={agregarCarrito}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default ProductDetailsArea22;
