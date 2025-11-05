import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link
import './login.css'; // We will create this
import welcomeBackground from '../assets/HireHelper_bg.jpeg'; 
import logoImage from '../assets/logo.png'; // Assuming you use the same logo

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    // Use "login-container" for this page
    <div className="login-container"> 
      
      {/* ===== LEFT HALF (LOGIN FORM) ===== */}
      <div className="form-side">
        <a href="#" className="back-link">← Back to website</a>
        
        <form>
          <h2>Log in to your account</h2>
          
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <p className="forgot-password">Forget Password?</p>

          <button type="submit" className="login-button">Login</button>
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
          
          {/* Logo at the top-right */}
          <div className="welcome-logo">
            Hire-a-Helper
            <img src={logoImage} alt="Hire-a-Helper logo" /> 
          </div>

          {/* Center content */}
          <div className="welcome-content">
            <h2>Welcome Back!</h2>
            <p>Log in to your Hire-a-Helper account</p>
          </div>

          {/* Bottom-center content */}
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