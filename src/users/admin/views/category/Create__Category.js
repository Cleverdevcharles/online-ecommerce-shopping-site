import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForm from "../../../../components/forms/category/categoryForm";
import { isAuthenticated } from "../../../../functions/auth";
import { createCategory } from "../../../../functions/category";
import SideBar from "../../layouts/SideBar";
import "../dashboard/Dashboard.css";
import "../styles.css";

const Create__Category = ({ history }) => {
  const [name, setName] = useState("");
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState("Save Changes");

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated();

  useEffect(() => {
    const menu = window.localStorage.getItem("Menu");
    setMenu(JSON.parse(menu));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Menu", JSON.stringify(menu));
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Category name is required.");
      }, 1000);
      return;
    }
    if (name.length > 32) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Category name is long, should be between 2 to 32 characters."
        );
      }, 1000);
      return;
    }
    if (name.length <= 2) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Category name is short, should be between 2 to 32 characters."
        );
      }, 1000);
      return;
    }

    // make request to api to create category
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          toast.error(`Category should be unique. ${name} already exist.`);
        }, 1000);
        console.log(data);
      } else {
        setLoading(true);
        setLoading(false);
        toast.success(`Category ${name} created successfully.`);
        setName("");
      }
    });
  };

  const goBack = () => (
    <div className="mt-2">
      <Link to="/admin/categories" className="text-dark">
        <b>Back to Categories</b>
      </Link>
    </div>
  );

  const viewSite = () => {
    history.push("/");
    window.location.reload();
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

          <div className="recent__grid row">
            <div className="orders col">
              <div className="category cards">
                <div className="card__header">
                  <div className="offset-md-4">
                    <h3>Create New Category</h3>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-md-8 offset-md-2">
                    <CategoryForm
                      handleSubmit={handleSubmit}
                      name={name}
                      setName={setName}
                      loading={loading}
                      button={button}
                    />
                    {goBack()}
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

export default Create__Category;
