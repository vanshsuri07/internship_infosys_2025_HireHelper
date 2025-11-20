import { useEffect, useState } from "react";
import axios from "axios";
import "./MyRequest.css";
import { API_PATHS } from "../api/apipath";
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaUser } from "react-icons/fa";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_PATHS.REQUESTS.GET_SENT_REQUESTS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Requests data:", res.data); // Debug: Check structure
        setRequests(res.data.requests || []);
      } catch (error) {
        console.error("Error fetching sent requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "status-badge-pending",
      accepted: "status-badge-accepted",
      rejected: "status-badge-rejected",
    };
    return statusMap[status?.toLowerCase()] || "status-badge-pending";
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to get task owner name
  const getTaskOwnerName = (request) => {
    const taskUser = request.task?.user;
    if (!taskUser) return "Unknown Owner";

    const firstName = taskUser.firstName || "";
    const lastName = taskUser.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Owner";
  };

  // Helper to get task owner profile picture
  const getTaskOwnerPicture = (request) => {
    return request.task?.user?.profilePicture || null;
  };

  if (loading) {
    return (
      <div className="my-requests-container">
        <div className="loading-spinner">Loading your requests...</div>
      </div>
    );
  }

  return (
    <div className="my-requests-container">
      <div className="my-requests-header">
        <h1>My Requests</h1>
        <p className="subtitle">Track the help requests you've sent</p>
      </div>

      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="no-requests-card">
            <div className="no-requests-icon">📭</div>
            <p className="no-requests-text">
              You haven't sent any requests yet.
            </p>
            <p className="no-requests-subtext">
              Browse available tasks and send help requests to get started!
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div className="request-card" key={req._id}>
              <div className="request-card-header">
                <div className="request-card-left">
                  <div className="task-owner-info">
                    {getTaskOwnerPicture(req) ? (
                      // Show profile image
                      <img
                        src={getTaskOwnerPicture(req)}
                        alt="Owner"
                        className="owner-avatar"
                      />
                    ) : (
                      // Show initials
                      <div className="owner-initials">
                        {req.task?.user?.firstName?.[0]?.toUpperCase() || ""}
                        {req.task?.user?.lastName?.[0]?.toUpperCase() || ""}
                      </div>
                    )}
                  </div>
                  <div className="request-card-info">
                    <h3 className="request-task-title">
                      {req.task?.title || "Task"}
                    </h3>

                    {/* Task Owner Information */}
                    <div className="task-owner-info">
                      {getTaskOwnerPicture(req) && (
                        <img
                          src={getTaskOwnerPicture(req)}
                          alt="Owner"
                          className="owner-avatar"
                        />
                      )}
                      <FaUser className="owner-icon" />
                      <span className="owner-name">
                        Task Owner: {getTaskOwnerName(req)}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`status-badge ${getStatusBadgeClass(req.status)}`}
                >
                  {req.status || "Pending"}
                </span>
              </div>

              <div className="request-card-body">
                <div className="request-details">
                  <div className="request-detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{req.task?.location || "Remote"}</span>
                  </div>

                  <div className="request-detail-item">
                    <FaClock className="detail-icon" />
                    <span>Sent {formatDateTime(req.createdAt)}</span>
                  </div>

                  {req.task?.start_time && (
                    <div className="request-detail-item">
                      <FaClock className="detail-icon" />
                      <span>Starts: {formatDateTime(req.task.start_time)}</span>
                    </div>
                  )}
                </div>

                {req.message && (
                  <div className="request-message-box">
                    <div className="message-header">
                      <FaEnvelope className="message-icon" />
                      <span>Your message:</span>
                    </div>
                    <p className="message-text">{req.message}</p>
                  </div>
                )}
              </div>

              {req.task?.picture && (
                <div className="request-task-preview">
                  <img
                    src={req.task.picture}
                    alt={req.task.title}
                    className="preview-image"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyRequests;
