/* eslint-disable no-console */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Web3 from "web3";
import Logo from "@components/logo";
import MainMenu from "@components/menu/main-menu";
import MobileMenu from "@components/menu/mobile-menu";
import SearchForm from "@components/search-form/layout-01";
import FlyoutSearchForm from "@components/search-form/layout-02";
import ColorSwitcher from "@components/color-switcher";
import BurgerButton from "@ui/burger-button";
import { useOffcanvas, useSticky, useFlyoutSearch } from "@hooks";
import headerData from "../../../data/general/header-01.json";
import menuData from "../../../data/general/menu-01.json";

import { FaCartArrowDown } from "react-icons/fa";


const Header = ({ className }) => {


    const [allInyectable, setInyectable] = useState([]);
    const [menuMobile, setMenu] = useState(menuData);
    const [isLoad, setIsLoad] = useState(false);


    useEffect(() => {
        obtenerDatos();

    }, []);

    const obtenerDatos = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic Y2tfMjU3YTQ2YjgzY2RlNjc3MGY4MWFkZDRkZmM2MjI0YmExOGMxNWY5Mjpjc18xZjlhZThiZjA5MDNmNTZmNjVjZWVhODVjNGY3MmVhMjExNjlhZTli");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        const data = await fetch("https://puromusculos.com/wordpress/index.php//wp-json/wc/v3/products/categories?per_page=99&parent=20", requestOptions)
        const result = await data.json();
        console.log(result);
        setInyectable(result)
        setIsLoad(true)

        for (let i = 0; i < menuMobile.length; i++) {
            if (
                (menuMobile[i].text === 'Inyectables')
            ) {
                menuMobile[i].submenu = result;
            }
        }

    }

    const sticky = useSticky();
    const { offcanvas, offcanvasHandler } = useOffcanvas();
    const { search, searchHandler } = useFlyoutSearch();

    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            console.log(
                "Non-ethereum browser detected. You should install Metamask"
            );
        }
        return provider;
    };

    const onConnect = async () => {
        try {
            const currentProvider = detectCurrentProvider();
            if (currentProvider) {
                await currentProvider.request({
                    method: "eth_requestAccounts",
                });
                const web3 = new Web3(currentProvider);
                const userAccount = await web3.eth.getAccounts();
                const account = userAccount[0];
                const getEthBalance = await web3.eth.getBalance(account);
                setEthBalance(getEthBalance);
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onDisconnect = () => {
        setIsAuthenticated(false);
    };

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
                menu={menuData}
                logo={headerData.logo}
            />

        </>
    );
};

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;
