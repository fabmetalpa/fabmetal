import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import { ImageType } from "@utils/types";

const BannerBadge = ({ className, image, title, ...rest }) => (
    <div className={clsx("banner-badge-top", className)} {...rest}>

        {image?.src && (
            <div className="icon">
                <Image
                    src={image.src}
                    alt={image?.alt || title}
                    title={image?.alt || title}
                    width={image?.width}
                    height={image?.height}
                    priority
                />
            </div>
        )}

        <h2 className="subtitle" style={{ fontSize: '12px' }}>{title}</h2>
    </div>
);

BannerBadge.propTypes = {
    className: PropTypes.string,
    image: ImageType.isRequired,
    title: PropTypes.string.isRequired,
};

export default BannerBadge;
