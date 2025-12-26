import PropTypes from "prop-types";
import clsx from "clsx";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "@ui/offcanvas";
import Anchor from "@ui/anchor";
import Logo from "@components/logo";
import { slideToggle, slideUp } from "@utils/methods";
import SubMenu from "./submenu";
import SubMenuMobile from "./submenumobile";
import MegaMenu from "./megamenu";

const MobileMenu = ({ isOpen, onClick, menua, logo }) => {

    console.log("📱 MobileMenu recibió menua:", menua);
    console.log("📱 Tipo de menua:", typeof menua);
    console.log("📱 Es array?:", Array.isArray(menua));
    
    if (Array.isArray(menua)) {
        console.log("📱 Primer elemento:", menua[0]);
        console.log("📱 Campos disponibles:", menua[0] ? Object.keys(menua[0]) : 'vacío');
    }
 
    console.log("asdasdsd ", menua)
    // Función auxiliar para convertir texto a slug (kebab-case)
    function toSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD') // para manejar tildes
        .replace(/[\u0300-\u036f]/g, '') // elimina acentos
        .replace(/[^a-z0-9\s/]/g, '') // solo letras, números y espacios
        .trim()
        .replace(/\s+/g, '-'); // espacios → guiones
    }

    // Extraer solo las subcategorías (excluye la raíz "Equipamiento")
    const equipamientoSubmenu = menua
    .filter(item => {
        // Verifica si existe y tiene nombre
        if (!item || !item.name) return false;
        
        // Busca por parent_id = 9 (hijas de Equipamiento)
        // O por nombre que contenga "Equipamiento" o sea hija de ID 9
        const isChildOfEquipamiento = item.parent_id && item.parent_id[0] === 9;
        const hasEquipamientoInName = item.name.includes('Equipamiento') || 
                                    (item.display_name && item.display_name.includes('Equipamiento'));
        
        return isChildOfEquipamiento || hasEquipamientoInName;
    })
    .map(item => {
        // Extraer el nombre sin "Equipamiento / " si existe
        const fullName = item.display_name || item.name || '';
        const name = fullName.replace('Equipamiento / ', '').replace('Equipamiento-', '').trim();
        
        return {
        id: item.id,
        name: name,
        slug: toSlug(name),
        parent: 9, 
        description: '',
        // Mantén los datos originales por si acaso
        original: item
        };
    });

    const menu = [
    { id: 1, text: 'Inicio', path: '/' },
    { id: 2, text: 'Entornos', path: '/Entornos' },
    {
        id: 3,
        text: 'Equipamiento',
        path: '',
        submenu: equipamientoSubmenu, 
    },
    { id: 4, text: 'Fabricación', path: '/Fabricacion' },
    { id: 5, text: 'Calidad', path: '/Calidad' },
    { id: 6, text: 'Proyectos', path: '/Proyectos' },
    { id: 7, text: 'Contacto', path: '/Contacto' },
    ];
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
                    </ul>
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