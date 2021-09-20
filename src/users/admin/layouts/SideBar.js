import { React, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../functions/auth";
import userProfile from "../../../components/images/user.png";

const SideBar = () => {
  const [siteArrow, setSiteArrow] = useState(false);
  const [customersArrow, setCustomersArrow] = useState(false);
  const [categoryArrow, setCategoryArrow] = useState(false);
  const [productArrow, setProductArrow] = useState(false);
  const [settingsArrow, setSettingsArrow] = useState(false);

  const toggleSiteArrow = () => {
    setSiteArrow(siteArrow ? false : true);
  };
  const toggleCustomersArrow = () => {
    setCustomersArrow(customersArrow ? false : true);
  };
  const toggleCategoryArrow = () => {
    setCategoryArrow(categoryArrow ? false : true);
  };
  const toggleProductArrow = () => {
    setProductArrow(productArrow ? false : true);
  };
  const toggleSettingsArrow = () => {
    setSettingsArrow(settingsArrow ? false : true);
  };
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  return (
    <>
      <div className="sidebar__brand">
        <div className="brand__flex">
          <div className="brand__icons">
            <span></span>
            <Link to="/profile">
              <span></span>
            </Link>
          </div>
        </div>
      </div>

      <div className="sidebar__main">
        <div className="sidebar__user">
          <Link to="/profile">
            <img
              src={userProfile}
              alt="Admin__Image"
              className="admin__image"
            />
          </Link>
          <div>
            <h3>{name}</h3>
            <span>{email}</span>
          </div>
        </div>

        {role === "admin" ? (
          <div className="sidebar__menu">
            <div className="menu__block">
              <Link className="link" to="/admin/dashboard">
                <div className="menu__head dashboard">
                  <span>Dashboard</span>
                  <i class="las la-palette"></i>
                </div>
              </Link>
              <Link className="link" to="/admin/order&pruchase/history">
                <div className="menu__head dashboard">
                  <span>Orders</span>
                  <i class="las la-palette"></i>
                </div>
              </Link>
              <div
                className="menu__head"
                onClick={toggleSiteArrow}
                data-bs-toggle="collapse"
                href="#siteCollapse"
                role="button"
                aria-expanded="false"
                aria-controls="siteCollapse"
              >
                <span className="components">Site</span>
                <span
                  className={
                    siteArrow
                      ? "conponents las la-chevron-circle-up"
                      : "conponents las la-chevron-circle-down"
                  }
                ></span>
                <i class="las la-store-alt"></i>
              </div>
              <ul className="collapse multi-collapse" id="siteCollapse">
                <li>
                  <Link to="/admin/create-site">
                    <span className="las la-edit"></span>
                    <span>Create Site</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/sites">
                    <span className="las la-edit"></span>
                    <span>Manage Site Settings</span>
                  </Link>
                </li>
              </ul>

              <div
                className="menu__head"
                onClick={toggleCustomersArrow}
                data-bs-toggle="collapse"
                href="#usersCollapse"
                role="button"
                aria-expanded="false"
                aria-controls="usersCollapse"
              >
                <span className="components">Customers</span>
                <span
                  className={
                    customersArrow
                      ? "components las la-chevron-circle-up"
                      : "components las la-chevron-circle-down"
                  }
                ></span>
                <i class="las la-address-card"></i>
              </div>
              <ul className="collapse multi-collapse" id="usersCollapse">
                <li>
                  <a href="">
                    <span className="las la-eye"></span>
                    <span>View All Customers</span>
                  </a>
                  <hr />
                </li>
                <li>
                  <a href="">
                    <span className="las la-edit"></span>
                    <span>Modify Customer Details</span>
                  </a>
                </li>
              </ul>

              <div
                className="menu__head"
                onClick={toggleCategoryArrow}
                data-bs-toggle="collapse"
                href="#categoryCollapse"
                role="button"
                aria-expanded="false"
                aria-controls="categoryCollapse"
              >
                <span className="components">Category</span>
                <span
                  className={
                    categoryArrow
                      ? "components las la-chevron-circle-up"
                      : "components las la-chevron-circle-down"
                  }
                ></span>
                <i class="las la-layer-group"></i>
              </div>

              <ul className="collapse multi-collapse" id="categoryCollapse">
                <li>
                  <Link to="/admin/create-category" className="admin_link">
                    <span className="las la-pencil-alt"></span>
                    <span>Create New Category</span>
                  </Link>
                  <hr />
                </li>

                <li>
                  <Link to="/admin/categories" className="admin_link">
                    <span className="las la-eye"></span>
                    <span>View All Categoryies</span>
                  </Link>
                </li>
              </ul>

              <div
                className="menu__head"
                onClick={toggleProductArrow}
                data-bs-toggle="collapse"
                href="#productCollapse"
                role="button"
                aria-expanded="false"
                aria-controls="productCollapse"
              >
                <span className="components">Product</span>
                <span
                  className={
                    productArrow
                      ? "components las la-chevron-circle-up"
                      : "components las la-chevron-circle-down"
                  }
                ></span>
                <i class="las la-star"></i>
              </div>

              <ul className="collapse multi-collapse" id="productCollapse">
                <li>
                  <Link to="/admin/create-product" className="admin_link">
                    <span className="las la-pencil-alt"></span>
                    <span>Create New Product</span>
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link to="/admin/products" className="admin_link">
                    <span className="las la-eye"></span>
                    <span>View All Products</span>
                  </Link>
                </li>
              </ul>

              <div
                className="menu__head"
                onClick={toggleSettingsArrow}
                data-bs-toggle="collapse"
                href="#settingsCollapse"
                role="button"
                aria-expanded="false"
                aria-controls="settingsCollapse"
              >
                <span className="components">Settings</span>
                <span
                  className={
                    settingsArrow
                      ? "components las la-chevron-circle-up"
                      : "components las la-chevron-circle-down"
                  }
                ></span>
                <i class="las la-cog"></i>
              </div>

              <ul className="collapse multi-collapse" id="settingsCollapse">
                <li>
                  <Link to="/update/profile">
                    <span className="las la-edit"></span>
                    <span>Update Profile</span>
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link to="/users/password/change">
                    <span className="las la-edit"></span>
                    <span>Change password</span>
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link to="/profile">
                    <span className="las la-eye"></span>
                    <span>View profile</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="sidebar__menu">
            <div className="menu__block">
              <Link className="link" to="/user/dashboard">
                <div className="menu__head dashboard">
                  <span>Dashboard</span>
                  <i class="las la-palette"></i>
                </div>
              </Link>

              <div
                className="menu__head"
                onClick={toggleSettingsArrow}
                data-bs-toggle="collapse"
                href="#settingsCollapse"
                role="button"
                aria-expanded="false"
                aria-controls="settingsCollapse"
              >
                <span className="components">Settings</span>
                <span
                  className={
                    settingsArrow
                      ? "components las la-chevron-circle-up"
                      : "components las la-chevron-circle-down"
                  }
                ></span>
                <i class="las la-cog"></i>
              </div>

              <ul className="collapse multi-collapse" id="settingsCollapse">
                <li>
                  <Link to="/update/profile">
                    <span className="las la-edit"></span>
                    <span>Update Profile</span>
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link to="/users/password/change">
                    <span className="las la-edit"></span>
                    <span>Change password</span>
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link to="/profile">
                    <span className="las la-eye"></span>
                    <span>View profile</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;
