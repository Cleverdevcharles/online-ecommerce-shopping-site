import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, signup } from "../../../functions/auth";
import { getCategories, getSites } from "../../apiCore";
import Site from "../../card/Site";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });
  const [term_condition, setTerm_condition] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmpasswordShown, setConfirmPasswordShown] = useState(false);
  const [processing, setProcessing] = useState("");
  const [sitesByArrival, setSitesByArrival] = useState([]);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { user } = isAuthenticated();

  // const { user } = authenticate();

  const toggleRegisterVisiblity = () => {
    setTerm_condition(term_condition ? false : true);
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmpasswordShown ? false : true);
  };

  const { firstName, lastName, name, email, password1, password2 } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const register = (e) => {
    e.preventDefault();
    setProcessing(true);
    const strongRegexSpecialCharacter = /^(.*\W).*$/;

    if (!firstName) {
      toast.error("First name is required.");
      setProcessing(false);
      return;
    }
    if (strongRegexSpecialCharacter.test(firstName)) {
      toast.error("First name can't contain any special character.");
      setProcessing(false);
      return;
    }
    if (!lastName) {
      toast.error("Last name is required.");
      setProcessing(false);
      return;
    }
    if (strongRegexSpecialCharacter.test(lastName)) {
      toast.error("Last name can't contain any special character.");
      setProcessing(false);
      return;
    }
    // if (name.length > 32) {
    //   toast.error(
    //     "First name + Last name to long. Must be below 32 characters."
    //   );
    //   setProcessing(false);
    //   return;
    // }

    if (!email) {
      toast.error("Valid email is required.");
      setProcessing("");
      return;
    }
    if (!password1) {
      toast.error("Please create your password.");
      setProcessing("");
      return;
    }
    if (password1.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setProcessing("");
      return;
    }
    if (password1.length > 32) {
      toast.error("Password must be between 8 to 32 characters long only.");
      setProcessing("");
      return;
    }
    const strongRegexHighercase = new RegExp("^(?=.*[A-Z])");
    if (!strongRegexHighercase.test(password1)) {
      toast.error("Password must contain at least an uppercase.");
      setProcessing("");
      return;
    }
    const strongRegexLowercase = new RegExp("^(?=.*[a-z])");
    if (!strongRegexLowercase.test(password1)) {
      toast.error("Password must contain at least a lowercase.");
      setProcessing("");
      return;
    }
    const strongRegexNumber = new RegExp("^(?=.*[0-9])");
    if (!strongRegexNumber.test(password1)) {
      toast.error("Password must contain at least one number.");
      setProcessing("");
      return;
    }
    if (!strongRegexSpecialCharacter.test(password1)) {
      toast.error("Password must contain at least one special character.");
      setProcessing("");
      return;
    }
    if (!password2) {
      toast.error("Please confrim your password.");
      setProcessing("");
      return;
    }
    if (password2 !== password1) {
      toast.error("Password do not match.");
      setProcessing("");
      return;
    }
    var name = firstName.trim() + " " + lastName.trim();

    signup({ name, email, password: password1 }).then((error) => {
      if (error) {
        console.log("Error => ", error);
        toast.success(
          `Email sent to ${email}. Please kindly follow the steps to verify your email.`
        );
        console.log("Final Error => ", error.errors);
        toast.error(error.errors);
        setProcessing(false);
      } else {
        toast.success(
          `Email sent to ${email}. Please kindly follow the steps to verify your email.`
        );
        setFormData({
          ...formData,
          firstName: "",
          lastName: "",
          name: "",
          email: "",
          password1: "",
          password2: "",
        });
        setProcessing(false);
      }
    });
  };

  const login = () => {
    history.push("/login");
    window.location.reload();
  };

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
      {user ? <Redirect to="/" /> : null}
      <div className="register">
        <Link to="/">
          {sitesByArrival.map((site, i) => (
            <div key={i} className="header__logo">
              <Site site={site} />
            </div>
          ))}
        </Link>
        <div className="register__container">
          <center>
            <h3>Register Now</h3>
          </center>
          <hr />

          <form>
            <div className="firstName__lastName mb-1">
              <div>
                <h5>First Name</h5>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleChange("firstName")}
                  placeholder="Enter you first name here..."
                  name="firstName"
                  className="w-full login px-8 py-1 rounded-lg pl-3 pr-3 pb-1 formInput
                                bg-gray-100 border border-gray-200 placeholder-gray-500
                                text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              <div>
                <h5>Last Name</h5>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleChange("lastName")}
                  placeholder="Enter you last name here..."
                  name="lastName"
                  className="w-full px-8 py-3 rounded-lg pl-3 pr-3 pb-1 formInput
                                bg-gray-100 border border-gray-200 placeholder-gray-500
                                text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>
            </div>

            <h5>E-mail</h5>
            <input
              type="email"
              value={email}
              onChange={handleChange("email")}
              placeholder="Enter you email address here..."
              name="email"
              className="w-full px-8 py-5 rounded-lg pl-3 pr-3 pb-1 formInput
                        bg-gray-100 border border-gray-200 placeholder-gray-500
                        text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            />

            <h5>Password</h5>
            <div className="passwordInput mb-2">
              <input
                type={passwordShown ? "text" : "password"}
                value={password1}
                placeholder="Enter you password here..."
                name="password1"
                className="w-full px-8 py-3 rounded-lg pl-3 pr-3 pb-1 formInput formInputPassword
                            bg-gray-100 border border-gray-200 placeholder-gray-500
                            text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                onChange={handleChange("password1")}
              />
              <span className="form__symbol">
                {/* <i className="fas fa-lock"></i> */}
                {passwordShown ? (
                  <i
                    className="fas fa-eye-slash"
                    onClick={togglePasswordVisiblity}
                  ></i>
                ) : (
                  <i
                    className="fas fa-eye"
                    onClick={togglePasswordVisiblity}
                  ></i>
                )}
              </span>
            </div>
            <h5>Confirm Password</h5>
            <div className="passwordInput">
              <input
                type={confirmpasswordShown ? "text" : "password"}
                value={password2}
                placeholder="Enter you password here..."
                name="password2"
                className="w-full px-8 py-3 rounded-lg pl-3 pr-3 pb-1 formInput formInputPassword
                            bg-gray-100 border border-gray-200 placeholder-gray-500
                            text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                onChange={handleChange("password2")}
              />
              <span className="form__symbol">
                {confirmpasswordShown ? (
                  <i
                    className="fas fa-eye-slash"
                    onClick={toggleConfirmPasswordVisiblity}
                  ></i>
                ) : (
                  <i
                    className="fas fa-eye"
                    onClick={toggleConfirmPasswordVisiblity}
                  ></i>
                )}
              </span>
            </div>
            <p>
              <small>
                By registering you agree to ou Conditions of Use & Sale. Please
                see our Privacy Notice, our Cookies Notice and our
                Interest-Based Ads Notice.
              </small>
            </p>
          </form>
          <div className="form-check">
            <div className="slideThree">
              <input
                type="checkbox"
                onClick={toggleRegisterVisiblity}
                value="None"
                id="slideThree"
                name="check"
              />
              <label htmlFor="slideThree"></label>
            </div>
          </div>
          {term_condition ? (
            <button
              type="submit"
              onClick={register}
              className="register__registerButton"
            >
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                <b>Register</b>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled
              className="register__registerButton"
              style={{ backgroundColor: "#f1d690" }}
            >
              <b>Kindly agree to our Conditions of Use & Sale.</b>
            </button>
          )}
          <div className="my-12 border-b text-center mt-1">
            <div
              className="leading-none px-2 inline-block text-sm 
                        text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
            >
              <b>Or sign with email or Social login</b>
            </div>
          </div>
          <button
            type="submit"
            onClick={login}
            className="register__signInButton"
          >
            <b>Login</b>
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
