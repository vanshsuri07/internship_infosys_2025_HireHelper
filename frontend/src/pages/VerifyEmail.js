import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_PATHS } from "../api/apipath";
import "./VerifyEmail.css";
import welcomeBackground from "../assets/HireHelper_bg.jpeg";
import logoImage from "../assets/logo.png";

function VerifyEmail() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, {
        otp: code,
      });

      console.log("Verification success:", data);
      navigate("/login");
    } catch (err) {
      console.error("Verification failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD);
      alert("Verification code resent!");
    } catch (err) {
      alert("Failed to resend code. Try again.");
    }
  };

  return (
    <div
      className="verify-container"
      style={{ backgroundImage: `url(${welcomeBackground})` }}
    >
      <div className="verify-overlay">
        <div className="verify-logo">
          <img src={logoImage} alt="Hire-a-Helper logo" />
          Hire-a-Helper
        </div>

        <div className="verify-card">
          <div className="verify-icon">
            <span>&#x2709;&#xfe0f;</span>
          </div>

          <h2>Verify your email</h2>
          <p>Enter the 6-digit code sent to your email</p>

          <form onSubmit={handleVerify}>
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="0 0 0 0 0 0"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="6"
                required
              />
            </div>

            <button type="submit" className="verify-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <p className="resend-link">
            Didn’t receive the code?{" "}
            <strong onClick={handleResend} style={{ cursor: "pointer" }}>
              Resend
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
