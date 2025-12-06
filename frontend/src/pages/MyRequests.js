import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyRequests.css";
import { API_PATHS } from "../api/apipath";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
// 1. Import Context
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function MyRequests() {
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // 2. Get Search Term
  const context = useOutletContext();
  const search = context ? context.search : "";

  // 3. Filter Logic (Search by Task Title)
  const filteredSent = sent.filter((req) => {
    const term = search.toLowerCase();
    const taskTitle = req.task?.title?.toLowerCase() || "";
    return taskTitle.includes(term);
  });

  const fetchSentRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_PATHS.REQUESTS.GET_SENT_REQUESTS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let requestsData = [];
      if (Array.isArray(res.data)) {
        requestsData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        requestsData = res.data.data;
      } else if (res.data && Array.isArray(res.data.requests)) {
        requestsData = res.data.requests;
      }
      setSent(requestsData);
    } catch (err) {
      console.error("Error fetching sent requests:", err);
      setError("Failed to load your sent requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getImageUrl = (picture) => {
    if (!picture || picture.trim() === "") return null;
    if (picture.startsWith("data:") || picture.startsWith("http")) {
      return picture;
    }
    const cleanPath = picture.replace(/\\/g, "/");
    const path = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:5000${path}`;
  };

  if (loading)
    return (
      <div className="my-requests-container">
        <p className="loading">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="my-requests-container">
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <div className="my-requests-container">
      <div className="sent-list">
        {/* 4. Use 'filteredSent' instead of 'sent' */}
        {filteredSent.length === 0 ? (
          <p className="no-data">
            {search
              ? "No matches found."
              : "You haven't sent any requests yet."}
          </p>
        ) : (
          filteredSent.map((req) => {
            const taskTitle = req.task?.title || "Unknown Task";
            const taskCategory = req.task?.category || "General";
            const ownerName = req.task?.user
              ? `${req.task.user.firstName} ${req.task.user.lastName}`
              : "Unknown User";

            const taskImageSrc = getImageUrl(req.task?.picture);
            const getInitials = (name) => {
              if (!name) return "";

              const parts = name.trim().split(" ");

              const first = parts[0]?.[0] || "";
              const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

              return (first + last).toUpperCase();
            };

            const ownerInitial = getInitials(ownerName);

            return (
              <div key={req._id} className="sent-card">
                <div className="card-header">
                  <div className="user-info">
                    <div className="avatar-circle">
                      {req.task?.user?.profileImageUrl ? (
                        <img
                          src={req.task.user.profileImageUrl}
                          alt={ownerName}
                          className="req-avatar-image"
                        />
                      ) : (
                        <div className="avatar-circle">{ownerInitial}</div>
                      )}
                    </div>
                    <div>
                      <div className="title-row">
                        <h3 className="task-title">{taskTitle}</h3>
                        <span className="category-tag">{taskCategory}</span>
                      </div>
                      <p className="task-owner">Task owner: {ownerName}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${req.status}`}>
                    {req.status}
                  </span>
                </div>

                <div className="message-box">
                  <strong>Your message:</strong>
                  <p>{req.message}</p>
                </div>

                <div className="meta-details">
                  <span className="meta-item">
                    <FaClock /> Sent {formatDateTime(req.createdAt)}
                  </span>
                  {req.task?.location && (
                    <span className="meta-item">
                      <FaMapMarkerAlt /> {req.task.location}
                    </span>
                  )}
                </div>

                {taskImageSrc && (
                  <div className="task-image-container">
                    <img
                      src={taskImageSrc}
                      alt={taskTitle}
                      className="task-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyRequests;
