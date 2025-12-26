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

const ProductDetailsArea = ({ space, className, product, agregarCarrito }) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };

    // CORRECCIÓN: Ya no necesitas convertir images porque ya es un array
    const galleryImages = React.useMemo(() => {
        // Si images ya es un array, usarlo directamente
        if (Array.isArray(product.images)) {
            return product.images;
        }
        
        // Si es un objeto (para compatibilidad con versiones anteriores), convertirlo
        if (typeof product.images === 'object' && product.images !== null) {
            // Si tiene propiedad 'main' y es un objeto con arrays
            if (product.images.main && Array.isArray(product.images.main)) {
                return product.images.main;
            }
            
            // Si es un objeto plano con URLs
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

    console.log("📸 Imágenes para galería:", galleryImages);
    console.log("📸 Número de imágenes:", galleryImages.length);

    // Opcional: Para debugging, mostrar información detallada de las imágenes
    if (galleryImages.length > 0) {
        console.log("📸 Estructura de la primera imagen:", galleryImages[0]);
    }

    // Eliminar la variable filteredImages ya que no es necesaria

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
                            {/* Pasar galleryImages directamente */}
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

                            <div className="rn-bid-details">
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
    );
};

ProductDetailsArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    product: PropTypes.object.isRequired,
    agregarCarrito: PropTypes.func,
};

export default ProductDetailsArea;