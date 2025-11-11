import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp'; 
import Login from './components/login'; 
import VerifyEmail from './components/VerifyEmail'; // <-- 1. IMPORT IT

import './App.css'; 

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- 2. ADD THE NEW ROUTE --- */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;