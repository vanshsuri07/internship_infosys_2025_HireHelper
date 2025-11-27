import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../api/apipath";
import "./TaskCard.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='200'%3E%3Crect width='700' height='200' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%23666'%3ENo Image Available%3C/svg%3E";

function TaskCard({
  task,
  onDelete,
  onRequest,
  showActions = true,
  isOwner = false,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [requestSent, setRequestSent] = useState(task.requestSent || false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDate = (isoString) => {
    if (!isoString) return "Not set";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      open: " #e91594", 
      "in-progress": "#d63384", 
      completed: "#4a0f60", 
      cancelled: "#EF4444", 
    };
    return colors[status] || "#9CA3AF";
  };

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
  };

  const getImageUrl = (picture) => {
    if (!picture || picture.trim() === "") return PLACEHOLDER_IMAGE;
    
    // Since we are sending Base64 now, it will start with "data:"
    if (picture.startsWith("data:") || picture.startsWith("http")) {
      return picture;
    }

    // Fallback for old images
    return `http://localhost:5000/${picture}`;
  };

  const imageUrl = getImageUrl(task.picture);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to update task status");
        navigate("/login");
        return;
      }
      const res = await axios.patch(
        API_PATHS.TASK.UPDATE_TASK(task._id),
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setCurrentStatus(newStatus);
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert(error.response?.data?.message || "Failed to update status.");
      setCurrentStatus(currentStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.delete(API_PATHS.TASK.DELETE_TASK(task._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        if (onDelete) onDelete(task._id);
      }
    } catch (error) {
      alert("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => navigate(`/dashboard/addtask/${task._id}`);

  const handleRequest = async () => {
    if (onRequest) {
      const success = await onRequest(task);
      if (success !== false) {
        setRequestSent(true);
      }
    } else {
      navigate(`/dashboard/tasks/${task._id}`);
    }
  };

  return (
    <div className="my-task-card">
      <div className="task-card-image-container">
        <img
          src={imageUrl}
          alt={task.title}
          className="task-card-image"
          onError={handleImageError}
        />

        <span
          className="task-card-status-badge"
          style={{ backgroundColor: getStatusColor(currentStatus) }}
        >
          {currentStatus.replace("-", " ")}
        </span>

        {task.category && (
          <span className="task-card-category-badge">{task.category}</span>
        )}
      </div>

      <div className="task-card-content">
        <h3 className="task-card-title" title={task.title}>
          {task.title}
        </h3>

        {task.user && (
          <div className="task-card-user">
            <FaUser />
            <span>{user ? `${user.firstName} ${user.lastName}` : "User"}</span>
          </div>
        )}

        <p className="task-card-description">
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </p>

        <div className="task-card-info">
          <div className="task-info-item">
            <FaMapMarkerAlt className="task-icon" />
            <span className="truncate">{task.location || "Remote"}</span>
          </div>

          <div className="task-info-item">
            <FaCalendarAlt className="task-icon" />
            <span>
              {formatDate(task.start_time)}
              {task.start_time && <span style={{ margin: "0 4px" }}>•</span>}
              {formatTime(task.start_time)}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="task-status-control">
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              className="status-dropdown"
              aria-label="Change Status"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {showActions && (
          <div className="task-card-actions">
            {isOwner ? (
              <>
                <button className="edit-button" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "..." : "Delete"}
                </button>
              </>
            ) : (
              onRequest && (
                <button
                  className={
                    requestSent ? "request-sent-button" : "btn-request"
                  }
                  onClick={handleRequest}
                  disabled={requestSent}
                >
                  {requestSent ? "Request Sent ✓" : "Request to Help"}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;