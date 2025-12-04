import React, { useEffect, useState } from "react";
import "./Requests.css";
import { API_PATHS } from "../api/apipath";
import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Requests() {
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  const context = useOutletContext();
  const search = context ? context.search : "";

  // -------------------------------
  // Get First + Last Name Initials
  // -------------------------------
  const getInitials = (firstName, lastName) => {
    const f = firstName?.charAt(0)?.toUpperCase() || "";
    const l = lastName?.charAt(0)?.toUpperCase() || "";
    return f + l;
  };

  // -------------------------------
  // Filter Logic
  // -------------------------------
  const filteredRequests = received.filter((req) => {
    const term = search.toLowerCase();
    const first = req.requester?.firstName?.toLowerCase() || "";
    const last = req.requester?.lastName?.toLowerCase() || "";
    const fullName = `${first} ${last}`;
    const title = req.task?.title?.toLowerCase() || "";

    return fullName.includes(term) || title.includes(term);
  });

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.REQUESTS.GET_MY_REQUESTS);
      setReceived(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (reqId, newStatus) => {
    try {
      await axiosInstance.patch(
        `${API_PATHS.REQUESTS.UPDATE_REQUEST_STATUS(reqId)}`,
        { status: newStatus }
      );
      fetchRequests();
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
        {filteredRequests.length === 0 ? (
          <p className="no-requests">
            {search ? "No matching requests found." : "No incoming requests."}
          </p>
        ) : (
          filteredRequests.map((req) => (
            <div key={req._id} className="req-card">
              {/* ---- Avatar ---- */}
              <div className="req-avatar-col">
                <div className="req-avatar-placeholder">
                  {req.requester?.profileImageUrl ? (
                    <img
                      src={req.requester.profileImageUrl}
                      alt="profile"
                      className="req-avatar-image"
                    />
                  ) : (
                    <span className="avatar-initials">
                      {getInitials(
                        req.requester?.firstName,
                        req.requester?.lastName
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="req-content-col">
                <div className="req-top-row">
                  <h3 className="req-name">
                    {req.requester?.firstName} {req.requester?.lastName}
                  </h3>

                  <div className="req-rating-badge">
                    <FaStar className="star-icon" />
                    <span className="rating-num">4.8</span>
                    <span className="review-count">(12 reviews)</span>
                  </div>
                </div>

                <p className="req-message">
                  {req.message || "I'd love to help with this task!"}
                </p>

                <div className="req-task-box">
                  <span className="req-task-label">Requesting for:</span>
                  <span className="req-task-title">
                    {req.task?.title || "Unknown Task"}
                  </span>
                </div>

                <div className="req-meta-row">
                  <div className="req-meta-item">
                    <FaClock /> <span>{formatTime(req.createdAt)}</span>
                  </div>

                  <div className="req-meta-item">
                    <FaMapMarkerAlt /> <span>Within 5 miles</span>
                  </div>
                </div>
              </div>

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
