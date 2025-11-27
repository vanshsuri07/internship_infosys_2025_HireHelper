import React from 'react';
import './RequestCard.css';
import { FaStar, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

function RequestCard({ request, onAccept, onDecline }) {
  const { sender, task, message, createdAt } = request;

  // Helper to format date/time (e.g., "Jul 4, 4:00 PM")
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
    });
  };

  return (
    <div className="request-card">
      {/* --- Left: Avatar --- */}
      <div className="req-avatar-section">
        {sender?.picture ? (
          <img src={sender.picture} alt={sender.name} className="req-avatar-img" />
        ) : (
          <div className="req-avatar-placeholder">
            {sender?.name ? sender.name.charAt(0).toUpperCase() : <FaUser />}
          </div>
        )}
      </div>

      {/* --- Middle: Content --- */}
      <div className="req-content-section">
        <div className="req-header">
          <h3 className="req-name">{sender?.name || 'Unknown User'}</h3>
          <div className="req-rating">
            <FaStar className="star-icon" />
            <span className="rating-val">4.8</span> {/* Mock rating for now */}
            <span className="review-count">(18 reviews)</span>
          </div>
        </div>

        <p className="req-message">
          {message || "I'd like to help with this task!"}
        </p>

        {/* The "Requesting for" Grey Box */}
        <div className="req-task-box">
          <span className="req-task-label">Requesting for:</span>
          <span className="req-task-title">{task?.title || 'Unknown Task'}</span>
        </div>

        <div className="req-meta">
          <div className="req-meta-item">
            <FaClock /> <span>{formatTime(createdAt)}</span>
          </div>
          <div className="req-meta-item">
            <FaMapMarkerAlt /> <span>Within 5 miles</span> {/* Mock distance */}
          </div>
        </div>
      </div>

      {/* --- Right: Buttons --- */}
      <div className="req-actions-section">
        <button 
          className="req-btn accept-btn" 
          onClick={() => onAccept(request._id)}
        >
          Accept
        </button>
        <button 
          className="req-btn decline-btn"
          onClick={() => onDecline(request._id)}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export default RequestCard;