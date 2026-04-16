import React, { useState, useEffect } from 'react';
import { useTime } from '../context/TimeContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';

const TimeTracker = () => {
  const { user } = useAuth();
  const {
    timeEntries,
    stats,
    runningTimer,
    loading,
    createTimeEntry,
    updateTimeEntry,
    startTimer,
    stopTimer,
    deleteTimeEntry,
    formatDuration,
    fetchStats,
  } = useTime();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [newTask, setNewTask] = useState({
    task: '',
    description: '',
    category: 'work',
    tags: []
  });

  const categories = [
    { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800' },
    { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
    { value: 'learning', label: 'Learning', color: 'bg-purple-100 text-purple-800' },
    { value: 'exercise', label: 'Exercise', color: 'bg-red-100 text-red-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  // Update current time for running timer
  useEffect(() => {
    let interval;
    if (runningTimer) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - new Date(runningTimer.startTime)) / 1000);
        setCurrentTime(runningTimer.duration + elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningTimer]);

  // Handle task operations
  const handleCreateTask = async () => {
    if (newTask.task.trim()) {
      const result = await createTimeEntry(newTask);
      if (result.success) {
        setNewTask({
          task: '',
          description: '',
          category: 'work',
          tags: []
        });
        setShowTaskModal(false);
        fetchStats();
      }
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry({ ...entry });
    setShowTaskModal(true);
  };

  const handleUpdateEntry = async () => {
    if (editingEntry && editingEntry.task.trim()) {
      const result = await updateTimeEntry(editingEntry._id, {
        task: editingEntry.task,
        description: editingEntry.description,
        category: editingEntry.category,
        tags: editingEntry.tags
      });
      if (result.success) {
        setEditingEntry(null);
        setShowTaskModal(false);
      }
    }
  };

  const handleStartTimer = async (entryId) => {
    await startTimer(entryId);
    fetchStats();
  };

  const handleStopTimer = async (entryId) => {
    await stopTimer(entryId);
    fetchStats();
  };

  const handleCompleteTask = async (entry) => {
    // Stop timer if running
    if (entry.isRunning) {
      await stopTimer(entry._id);
    }
    
    // Mark as completed
    await updateTimeEntry(entry._id, { isCompleted: true });
    fetchStats();
  };

  const handleDeleteEntry = (entry) => {
    setDeleteTarget(entry);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteTimeEntry(deleteTarget._id);
      fetchStats();
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const getCategoryStyle = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading time tracker...</p>
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
              Time Tracker
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Track time spent on tasks and boost your productivity
            </p>
          </div>

          {/* Running Timer Display */}
          {runningTimer && (
            <div className="card border-2 border-amber-500 mb-8">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{runningTimer.task}</h3>
                      <p className="text-sm text-gray-600">{runningTimer.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-amber-600 font-mono">
                        {formatDuration(currentTime)}
                      </div>
                      <div className="text-sm text-gray-500">Running</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStopTimer(runningTimer._id)}
                        className="btn-outline btn-sm"
                      >
                        ⏸ Stop
                      </button>
                      <button
                        onClick={() => handleCompleteTask(runningTimer)}
                        className="btn-primary btn-sm"
                      >
                        ✓ Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card-hover card-body p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-2">
                  {stats.totalEntries}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
              </div>
              <div className="card-hover card-body p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                  {stats.completedEntries}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Completed</p>
              </div>
              <div className="card-hover card-body p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                  {formatDuration(stats.totalDuration)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Total Time</p>
              </div>
              <div className="card-hover card-body p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                  {formatDuration(stats.avgDuration)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Avg per Task</p>
              </div>
            </div>
          )}

          {/* Time Entries */}
          <div className="card">
            <div className="card-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Time Entries</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Track and manage your tasks</p>
              </div>
              <button 
                onClick={() => setShowTaskModal(true)}
                className="btn-primary btn-sm w-full sm:w-auto"
                disabled={!!runningTimer}
              >
                + New Task
              </button>
            </div>

            {timeEntries.length === 0 ? (
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">⏱️</div>
                <h3 className="heading-4 mb-2">No time entries yet</h3>
                <p className="text-body mb-4">Start tracking your first task!</p>
                <button 
                  onClick={() => setShowTaskModal(true)}
                  className="btn-primary"
                  disabled={!!runningTimer}
                >
                  Start Tracking
                </button>
              </div>
            ) : (
              <div className="card-body">
                <div className="space-y-4">
                  {timeEntries.map((entry) => (
                    <div key={entry._id} className={`p-4 rounded-lg border-2 transition-all ${
                      entry.isRunning 
                        ? 'border-amber-500 bg-amber-50' 
                        : entry.isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className={`font-bold text-lg ${entry.isCompleted ? 'line-through opacity-60' : ''}`}>
                              {entry.task}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(entry.category)}`}>
                              {categories.find(c => c.value === entry.category)?.label}
                            </span>
                            {entry.isRunning && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                Running
                              </span>
                            )}
                            {entry.isCompleted && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          {entry.description && (
                            <p className="text-gray-600 mb-2">{entry.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Duration: {formatDuration(entry.currentDuration || entry.duration)}</span>
                            <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                            {entry.completedAt && (
                              <span>Completed: {new Date(entry.completedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!entry.isCompleted && (
                            <>
                              {entry.isRunning ? (
                                <button
                                  onClick={() => handleStopTimer(entry._id)}
                                  className="btn-outline btn-sm"
                                >
                                  ⏸ Stop
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartTimer(entry._id)}
                                  className="btn-primary btn-sm"
                                  disabled={!!runningTimer}
                                >
                                  ▶ Start
                                </button>
                              )}
                              <button
                                onClick={() => handleCompleteTask(entry)}
                                className="btn-primary btn-sm"
                              >
                                ✓ Complete
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card glass max-w-md w-full">
            <div className="card-header flex items-center justify-between">
              <h3 className="heading-4">{editingEntry ? 'Edit Task' : 'New Task'}</h3>
              <button 
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingEntry(null);
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
                  Task Name
                </label>
                <input
                  type="text"
                  value={editingEntry ? editingEntry.task : newTask.task}
                  onChange={(e) => editingEntry 
                    ? setEditingEntry({ ...editingEntry, task: e.target.value })
                    : setNewTask({ ...newTask, task: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Write project proposal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingEntry ? editingEntry.description : newTask.description}
                  onChange={(e) => editingEntry 
                    ? setEditingEntry({ ...editingEntry, description: e.target.value })
                    : setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="input"
                  rows="3"
                  placeholder="Task description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editingEntry ? editingEntry.category : newTask.category}
                  onChange={(e) => editingEntry 
                    ? setEditingEntry({ ...editingEntry, category: e.target.value })
                    : setNewTask({ ...newTask, category: e.target.value })
                  }
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingEntry(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={editingEntry ? handleUpdateEntry : handleCreateTask}
                  className="btn-primary flex-1"
                >
                  {editingEntry ? 'Update' : 'Start'} Task
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
        title="Delete Time Entry?"
        message={`Are you sure you want to delete "${deleteTarget?.task}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default TimeTracker;