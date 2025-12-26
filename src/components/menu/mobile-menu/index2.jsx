
import PropTypes from "prop-types";
import clsx from "clsx";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "@ui/offcanvas";
import Anchor from "@ui/anchor";
import Logo from "@components/logo";
import { slideToggle, slideUp } from "@utils/methods";
import SubMenu from "./submenu";
import SubMenuMobile from "./submenumobile";
import MegaMenu from "./megamenu";

const MobileMenu = ({ isOpen, onClick, menu, logo }) => {

    console.log(menu);

    const onClickHandler = (e) => {
        e.preventDefault();
        const { target } = e;
        const {
            parentElement: {
                parentElement: { childNodes },
            },
            nextElementSibling,
        } = target;
        slideToggle(nextElementSibling);
        childNodes.forEach((child) => {
            if (child.id === target.parentElement.id) return;
            if (child.classList.contains("has-children")) {
                slideUp(child.lastElementChild);
            }
        });
    };
    return (
        <Offcanvas isOpen={isOpen} onClick={onClick}>
            <OffcanvasHeader onClick={onClick}>
                <Logo logo={logo} />
            </OffcanvasHeader>
            <OffcanvasBody>
                <nav>

                    <ul className="mainmenu">
                        <li id={1} key={1}>
                            <a className="nav-link its_new" href={ "/categoria/" +  22}>
                                Inicio
                            </a> 
                        </li>
                        <li id={1} key={1}>
                            <a className="nav-link its_new" href={ "/categoria/" +  22}>
                                Entornos
                            </a> 
                        </li>

                        <li
                            className={clsx(
                                "has-droupdown",
                                "with-megamenu",
                                "has-children"
                            )}
                            id={5}
                            key={4}
                        >
                            
                            <a
                                className="nav-link its_new"
                                href={"/categoria/" +  2}
                                
                            >
                                {"Equipamiento"}
                            </a>
                            
                        </li>

                        {menu?.map((nav) => {
                            const hasChildren = !!nav.submenu || !!nav.megamenu;
                            return (
                                <li
                                    className={clsx(
                                        !!nav.submenu && "has-droupdown",
                                        !!nav.megamenu && "with-megamenu",
                                        hasChildren && "has-children"
                                    )}
                                    id={nav.id}
                                    key={nav.id}
                                >
                                    <Anchor
                                        className="nav-link its_new"
                                        path={hasChildren ? "#!" : nav.path}
                                        onClick={
                                            hasChildren
                                                ? onClickHandler
                                                : (e) => e
                                        }
                                    >
                                        {nav.text}
                                    </Anchor>
                                    {nav?.submenu && (
                                        <SubMenuMobile menu={nav.submenu} />
                                    )}
                                    {nav?.megamenu && (
                                        <MegaMenu menu={nav.megamenu} />
                                    )}
                                </li>
                            );
                        })}

                        <li id={1} key={1}>
                            <a className="nav-link its_new" href={ "/categoria/" +  22}>
                                Fabricación
                            </a> 
                        </li>
                        <li id={1} key={1}>
                            <a className="nav-link its_new" href={ "/categoria/" +  22}>
                                Calidad
                            </a> 
                        </li>
                        <li id={1} key={1}>
                            <a className="nav-link its_new" href={ "/categoria/" +  22}>
                                Proyectos
                            </a> 
                        </li>
                        <li id={1} key={1}>
                            <a className="nav-link its_new" href={ "/categoria/" +  22}>
                                Contacto
                            </a> 
                        </li>
                    </ul>
                    {/*
                    <ul className="mainmenu">

                        {menu?.map((nav) => {
                            const hasChildren = !!nav.submenu || !!nav.megamenu;
                            return (
                                <li
                                    className={clsx(
                                        !!nav.submenu && "has-droupdown",
                                        !!nav.megamenu && "with-megamenu",
                                        hasChildren && "has-children"
                                    )}
                                    id={nav.id}
                                    key={nav.id}
                                >
                                    
                                    <a
                                        className="nav-link its_new"
                                        href={hasChildren ? "#!" : "/categoria/" +  nav.id}
                                        onClick={
                                            hasChildren
                                                ? onClickHandler
                                                : (e) => e
                                        }
                                    >
                                        {nav.name}
                                    </a>
                                    {nav?.submenu && (
                                        <SubMenuMobile menu={nav.submenu} />
                                    )}
                                    {nav?.megamenu && (
                                        <MegaMenu menu={nav.megamenu} />
                                    )}
                                </li>
                            );
                        })}
                    </ul>*/}
                </nav>
            </OffcanvasBody>
        </Offcanvas>
    );
};

MobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    menu: PropTypes.arrayOf(PropTypes.shape({})),
    logo: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            alt: PropTypes.string,
        })
    ),
};

export default MobileMenu;
