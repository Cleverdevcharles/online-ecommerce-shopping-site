import { React, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../../functions/auth";
import userProfile from "../../../components/images/user.png";

const SideBar = () => {
  const [settingsArrow, setSettingsArrow] = useState(false);


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
      </div>
    </>
  );
};

export default SideBar;
