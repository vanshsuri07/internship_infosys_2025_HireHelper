import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dashboard.css";

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
    subtitle: "Manage the tasks you have requested",
  },
  "/dashboard/addtask": {
    title: "Add Task",
    subtitle: "Create a new task",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Manage your account",
  },
};

function DashboardLayout() {
  const location = useLocation();
  const [search, setSearch] = useState("");

  const currentTitle = pageTitles[location.pathname]?.title || "Dashboard";
  const currentSubtitle =
    pageTitles[location.pathname]?.subtitle || "Welcome to Hire-a-Helper";

  // Hide search bar on specific pages
  const hideSearchOn = ["/dashboard/settings", "/dashboard/addtask"];
  const showSearch = !hideSearchOn.includes(location.pathname);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <Header
          title={currentTitle}
          subtitle={currentSubtitle}
          onSearch={setSearch}
          showSearch={showSearch}
        />

        <div className="dashboard-content">
          <Outlet context={{ search }} />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
