import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_API } from "../../../config";
import { isAuth } from "../../../helpers/auth";
import { getCategories, getSites } from "../../apiCore";
import Site from "../../card/Site";
import "./ResetPassword.css";

const ResetPassword = ({ match }) => {
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
    token: "",
  });
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
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmpasswordShown, setConfirmPasswordShown] = useState(false);
  const [processing, setProcessing] = useState("");

  const { password1, password2, token } = formData;
  const history = useHistory();

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmpasswordShown ? false : true);
  };

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setFormData({ ...formData, token });
    }
  }, []);

  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = (e) => {
    setProcessing(true);
    e.preventDefault();
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
    const strongRegexSpecialCharacter = /^(.*\W).*$/;
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

    axios
      .put(`${BACKEND_API}/resetpassword`, {
        newPassword: password1,
        resetPasswordLink: token,
      })
      .then((res) => {
        console.log(res.data.message);
        setFormData({
          ...formData,
          password1: "",
          password2: "",
        });
        setProcessing(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
        setProcessing(false);
        console.log(err.response.data.error);
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
      {isAuth() ? <Redirect to="/" /> : null}
      <div className="resetPassword">
        <Link to="/">
          {sitesByArrival.map((site, i) => (
            <div key={i} className="header__logo">
              <Site site={site} />
            </div>
          ))}
        </Link>
        <div className="resetPassword__container">
          <center>
            <h3>Reset Your Password Now</h3>
          </center>
          <hr />

          <form>
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
            <button
              type="submit"
              onClick={handleSubmit}
              className="resetPassword__resetPasswordButton"
            >
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                <b>Reset Password</b>
              )}
            </button>
          </form>
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
            className="resetPassword__signInButton"
          >
            <b>Login</b>
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
