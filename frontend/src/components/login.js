import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axiosInstance from '../api/axiosInstance'; 
import { API_PATHS } from '../api/apipath'; 
import './login.css'; 
import welcomeBackground from '../assets/HireHelper_bg.jpeg'; 
import logoImage from '../assets/logo.png'; 
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 
  const { login } = useAuth(); // Get the login function

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the login endpoint
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", data); 
      
      // Save the user to your "global wallet" (AuthContext)
      login(data.user); 

      // On success, navigate to the dashboard
      navigate("/dashboard/feed"); 

    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // --- THIS IS THE CORRECT, FULL RETURN STATEMENT ---
  return (
    <div className="login-container"> 
      
      {/* ===== LEFT HALF (LOGIN FORM) ===== */}
      <div className="form-side">
        <a href="#" className="back-link">← Back to website</a>
        
        <form onSubmit={handleSubmit}>
          <h2>Log in to your account</h2>

          {/* Display error messages */}
          {error && <p className="form-error">{error}</p>} 
          
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
          
          <Link to="/forgot-password" className="forgot-password">Forget Password?</Link>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* ===== RIGHT HALF (WELCOME BACK) ===== */}
      <div 
        className="welcome-side"
        style={{ 
          backgroundImage: `url(${welcomeBackground})` 
        }}
      >
        <div className="welcome-overlay">
          <div className="welcome-logo">
            Hire-a-Helper
            <img src={logoImage} alt="Hire-a-Helper logo" /> 
          </div>
          <div className="welcome-content">
            <h2>Welcome Back!</h2>
            <p>Log in to your Hire-a-Helper account</p>
          </div>
          <div className="signup-prompt">
            <p>
              Don't have an account? | <Link to="/signup" className="signup-hyperlink">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;