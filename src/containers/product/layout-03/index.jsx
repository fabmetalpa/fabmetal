import clsx from "clsx";
import Product from "@components/product/layout-02";
const ProductArea = ({ space, className, data }) => (
    <div
        className={clsx(
            "product-area",
            space === 1 && "rn-section-gapTop",
            className
        )}
    >
        <div className="container">
            <div className="row mb--30 align-items-center">
                <div className="col-12">
                    <h3
                        className="title mb--0"
                        data-sal-delay="150"
                        data-sal="slide-up"
                        data-sal-duration="800"
                    >
                        {data?.section_title.title}
                    </h3>
                </div>
            </div>
            <div className="row g-5">
                {data?.products?.map((prod) => (
                    <div
                        key={prod.id}
                        data-sal="slide-up"
                        data-sal-delay="150"
                        data-sal-duration="800"
                        className="col-3 col-lg-4 col-md-6 col-sm-6 col-12"
                    >
                        <Product
                            title={prod.name}
                            slug={prod.slug}
                            latestBid="34"
                            regular_price={prod.regular_price}
                            price={prod.price}
                            prod={prod}
                            auction_date={prod.auction_date}
                            image={prod.images?.[0]}
                            agregarCarrito={data.agregarCarrito}

                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);



export default ProductArea;
