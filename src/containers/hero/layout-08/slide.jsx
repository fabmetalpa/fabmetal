import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Anchor from "@ui/anchor";
import Button from "@ui/button";
import PlaceBidModal from "@components/modals/placebid-modal";
import { ImageType } from "@utils/types";

const SingleSlide = ({
    image,
    title,
    path,
    description,
    authors,
    bitCount,
    auction_date,
    award_image,
}) => {
    const [showBidModal, setShowBidModal] = useState(false);
    
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };
    
    return (
        <div style={{ 
            position: "relative", 
            width: "100%", 
            height: "100%",
            minHeight: "700px",
            backgroundColor: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {/* Overlay que cubre TODO */}
            <div 
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
                    zIndex: 1,
                }}
            />

            {/* Imagen de fondo - cubre TODO */}
            {image?.src && (
                <Image
                    src={image.src}
                    alt="Slider BG"
                    quality={100}
                    priority
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: "cover",
                        objectPosition: "center center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0
                    }}
                />
            )}

            {/* Contenido - centrado verticalmente */}
            <div className="container" style={{ 
                position: "relative", 
                zIndex: 2,
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                margin: "0 auto"
            }}>
                <div className="row g-5" style={{ 
                    width: "100%",
                    alignItems: "center",
                    margin: "0" // Eliminar márgenes de Bootstrap
                }}>
                    {/* Columna 1: Título */}
                    <div className="col-xl-4 col-lg-12 col-12 order-3 order-xl-1 order-sm-1">
                        <Anchor path={path}>
                            <h2
                                className="title"
                                dangerouslySetInnerHTML={{ __html: title }}
                                style={{
                                    color: "#ffffff",
                                    textShadow: "3px 3px 8px rgba(0,0,0,0.9)",
                                    fontSize: "3.5rem",
                                    fontWeight: "800",
                                    lineHeight: "1.1",
                                    marginBottom: "25px",
                                    marginTop: "0", // Eliminar margen superior
                                    paddingLeft: "15px"
                                }}
                            />
                        </Anchor>
                        
                        {/* Información adicional */}
                        {(bitCount || auction_date) && (
                            <div style={{
                                marginTop: "15px",
                                padding: "15px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                                backdropFilter: "blur(5px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                maxWidth: "90%",
                                marginLeft: "15px"
                            }}>
                                {bitCount && (
                                    <div style={{
                                        color: "#ffffff",
                                        fontSize: "1.1rem",
                                        marginBottom: "8px"
                                    }}>
                                        <strong>{bitCount}</strong> bits disponibles
                                    </div>
                                )}
                                
                                {auction_date && (
                                    <div style={{
                                        color: "#ffffff",
                                        fontSize: "1rem",
                                        opacity: "0.9"
                                    }}>
                                        Subasta: {auction_date}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Columna 2: Descripción */}
                    <div className="col-xl-6 col-lg-12 col-12 order-2 order-xl-2 order-sm-2">
                        <div className="item-description">
                            <div style={{
                                color: "#ffffff",
                                fontSize: "1.3rem",
                                fontWeight: "500",
                                lineHeight: "1.7",
                                backgroundColor: "rgba(0,0,0,0.6)",
                                padding: "30px",
                                borderRadius: "15px",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                                margin: "0" // Eliminar márgenes
                            }}>
                                <p style={{ margin: "0 0 25px 0" }}>
                                    {description}
                                </p>
                                
                                <Button
                                    color="primary-alta"
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.95)",
                                        color: "#000",
                                        fontWeight: "bold",
                                        padding: "14px 35px",
                                        borderRadius: "30px",
                                        border: "none",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                                        fontSize: "1.1rem",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    Ver más detalles
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Columna 3: Imagen de premio */}
                    <div className="col-xl-2 col-lg-12 col-12 order-1 order-xl-3 order-sm-3 d-flex justify-content-center">
                        <div className="img-thumb-award">
                            {award_image?.src && (
                                <div style={{
                                    backgroundColor: "rgba(255,255,255,0.95)",
                                    padding: "15px",
                                    borderRadius: "20px",
                                    boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                                    transform: "perspective(1000px) rotateY(-8deg)",
                                    transition: "all 0.4s ease",
                                    width: "180px",
                                    height: "180px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <Image
                                        src={award_image.src}
                                        alt="Premio"
                                        width={150}
                                        height={150}
                                        style={{
                                            borderRadius: "12px",
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

SingleSlide.propTypes = {
    title: PropTypes.string,
    path: PropTypes.string,
    description: PropTypes.string,
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            slug: PropTypes.string,
            image: ImageType,
        })
    ),
    bitCount: PropTypes.number,
    auction_date: PropTypes.string,
    image: ImageType,
    award_image: ImageType,
};

export default SingleSlide;