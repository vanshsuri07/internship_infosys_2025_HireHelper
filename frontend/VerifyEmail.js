import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VerifyEmail.css'; // We will create this
import welcomeBackground from '../assets/HireHelper_bg.jpeg'; 
import logoImage from '../assets/logo.png';

function VerifyEmail() {
  const [code, setCode] = useState('');

  return (
    <div 
      className="verify-container"
      style={{ 
        backgroundImage: `url(${welcomeBackground})` 
      }}
    >
      <div className="verify-overlay">
        
        {/* Logo at the top-left */}
        <div className="verify-logo">
          <img src={logoImage} alt="Hire-a-Helper logo" /> 
          Hire-a-Helper
        </div>

        {/* The main white card */}
        <div className="verify-card">
          <div className="verify-icon">
            {/* This is a simple emoji placeholder for the icon */}
            <span>&#x2705;</span> 
          </div>

          <h2>Verify your email</h2>
          <p>Enter the 6-digit code sent to your email</p>

          <form>
            <div className="input-group">
              <label>Verification Code</label>
              <input 
                type="text" 
                placeholder="0 0 0 0 0 0"
                value={code}
                onChange={(e) => setCode(e.target.value)} 
                maxLength="6"
              />
            </div>
            
            {/* We'll make this <Link> look like a button */}
            <Link to="/feed" className="verify-button">Verify Code</Link>
          </form>

          <p className="resend-link">
            Didn't receive the code? <strong>Resend</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default VerifyEmail;