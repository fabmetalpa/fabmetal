import { useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import PlaceBidModal from "@components/modals/placebid-modal";

const CountdownTimer = dynamic(() => import("@ui/countdown/layout-01"), {
    ssr: false,
});

const ShareDropdown = dynamic(() => import("@components/share-dropdown"), {
    ssr: false,
});

const Product = ({
    overlay,
    title,
    slug,
    latestBid,
    price,
    likeCount,
    auction_date,
    image,
    bitCount,
    authors,
    placeBid,
    disableShareDropdown,
}) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };


    return (
        <>
            <div
                className={clsx(
                    "product-style-one ",
                    !overlay && "no-overlay",
                    placeBid && "with-placeBid"
                )}
            >
                <div className="card-thumbnail">
                    {image && (
                        <Anchor path={`/producto/${title}`}>
                            <img
                                src={image}
                                alt="NFT_portfolio"
                                width={533}
                                height={533}
                            />
                        </Anchor>
                    )}

                </div>
                <div className="product-share-wrapper">

                </div>
                <Anchor path={`/producto/${title}`}>
                    <span className="product-name">{title}</span>
                </Anchor>

            </div>
            <PlaceBidModal show={showBidModal} handleModal={handleBidModal} />
        </>
    );
};



export default Product;
