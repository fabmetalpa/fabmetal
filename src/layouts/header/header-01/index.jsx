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

const Header = ({ className, odooCategories = []  }) => {

    console.log(odooCategories)

    const [allInyectable, setInyectable] = useState(odooCategories.filter(category => category.id !== 9));


    const sticky = useSticky();
    const { offcanvas, offcanvasHandler } = useOffcanvas();
    const { search, searchHandler } = useFlyoutSearch();

    
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
                                    
                                    <MainMenu menu={menuData} inyectable={allInyectable} />
                                    
                                    {/*
                                    <ul className="mainmenu">
                  
                                        
                                        {odooCategories.map(cat => (
                                            <li key={cat.id}>
                                            <a href={`/categoria/${cat.id}`}>{cat.name}</a>
                                            </li>
                                        ))}
                                        </ul>
                                    */}

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
                                        {/*      <span className="badge">5</span>   */}
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
                menua={odooCategories}
                logo={headerData.logo}
            />

        </>
    );
};

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;
