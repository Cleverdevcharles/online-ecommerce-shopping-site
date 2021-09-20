import moment from "moment";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { addItem, removeItem, updateItem } from "../cart/cartHelpers";
import ShowImage from "../show_image/ShowImage";
import "./ProductCard.css";
const ProductCard = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f,
  run = undefined,
  // changeCartSize
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  const history = useHistory();

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="bag-btn view_prtd" data-id="1">
            <i className="fas fa-eye">View Product</i>
          </button>
        </Link>
      )
    );
  };
  const addToCart = () => {
    // console.log('added');
    addItem(product, setRedirect(true));
    toast.success("Item added ");
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return null;
    }
  };

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <button className="bag-btn" data-id="1" onClick={addToCart}>
          <i className="fas fa-shopping-cart">Add to card</i>
        </button>
      )
    );
  };
  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill stock-btn">
        In Stock{" "}
      </span>
    ) : (
      <span className="badge badge-danger badge-pill stock-btn">
        Out of Stock{" "}
      </span>
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group ml-2 mb-3">
            <div
              className="input-group-prepend"
              style={{
                border: "2px solid #f09d51",
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
              }}
            >
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              value={count}
              className="adjust_btn p-2 pl-3"
              style={{
                border: "2px solid #f09d51",
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
              }}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <div className="container">
          <button
            onClick={() => {
              removeItem(product._id);
              setRun(!run); // run useEffect in parent Cart
            }}
            className="btn container btn-outline-danger mt-2 mb-2"
            style={{
              backgroundColor: "red",
              borderRadius: "6px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Remove Product
          </button>
        </div>
      )
    );
  };
  return (
    <div className="box">
      {shouldRedirect(redirect)}
      <article className="product">
        <div className="img-container">
          <Link to={`product/${product._id}`}>
            <ShowImage item={product} url="product" />
          </Link>
          {showStock(product.quantity)}
          {showViewButton(showViewProductButton)}
          {showAddToCartBtn(showAddToCartButton)}
        </div>

        <div className="product__info">
          <div className="title-price">
            <h3>{product.name}</h3>
            <h4>${product.price}</h4>
          </div>
          <div className="description-oldprice">
            <p style={{ width: "85%" }}>
              {product.description.substring(0, 25)}....
            </p>
            <del className="text-danger">
              <h6>${product.oldprice}</h6>
            </del>
          </div>
          <div className="description-oldprice">
            <p className="black-8">{moment(product.createdAt).fromNow()}</p>
          </div>
        </div>
        {showCartUpdateOptions(cartUpdate)}
        {showRemoveButton(showRemoveProductButton)}
      </article>
      <br />
    </div>
  );
};

export default ProductCard;
