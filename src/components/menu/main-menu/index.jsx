import SubMenu from "./submenu";
import Link from 'next/link';


const MainMenu = ({ menu, inyectable }) => (

    <ul className="mainmenu">


        <li
            className=" with-megame"
        >
            <a legacyBehavior className="small" href="/categoria/INDUSTRIA ALIMENTARIA">
                Alimentos
            </a>
        </li>
        <li
            className=" with-megame"
        >
            <a legacyBehavior href="/categoria/INDUSTRIA CONSTRUCTORA">
                Construcción
            </a>
        </li>
        <li
            className=" with-megame"
        >
            <a legacyBehavior href="/categoria/INDUSTRIA FUNERARIA">
                Funeraria
            </a>
        </li>
        <li
            className=" has-menu-child-item with-megame"
        >
            <a legacyBehavior href="/categoria/INDUSTRIA HOSTELERIA">
                Hostelería
            </a>
        </li>
        <li
            className=" has-menu-child-item with-megame"
        >
            <a legacyBehavior href="/categoria/INDUSTRIA VETERINARIA">
                Veterinaria
            </a>
        </li>


    </ul>
);


export default MainMenu;
