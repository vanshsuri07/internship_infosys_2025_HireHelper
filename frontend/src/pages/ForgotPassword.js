import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance"; // Assuming you have this
import { Link } from "react-router-dom";
import "./PasswordReset.css"; // New CSS file
import welcomeBackground from "../assets/HireHelper_bg.jpeg";
import logoImage from "../assets/logo.png";
import { API_PATHS } from "../api/apipath";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // For success/error messages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await axiosInstance.post(
        `${API_PATHS.AUTH.FORGOT_PASSWORD}`,
        { email }
      );

      setMessage(
        data.message || "Password reset link sent! Please check your email."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="pr-container" // 'Password Reset Container'
      style={{ backgroundImage: `url(${welcomeBackground})` }}
    >
      <div className="pr-overlay">
        <div className="pr-logo">
          <img src={logoImage} alt="Hire-a-Helper logo" />
          Hire-a-Helper
        </div>

        <div className="pr-card">
          <form onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p className="pr-subtitle">
              Please enter your e-mail address. You will receive an <br></br>
              e-mail along with a link which can be used to reset your password.
            </p>

            {/* Show success or error messages */}
            {message && <p className="pr-message success">{message}</p>}
            {error && <p className="pr-message error">{error}</p>}

            <div className="pr-input-group">
              <label htmlFor="email"><br></br>Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="pr-button" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>

            <p className="pr-help-link">
              <br></br>I am not receiving password reset email.{" "}
              <Link to="/help">Need help?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
