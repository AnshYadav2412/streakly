import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';

const Projects = () => {
  const { user } = useAuth();
  const {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
  } = useProjects();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    color: '#f59e0b'
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const projectColors = [
    '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', 
    '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
  ];

  // Handle project operations
  const handleCreateProject = async () => {
    if (newProject.title.trim()) {
      const result = await createProject(newProject);
      if (result.success) {
        setNewProject({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium',
          color: '#f59e0b'
        });
        setShowProjectModal(false);
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
    setShowProjectModal(true);
  };

  const handleUpdateProject = async () => {
    if (editingProject && editingProject.title.trim()) {
      const result = await updateProject(editingProject._id, {
        title: editingProject.title,
        description: editingProject.description,
        dueDate: editingProject.dueDate,
        priority: editingProject.priority,
        color: editingProject.color
      });
      if (result.success) {
        setEditingProject(null);
        setShowProjectModal(false);
      }
    }
  };

  const handleToggleProject = async (project) => {
    await updateProject(project._id, { isCompleted: !project.isCompleted });
  };

  const handleDeleteProject = (project) => {
    setDeleteTarget({ type: 'project', id: project._id, name: project.title });
    setShowDeleteConfirm(true);
  };

  // Handle task operations
  const handleCreateTask = async () => {
    if (newTask.title.trim() && selectedProject) {
      const result = await addTask(selectedProject, newTask);
      if (result.success) {
        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium'
        });
        setShowTaskModal(false);
        setSelectedProject(null);
      }
    }
  };

  const handleEditTask = (project, task) => {
    setEditingTask({ ...task, projectId: project._id });
    setShowTaskModal(true);
  };

  const handleUpdateTask = async () => {
    if (editingTask && editingTask.title.trim()) {
      const result = await updateTask(editingTask.projectId, editingTask._id, {
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        priority: editingTask.priority
      });
      if (result.success) {
        setEditingTask(null);
        setShowTaskModal(false);
      }
    }
  };

  const handleToggleTask = async (projectId, task) => {
    await updateTask(projectId, task._id, { isCompleted: !task.isCompleted });
  };

  const handleDeleteTask = (projectId, task) => {
    setDeleteTarget({ 
      type: 'task', 
      projectId, 
      taskId: task._id, 
      name: task.title 
    });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget.type === 'project') {
      await deleteProject(deleteTarget.id);
    } else {
      await deleteTask(deleteTarget.projectId, deleteTarget.taskId);
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navbar />

      <div className="section">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Projects
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Organize your work into projects and track progress with tasks
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-2">
                {projects.length}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Total Projects</p>
            </div>
            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                {projects.filter(p => p.isCompleted).length}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Completed</p>
            </div>
            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {projects.reduce((total, p) => total + p.tasks.length, 0)}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
            </div>
            <div className="card-hover card-body p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                {projects.reduce((total, p) => total + p.tasks.filter(t => t.isCompleted).length, 0)}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Tasks Done</p>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="card">
            <div className="card-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Your Projects</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your projects and tasks</p>
              </div>
              <button 
                onClick={() => setShowProjectModal(true)}
                className="btn-primary btn-sm w-full sm:w-auto"
              >
                + New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="heading-4 mb-2">No projects yet</h3>
                <p className="text-body mb-4">Create your first project to get started!</p>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="btn-primary"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="card-body">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <div key={project._id} className="card border-2 hover:shadow-lg transition-all duration-200">
                      {/* Project Header */}
                      <div className="card-header" style={{ backgroundColor: project.color + '20' }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                onClick={() => handleToggleProject(project)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  project.isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 hover:border-amber-500'
                                }`}
                              >
                                {project.isCompleted && (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <h4 className={`font-bold text-gray-900 ${project.isCompleted ? 'line-through opacity-60' : ''}`}>
                                {project.title}
                              </h4>
                            </div>
                            {project.description && (
                              <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}>
                                {project.priority}
                              </span>
                              {project.dueDate && (
                                <span className="text-xs text-gray-500">
                                  Due: {new Date(project.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="px-6 py-2 bg-gray-50">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{project.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.completionPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                          <span>{project.completedTasksCount} of {project.tasks.length} tasks</span>
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Tasks</h5>
                          <button
                            onClick={() => {
                              setSelectedProject(project._id);
                              setShowTaskModal(true);
                            }}
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                          >
                            + Add Task
                          </button>
                        </div>

                        {project.tasks.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No tasks yet</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {project.tasks.map((task) => (
                              <div key={task._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                <button
                                  onClick={() => handleToggleTask(project._id, task)}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                    task.isCompleted
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-amber-500'
                                  }`}
                                >
                                  {task.isCompleted && (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium text-gray-900 truncate ${task.isCompleted ? 'line-through opacity-60' : ''}`}>
                                    {task.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                    {task.dueDate && (
                                      <span className="text-xs text-gray-500">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEditTask(project, task)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(project._id, task)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card glass max-w-md w-full">
            <div className="card-header flex items-center justify-between">
              <h3 className="heading-4">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button 
                onClick={() => {
                  setShowProjectModal(false);
                  setEditingProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={editingProject ? editingProject.title : newProject.title}
                  onChange={(e) => editingProject 
                    ? setEditingProject({ ...editingProject, title: e.target.value })
                    : setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Website Redesign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingProject ? editingProject.description : newProject.description}
                  onChange={(e) => editingProject 
                    ? setEditingProject({ ...editingProject, description: e.target.value })
                    : setNewProject({ ...newProject, description: e.target.value })
                  }
                  className="input"
                  rows="3"
                  placeholder="Project description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingProject ? editingProject.dueDate?.split('T')[0] : newProject.dueDate}
                    onChange={(e) => editingProject 
                      ? setEditingProject({ ...editingProject, dueDate: e.target.value })
                      : setNewProject({ ...newProject, dueDate: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editingProject ? editingProject.priority : newProject.priority}
                    onChange={(e) => editingProject 
                      ? setEditingProject({ ...editingProject, priority: e.target.value })
                      : setNewProject({ ...newProject, priority: e.target.value })
                    }
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {projectColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => editingProject 
                        ? setEditingProject({ ...editingProject, color })
                        : setNewProject({ ...newProject, color })
                      }
                      className={`w-8 h-8 rounded-full border-2 ${
                        (editingProject ? editingProject.color : newProject.color) === color
                          ? 'border-gray-900'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  className="btn-primary flex-1"
                >
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card glass max-w-md w-full">
            <div className="card-header flex items-center justify-between">
              <h3 className="heading-4">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              <button 
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                  setSelectedProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={(e) => editingTask 
                    ? setEditingTask({ ...editingTask, title: e.target.value })
                    : setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Design homepage mockup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingTask ? editingTask.description : newTask.description}
                  onChange={(e) => editingTask 
                    ? setEditingTask({ ...editingTask, description: e.target.value })
                    : setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="input"
                  rows="3"
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask ? editingTask.dueDate?.split('T')[0] : newTask.dueDate}
                    onChange={(e) => editingTask 
                      ? setEditingTask({ ...editingTask, dueDate: e.target.value })
                      : setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editingTask ? editingTask.priority : newTask.priority}
                    onChange={(e) => editingTask 
                      ? setEditingTask({ ...editingTask, priority: e.target.value })
                      : setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    setSelectedProject(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  className="btn-primary flex-1"
                >
                  {editingTask ? 'Update' : 'Create'} Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={`Delete ${deleteTarget?.type}?`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Projects;