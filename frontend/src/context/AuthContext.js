import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // --- Add state for tasks ---
  const [tasks, setTasks] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('hirehelper_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('hirehelper_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setTasks([]); // Clear tasks on logout
    localStorage.removeItem('hirehelper_user');
    navigate('/login');
  };

  // --- Function to add a task to our list ---
  const addTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // The value to be passed to all children
  // --- Pass tasks and addTask ---
  const value = { user, login, logout, tasks, addTask };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};