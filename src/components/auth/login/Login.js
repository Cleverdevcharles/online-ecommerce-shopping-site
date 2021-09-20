import axios from "axios";
import React, { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_API, FACEBOOK_CLIENT, GOOGLE_CLIENT } from "../../../config";
import { authenticate, isAuthenticated, signin } from "../../../functions/auth";
import { getCategories, getSites } from "../../apiCore";
import Site from "../../card/Site";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
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
  const [processing, setProcessing] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const { user } = isAuthenticated();
  const history = useHistory();
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const { email, password1 } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const sendGoogleToken = (tokenId) => {
    setGoogleLoading(true);
    axios
      .post(`${BACKEND_API}/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        console.log(res.data);
        informParent(res);
        setGoogleLoading(false);
      })
      .catch((error) => {
        setGoogleLoading(false);
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  const informParent = (response) => {
    authenticate(response, () => {

    });
  };

  const sendFacebookToken = (userID, accessToken) => {
    setFacebookLoading(true);
    axios
      .post(`${BACKEND_API}/facebooklogin`, {
        userID,
        accessToken,
      })
      .then((res) => {
        setFacebookLoading(false);
        console.log(res.data);
        informParent(res);
      })
      .catch((error) => {
        console.log("FACEBOOK SIGNIN ERROR", error.response);
        setFacebookLoading(false);
      });
  };

  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  const responseFacebook = (response) => {
    console.log(response);
    sendFacebookToken(response.userID, response.accessToken);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!email && !password1) {
      toast.error("Please fill out all field.");
      setProcessing(false);
      return;
    }
    if (!email) {
      toast.error("Please provide your valid email address.");
      setProcessing(false);
      return;
    }
    if (!password1) {
      toast.error("Please provide your valid password.");
      setProcessing(false);
      return;
    }
    if (email && password1) {
      setFormData({ ...formData, textChange: "Submitting" });

      signin({ email, password: password1 }).then((data) => {
        if (data.error) {
          toast.error(data.error);
          setProcessing(false);
        } else {
          authenticate(data, () => {
            setFormData({
              ...formData,
              email: "",
              password1: "",
            });
            setProcessing(false);
            user && user.role === "admin"
              ? history.push("/")
              : history.push("/");
            toast.success(`Hey ${data.user.name}, Welcome back!`);
          });
        }
      });
    } else {
      toast.error("E-mail and Password do not match.");
      setProcessing(false);
    }
  };

  const register = () => {
    history.push("/register");
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
      <div className="login">
        <Link to="/">
          {sitesByArrival.map((site, i) => (
            <div key={i} className="header__logo">
              <Site site={site} />
            </div>
          ))}
        </Link>
        <div className="login__container">
          <center>
            <h3>Login Now</h3>
          </center>
          <hr />

          <form onSubmit={handleSubmit}>
            <h5>E-mail</h5>
            <input
              type="text"
              value={email}
              onChange={handleChange("email")}
              placeholder="Enter you email address here..."
              className="login w-full px-8 py-3 rounded-lg pl-3 pr-3 pb-1 formInput
                        bg-gray-100 border border-gray-200 placeholder-gray-500
                        text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              style={{ marginTop: "-2px" }}
            />

            <h5>Password</h5>
            <div className="passwordInput mb-2">
              <input
                type={passwordShown ? "text" : "password"}
                value={password1}
                placeholder="Enter you password here..."
                className="login__password w-full px-8 py-1 rounded-lg pl-3 pr-3 pb-1 formInput formInputPassword
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

            <button type="submit" className="login__signInButton py-1">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                <b>Log In</b>
              )}
            </button>
            <Link
              to="/users/password/forget"
              className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
            >
              Forget password?
            </Link>
          </form>
          <div className="w-full flex-1 mt-8 text-indigo-500">
            <div className="flex flex-col items-center">
              <GoogleLogin
                clientId={`${GOOGLE_CLIENT}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="login__signInButton google py-1 bg-danger"
                  >
                    {googleLoading ? (
                      <div className="spinner" id="spinner"></div>
                    ) : (
                      <>
                        <div>
                          <i className="fab fa-google text-white" />
                          <span className="ml-4 text-white">
                            <b>Sign In with Google</b>
                          </span>
                        </div>
                      </>
                    )}
                  </button>
                )}
              ></GoogleLogin>
              <FacebookLogin
                appId={`${FACEBOOK_CLIENT}`}
                autoLoad={false}
                callback={responseFacebook}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    className="login__signInButton py-1 facebook bg-primary"
                  >
                    {facebookLoading ? (
                      <div className="spinner" id="spinner"></div>
                    ) : (
                      <div>
                        <i className="fab fa-facebook text-white" />
                        <span className="ml-4 text-white">
                          <b>Sign In with Facebook</b>
                        </span>
                      </div>
                    )}
                  </button>
                )}
              />
            </div>
          </div>

          <center>
            <hr />
            <b>Don't have an acoount ?</b>
          </center>
          <button
            onClick={register}
            className="login__registerButton mt-3 py-1"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

// 07035303113

export default Login;
