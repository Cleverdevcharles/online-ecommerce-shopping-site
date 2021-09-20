import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import userProfile from "../../../../components/images/user.png";
import { isAuthenticated } from "../../../../functions/auth";
import { getPurchaseHistory } from "../../../../functions/user";
import SideBar from "../../layouts/SideBar";
import "../styles.css";
import "../dashboard/Dashboard.css";

const History = () => {
  const [menu, setMenu] = useState(false);
  const [history, setHistory] = useState([]);

  const currentHistory = useHistory();

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

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();
  const token = isAuthenticated().token;

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setHistory(data);
      }
    });
  };

  useEffect(() => {
    init(_id, token);
  }, []);

  const viewSite = () => {
    currentHistory.push("/");
    window.location.reload();
    };


    
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


  const purchaseHistory = (history) => {
    return (
      <div className="card__height">
        <div className="card__body">
          <div
            className="table__responsive"
            style={{ height: "200px", overflow: "auto" }}
          >
            <table width="100" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <td>Product ID</td>
                  <td>Name</td>
                  <td>Amount</td>
                  <td>Purchased Date</td>
                  <td>Shipping Date</td>{" "}
                </tr>
              </thead>
              {history.map((h, i) => {
                return (
                  <tbody>
                    {h.products.map((p, i) => {
                      return (
                        <tr key={i}>
                          <td>{p._id}</td>
                          <td>{p.name}</td>
                          <td>${p.price}</td>
                          <td>{getPurchasedDate()}</td>{" "}
                          <td>{getShippingDate()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    );
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
                <small style={{ fontSize: "10px" }}>
                  Continue&nbsp;Shopping
                </small>
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
              {email}
            </small>
            <span>
              <img
                src={userProfile}
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
        style={menu ? { marginLeft: "0px" } : { marginLeft: "280px" }}
      >
        <main>
          <div className="page__header ">
            <div>
              <h1> My Dashboard</h1>
              <small>Monitor your dashboard...</small>
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
          <div className="cards row">
            <div className="card__single col sales">
              <div className="card__flex">
                <div className="card__info">
                  <h3 className="card__number">{name}</h3>
                  <div className="card__head">
                    <h3>Name</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="card__single col">
              <div className="card__flex">
                <div className="card__info">
                  <h3 className="card__number">{email}</h3>
                  <div className="card__head">
                    <h3>Email</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recent__grid row">
            <div className="orders col">
              <div className="card">
                <div className="card__header">
                  <h3>Purchase History</h3>
                </div>

                {purchaseHistory(history)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default History;
