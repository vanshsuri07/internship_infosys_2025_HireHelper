import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apipath";
import "./login.css";
import welcomeBackground from "../assets/HireHelper_bg.jpeg";
import logoImage from "../assets/logo.png";
import { IoArrowBack } from "react-icons/io5";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // --- API CALL ---
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login success:", data);

      // ✅ Store token in localStorage (for authentication persistence)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ Optionally store user info
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect user after login
      navigate("/feed"); // or dashboard/home
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ===== LEFT HALF (LOGIN FORM) ===== */}
      <div className="form-side">
        <a href="/" className="back-link">
          <IoArrowBack className="back-icon" />
          Back to website
        </a>
        <form onSubmit={handleSubmit}>
          <h2>Log in to your account</h2>

          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="forgot-password">Forgot Password?</p>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* ===== RIGHT HALF (WELCOME SIDE) ===== */}
      <div
        className="welcome-side"
        style={{ backgroundImage: `url(${welcomeBackground})` }}
      >
        <div className="welcome-overlay">
          <div className="welcome-logo">
            <img src={logoImage} alt="Hire-a-Helper logo" /> Hire-a-Helper
          </div>

          <div className="welcome-content">
            <h2>Welcome Back!</h2>
            <p>Log in to your Hire-a-Helper account</p>
          </div>

          <div className="signup-prompt">
            <p>
              Don't have an account? |{" "}
              <Link to="/signup" className="signup-hyperlink">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
