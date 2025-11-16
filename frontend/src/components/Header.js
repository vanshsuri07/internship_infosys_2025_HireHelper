import React from 'react';
import './Dashboard.css'; // Use the same CSS file
import { FaSearch, FaBell } from 'react-icons/fa';

// This Header will be rendered BY each page (like Feed)
function Header({ title, subtitle }) {
  return (
    <div className="header">
      <div className="header-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      
      <div className="header-controls">
        <div className="header-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search Tasks..." />
        </div>
        <div className="header-notification">
          <FaBell />
        </div>
      </div>
    </div>
  );
}

export default Header;