import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-detect API URL based on current host
  const getApiUrl = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
      return `${import.meta.env.VITE_API_URL}/api/auth`;
    }
    
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:5000/api/auth';
    } else {
      // Use the same IP as the frontend for mobile testing
      return `http://${currentHost}:5000/api/auth`;
    }
  };

  const API_URL = getApiUrl();

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      const { data } = response.data;
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { data } = response.data;
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get(`${API_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Update user details
  const updateUser = async (name, email) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/updatedetails`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/updatepassword`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response.data;
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
