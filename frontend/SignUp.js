// --- 1. IMPORT useNavigate ---
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import './SignUp.css'; 
import welcomeBackground from '../assets/HireHelper_bg.jpeg'; 
import logoImage from '../assets/logo.png'; 

function SignUp() {
  // --- (State code is unchanged) ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // (We don't need the 'error' state for this version)
  // const [error, setError] = useState(null); 

  // --- 2. INITIALIZE useNavigate ---
  const navigate = useNavigate();

  // --- 3. THIS IS THE MODIFIED SUBMIT FUNCTION ---
  // It no longer tries to 'fetch' the backend.
  const handleSubmit = (event) => {
    // Prevent the form from doing a full page reload
    event.preventDefault(); 
    
    // Log to the console for testing
    console.log("Form submitted, bypassing backend and navigating...");
    
    // Navigate straight to the verify-email page
    navigate('/verify-email');
  };

  // --- JSX (The "HTML") ---
  return (
    <div className="signup-container">
      
      {/* ===== LEFT HALF (UNCHANGED) ===== */}
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
              Already have an account? | <Link to="/login" className="login-hyperlink">Login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT HALF (REGISTRATION FORM) ===== */}
      <div className="form-side">
        <a href="#" className="back-link">← Back to website</a>
        
        {/* --- 4. ADD onSubmit TO THE FORM --- */}
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          
          {/* (We don't need the {error && ...} line for this version) */}

          <div className="form-row">
            {/* First Name */}
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
            {/* Last Name */}
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
          {/* Phone Number */}
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
              required
            />
          </div>
          {/* Email */}
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
          {/* Password */}
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

          {/* --- 5. MAKE THE BUTTON type="submit" --- */}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default SignUp;