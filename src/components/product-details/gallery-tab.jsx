import PropTypes from "prop-types";
import Image from "next/image";
import TabContent from "react-bootstrap/TabContent";
import TabContainer from "react-bootstrap/TabContainer";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";

const GalleryTab = ({ images }) => {
    // Asegurarse de que images sea un array
    const safeImages = Array.isArray(images) ? images : [];
    
    if (safeImages.length === 0) {
        return (
            <div className="product-tab-wrapper">
                <div className="rn-pd-thumbnail">
                    <img
                        src="/images/default-product.png"
                        alt="Producto sin imagen"
                        width={560}
                        height={560}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="product-tab-wrapper">
            <TabContainer defaultActiveKey="nav-0">
                <div className="pd-tab-inner">
                    <Nav className="rn-pd-nav rn-pd-rt-content nav-pills">
                        {safeImages.map((image, index) => (
                            <Nav.Link
                                key={image.id || `image-${index}`}
                                as="button"
                                eventKey={`nav-${index}`}
                            >
                                <span className="rn-pd-sm-thumbnail">
                                    <img
                                        src={image.src}
                                        alt={image?.alt || `Product ${index + 1}`}
                                        width={167}
                                        height={167}
                                        loading="lazy"
                                    />
                                </span>
                            </Nav.Link>
                        ))}
                    </Nav>
                    <TabContent className="rn-pd-content">
                        {safeImages.map((image, index) => (
                            <TabPane 
                                key={image.id || `pane-${index}`} 
                                eventKey={`nav-${index}`}
                            >
                                <div className="rn-pd-thumbnail">
                                    <img
                                        src={image.src}
                                        alt={image?.alt || `Product ${index + 1}`}
                                        width={560}
                                        height={560}
                                        priority={index === 0}
                                    />
                                </div>
                            </TabPane>
                        ))}
                    </TabContent>
                </div>
            </TabContainer>
        </div>
    );
};

GalleryTab.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            src: PropTypes.string.isRequired,
            alt: PropTypes.string,
        })
    ),
};

export default GalleryTab;