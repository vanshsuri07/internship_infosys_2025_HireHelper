import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AddTask.css'; // We will create this

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('');
  const [taskImage, setTaskImage] = useState(null);

  const { addTask } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const imageURL = taskImage ? URL.createObjectURL(taskImage) : null;
    
    // Create a new task object from our state
    const newTask = {
  id: Date.now(), // Simple unique ID
  title: title,
  description: description,
  location: location,
  startDate: startDate,
  startTime: startTime,
  endTime: endTime,
  category: category,
  image: imageURL, // <-- Use the new URL
};

    // Add the task to our global context
    addTask(newTask);

    // Navigate to the "My Tasks" page to see it
    navigate('/dashboard/mytasks');
  };

  return (
    <div className="add-task-container">
      <form className="add-task-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Furniture"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what help you need..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Delhi"
            required
          />
        </div>

        {/* --- Row for Start Date/Time --- */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="start-time">Start Time</label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* --- Row for End Date/Time (Optional) --- */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="end-date">End Date (Optional)</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">End Time (Optional)</label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Moving">Moving</option>
            <option value="Gardening">Gardening</option>
            <option value="Painting">Painting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Task Image (Optional)</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setTaskImage(e.target.files[0])}
            accept="image/png, image/jpeg, image/gif"
          />
        </div>

        <button type="submit" className="submit-task-button">
          Create Task
        </button>

      </form>
    </div>
  );
}

export default AddTask;