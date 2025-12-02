import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom"; // 1. Import useOutletContext
import { API_PATHS } from "../api/apipath";
import TaskCard from "../components/TaskCard";
import "./MyTasks.css";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // 2. Get Search Term
  const context = useOutletContext();
  const search = context ? context.search : "";

  // 3. Filter Logic
  // Note: This filters the *current page* of tasks
  const filteredTasks = tasks.filter((task) => {
    const term = search.toLowerCase();
    const title = task.title ? task.title.toLowerCase() : "";
    const location = task.location ? task.location.toLowerCase() : "";
    return title.includes(term) || location.includes(term);
  });

  const fetchMyTasks = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (status) {
        params.append("status", status);
      }

      const res = await axios.get(
        `${API_PATHS.TASK.GET_MY_TASKS}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setTasks(res.data.data || []);
        setPagination(res.data.pagination || null);
      }
    } catch (error) {
      console.error("Error fetching my tasks:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load tasks. Please try again."
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTaskDelete = () => {
    fetchMyTasks(currentPage, statusFilter);
  };

  if (loading) {
    return (
      <div className="my-tasks-container">
        <p className="loading">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tasks-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchMyTasks(currentPage, statusFilter)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-tasks-container">
      <div className="tasks-toolbar">
        <select 
          className="filter-dropdown"
          value={statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="">All Tasks</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          className="add-task-button"
          onClick={() => navigate("/dashboard/addtask")}
        >
          + Add Task
        </button>
      </div>

      <div className="my-tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleTaskDelete}
              isOwner={true}
            />
          ))
        ) : (
          <div className="no-tasks">
            <p>
              {search 
                ? "No tasks match your search." 
                : "You haven't created any tasks yet."}
            </p>
            {!search && (
              <button
                className="create-first-task-btn"
                onClick={() => navigate("/dashboard/addtask")}
              >
                + Create Your First Task
              </button>
            )}
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages} (
            {pagination.totalTasks} tasks)
          </span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default MyTasks;