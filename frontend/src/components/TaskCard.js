import React from 'react';
import './TaskCard.css'; 
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

// --- NEW: A placeholder image URL ---
// You can change this to any placeholder image you like
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/700x200.png?text=No+Image+Provided';

function TaskCard({ task }) {
  
  // A helper function to format time (e.g., 14:30 -> 2:30 PM)
  const formatTime = (time) => {
    if (!time) return '';
    let [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  };

  // --- NEW: Check if the image exists. If not, use the placeholder. ---
  const imageUrl = task.image ? task.image : PLACEHOLDER_IMAGE;

  return (
    <div className="my-task-card">
      
      {/* This 'img' tag is now safe */}
      <img src={imageUrl} alt={task.title} className="task-card-image" />
      
      <span className="task-card-category-badge">{task.category}</span>
      
      <div className="task-card-content">
        <h3>{task.title}</h3>
        <p className="task-card-description">{task.description}</p>
        
        <div className="task-card-info">
          <div>
            <FaMapMarkerAlt />
            <span>{task.location}</span>
          </div>
          <div>
            <FaCalendarAlt />
            <span>{task.startDate}</span>
          </div>
          <div>
            <FaClock />
            <span>{`${formatTime(task.startTime)} - ${formatTime(task.endTime)}`}</span>
          </div>
        </div>
        
        <div className="task-card-actions">
          <button className="view-button">View</button>
          <button className="delete-button">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;