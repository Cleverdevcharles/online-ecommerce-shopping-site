import React, { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PhoneInput from "react-phone-number-input";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "../../components/forms/category/categoryForm.css";
import { isAuthenticated } from "../../functions/auth";
import { read, update, updateUser } from "../../functions/user";
import SideBar from "../../users/admin/layouts/SideBar";
import "../../users/admin/views/dashboard/Dashboard.css";
import "../../users/admin/views/styles.css";

const Update__Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    address: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    error: false,
  });
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState("Save");
  const [phone, setPhone] = useState();
  const [country, setCountry] = useState();
  const [state, setState] = useState();

  const history = useHistory();

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  const { user, token } = isAuthenticated();
  const { name, email, password, firstName, lastName, error, address } = values;

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
          firstName: "",
          lastName: "",
          name: data.name,
          address: "",
          email: data.email,
          password: data,
        });
        setPhone("");
        setCountry("");
        setState("");
      }
    });
  };

  useEffect(() => {
    const userId = match.params.userId;
    init(userId);
  }, []);

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const profile = () => {
    history.push("/profile");
    window.location.reload();
  };

  const goBack = () => (
    <div className="mt-2 pb-5">
      <Link onClick={profile} className="text-dark">
        <b>Back to Profile</b>
      </Link>
    </div>
  );

  const viewSite = () => {
    history.push("/");
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const name = firstName + " " + lastName;
    const strongRegexSpecialCharacter = /^(.*\W).*$/;

    if (!firstName) {
      toast.error("First name is required.");
      setLoading(false);
      return;
    }
    if (strongRegexSpecialCharacter.test(firstName)) {
      toast.error("First name can't contain any special character.");
      setLoading(false);
      return;
    }
    if (!lastName) {
      toast.error("Last name is required.");
      setLoading(false);
      return;
    }
    if (strongRegexSpecialCharacter.test(lastName)) {
      toast.error("Last name can't contain any special character.");
      setLoading(false);
      return;
    }
    if (name.length > 32) {
      toast.error(
        "First name + Last name to long. Must be below 32 characters."
      );
      setLoading(false);
      return;
    }
    if (!phone) {
      toast.error("Phone number is required.");
      setLoading(false);
      return;
    }
    if (!address) {
      toast.error("Address is required.");
      setLoading(false);
      return;
    }
    if (!country) {
      toast.error("Country is required.");
      setLoading(false);
      return;
    }
    if (!state) {
      toast.error("State is required.");
      setLoading(false);
      return;
    }
    update(user._id, token, {
      name,
      email,
      phone,
      address,
      country,
      state,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
        toast.error(data.error);
        setLoading(false);
      } else {
        updateUser(data, () => {
          setLoading(false);
          setPhone(phone);
          setValues({
            ...values,
            firstName: "",
            lastName: "",
            name: data.name,
            photo: "",
            address: "",
            state: "",
            country: "",
            email: data.email,
            success: true,
          });
        });
        toast.success("Profile updated successfully.");
      }
    });
  };

  const updateProfileForm = () => (
    <form>
      <div className="form-group row">
        <div className="col">
          <label className="text-muted">First Name</label>
          <input
            type="text"
            className="formInput"
            onChange={handleChange("firstName")}
            placeholder="Enter your first name here..."
            style={{ marginTop: "-1px" }}
            value={firstName}
          />
        </div>
        <div className="col">
          <label className="text-muted">Last Name</label>
          <input
            type="text"
            className="formInput"
            style={{ marginTop: "-1px" }}
            onChange={handleChange("lastName")}
            placeholder="Enter your last name here..."
            value={lastName}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col">
          <label className="text-muted">Country</label>
          <CountryDropdown
            className="formInput"
            placeholder="Enter your country here..."
            style={{ marginTop: "-1px" }}
            onChange={setCountry}
            value={country}
          />
        </div>
        <div className="col">
          <label className="text-muted">State</label>
          <RegionDropdown
            className="formInput"
            country={country}
            placeholder="Enter your state here..."
            style={{ marginTop: "-1px" }}
            onChange={setState}
            value={state}
          />
        </div>
      </div>
      <div className="form-group row">
        <div className="col">
          <label className="text-muted">Street Address</label>
          <input
            type="text"
            className="formInput -"
            placeholder="Enter your street address here..."
            style={{ marginTop: "-1px" }}
            onChange={handleChange("address")}
            value={address}
          />
        </div>
        <div className="col">
          <label className="text-muted">Phone Number</label>
          <PhoneInput
            placeholder="Enter phone number..."
            className="formInput"
            style={{ marginTop: "-1px" }}
            value={phone}
            onChange={setPhone}
          />
        </div>
      </div>

      {loading ? (
        <button className="btn__category">
          <div class="loader"></div>
        </button>
      ) : (
        <button className="btn__category" onClick={handleSubmit}>
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
                src="https://res.cloudinary.com/dt1q2a20t/images/upload/v1620401647/fkriioooip6rqj59qjvn.jpg"
                width="40px"
                height="40px"
                alt="admin__images"
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

          <div className="recent__grid row" style={{ marginTop: "-15px" }}>
            <div className="orders col">
              <div className="category cards pb-5">
                <div className="card__header">
                  <div className="offset-md-5">
                    <h3>Update Profile</h3>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-8 offset-md-2">
                    {updateProfileForm()}
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

export default Update__Profile;
