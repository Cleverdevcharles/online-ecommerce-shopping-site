import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../components/home/Home.css";
import { isAuthenticated } from "../../../../functions/auth";
import {
  getStatusValues,
  listOrders,
  updateOrderStatus,
} from "../../../../functions/order";
import SideBar from "../../layouts/SideBar";
import "../dashboard/Dashboard.css";
import "../styles.css";

const Orders = ({ history }) => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  useEffect(() => {
    const menu = window.localStorage.getItem("Menu");
    setMenu(JSON.parse(menu));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Menu", JSON.stringify(menu));
  });

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    setLoading(true);
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        setOrders(data);
        setLoading(false);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const goBack = () => (
    <div className="mt-2 pb-5">
      <Link to="/admin/dashboard" className="text-dark">
        <b>Back to dashboard</b>
      </Link>
    </div>
  );

  const viewSite = () => {
    history.push("/");
    window.location.reload();
  };

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <center>
          <h4 className="text-success display-2">
            Total Orders: {orders.length}
          </h4>
        </center>
      );
    } else {
      return (
        <center>
          <h4 className="text-danger display-2">No orders</h4>
        </center>
      );
    }
  };

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {o.status}</h3>
      <select
        className="form-control"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Update Status</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

const getShippingDate = (dateIn) => {
  var today = new Date();
  var business_days = 14;

  var deliveryDate = today;
  var total_days = business_days;
  for (var days = 1; days <= total_days; days++) {
    deliveryDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    if (deliveryDate.getDay() == 0 || deliveryDate.getDay() == 6) {
      //it's a weekend day so we increase the total_days of 1
      total_days++;
    }
  }
  console.log(today);
  console.log(deliveryDate);

  return deliveryDate.toLocaleString();
};

const getPurchasedDate = (dateIn) => {
  var today = new Date();
  var business_days = 14;

  var deliveryDate = today;
  var total_days = business_days;
  for (var days = 1; days <= total_days; days++) {
    deliveryDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    if (deliveryDate.getDay() == 0 || deliveryDate.getDay() == 6) {
      //it's a weekend day so we increase the total_days of 1
      total_days++;
    }
  }
  console.log(today);
  console.log(deliveryDate);

  return today.toLocaleString();
};

  return (
    <>
      <div className="sidebar" style={menu ? { marginLeft: "-280px" } : null}>
        <SideBar />
      </div>
      <header style={menu ? { marginLeft: "0px" } : { marginLeft: "280px" }}>
        <div className="menu__toggle header__icons">
          <label htmlFor="nav__toggle" onClick={toggleMenu}>
            <span
              className={menu ? "las la-bars" : "fas fa-times-circle"}
            ></span>
          </label>
          <label htmlFor="">
            <span className="las la-search"></span>
          </label>
          <Link to="/" className="header__link" onClick={viewSite}>
            <label htmlFor="" className="view__site">
              <span className="las la-store-alt">
                <small style={{ fontSize: "10px" }}>View&nbsp;Site</small>
              </span>
            </label>
          </Link>
        </div>
        <div
          className="admin__info"
          style={menu ? { display: "block" } : { display: "none" }}
        >
          <label htmlFor="">
            <small style={{ color: "gray", marginRight: "10px" }}>
              {user.email}
            </small>
            <span>
              <img
                src="https://res.cloudinary.com/dt1q2a20t/image/upload/v1620401647/fkriioooip6rqj59qjvn.jpg"
                width="40px"
                height="40px"
                alt="admin__image"
              />
            </span>
          </label>
        </div>
      </header>
      <div
        className="main__content"
        style={
          menu
            ? { marginLeft: "0px", backgroundColor: "#fff" }
            : { marginLeft: "280px", backgroundColor: "#fff" }
        }
      >
        <main>
          <div className="page__header ">
            <div>
              <h1>Analytics Dashboard</h1>
              <small>
                Monitor your dashboard, processing customer orders and many
                more...
              </small>
            </div>

            <div
              className="header__actions"
              style={
                menu
                  ? null
                  : { display: "none", transition: "all 0.5s ease-in-out" }
              }
            >
              <button>
                <span className="las la-tools">Settings</span>
              </button>
            </div>
          </div>

          <div className="recent__grid">
            <div className="orders">
              <div className="category">
                <div className="card__header">
                  <div className="offset-md-4">
                    <h3>MANAGE ALL ORDERS</h3>
                  </div>
                </div>

                {loading ? (
                  <div className="slider">
                    <center>
                      <h2 className="mt-4">Loading...</h2>
                    </center>
                  </div>
                ) : (
                  <div className="slider">
                    <center>
                      <h2 className="mt-4">{showOrdersLength()}</h2>
                    </center>
                    <ul id="autoWidth" className="cs-hidden">
                      {orders.map((o, oIndex) => {
                        return (
                          <li className="item">
                            <div className="slider-img">
                              <div
                                className="mt-5"
                                key={oIndex}
                                style={{
                                  borderBottom: "5px solid indigo",
                                  border: "2px solid #f09d51",
                                  padding: "20px",
                                }}
                              >
                                <center>
                                  <h4 className="mb-5">
                                    <span>Order ID: {o._id}</span>
                                  </h4>
                                </center>

                                <ul className="list-group mb-2">
                                  <li className="list-group-item">
                                    {showStatus(o)}
                                  </li>
                                  <li className="list-group-item">
                                    Transaction ID: {o.transaction_id}
                                  </li>
                                  <li className="list-group-item">
                                    Amount: ${o.amount}
                                  </li>
                                  <li className="list-group-item">
                                    Ordered by: {o.user.name}
                                  </li>
                                  <li className="list-group-item">
                                    Ordered on: {getPurchasedDate()}
                                  </li>
                                  <li className="list-group-item">
                                    Delivery date: {getShippingDate()}
                                  </li>
                                  <li className="list-group-item">
                                    Delivery address: {o.address}
                                  </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                  Total products in the order:{" "}
                                  {o.products.length}
                                </h3>

                                {o.products.map((p, pIndex) => (
                                  <div
                                    className="mb-4"
                                    key={pIndex}
                                    style={{
                                      padding: "20px",
                                      border: "1px solid indigo",
                                    }}
                                  >
                                    {showInput("Product name", p.name)}
                                    {showInput("Product price", p.price)}
                                    {showInput("Product total", p.count)}
                                    {showInput("Product Id", p._id)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      {goBack()}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Orders;
