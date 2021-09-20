import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userProfile from "../../../../components/images/user.png";
import { isAuthenticated } from "../../../../functions/auth";
import {
  getStatusValues,
  listOrders,
  updateOrderStatus,
} from "../../../../functions/order";
import { getProducts } from "../../../../functions/product";
import { getUsers } from "../../../../functions/user";
import SideBar from "../../layouts/SideBar";
import "../styles.css";
import "./Dashboard.css";

const Dashboard = ({ history }) => {
  const [menu, setMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
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

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  const loadUsers = () => {
    getUsers().then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setUsers(data);
      }
    });
  };
  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    loadUsers();
    loadProducts();
  }, []);

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

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className="text-danger">No orders</h1>;
    }
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

  const viewSite = () => {
    history.push("/");
    window.location.reload();
  };

  const sales = () => {
    let total = 0;
    products.map((p, i) => {
      total += p.sold;
    });

    return total;
  };

  const totalIncome = () => {
    let total = 0;
    orders.map((o, i) => {
      total += o.amount;
    });

    return total;
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
                {role === "admin" ? (
                  <small style={{ fontSize: "10px" }}>View&nbsp;Site</small>
                ) : (
                  <small style={{ fontSize: "10px" }}>Continue&nbsp;Shopping</small>
                )}
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
              <h1> Analytics Dashboard</h1>
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
          <div className="cards row">
            <div className="card__single col sales">
              <div className="card__flex">
                <div className="card__info">
                  <h3 className="card__number">{sales()}</h3>

                  <div className="card__head">
                    <h3>Sales</h3>
                  </div>
                </div>
                <div className="card__chart danger">
                  <span className="las la-shopping-cart"></span>
                </div>
              </div>
            </div>

            <div className="card__single col">
              <div className="card__flex">
                <div className="card__info">
                  <h3 className="card__number">{users.length}</h3>
                  <div className="card__head">
                    <h3>Customers</h3>
                  </div>
                </div>
                <div className="card__chart success">
                  <span className="fas fa-users"></span>
                </div>
              </div>
            </div>

            <div className="card__single col">
              <div className="card__flex">
                <div className="card__info">
                  <h3 className="card__number">{products.length}</h3>
                  <div className="card__head">
                    <h3>Products</h3>
                  </div>
                </div>
                <div className="card__chart success">
                  <span className="fab fa-product-hunt"></span>
                </div>
              </div>
            </div>

            <div className="card__single col">
              <div className="card__flex">
                <div className="card__info">
                  <h3 className="card__number">{totalIncome()}</h3>
                  <div className="card__head">
                    <h3>Income</h3>
                  </div>
                </div>
                <div className="card__chart warning">
                  <span className="las la-dollar-sign"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent__grid row">
            <div className="orders col">
              <div className="card">
                <div className="card__header">
                  <h3>Recent Orders</h3>
                  <Link to="/admin/orders">
                    <button>
                      Manage Orders <span className="las la-arrow-right"></span>
                    </button>
                  </Link>
                </div>

                <div className="card__height">
                  <div className="card__body">
                    <div
                      className="table__responsive"
                      style={{ height: "200px", overflow: "auto" }}
                    >
                      <table width="100" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <td>Customer</td>
                            <td>Name</td>
                            <td>Date</td>
                            <td>Amount</td>
                            <td>Payment</td>
                            <td>Status</td>
                          </tr>
                        </thead>
                        {orders.map((o, oIndex) => {
                          return (
                            <tbody>
                              <tr>
                                <td>
                                  <img
                                    src={userProfile}
                                    width="40px"
                                    height="40px"
                                    alt="customer__image"
                                  />
                                </td>
                                <td>{o.user.name}</td>
                                <td>{moment(o.createdAt).fromNow()}</td>
                                <td>${o.amount}</td>
                                <td>Successful</td>
                                <td>
                                  <span className="status completed"></span>
                                  {o.status}
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="customers col">
              <div className="card">
                <div className="card__header">
                  <h3>New Customers</h3>
                </div>
                <div
                  className="card__height"
                  style={{ height: "200px", overflow: "auto" }}
                >
                  <div className="card__body">
                    {users.map((u, i) => (
                      <div className="customer">
                        <div className="info">
                          <img
                            src={userProfile}
                            width="40px"
                            height="40px"
                            alt="customer__image"
                          />
                          <div>
                            <h4>
                              {u.name}{" "}
                              <small>
                                {u.role === "admin" ? (
                                  <span>({u.role})</span>
                                ) : null}
                              </small>
                            </h4>
                            <small>{u.email}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
