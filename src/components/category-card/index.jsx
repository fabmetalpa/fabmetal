import PropTypes from "prop-types";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import { GiMedicines } from "react-icons/gi";

const CategoryCard = ({ className, image, title, path, id }) => (
    <div>
        <a className={clsx("category-style-one", className)} href={path}>
            {image && (
                <img
                    src={image}
                    alt={image}
                    width={533}
                    height={533}
                />
            )}
            <span className="category-label">{title}</span>
        </a>
    </div>
);

CategoryCard.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
};

export default CategoryCard;
