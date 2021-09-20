import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { getCategories, getSites } from "../../components/apiCore";
import ProductCard from "./ProductCard";
import "../home/Home.css";

const { TabPane } = Tabs;

// this is childrend component of Product page
const SingleProduct = ({ product }) => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });
  const [sitesByArrival, setSitesByArrival] = useState([]);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { name, description, _id } = product;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  const loadSitesByArrival = () => {
    getSites("createdAt").then((data) => {
      console.log(data);
      if (data.error) {
        setError(data.error);
      } else {
        setSitesByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadCategories();
    loadSitesByArrival();
  }, []);

  const loadSites = () => {
    getSites().then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setSites(data);
      }
    });
  };

  useEffect(() => {
    loadSites();
  }, []);

  return (
    <>
      <div className="row slider">
        <div className="col-md-6 mt-4">
          {product && product.description && (
            <ProductCard product={product} showViewProductButton={false} />
          )}
        </div>
        <div className="col-md-6 mt-4">
          <h1 className="bg-info p-3">{name}</h1>
          <>
            <div className="mt5">
              <hr />
              <center>
                <h1>Description</h1>
              </center>
              <hr />
            </div>
            <center>
              {sites.map((s, i) => (
                <div className="col">
                  <Tabs type="card">
                    <TabPane key="1">{description && description}</TabPane>
                  </Tabs>
                  <Tabs type="card" className="mt-3">
                    <TabPane key="1"></TabPane>
                    <TabPane tab="More" key="2">
                      Call use on {s.phone} to learn more about this product.
                    </TabPane>
                  </Tabs>
                </div>
              ))}
            </center>
          </>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
