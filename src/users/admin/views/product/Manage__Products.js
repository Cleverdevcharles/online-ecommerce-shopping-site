import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../../../functions/auth";
import { deleteProduct, getProducts } from "../../../../functions/product";
import SideBar from "../../layouts/SideBar";
import "../dashboard/Dashboard.css";
import "../styles.css";

const Manage__Products = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchform, setSearchForm] = useState("");

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  const toggleSearchForm = () => {
    setSearchForm(searchform ? false : true);
  };

  useEffect(() => {
    const menu = window.localStorage.getItem("Menu");
    const searchform = window.localStorage.getItem("Search From");
    setMenu(JSON.parse(menu));
    setSearchForm(JSON.parse(searchform));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Menu", JSON.stringify(menu));
    window.localStorage.setItem("Search From", JSON.stringify(searchform));
  });

  const { user, token } = isAuthenticated();

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

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        toast.success(`${data.message}`);
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const viewSite = () => {
    history.push("/");
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

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
          <label htmlFor="" onClick={toggleSearchForm}>
            <span className="las la-search"></span>
          </label>
          <div>
            <input
              type="text"
              style={
                searchform ? { width: "100%" } : { width: "0px", opacity: "0" }
              }
              placeholder="Filter category by name...."
              value={keyword}
              onChange={handleSearchChange}
              className="form__filter mt-2"
            />
          </div>
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
        style={menu ? { marginLeft: "0px" } : { marginLeft: "280px" }}
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
            <div className="category card">
              <div className="card__header">
                {loading ? (
                  <div className="offset-md-4">
                    <h3>Loading Products, please wait....</h3>
                  </div>
                ) : (
                  <div className="offset-md-5">
                    {products.length > 1 ? (
                      <h3>Total {products.length} products</h3>
                    ) : (
                      <h3>Total {products.length} product </h3>
                    )}
                  </div>
                )}
              </div>

              <div className="card__height">
                <div className="card__body">
                  <div className="table__responsive">
                    {loading ? (
                      <div class="category__loader"></div>
                    ) : (
                      <>
                        <table style={{ width: "100%" }}>
                          <thead className="table__head">
                            <tr>
                              <td className="list__item__id">
                                <strong>ID</strong>
                              </td>
                              {/* <td className="list__item__id">
                                <strong>IMAGE</strong>
                              </td> */}
                              <td
                                className="list__item__name"
                                style={{ marginLeft: "50px" }}
                              >
                                <strong>NAME</strong>
                              </td>
                              <td className="list__item__edit">
                                <strong>EDIT</strong>
                              </td>
                              <td className="list__item__delete">
                                <strong>DELETE</strong>
                              </td>
                            </tr>
                          </thead>
                          {products.filter(searched(keyword)).map((p, i) => (
                            <tbody key={i}>
                              <tr>
                                <td className="td__list">
                                  <b>{p._id}</b>
                                </td>
                                {/* <td className="td__list">
                                  <ShowImage/>
                                </td> */}
                                <td className="td__list">
                                  <b>{p.name}</b>
                                </td>
                                <td className="td__list">
                                  <b>
                                    <Link
                                      className="action__link"
                                      to={`/admin/product/update/${p._id}`}
                                    >
                                      <span className="las la-edit"></span>
                                    </Link>
                                  </b>
                                </td>
                                <td
                                  className="td__list action__btn-delete mb-3"
                                  onClick={() => destroy(p._id)}
                                >
                                  {loading ? (
                                    <div className="category__loader"></div>
                                  ) : (
                                    <b>
                                      <span className="las la-trash"></span>
                                    </b>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </>
                    )}
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

export default Manage__Products;
