import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import "./Feed.css";
import { API_PATHS } from "../api/apipath";
import { FaClipboardList } from "react-icons/fa"; // Added for icons
import RequestModal from "../components/RequestModal";
import { useOutletContext } from "react-router-dom";
function FeedPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const { search } = useOutletContext();

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );
  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        // Added a tiny artificial delay to show off the skeleton loader smoothly
        // Remove the setTimeout in production if you want instant data
        const res = await axios.get(`${API_PATHS.TASK.GET_ALL_TASKS}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data.data || []);
      } catch (err) {
        console.error("Error fetching feed tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  const openRequestModal = (taskId) => {
    setActiveTask(taskId);
    setShowModal(true);
  };

  const sendRequest = async (message) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_PATHS.REQUESTS.CREATE_REQUEST}`,
        { taskId: activeTask, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Request sent!");
      setShowModal(false);
      return true; // Return true on success
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
      return false; // Return false on error
    }
  };

  // --- SKELETON LOADER COMPONENT (Internal) ---
  const SkeletonLoader = () => (
    <div className="skeleton-wrapper">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-line long"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line" style={{ marginTop: "1rem" }}></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1 className="feed-title">Community Tasks</h1>
        <p className="feed-subtitle">
          Discover opportunities to help your neighbors. Browse the tasks below
          and offer your assistance.
        </p>
      </div>

      <div className="feed-grid">
        {loading ? (
          <SkeletonLoader />
        ) : tasks.length === 0 ? (
          <div className="no-tasks-container" style={{ gridColumn: "1 / -1" }}>
            <FaClipboardList className="no-tasks-icon" />
            <h3 className="no-tasks-title">All Caught Up!</h3>
            <p className="no-tasks-text">
              There are no active tasks looking for help right now. <br />
              Check back later or post your own task!
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              showActions={true}
              onRequest={() => openRequestModal(task._id)}
            />
          ))
        )}
        {showModal && (
          <RequestModal
            onClose={() => setShowModal(false)}
            onSend={sendRequest}
          />
        )}
      </div>
    </div>
  );
}

export default FeedPage;
