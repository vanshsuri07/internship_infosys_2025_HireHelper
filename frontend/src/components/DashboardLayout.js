import React from "react";
// 1. Import Outlet AND useLocation
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header"; // 2. Import Header
import "./Dashboard.css";

// 3. This object maps your URL paths to the correct titles
const pageTitles = {
  "/dashboard/feed": {
    title: "Feed",
    subtitle: "Find tasks that need help",
  },
  "/dashboard/mytasks": {
    title: "My Tasks",
    subtitle: "Manage all tasks created by you",
  },
  "/dashboard/requests": {
    title: "Requests",
    subtitle: "See requests from other users",
  },
  "/dashboard/myrequests": {
    title: "My Requests",
    subtitle: "Manage the tasks you have posted",
  },
  "/dashboard/addtask": {
    title: "Add Task",
    subtitle: "Create a new task for others to help with",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Manage your account",
  },
};

function DashboardLayout() {
  // 4. Get the current location (URL)
  const location = useLocation();

  // 5. Find the correct title and subtitle from our object
  const currentTitle = pageTitles[location.pathname]?.title || "Dashboard";
  const currentSubtitle =
    pageTitles[location.pathname]?.subtitle || "Welcome to Hire-a-Helper";

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        {/* 6. Render the Header here, passing the titles as props */}
        <Header title={currentTitle} subtitle={currentSubtitle} />

        {/* 7. The content area for your pages */}
        <div className="dashboard-content">
          <Outlet /> {/* Child pages (Feed, MyTasks) appear here */}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
