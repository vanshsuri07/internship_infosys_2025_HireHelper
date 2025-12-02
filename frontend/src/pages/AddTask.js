import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_PATHS } from "../api/apipath";
import "./AddTask.css";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("");

  // --- THESE ARE THE MISSING STATES ---
  const [taskImage, setTaskImage] = useState(null); // Stores the file object
  const [imagePreview, setImagePreview] = useState(""); // Stores the URL/Base64 for preview
  // ------------------------------------

  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { taskId } = useParams();

  useEffect(() => {
    if (taskId) {
      setIsEditMode(true);
      fetchTaskDetails(taskId);
    }
  }, [taskId]);

  // Helper: Convert File to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // --- IMAGE HANDLING WITH SIZE CHECK ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // 1. Check Size (Limit to 2MB)
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert("File is too large. Please select an image under 2MB.");
        e.target.value = ""; // Clear input
        setTaskImage(null);
        setImagePreview("");
        return;
      }

      // 2. Set the file state
      setTaskImage(file);

      // 3. Create Base64 for Preview and Sending
      try {
        const base64 = await convertToBase64(file);
        setImagePreview(base64);
      } catch (err) {
        console.error("Error converting image:", err);
      }
    }
  };

  const fetchTaskDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(API_PATHS.TASK.GET_TASK_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const task = res.data.data || res.data.task || res.data;

      setTitle(task.title || "");
      setDescription(task.description || "");
      setLocation(task.location || "");
      setCategory(task.category || "Other");

      if (task.start_time) {
        const startDateTime = new Date(task.start_time);
        setStartDate(startDateTime.toISOString().split("T")[0]);
        setStartTime(
          startDateTime.toTimeString().split(" ")[0].substring(0, 5)
        );
      }

      if (task.end_time) {
        const endDateTime = new Date(task.end_time);
        setEndDate(endDateTime.toISOString().split("T")[0]);
        setEndTime(endDateTime.toTimeString().split(" ")[0].substring(0, 5));
      }

      // If editing, show existing image
      if (task.picture) {
        setImagePreview(task.picture);
      }
    } catch (error) {
      console.error("Fetch task error:", error);
      alert("Failed to fetch task details");
      navigate("/dashboard/mytasks");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const start_time = `${startDate}T${startTime}:00`;

      // Only create end_time if BOTH endDate AND endTime are provided
      const end_time = endDate && endTime ? `${endDate}T${endTime}:00` : null;

      // Create FormData instead of regular object
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("start_time", start_time);
      if (end_time) {
        formData.append("end_time", end_time);
      }
      formData.append("category", category);

      // Only add picture if a new one is selected
      if (taskImage) {
        formData.append("picture", taskImage);
      }

      // Only include status for new tasks
      if (!isEditMode) {
        formData.append("status", "open");
      }

      let res;
      if (isEditMode) {
        // Update existing task
        res = await axios.put(API_PATHS.TASK.UPDATE_TASK(taskId), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new task
        res = await axios.post(API_PATHS.TASK.CREATE_TASK, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (res.data.success) {
        alert(isEditMode ? "Task updated!" : "Task created!");
        navigate("/dashboard/mytasks");
      }
    } catch (error) {
      console.error("Task operation error:", error);
      if (error.response && error.response.status === 413) {
        alert(
          "The image is still too large for the server. Try a smaller one."
        );
      } else {
        alert(error.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-container">
      <form className="add-task-form" onSubmit={handleSubmit}>
        <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>

        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
          <div className="form-group">
            <label>End Time (Optional)</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Moving">Moving</option>
            <option value="Gardening">Gardening</option>
            <option value="Painting">Painting</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Delivery">Delivery</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Task Image (Max 2MB)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && !taskImage && (
            <div className="image-preview">
              <p>Preview:</p>
              <img
                src={imagePreview}
                alt="Current task"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
          {taskImage && (
            <div className="image-preview">
              <p>New image:</p>
              <img
                src={URL.createObjectURL(taskImage)}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="submit-task-button" disabled={loading}>
          {loading ? "Saving..." : isEditMode ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export default AddTask;
