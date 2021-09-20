import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../../components/forms/category/categoryForm.css";
import { isAuthenticated } from "../../../../functions/auth";
import { getCategories } from "../../../../functions/category";
import { createSite } from "../../../../functions/site";
import SideBar from "../../layouts/SideBar";
import "../dashboard/Dashboard.css";
import "../styles.css";

const Create__Site = ({ history }) => {
  const [values, setValues] = useState({
    name: "",
    about: "",
    email: "",
    facebook_url: "",
    whatsapp_url: "",
    instagram_url: "",
    twitter_url: "",
    phone: "",
    logo: "",
    createdSite: "",
    redirectToProfile: false,
    formData: "",
  });
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState("Create Product");

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated();
  const {
    name,
    about,
    email,
    facebook_url,
    whatsapp_url,
    instagram_url,
    twitter_url,
    phone,
    logo,
    createdSite,
    redirectToProfile,
    formData,
  } = values;

  useEffect(() => {
    const menu = window.localStorage.getItem("Menu");
    setMenu(JSON.parse(menu));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("Menu", JSON.stringify(menu));
  });

  const handleChange = (name) => (event) => {
    const value = name === "logo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  // load categories and set form data
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          categories: data,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values });
    setLoading(true);
    if (!name) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Site name is required.");
      }, 1000);
      return;
    }
    if (name.length > 32) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Site name is long, should be between 2 to 32 characters.");
      }, 1000);
      return;
    }
    if (name.length <= 2) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Site name is short, should be between 2 to 32 characters."
        );
      }, 1000);
      return;
    }
    if (!email) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Site's email is required. ");
      }, 1000);
      return;
    }
    if (!about) {
      setTimeout(() => {
        setLoading(false);
        toast.error("About site is required. ");
      }, 1000);
      return;
    }
    if (about.length <= 20) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "About site is short, should be between 20 characters to 1000 characters."
        );
      }, 1000);
      return;
    }
    if (about.length > 1000) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "About site is long, should be between 20 characters to 1000 characters."
        );
      }, 1000);
      return;
    }
    if (!logo) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please upload site's logo.");
      }, 1000);
      return;
    }
    if (!phone) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please site's phone number is required.");
      }, 1000);
      return;
    }

    setValues({
      ...values,
      name: "",
      about: "",
      email: "",
      facebook_url: "",
      whatsapp_url: "",
      instagram_url: "",
      twitter_url: "",
      phone: "",
      amazon_url: "",
      logo: "",
      createdSite: "",
    });

    // make request to api to create product
    createSite(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values });
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          // toast.error(`Site should be unique. ${name} already exist.`);
        }, 1000);
        console.log(data);
      } else {
        setLoading(true);
        setLoading(false);
        toast.success(`Site named "${name}" has been created successfully.`);
        setValues({
          ...values,
          name: "",
          about: "",
          email: "",
          facebook_url: "",
          whatsapp_url: "",
          instagram_url: "",
          twitter_url: "",
          phone: "",
          amazon_url: "",
          logo: "",
          createdSite: data.name,
        });
      }
    });
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={handleSubmit}>
      <h4>Upload Site's Logo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("logo")}
            type="file"
            name="logo"
            accept="image/*"
          />
        </label>
      </div>
      <br />

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="formInput"
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">About Us</label>
        <textarea
          onChange={handleChange("about")}
          className="formInput"
          value={about}
          rows="10"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">G-mail</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="formInput"
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Facebook Link</label>
        <input
          onChange={handleChange("facebook_url")}
          type="text"
          placeholder="Optional"
          className="formInput"
          value={facebook_url}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">WhatsApp Link</label>
        <input
          onChange={handleChange("whatsapp_url")}
          type="text"
          placeholder="Optional"
          className="formInput"
          value={whatsapp_url}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Instagram Link</label>
        <input
          onChange={handleChange("instagram_url")}
          type="text"
          placeholder="Optional"
          className="formInput"
          value={instagram_url}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Twitter Link</label>
        <input
          onChange={handleChange("twitter_url")}
          type="text"
          placeholder="Optional"
          className="formInput"
          value={twitter_url}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Phone Number</label>
        <input
          onChange={handleChange("phone")}
          type="text"
          className="formInput"
          value={phone}
        />
      </div>

      {/* <button className="btn btn-outline-primary">Create Product</button> */}
      {loading ? (
        <button className="btn__category">
          <div class="loader"></div>
        </button>
      ) : (
        <button className="btn__category">{button}</button>
      )}
    </form>
  );

  const goBack = () => (
    <div className="mt-2 pb-5">
      <Link to="/admin/site" className="text-dark">
        <b>Back to Site Settings</b>
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
                    <h3>Site Settings</h3>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-md-8 offset-md-2">
                    {newPostForm()}
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

export default Create__Site;
