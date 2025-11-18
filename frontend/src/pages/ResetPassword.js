import React, { useState } from 'react';
// Import useParams to read the "token" from the URL
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './PasswordReset.css'; // Re-use the same CSS
import welcomeBackground from '../assets/HireHelper_bg.jpeg';
import logoImage from '../assets/logo.png';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the token from the URL (e.g., /reset-password/THIS_IS_THE_TOKEN)
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // This is the URL from your backend routes
      const backendURL = 'http://localhost:5000/api/users/reset-password';
      
      // We send the new password AND the token
      const { data } = await axiosInstance.post(backendURL, { 
        password: password,
        token: token 
      });

      setMessage(data.message || "Password updated successfully! Redirecting to login...");
      
      // Wait 2 seconds, then send to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Change password</h2>

            {message && <p className="pr-message success">{message}</p>}
            {error && <p className="pr-message error">{error}</p>}

            <div className="pr-input-group">
              <label htmlFor="password">New password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pr-input-group">
              <label htmlFor="confirmPassword">Retype password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="pr-button" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;