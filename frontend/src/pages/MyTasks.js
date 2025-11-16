import React from 'react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import './MyTasks.css'; // We'll create this

function MyTasks() {
  // 1. Get the list of tasks from our "global wallet"
  const { tasks } = useAuth();

  console.log("Tasks in MyTasks page:", tasks);
  
  return (
    <div className="my-tasks-container">
      {/* Your DashboardLayout will show the Header with the title
        "My Tasks" and "Manage your posted tasks"
      */}
      
      <div className="my-tasks-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <p>You have not created any tasks yet. Click "+ Add Task" to get started!</p>
        )}
      </div>
    </div>
  );
}

export default MyTasks;