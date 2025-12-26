/* eslint-disable no-console */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Logo from "@components/logo";
import MobileMenu from "@components/menu/mobile-menu";
import SearchForm from "@components/search-form/layout-01";
import FlyoutSearchForm from "@components/search-form/layout-02";
import ColorSwitcher from "@components/color-switcher";
import BurgerButton from "@ui/burger-button";
import { useOffcanvas, useSticky, useFlyoutSearch } from "@hooks";
import headerData from "../../../data/general/header-01.json";
import { FaCartArrowDown } from "react-icons/fa";

import MainMenu from "@components/menu/main-menu";
import menuData from "../../../data/general/menu-01.json";

const Header = ({ className }) => {
    const [odooCategories, setOdooCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const sticky = useSticky();
    const { offcanvas, offcanvasHandler } = useOffcanvas();
    const { search, searchHandler } = useFlyoutSearch();

    // FUNCIÓN PARA OBTENER CATEGORÍAS DESDE ODOO
    const fetchCategoriesFromOdoo = async () => {
        try {
            console.log("🔍 Obteniendo categorías desde Odoo...");
            
            // Usar el proxy que ya tienes (o directo si no hay CORS)
            const response = await fetch('/api/cotizacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'common',
                        method: 'authenticate',
                        args: ['fabmetal', "admin@fabmetal.com.pa", "#Fabmetal1*/", {}]
                    },
                    id: 1
                })
            });
            
            const authData = await response.json();
            const uid = authData.result;
            
            if (!uid) {
                console.error("❌ Error de autenticación");
                return [];
            }
            
            // Obtener categorías
            const catResponse = await fetch('/api/cotizacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            'fabmetal',
                            uid,
                            "#Fabmetal1*/",
                            'product.public.category',
                            'search_read',
                            [
                                [['parent_id', '=', false]]
                            ],
                            { 
                                fields: ['id', 'name', 'cover_image'],
                                limit: 20
                            }
                        ]
                    },
                    id: 2
                })
            });
            
            const catData = await catResponse.json();
            return catData.result || [];
            
        } catch (error) {
            console.error("❌ Error al obtener categorías:", error);
            return [];
        }
    };

    // CARGAR CATEGORÍAS AL MONTAR EL HEADER
    // Solo el useEffect del Header (reemplázalo)
        useEffect(() => {
            const loadCategories = async () => {
                setLoading(true);
                
                // 1. CACHE: Primero intentar localStorage (INSTANTÁNEO)
                const stored = localStorage.getItem('odooCategories');
                if (stored) {
                    try {
                        const cachedCategories = JSON.parse(stored);
                        setOdooCategories(cachedCategories);
                        console.log("✅ Categorías desde cache:", cachedCategories.length);
                    } catch (e) {
                        console.error("Error parsing cache:", e);
                    }
                }
                
                // 2. FRESH: Luego obtener frescas del API (EN SEGUNDO PLANO)
                try {
                    console.log("🔄 Obteniendo categorías frescas...");
                    
                    // Usar el NUEVO endpoint
                    const response = await fetch('/api/categorias');
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data.success && data.categories.length > 0) {
                        setOdooCategories(data.categories);
                        localStorage.setItem('odooCategories', JSON.stringify(data.categories));
                        console.log("✅ Categorías actualizadas desde API:", data.categories.length);
                    } else {
                        console.log("⚠️ API devolvió 0 categorías");
                    }
                } catch (error) {
                    console.log("⚠️ Error al cargar categorías, usando cache:", error.message);
                    
                    // Si no hay cache y falla la API, mostrar placeholder
                    if (!stored) {
                        setOdooCategories([
                            { id: 1, name: 'Mobiliario' },
                            { id: 2, name: 'Clínico Móvil' },
                            { id: 3, name: 'Alimentaria' },
                            { id: 4, name: 'Constructora' }
                        ]);
                    }
                } finally {
                    setLoading(false);
                }
            };
            
            loadCategories();
            
            // Opcional: Refrescar cada hora
            const refreshInterval = setInterval(() => {
                console.log("🔄 Refrescando categorías automáticamente...");
                loadCategories();
            }, 60 * 60 * 1000); // 1 hora
            
            return () => clearInterval(refreshInterval);
        }, []);

    // Filtrar categorías (si necesitas excluir alguna)
    const allInyectable = odooCategories.filter(category => category.id !== 9);
    
    console.log("📊 Categorías disponibles:", odooCategories.length);

    console.log("📊 Estado actual del Header:");
    console.log("- Loading:", loading);
    console.log("- Categorías:", odooCategories.length);
    console.log("- Primeras categorías:", odooCategories.slice(0, 3));

    return (
        <>
            <header
                className={clsx(
                    "rn-header haeder-default black-logo-version header--fixed header--sticky",
                    sticky && "sticky",
                    className
                )}
            >
                <div className="container">
                    <div className="header-inner ">
                        <div className="header-left">
                            <Logo logo={headerData.logo} />
                            <div className="mainmenu-wrapper">
                                <nav
                                    id="sideNav"
                                    className="mainmenu-nav d-none d-xl-block"
                                >
                                    {loading ? (
                                        <div className="loading-categories">
                                            <span>Cargando categorías...</span>
                                        </div>
                                    ) : (
                                        <MainMenu menu={menuData} inyectable={allInyectable} />
                                    )}
                                </nav>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="setting-option d-none d-lg-block">
                                <SearchForm />
                            </div>
                            <div className="setting-option rn-icon-list d-block d-lg-none">
                                <div className="icon-box search-mobile-icon">
                                    <button
                                        type="button"
                                        aria-label="Click aqui para abrir el formulario"
                                        onClick={searchHandler}
                                    >
                                        <i className="feather-search" />
                                    </button>
                                </div>
                                <FlyoutSearchForm isOpen={search} />
                            </div>

                            <div className="setting-option rn-icon-list notification-badge">
                                <div className="icon-box">
                                    <a href="/carrito">
                                        <FaCartArrowDown />
                                    </a>
                                </div>
                            </div>
                            <div className="setting-option mobile-menu-bar d-block d-xl-none">
                                <div className="hamberger">
                                    <BurgerButton onClick={offcanvasHandler} />
                                </div>
                            </div>
                            <div
                                id="my_switcher"
                                className="setting-option my_switcher"
                            >
                                <ColorSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu
                isOpen={offcanvas}
                onClick={offcanvasHandler}
                 menua={odooCategories.map(cat => ({
                    ...cat,
                    display_name: cat.name, // ← AÑADE ESTE CAMPO
                    name: cat.name
                }))}
                logo={headerData.logo}
            />
        </>
    );
};

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;