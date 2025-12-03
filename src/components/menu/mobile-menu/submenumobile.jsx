import PropTypes from "prop-types";
import Anchor from "@ui/anchor";

const SubMenuMobile = ({ menu }) => (
    <ul className="submenu mobile-menu-children">
        {menu.map((nav) => (
            <li key={nav.id}>
                <a href={'/categoria/' + nav.name}>
                    {nav.name}
                </a>
            </li>
        ))}
        <li key={20}>
            <a href={'/categoria/Inyectables'}>
                Inyectables
            </a>
        </li>
    </ul >
);

SubMenuMobile.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({})),
}

export default SubMenuMobile;
