import React from "react";
import Header from "./Header";
import "./Layouts.css";
import Siderbar from "./Siderbar";

function Layout() {
  return (
    <>
      <input type="checkbox" id="nav__toggle" />
      <div className="sidebar">
        <Siderbar />
      </div>
    </>
  );
}

export default Layout;
