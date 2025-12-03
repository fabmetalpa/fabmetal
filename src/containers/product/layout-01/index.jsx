import clsx from "clsx";
import dynamic from "next/dynamic";
import Nav from "react-bootstrap/Nav";
import Product from "@components/product/layout-04";
import NotificationArea from "@containers/notification";

import { shuffleArray } from "@utils/methods";

const TabContent = dynamic(() => import("react-bootstrap/TabContent"), {
    ssr: false,
});
const TabContainer = dynamic(() => import("react-bootstrap/TabContainer"), {
    ssr: false,
});
const TabPane = dynamic(() => import("react-bootstrap/TabPane"), {
    ssr: false,
});

const ProductArea = ({ className, space, data }) => {
    console.log(data)
    return (

        <div
            className={clsx(
                "rn-product-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-8 custom-product-col">
                        {data?.section_title && (
                            <h2 className="text-left mt--50 mb--50">
                                Mi Carrito
                            </h2>
                        )}

                        <TabContainer defaultActiveKey="nav-home">
                            <Nav className="product-tab-nav">
                                <div className="nav">
                                    <Nav.Link as="button" eventKey="nav-home">
                                        Todos mis Productos
                                    </Nav.Link>

                                </div>
                            </Nav>
                            <TabContent>
                                <TabPane
                                    eventKey="nav-home"
                                    className="lg-product_tab-pane"
                                >
                                    {shuffleArray(data?.products)?.map((prod) => (
                                        <>
                                            <Product
                                                key={prod.id}
                                                title={prod.name}
                                                slug={prod.name}
                                                latestBid="{prod.latestBid}"
                                                price={prod.price}
                                                likeCount="{prod.likeCount}"
                                                auction_date="{prod.auction_date}"
                                                image={prod.images?.[0]}
                                                authors="{prod.authors}"
                                                bitCount="{prod.bitCount}"
                                                cantidad={prod.cantidad}
                                                precioTotal={prod.precioTotal}
                                                producto={prod}
                                                eliminarProducto={data.eliminarProducto}
                                            />
                                        </>
                                    ))}
                                </TabPane>

                            </TabContent>
                        </TabContainer>
                    </div>
                    <div className="col-lg-4 custom-product-col">
                        <div
                            className="header-right-fixed position-sticky product-notify-wrapper rbt-sticky-top-adjust-four mt--95 mt_md--20 mt_sm--15"
                            style={{ top: "90px" }}
                        >
                            <NotificationArea
                                data={{
                                    notifications: data.notifications,
                                    productos: data.products,
                                    vaciarCarrito: data.vaciarCarrito
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default ProductArea;
