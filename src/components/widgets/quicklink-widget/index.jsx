import PropTypes from "prop-types";
import Anchor from "@ui/anchor";
import Link from "next/link";

const QuicklinkWidget = ({ data }) => (
    <div className="footer-widget widget-quicklink">
        <h6 className="">{data.title}</h6>
        {data?.subTitle && (
            <h6 className="">{data.subTitle}</h6>    
        )}
        {data?.menu && (
            <ul className="footer-list-one">
                {data.menu.map((nav) => (
                    <li key={nav.id} className="single-list ">
                        <Link
                            rel="preload"
                            href={nav.path}
                            className=""
                            aria-label="label"
                        >
                            {nav.text}
                        </Link>

                    </li>
                ))}
            </ul>
        )}
    </div>
);

QuicklinkWidget.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string,
        menu: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
                    .isRequired,
                text: PropTypes.string.isRequired,
                path: PropTypes.string.isRequired,
            })
        ),
    }),
};

export default QuicklinkWidget;
