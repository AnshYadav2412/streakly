import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Auto-detect API URL based on current host
  const getApiUrl = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
      return `${import.meta.env.VITE_API_URL}/api/projects`;
    }
    
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:5000/api/projects';
    } else {
      // Use the same IP as the frontend for mobile testing
      return `http://${currentHost}:5000/api/projects`;
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

  // Fetch all projects
  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get(API_URL, getAuthHeader());
      setProjects(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const createProject = async (projectData) => {
    try {
      const response = await axios.post(API_URL, projectData, getAuthHeader());
      setProjects([response.data.data, ...projects]);
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      setError(message);
      return { success: false, message };
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, projectData, getAuthHeader());
      setProjects(projects.map(p => p._id === id ? response.data.data : p));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project';
      setError(message);
      return { success: false, message };
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      setProjects(projects.filter(p => p._id !== id));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project';
      setError(message);
      return { success: false, message };
    }
  };

  // Add task to project
  const addTask = async (projectId, taskData) => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/tasks`, taskData, getAuthHeader());
      setProjects(projects.map(p => p._id === projectId ? response.data.data : p));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add task';
      setError(message);
      return { success: false, message };
    }
  };

  // Update task
  const updateTask = async (projectId, taskId, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${projectId}/tasks/${taskId}`, taskData, getAuthHeader());
      setProjects(projects.map(p => p._id === projectId ? response.data.data : p));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      setError(message);
      return { success: false, message };
    }
  };

  // Delete task
  const deleteTask = async (projectId, taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/${projectId}/tasks/${taskId}`, getAuthHeader());
      setProjects(projects.map(p => p._id === projectId ? response.data.data : p));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      setError(message);
      return { success: false, message };
    }
  };

  // Load projects when user logs in
  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};