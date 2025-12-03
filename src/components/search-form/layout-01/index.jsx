import { useState } from "react";

const SearchForm = () => {

    const [inputValue, setInputValue] = useState("");

    const onChangeHandler = event => {
        setInputValue(event.target.value);
    };

    function handleMint() {
        console.log("233")
        window.location.href = '/busqueda/' + inputValue;
    }

    return (
        <form className="search-form-wrapper" action={"/busqueda/" + inputValue}>
            <input type="search" placeholder="Buscar Productos..." aria-label="Search" onChange={onChangeHandler}
                value={inputValue} />
            <div className="search-icon">
                <button type="button" className="search-button">
                    <a className="search-button text-dark mb--10" href={"/busqueda/" + inputValue}>
                        <i className="feather-search text-dark" />
                    </a>
                </button>


            </div>
        </form>
    )
};



export default SearchForm;
