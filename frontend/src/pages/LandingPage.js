import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// --- IMPORTS ---
import heroImage from '../assets/LandingPage.png'; 
import logoImage from '../assets/logo.png'; // <--- THIS WAS MISSING

function LandingPage() {
  return (
    <div className="landing-container">
      {/* --- Navbar --- */}
      <nav className="landing-nav">
        <div className="nav-logo">
          {/* Now 'logoImage' is defined and will work */}
         <img 
          src={logoImage} 
          alt="Hire-a-Helper" 
          style={{ height: '40px', width: 'auto' }} 
        />
          <h1>Hire-a-Helper</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><Link to="/login" className="nav-btn login-btn">Login</Link></li>
          <li><Link to="/signup" className="nav-btn signup-btn">Sign Up</Link></li>
        </ul>
      </nav>

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find the Right Help,<br />
            <span className="highlight-text">Right When You Need It.</span>
          </h1>
          <p className="hero-subtitle">
            Connect with trusted locals for moving, cleaning, gardening, and more. 
            Post a task or find one, it's that easy.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="hero-btn primary-btn">Get Started</Link>
            <Link to="/login" className="hero-btn secondary-btn">Find Tasks</Link>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImage} alt="People working together" className="hero-image" />
        </div>
      </header>

      {/* --- How it Works Section --- */}
      <section id="how-it-works" className="how-it-works-section">
        <h2 className="section-title">How it Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">1</div>
            <h3>Post a Task</h3>
            <p>Describe what you need help with, set a date, and pick a time.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">2</div>
            <h3>Review Requests</h3>
            <p>Get requests from trusted helpers and view their profiles and ratings.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">3</div>
            <h3>Get it Done</h3>
            <p>Choose the right person for the job and get your task completed.</p>
          </div>
        </div>
      </section>

      {/* --- Popular Categories Section --- */}
      <section id="categories" className="categories-section">
        <h2 className="section-title">Popular Categories</h2>
        <div className="categories-grid">
          <div className="category-card">🧹 Cleaning</div>
          <div className="category-card">📦 Moving</div>
          <div className="category-card">🌱 Gardening</div>
          <div className="category-card">🎨 Painting</div>
          <div className="category-card">🔨 Assembly</div>
          <div className="category-card">🎤 Event Organizer</div>
          <div className="category-card">💻 Tech Help</div>
          <div className="category-card">And many more...</div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="landing-footer">
        <p>© 2025 Hire-a-Helper. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;