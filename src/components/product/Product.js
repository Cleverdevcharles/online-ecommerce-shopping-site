import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import SingleProduct from "../../components/card/SingleProduct";
import { isAuthenticated } from "../../functions/auth";
import { productStar } from "../../functions/product";
import { listRelated, read } from "../apiCore";
import ProductCard from "../card/ProductCard";
import Header from "../navs/header/Header";
import Footer from "../navs/footer/Footer";
import "../home/Home.css";

const { TabPane } = Tabs;

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);
  const [star, setStar] = useState(0);

  const { user, token } = isAuthenticated();

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user's star
    }
  });

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    console.table(newRating, name);
    productStar(name, newRating, token).then((res) => {
      console.log("rating clicked", res.data);
      loadSingleProduct(); // if you want to show updated rating in real time
    });
  };

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row pt-4">
          <SingleProduct
            product={product}
            onStarClick={onStarClick}
            star={star}
          />
        </div>

        <div className="row">
          <div className="col text-center pt-5 pb-5">
            <hr />
            <h4>Related Products</h4>
            <hr />
          </div>
        </div>

        <div className="row pb-5 slider">
          {relatedProduct.length ? (
            relatedProduct.map((p, i) => (
              <div className="col-md-3 mb-3 slider-img" key={i}>
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div className="text-center col">No Related Products Found</div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Product;
