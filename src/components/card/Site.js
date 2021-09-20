import React from "react";
import Logo from "../show_image/Logo";
import { Link } from "react-router-dom";
import "./Site.css";

const Site = ({ site }) => {
  
  return (
    <div className="logo-container">
      <Link to="/">
        <Logo item={site} url="site" />
      </Link>
    </div>
  );
};

export default Site;
