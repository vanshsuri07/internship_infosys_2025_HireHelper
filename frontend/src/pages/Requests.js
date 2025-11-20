import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Requests.css";
import { API_PATHS } from "../api/apipath";

function Requests() {
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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

  const updateStatus = async (reqId, newStatus) => {
    try {
      await axios.patch(
        `${API_PATHS.REQUESTS.UPDATE_REQUEST_STATUS(reqId)}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();
      alert(`Request ${newStatus} successfully`);
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  if (loading) return <p className="loading">Loading requests...</p>;

  return (
    <div className="requests-container">
      <h2 className="section-title">Incoming Requests</h2>

      {received.length === 0 ? (
        <p className="empty-text">No one has requested your tasks yet.</p>
      ) : (
        <div className="req-list">
          {received.map((req) => (
            <div key={req._id} className="req-card">
              {/* Left side: Avatar */}
              <div className="req-avatar">
                <div className="avatar-circle">
                  {req.requester.email[0].toUpperCase()}
                </div>
              </div>

              {/* Main content */}
              <div className="req-content">
                <div className="req-header">
                  <h3 className="req-name">
                    {req.requester.firstName} {req.requester.lastName}
                  </h3>
                </div>

                <span className="req-message">{req.message}</span>

                {/* Task detail box */}
                <div className="task-box">
                  <p>
                    <strong>Requesting for:</strong>
                  </p>
                  <p>{req.task.title}</p>
                </div>

                {/* Footer row */}
                <div className="req-footer">
                  <span className="req-time">
                    • {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {req.status === "pending" && (
                <div className="req-actions">
                  <button
                    className="accept-btn"
                    onClick={() => updateStatus(req._id, "accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="decline-btn"
                    onClick={() => updateStatus(req._id, "rejected")}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;
