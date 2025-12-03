import PropTypes from "prop-types";
import clsx from "clsx";
import { useState } from "react";

const SearchForm = ({ isOpen }) => {

    const [inputValue, setInputValue] = useState("");

    const onChangeHandler = event => {
        setInputValue(event.target.value);
    };

    function handleMint() {
        console.log("233")
        window.location.href = '/busqueda/' + inputValue;
    }


    return (

        <form
            id="header-search-1"
            className={clsx("large-mobile-blog-search", isOpen && "active")}
            action={"/busqueda/" + inputValue}
        >
            <div className="rn-search-mobile form-group">



                <button type="button" className="search-button">
                    <a className="search-button text-dark mb--10" href={"/busqueda/" + inputValue}>
                        <i className="feather-search text-dark text-primary" />
                    </a>
                </button>
                <input type="text" onChange={onChangeHandler} value={inputValue} placeholder="Buscar Productos..." />


            </div>
        </form>



    )
}

SearchForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default SearchForm;

/*
<form
        id="header-search-1"
        action="#"
        method="GET"
        className={clsx("large-mobile-blog-search", isOpen && "active")}
    >
        <div className="rn-search-mobile form-group">
            <button type="submit" className="search-button">
                <i className="feather-search" />
            </button>
            <input type="text" placeholder="Buscar Productos..." />
        </div>
    </form>
    */