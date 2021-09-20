import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { getCategories, getFilteredProducts } from "../apiCore";
import ProductCard from "../card/ProductCard";
import Checkbox from "../checkbox/Checkbox";
import { prices } from "../fix_prices/fixedPrices";
import Footer from "../navs/footer/Footer";
import Header from "../navs/header/Header";
import RadioBox from "../radio_box/RadioBox";
import "./Shop.css";
import "../home/Home.css";
const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });
  const [star, setStar] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const handleStarClick = (num) => {
    // console.log(num);
    setStar(num);
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <>
      <Header />
      <div className="jumbotron hero">
        <div className="banner">
          <h1 className="banner-title mt-4">SHOP</h1>
        </div>
      </div>
      <div className="row" style={{ marginTop: "-33px" }}>
        <div
          className="col-md-3  pl-5 pt-3 menu"
        >
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4>Filter by price range</h4>
          <div>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>

        <div className="col-md-9 pr-4">
          <div>
            <hr />
            <center>
              <h2 className="mb-4">Products</h2>
            </center>
            <hr />
          </div>
          <div className="row slider">
            {filteredResults.map((product, i) => (
              <div key={i} className="col-md-4 mb-3 slider-img">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
