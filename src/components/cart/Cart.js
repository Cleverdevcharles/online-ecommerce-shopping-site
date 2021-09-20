import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../card/ProductCard";
import { getCart } from "./cartHelpers";
import Header from "../navs/header/Header";
import Footer from "../navs/footer/Footer";
import Checkout from "../checkout/Checkout";
import "../home/Home.css";
import "../cart/Cart.css";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = (items) => {
    return (
      <div>
        <center>
          <h1>Your cart has {`${items.length}`} item(s)</h1>
        </center>
        
        <div className="slider">
          <ul id="autoWidth" className="cs-hidden">
            {items.map((product, i) => (
              <li key={i} className="item">
                <div className="slider-img">
                  <ProductCard
                    key={i}
                    product={product}
                    showAddToCartButton={false}
                    cartUpdate={true}
                    showRemoveProductButton={true}
                    setRun={setRun}
                    run={run}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const noItemsMessage = () => (
    <h1>
      Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
    </h1>
  );

  return (
    <>
      <Header />
      <div className="jumbotron hero">
        <div className="banner">
          <h1 className="banner-title mt-4">CART</h1>
        </div>
      </div>
      <div className="row container-fluid">
        <div className="col-md-8">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-md-4">
          <center>
            <h1>Your cart summary</h1>
          </center>
          <hr />
          <Checkout products={items} setRun={setRun} run={run} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
