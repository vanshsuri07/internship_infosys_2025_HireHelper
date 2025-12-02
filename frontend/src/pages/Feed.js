import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import "./Feed.css";
import { API_PATHS } from "../api/apipath";
import { FaClipboardList } from "react-icons/fa";
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

      // Update the task in the tasks array to mark requestSent as true
      setTasks(
        tasks.map((task) =>
          task._id === activeTask ? { ...task, requestSent: true } : task
        )
      );

      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error sending request";

      // Check if the error is because request was already sent
      if (
        errorMessage.toLowerCase().includes("already sent") ||
        errorMessage.toLowerCase().includes("already exists")
      ) {
        // Update the state to reflect that request was already sent
        setTasks(
          tasks.map((task) =>
            task._id === activeTask ? { ...task, requestSent: true } : task
          )
        );
        setShowModal(false);
        alert(errorMessage);
        return true; // Return true because the request exists
      }

      alert(errorMessage);
      return false;
    }
  };

  const handleRequestClick = async (task) => {
    openRequestModal(task._id);
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
              onRequest={() => handleRequestClick(task)}
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
