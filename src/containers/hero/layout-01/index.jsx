import PropTypes from "prop-types";
import Image from "next/image";
import Button from "@ui/button";
import { HeadingType, TextType, ButtonType, ImageType } from "@utils/types";

const HeroArea = ({ data }) => (
    <div className="slider-one rn-section-gapTop">
        <div className="container">
            <div className="row row-reverce-sm align-items-center">
                <div className="col-lg-5 col-md-6 col-sm-12 mt_sm--50">

                    <h2
                        className="title"
                        data-sal-delay="200"
                        data-sal="slide-up"
                        data-sal-duration="800"
                    >

                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </h2>

                    <p
                        className="slide-disc"
                        data-sal-delay="300"
                        data-sal="slide-up"
                        data-sal-duration="800"
                    >
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    </p>


                    <div className="button-group">
                        <Button

                            data-sal-delay={400 + 10 * 100}
                            data-sal="slide-up"
                            data-sal-duration="800"
                        >
                            Contactanos
                        </Button>

                    </div>

                </div>
                <div className="col-lg-5 col-md-6 col-sm-12 offset-lg-1">
                    {data?.images?.[0]?.src && (
                        <div className="slider-thumbnail">
                            <Image
                                src="/nueva/herba.png"
                                alt="hero"
                                width={985}
                                height={993}
                                priority
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

HeroArea.propTypes = {
    data: PropTypes.shape({
        headings: PropTypes.arrayOf(HeadingType),
        texts: PropTypes.arrayOf(TextType),
        buttons: PropTypes.arrayOf(ButtonType),
        images: PropTypes.arrayOf(ImageType),
    }),
};

export default HeroArea;
