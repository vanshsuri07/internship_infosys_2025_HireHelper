import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Requests.css";
import { API_PATHS } from "../api/apipath";
import { FaStar, FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";

function Requests() {
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // --- 1. FETCH REAL DATA ---
  const fetchRequests = async () => {
    try {
      const resReceived = await axios.get(
        `${API_PATHS.REQUESTS.GET_MY_REQUESTS}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReceived(resReceived.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- 2. HANDLE ACCEPT/DECLINE ---
  const updateStatus = async (reqId, newStatus) => {
    try {
      await axios.patch(
        `${API_PATHS.REQUESTS.UPDATE_REQUEST_STATUS(reqId)}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Failed to update status");
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="requests-container">
        <p className="loading">Loading requests...</p>
      </div>
    );

  return (
    <div className="requests-container">
      <div className="req-list">
        {received.length === 0 ? (
          <p className="no-requests">No incoming requests found.</p>
        ) : (
          received.map((req) => (
            <div key={req._id} className="req-card">
              {/* --- LEFT: AVATAR --- */}
              <div className="req-avatar-col">
                <div className="req-avatar-placeholder">
                  {/* Show first letter of name */}
                  {req.requester?.profileImageUrl ? (
                    <img
                      src={req.requester.profileImageUrl}
                      alt={`${req.requester.firstName} ${req.requester.lastName}`}
                      className="req-avatar-image"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>
              </div>

              {/* --- MIDDLE: CONTENT --- */}
              <div className="req-content-col">
                <div className="req-top-row">
                  <h3 className="req-name">
                    {req.requester?.firstName} {req.requester?.lastName}
                  </h3>
                </div>

                {/* Message */}
                <p className="req-message">
                  {req.message ||
                    "I'd love to help with this task! Available immediately."}
                </p>

                {/* Grey Task Box */}
                <div className="req-task-box">
                  <span className="req-task-label">Requesting for:</span>
                  <span className="req-task-title">
                    {req.task?.title || "Unknown Task"}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="req-meta-row">
                  <div className="req-meta-item">
                    <FaClock /> <span>{formatTime(req.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* --- RIGHT: BUTTONS --- */}
              <div className="req-actions-col">
                {req.status === "pending" ? (
                  <>
                    <button
                      className="req-btn accept-btn"
                      onClick={() => updateStatus(req._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="req-btn decline-btn"
                      onClick={() => updateStatus(req._id, "rejected")}
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span className={`status-label ${req.status}`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Requests;
