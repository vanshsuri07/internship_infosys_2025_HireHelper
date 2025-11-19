import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Restore login session on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("hirehelper_user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedUser !== "undefined" && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);

      // Cleanup corrupted values
      localStorage.removeItem("hirehelper_user");
      localStorage.removeItem("token");
    }
  }, []);

  // LOGIN FUNCTION — FIXED
  const login = (response) => {
    if (!response || !response.user || !response.token) {
      console.error("Invalid login response:", response);
      return;
    }

    const userData = response.user;
    const token = response.token;

    localStorage.setItem("hirehelper_user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
    setIsAuthenticated(true);

    navigate("/dashboard");
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("hirehelper_user");
    localStorage.removeItem("token");

    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
