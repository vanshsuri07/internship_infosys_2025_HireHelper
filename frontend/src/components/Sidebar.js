import React from "react";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";
import logoImage from "../assets/logo.png";

// 1. IMPORT ICONS AND useAuth
import {
  FaHome,
  FaTasks,
  FaEnvelopeOpenText,
  FaHistory,
  FaPlus,
  FaCog,
  FaUserCircle, // <-- New icon
  FaSignOutAlt, // <-- New icon
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // <-- IMPORT useAuth

function Sidebar() {
  // 2. GET USER AND LOGOUT FROM CONTEXT
  const { user, logout } = useAuth();

  // This will help us debug if the user data is still missing
  console.log("User from context:", user);

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logoImage} alt="Hire-a-Helper logo" />
          Hire-a-Helper
        </div>
        <nav className="sidebar-nav">
          {/* --- HERE ARE ALL YOUR LINKS, UNBROKEN --- */}
          <NavLink
            to="/dashboard/feed"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaHome /> <span>Feed</span>
          </NavLink>

          <NavLink
            to="/dashboard/mytasks"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaTasks /> <span>My Tasks</span>
          </NavLink>

          <NavLink
            to="/dashboard/requests"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaEnvelopeOpenText /> <span>Requests</span>
          </NavLink>

          <NavLink
            to="/dashboard/myrequests"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaHistory /> <span>My Requests</span>
          </NavLink>

          <NavLink
            to="/dashboard/addtask"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaPlus /> <span> Add Task</span>
          </NavLink>

          {/* --- SETTINGS LINK IS HERE --- */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaCog /> <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* --- SIDEBAR-BOTTOM NOW ONLY HOLDS THE PROFILE --- */}
      <div className="sidebar-bottom">
        {user && (
          <div className="user-profile">
            <FaUserCircle className="profile-icon" />
            <div className="profile-details">
              <span className="profile-name">
                {user.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : user.name || "User Name"}
              </span>
              <span className="profile-email">
                {user.email || "user@example.com"}
              </span>
            </div>
            <button onClick={logout} className="logout-button">
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
