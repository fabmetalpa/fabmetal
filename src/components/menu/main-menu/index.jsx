import SubMenu from "./submenu";
import Link from 'next/link';


const MainMenu = ({ menu, inyectable }) => (
    
<div>
    <ul className="mainmenu">


        <li
            className=" with-megame"
        >
            <Link legacyBehavior href="/">
                Inicio

            </Link>
        </li>

        
        <li
            className=" with-megame"
        >
            <Link legacyBehavior href="/">
                Entornos

            </Link>
        </li>

        <li
            className="has-droupdown has-menu-child-item with-megame"
        >
            <Link legacyBehavior href="/categoria/9">
                Equipamiento 
            </Link>

            <ul className="submenu">
                {inyectable.map((nav) => (
                    <SubMenu key={nav.id} menu={nav.name} />
                ))}
            </ul>
        </li>

        <li
            className=" with-megame"
        >
            <Link legacyBehavior href="/">
                Fabricación 
            </Link>
        </li>


        <li
            className=" with-megame"
        >
            <Link legacyBehavior href="/">
                Proyectos   
            </Link>
        </li>

        <li
            className=" with-megame"
        >
            <Link legacyBehavior href="/">
                Contacto  
            </Link>
        </li>
       
    </ul>
    

                    
    </div>
);


export default MainMenu;