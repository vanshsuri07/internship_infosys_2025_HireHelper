import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../api/apipath";
import "./TaskCard.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/700x200?text=No+Image&font=roboto";

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

  // Sync requestSent from task prop whenever it changes
  useEffect(() => {
    setRequestSent(task.requestSent || false);
  }, [task.requestSent]);

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
  const getTaskOwnerName = (request) => {
    const taskUser = request.task?.user;
    if (!taskUser) return "Unknown Owner";

    const firstName = taskUser.firstName || "";
    const lastName = taskUser.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Owner";
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
      const res = await axiosInstance.patch(
        API_PATHS.TASK.UPDATE_TASK(task._id),
        { status: newStatus }
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
      const res = await axiosInstance.delete(
        API_PATHS.TASK.DELETE_TASK(task._id)
      );
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
      try {
        await onRequest(task);
        // Don't set requestSent here - let the parent component update the task prop
        // which will trigger the useEffect above to update requestSent
      } catch (error) {
        console.error("Request error:", error);
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
            <span>
              {task.user.name ||
                `${task.user.firstName || ""} ${
                  task.user.lastName || ""
                }`.trim() ||
                task.user.email ||
                "Task Owner"}
            </span>
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
            </select>
          </div>
        )}

        {showActions && (
          <div className="task-card-actions">
            {isOwner ? (
              //  OWNER SEES EDIT + DELETE
              <>
                <button className="edit-button" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : (
              //  NORMAL USER SEES REQUEST BUTTON
              onRequest && (
                <button
                  className={
                    requestSent
                      ? "request-sent-button"
                      : currentStatus !== "open"
                      ? "btn-disabled"
                      : "btn-request"
                  }
                  onClick={handleRequest}
                  disabled={requestSent || currentStatus !== "open"}
                >
                  {requestSent
                    ? "Request Sent ✓"
                    : currentStatus === "completed"
                    ? "Completed"
                    : currentStatus === "in-progress"
                    ? "In Progress"
                    : "Request to Help"}
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
