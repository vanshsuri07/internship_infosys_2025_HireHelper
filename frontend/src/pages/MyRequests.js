import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyRequests.css";
import { API_PATHS } from "../api/apipath";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

// 1. Define a placeholder image
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600x350.png?text=No+Image";

function MyRequests() {
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchSentRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_PATHS.REQUESTS.GET_SENT_REQUESTS}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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

  // 2. Helper to format dates
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

  // 3. NEW: Smart Image URL Helper (Matches TaskCard logic)
  const getImageUrl = (picture) => {
    if (!picture || picture.trim() === "") return null; // Return null to hide image container
    
    // If it's Base64 or a full URL, return as-is
    if (picture.startsWith("data:") || picture.startsWith("http")) {
      return picture;
    }

    // If it's a relative path (Windows or Mac), fix slashes and prepend localhost
    const cleanPath = picture.replace(/\\/g, "/");
    const path = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:5000${path}`;
  };

  if (loading) return <div className="my-requests-container"><p className="loading">Loading...</p></div>;
  if (error) return <div className="my-requests-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="my-requests-container">
      <div className="header-section">
        <h2>My Requests</h2>
        <p>Track the help requests you've sent</p>
      </div>

      <div className="sent-list">
        {sent.length === 0 ? (
          <p className="no-data">You haven't sent any requests yet.</p>
        ) : (
          sent.map((req) => {
            const taskTitle = req.task?.title || "Unknown Task";
            const taskCategory = req.task?.category || "General";
            const ownerName = req.task?.user
              ? `${req.task.user.firstName} ${req.task.user.lastName}`
              : "Unknown User";
            
            // 4. Use the helper function here
            const taskImageSrc = getImageUrl(req.task?.picture);
            
            const ownerInitial = ownerName.charAt(0).toUpperCase();

            return (
              <div key={req._id} className="sent-card">
                <div className="card-header">
                  <div className="user-info">
                    <div className="avatar-circle">{ownerInitial}</div>
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

                {/* 5. Render Image only if valid */}
                {taskImageSrc && (
                  <div className="task-image-container">
                    <img
                      src={taskImageSrc}
                      alt={taskTitle}
                      className="task-image"
                      onError={(e) => {
                        e.target.style.display = 'none'; // Hide if broken
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