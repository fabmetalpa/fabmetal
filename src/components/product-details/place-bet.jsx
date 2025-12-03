import { useState } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import Image from "next/image";
import Anchor from "@ui/anchor";
import Button from "@ui/button";
import PlaceBidModal from "@components/modals/placebid-modal";
import { ImageType } from "@utils/types";

const Countdown = dynamic(() => import("@ui/countdown/layout-02"), {
    ssr: false,
});

const PlaceBet = ({ highest_bid, auction_date, btnColor, className, prod, agregarCarrito }) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };

    return (
        <>
            <div className={clsx("place-bet-area", className)}>

                <Button
                    color={btnColor || "primary-alta"}
                    className=""
                    onClick={() => agregarCarrito(prod)}
                >
                    Agregar al Carrito
                </Button>
            </div>
        </>
    );
};



export default PlaceBet;
