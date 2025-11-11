import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// --- 1. IMPORT THE ROUTER ---
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* --- 2. WRAP YOUR <App /> --- */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);