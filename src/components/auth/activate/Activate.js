import axios from "axios";
import jwt from "jsonwebtoken";
import { React, useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_API } from "../../../config";
import { isAuth } from "../../../helpers/auth";
import "./Activate.css";

const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setFormData({ ...formData, name, token });
    }
    console.log(token, name);
  }, [match.params]);

  const { name, token, show } = formData;
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${BACKEND_API}/activation`, {
        token,
      })
      .then((res) => {
        setFormData({
          ...formData,
          show: false,
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };
  const login = () => {
    history.push("/login");
    window.location.reload();
  };
  return (
    <div className="register" style={{ marginTop: "150px" }}>
      <h1>Welcome {name}</h1>
      {isAuth() ? <Redirect to="/" /> : null}
      <div className="register__container">
        <form style={{ marginTop: "10px" }} onSubmit={handleSubmit}>
          <button type="submit" className=" register__registerButton">
            Activate your Account
          </button>
        </form>
        <hr style={{ marginTop: "10px" }} />
        <div style={{ justifyContent: "space-between" }}>
          <center>
            <p>Wants you login ?</p>
          </center>
          <Link
            to="/login"
            onClick={login}
            className="a login__button"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            <button type="submit" className=" register__signInButton">
              <b>Login</b>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Activate;
