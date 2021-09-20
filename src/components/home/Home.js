import React, { useEffect, useState } from "react";
import { getProducts } from "../apiCore";
import ProductCard from "../card/ProductCard";
import Footer from "../navs/footer/Footer";
import Header from "../navs/header/Header";
import Hero from "../navs/hero/Hero";
import "./Home.css";

function Home() {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);

  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      console.log(data);
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);
  return (
    <div>
      <Header />

      <Hero />

      <div className="slider">
        <center>
          <h2 className="mt-4">New Arrivals</h2>
        </center>
        <ul id="autoWidth" className="cs-hidden">
          {productsByArrival.map((product, i) => (
            <li key={i} className="item">
              <div className="slider-img">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="slider">
        <center>
          <h2 className="mt-4">Best Sellers</h2>
        </center>
        <ul id="autoWidth" className="cs-hidden">
          {productsBySell.map((product, i) => (
            <li key={i} className="item">
              <div className="slider-img">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
