import PropTypes from "prop-types";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import { GiMedicines } from "react-icons/gi";

const CategoryCard = ({ className, image, title, path }) => (
    <a className={clsx("category-style-one", className)} href={path}>
        {image?.src && (
            <img
                src={image.src}
                alt={title}
                width={533}
                height={533}
            />
        )}
        <span className="category-label">{title}</span>
    </a>
);

CategoryCard.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
};

export default CategoryCard;
