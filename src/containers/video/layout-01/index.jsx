import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import { ImageType } from "@utils/types";
import { FaStoreAlt } from "react-icons/fa";
import { useRouter } from "next/router";

const VideoArea = ({
    data,
    className,
    space,

}) => {
    const router = useRouter();
    console.log(data)


    const irCategoria = (categoria) => {

        console.log(categoria)
        router.push({
            pathname: "categoria/" + { categoria } + "/",
        });
    }



    return (
        <div
            className={clsx(
                "vedio-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row mb--40">
                    <div className="title-area ">

                        {data?.title && (
                            <h3 className="title mb--15">{data.subtitle}</h3>
                        )}
                        {data?.subtitle && (
                            <p className="subtitle"></p>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 position-relative">
                        <a href={"/categoria/" + data.title}>
                            <button
                                type="button"
                                className={clsx(
                                    "video-play-button btn-large with-animation",
                                    className
                                )}

                            >

                                <p className=" color-primary h2" > <FaStoreAlt /> </p>

                            </button>
                        </a>
                        {data.imagen && (
                            <div className="vedio-wrapper">
                                <Image
                                    src={data.imagen}
                                    alt={data.imagen || "Video BG"}
                                    title={data.imagen || "Video BG"}
                                    width={1368}
                                    height={610}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

VideoArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: PropTypes.shape({
            title: PropTypes.string,
            subtitle: PropTypes.string,
        }),
        images: PropTypes.arrayOf(ImageType),
        video: PropTypes.shape({
            videoId: PropTypes.string,
        }),
    }),
};

VideoArea.defaultProps = {
    space: 1,
};

export default VideoArea;
