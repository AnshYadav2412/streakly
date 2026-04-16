import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Auto-detect API URL based on current host
  const getApiUrl = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
      return `${import.meta.env.VITE_API_URL}/api/habits`;
    }
    
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:5000/api/habits';
    } else {
      // Use the same IP as the frontend for mobile testing
      return `http://${currentHost}:5000/api/habits`;
    }
  };

  const API_URL = getApiUrl();

  // Get auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch all habits
  const fetchHabits = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get(API_URL, getAuthHeader());
      setHabits(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      setError(error.response?.data?.message || 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${API_URL}/analytics`, getAuthHeader());
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // Create habit
  const createHabit = async (habitData) => {
    try {
      const response = await axios.post(API_URL, habitData, getAuthHeader());
      setHabits([...habits, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create habit';
      setError(message);
      return { success: false, message };
    }
  };

  // Update habit
  const updateHabit = async (id, habitData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, habitData, getAuthHeader());
      setHabits(habits.map(h => h._id === id ? response.data.data : h));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update habit';
      setError(message);
      return { success: false, message };
    }
  };

  // Toggle habit completion
  const toggleHabitCompletion = async (id, dateKey) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/toggle`,
        { dateKey },
        getAuthHeader()
      );
      setHabits(habits.map(h => h._id === id ? response.data.data : h));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle habit';
      setError(message);
      return { success: false, message };
    }
  };

  // Delete habit
  const deleteHabit = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      setHabits(habits.filter(h => h._id !== id));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete habit';
      setError(message);
      return { success: false, message };
    }
  };

  // Load habits when user logs in
  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchAnalytics();
    } else {
      setHabits([]);
      setAnalytics(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    habits,
    analytics,
    loading,
    error,
    fetchHabits,
    fetchAnalytics,
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    deleteHabit,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
