import { Routes, Route, Navigate } from "react-router-dom";

// Auth Components
import SignUp from "./pages/SignUp";
import Login from "./pages/login";
import VerifyEmail from "./pages/VerifyEmail";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Dashboard Layout
import DashboardLayout from "./components/DashboardLayout";

// Dashboard Pages
import Feed from "./pages/Feed";
import MyTasks from "./pages/MyTasks";
import Requests from "./pages/Requests";
import MyRequests from "./pages/MyRequests";
import AddTask from "./pages/AddTask";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Authentication Routes --- */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Set signup as the default page */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

        {/* --- Dashboard Routes --- */}
        {/* This is a Nested Route. DashboardLayout is the parent. */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* The pages below will render inside the <Outlet /> */}
          <Route path="feed" element={<Feed />} />
          <Route path="mytasks" element={<MyTasks />} />
          <Route path="requests" element={<Requests />} />
          <Route path="myrequests" element={<MyRequests />} />
          <Route path="addtask" element={<AddTask />} />
          <Route path="addtask/:taskId" element={<AddTask />} />
          <Route path="settings" element={<Settings />} />

          {/* This makes /dashboard/feed the default page */}
          <Route index element={<Navigate to="feed" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
