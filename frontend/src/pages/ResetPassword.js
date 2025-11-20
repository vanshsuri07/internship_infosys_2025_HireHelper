import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./PasswordReset.css";
import welcomeBackground from "../assets/HireHelper_bg.jpeg";
import logoImage from "../assets/logo.png";
import { API_PATHS } from "../api/apipath";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. No token provided.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        newPassword: password,
        token: token,
      });

      setMessage(
        data.message || "Password updated successfully! Redirecting to login..."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.message ||
          "Invalid or expired reset link. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="pr-container"
        style={{ backgroundImage: `url(${welcomeBackground})` }}
      >
        <div className="pr-overlay">
          <div className="pr-logo">
            <img src={logoImage} alt="Hire-a-Helper logo" />
            Hire-a-Helper
          </div>
          <div className="pr-card">
            <h2>Invalid Reset Link</h2>
            <p className="pr-message error">No token provided in the URL.</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="pr-button"
            >
              Request New Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pr-container"
      style={{ backgroundImage: `url(${welcomeBackground})` }}
    >
      <div className="pr-overlay">
        <div className="pr-logo">
          <img src={logoImage} alt="Hire-a-Helper logo" />
          Hire-a-Helper
        </div>

        <div className="pr-card">
          <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>

            {message && <p className="pr-message success">{message}</p>}
            {error && <p className="pr-message error">{error}</p>}

            <div className="pr-input-group">
              <label htmlFor="password">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="pr-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype new password"
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="pr-button" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <a
                href="/forgot-password"
                style={{
                  color: "#4CAF50",
                  textDecoration: "none",
                  marginRight: "15px",
                }}
              >
                Request New Link
              </a>
              <a
                href="/login"
                style={{ color: "#4CAF50", textDecoration: "none" }}
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
