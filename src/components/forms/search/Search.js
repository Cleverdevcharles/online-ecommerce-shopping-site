import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCategories, list } from "../../apiCore";
import ProductCard from "../../card/ProductCard";
import "../../navs/header/Header.css";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const history = useHistory();

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);


  const searchData = () => {
    // console.log(search, category);
    if (search) {
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            history.push(`?${search}`);
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `No products found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>

        <div className="row">
          {results.map((product, i) => (
            <div className="col-4 mb-3">
              <ProductCard key={i} product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit} className="header__search">
      <span className="header__search">
        <div>
          <select className="btn" onChange={handleChange("category")}>
            <option value="All">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </span>
      <input
        className="header__searchInput"
        onChange={handleChange("search")}
        type="search"
      />
      <button style={{ border: "none", backgroundColor: "transparent" }}>
        <SearchIcon
          className="header__searchIcon"
          style={{ marginLeft: "-20px" }}
        />
      </button>
    </form>
  );

  return (
    <>
      <div className="header__search">{searchForm()}</div>
      <div  style={{ marginTop: "100px", display: "fixed" }}>
        {searchedProducts(results)}
      </div>
    </>
  );
};

export default Search;