import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import axios from "axios";
import { FaSearch, FaBell } from "react-icons/fa";
import { API_PATHS } from "../api/apipath";
import axiosInstance from "../api/axiosInstance";

function Header({ title, subtitle, onSearch, showSearch = true }) {
  const [notifications, setNotifications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.NOTIFICATION.GET_NOTIFICATIONS
      );
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        API_PATHS.NOTIFICATION.MARK_AS_READ(id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // SEARCH HANDLER with delay
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch && onSearch(searchText);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  return (
    <div className="header">
      <div className="header-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="header-controls">
        {/* 🔍 SEARCH BAR */}

        {showSearch && (
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        )}

        {/* 🔔 Notification Bell */}
        <div
          className="header-notification"
          onClick={() => setOpenDropdown(!openDropdown)}
          ref={dropdownRef}
        >
          <FaBell className="bell-icon" />
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}

          {openDropdown && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 && (
                <p className="no-notifs">No notifications</p>
              )}

              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`notif-item ${n.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(n._id)}
                >
                  <p>{n.body}</p>
                  <span className="notif-time">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
