import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TimeContext = createContext();

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};

export const TimeProvider = ({ children }) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [runningTimer, setRunningTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Auto-detect API URL based on current host
  const getApiUrl = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
      return `${import.meta.env.VITE_API_URL}/api/time`;
    }
    
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:5000/api/time';
    } else {
      return `http://${currentHost}:5000/api/time`;
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

  // Fetch all time entries
  const fetchTimeEntries = async (filters = {}) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}?${params}`, getAuthHeader());
      setTimeEntries(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch time entries:', error);
      setError(error.response?.data?.message || 'Failed to fetch time entries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async (period = 'week') => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${API_URL}/stats?period=${period}`, getAuthHeader());
      setStats(response.data.data);
      setRunningTimer(response.data.data.runningTimer);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Create time entry (start timer)
  const createTimeEntry = async (entryData) => {
    try {
      const response = await axios.post(API_URL, entryData, getAuthHeader());
      setTimeEntries([response.data.data, ...timeEntries]);
      setRunningTimer(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create time entry';
      setError(message);
      return { success: false, message };
    }
  };

  // Update time entry
  const updateTimeEntry = async (id, entryData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, entryData, getAuthHeader());
      setTimeEntries(timeEntries.map(t => t._id === id ? response.data.data : t));
      
      // Update running timer if this entry was running
      if (runningTimer && runningTimer._id === id) {
        setRunningTimer(response.data.data.isRunning ? response.data.data : null);
      }
      
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update time entry';
      setError(message);
      return { success: false, message };
    }
  };

  // Start timer
  const startTimer = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/start`, {}, getAuthHeader());
      setTimeEntries(timeEntries.map(t => t._id === id ? response.data.data : t));
      setRunningTimer(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start timer';
      setError(message);
      return { success: false, message };
    }
  };

  // Stop timer
  const stopTimer = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/stop`, {}, getAuthHeader());
      setTimeEntries(timeEntries.map(t => t._id === id ? response.data.data : t));
      setRunningTimer(null);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to stop timer';
      setError(message);
      return { success: false, message };
    }
  };

  // Delete time entry
  const deleteTimeEntry = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      setTimeEntries(timeEntries.filter(t => t._id !== id));
      
      // Clear running timer if this entry was running
      if (runningTimer && runningTimer._id === id) {
        setRunningTimer(null);
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete time entry';
      setError(message);
      return { success: false, message };
    }
  };

  // Format duration helper
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Load data when user logs in
  useEffect(() => {
    if (user) {
      fetchTimeEntries();
      fetchStats();
    } else {
      setTimeEntries([]);
      setStats(null);
      setRunningTimer(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    timeEntries,
    stats,
    runningTimer,
    loading,
    error,
    fetchTimeEntries,
    fetchStats,
    createTimeEntry,
    updateTimeEntry,
    startTimer,
    stopTimer,
    deleteTimeEntry,
    formatDuration,
  };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};