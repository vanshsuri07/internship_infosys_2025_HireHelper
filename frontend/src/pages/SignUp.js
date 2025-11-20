import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apipath";
import "./SignUp.css";
import welcomeBackground from "../assets/HireHelper_bg.jpeg";
import logoImage from "../assets/logo.png";
import { IoArrowBack } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = { firstName, lastName, email, password };

    try {
      // --- API CALL ---
      const { data } = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        payload
      );

      console.log("Signup success:", data);
      navigate("/verify-email");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="signup-container">
      {/* LEFT SIDE */}
      <div
        className="welcome-side"
        style={{ backgroundImage: `url(${welcomeBackground})` }}
      >
        <div className="welcome-overlay">
          <div className="welcome-logo">
            <img src={logoImage} alt="Hire-a-Helper logo" />
            Hire-a-Helper
          </div>

          <div className="welcome-content">
            <h2>Hello Friend!</h2>
            <p>Join Hire-a-Helper community by creating an account</p>
          </div>

          <div className="login-prompt-left">
            <p>
              Already have an account? |{" "}
              <Link to="/login" className="login-hyperlink">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="form-side">
        <a href="/" className="back-link">
          <IoArrowBack className="back-icon" />
          Back to website
        </a>

        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          {/* Error display */}
          {error && <p className="error-message">{error}</p>}

          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

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
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                required
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

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
