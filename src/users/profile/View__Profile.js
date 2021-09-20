import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../components/forms/category/categoryForm.css";
import { isAuthenticated } from "../../functions/auth";
import { read } from "../../functions/user";
import SideBar from "../../users/admin/layouts/SideBar";
import "../../users/admin/views/dashboard/Dashboard.css";
import "../../users/admin/views/styles.css";

const View__Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    password: "",
    error: false,
  });
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState("Click to update profile");

  const history = useHistory();

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  const { user, token } = isAuthenticated();
  const { name, email, password, error, phone, address, state, country } =
    values;

  const init = () => {
    const userId = user._id;
    console.log(userId);
    read(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error, data);
        console.log("User Id =>", user._id);
        setValues({ ...values, error: true });
      } else {
        console.log(data);
        console.log(userId);
        setValues({
          ...values,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          state: data.state,
          country: data.country,
          password: data,
        });
      }
    });
  };

  useEffect(() => {
    const userId = match.params.userId;
    init(userId);
  }, []);

  const updateProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setInterval(() => {
      setLoading(false);
      history.push("/update/profile");
    }, 500);
  };

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

  const viewProfile = (
    name,
    email,
    password,
    phone,
    address,
    state,
    country
  ) => (
    <form>
      <div className="form-group row">
        <div className="col">
          <label className="text-muted">Name</label>
          <input type="text" disabled className="form-control" value={name} />
        </div>
        <div className="col">
          <label className="text-muted">Email</label>
          <input type="email" disabled className="form-control" value={email} />
        </div>
      </div>
      <div className="form-group row">
        <div className="col">
          <label className="text-muted">Country</label>
          <input
            type="text"
            className="form-control"
            disabled
            style={{ marginTop: "-1px" }}
            value={country}
          />
        </div>
        <div className="col">
          <label className="text-muted">State</label>
          <input
            type="text"
            className="form-control"
            disabled
            style={{ marginTop: "-1px" }}
            value={state}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col">
          <label className="text-muted">Street Address</label>
          <input
            type="text"
            className="form-control"
            disabled
            style={{ marginTop: "-1px" }}
            value={address}
          />
        </div>
        <div className="col">
          <label className="text-muted">Phone Number</label>
          <input
            type="text"
            className="form-control"
            disabled
            style={{ marginTop: "-1px" }}
            value={phone}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          disabled
          className="form-control"
          value={password}
        />
      </div>
      <br />

      {loading ? (
        <button className="btn__category">
          <div class="loader"></div>
        </button>
      ) : (
        <button className="btn__category" onClick={updateProfile}>
          {button}
        </button>
      )}
    </form>
  );

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
                {user.role === "admin" ? (
                  <small style={{ fontSize: "10px" }}>View&nbsp;Site</small>
                ) : (
                  <small style={{ fontSize: "10px" }}>
                    Continue&nbsp;Shopping
                  </small>
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
            ? { marginLeft: "0px", backgroundColor: "white" }
            : { marginLeft: "280px", backgroundColor: "white" }
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

          <div className="recent__grid row">
            <div className="orders col">
              <div className="category cards pb-5">
                <div className="card__header">
                  <div className="offset-md-5">
                    <h3>Profile</h3>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-8 offset-md-2">
                    {viewProfile(
                      name,
                      email,
                      password,
                      phone,
                      address,
                      state,
                      country
                    )}
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

export default View__Profile;
