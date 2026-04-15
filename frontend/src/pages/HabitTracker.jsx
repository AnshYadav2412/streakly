import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TimePicker from '../components/TimePicker';
import ConfirmDialog from '../components/ConfirmDialog';

const HabitTracker = () => {
  const { user } = useAuth();
  const {
    habits,
    loading,
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    deleteHabit,
    fetchAnalytics,
  } = useHabits();

  // Get current week dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Start from Monday
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + diff + i);
      weekDates.push({
        date: date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.toDateString() === today.toDateString(),
        dateKey: date.toISOString().split('T')[0]
      });
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [newHabit, setNewHabit] = useState({ 
    name: '', 
    time: '9:00 AM', 
    marks: 5,
    category: 'Personal'
  });

  const handleToggleHabitDay = async (habitId, dateKey, date) => {
    // Prevent toggling future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return; // Don't allow future dates
    }
    
    await toggleHabitCompletion(habitId, dateKey);
    fetchAnalytics(); // Refresh analytics after toggle
  };

  const handleAddHabit = async () => {
    if (newHabit.name.trim()) {
      const result = await createHabit({
        ...newHabit,
        marks: parseInt(newHabit.marks) || 5,
      });
      
      if (result.success) {
        setNewHabit({ name: '', time: '9:00 AM', marks: 5, category: 'Personal' });
        setShowAddModal(false);
        fetchAnalytics();
      }
    }
  };

  const openEditModal = (habit) => {
    setEditingHabit({ ...habit });
    setShowEditModal(true);
  };

  const handleSaveEditHabit = async () => {
    if (editingHabit && editingHabit.name.trim()) {
      const result = await updateHabit(editingHabit._id, {
        name: editingHabit.name,
        time: editingHabit.time,
        marks: parseInt(editingHabit.marks) || 5,
        category: editingHabit.category,
      });
      
      if (result.success) {
        setShowEditModal(false);
        setEditingHabit(null);
        fetchAnalytics();
      }
    }
  };

  const handleDeleteHabit = async (id) => {
    setHabitToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (habitToDelete) {
      await deleteHabit(habitToDelete);
      fetchAnalytics();
      setShowDeleteConfirm(false);
      setHabitToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setHabitToDelete(null);
  };

  // Calculate stats
  const todayKey = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => {
    const completedDates = h.completedDates instanceof Map ? h.completedDates : new Map(Object.entries(h.completedDates || {}));
    return completedDates.get(todayKey);
  }).length;
  
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Calculate total marks earned today
  const marksEarnedToday = habits.reduce((total, habit) => {
    const completedDates = habit.completedDates instanceof Map ? habit.completedDates : new Map(Object.entries(habit.completedDates || {}));
    return total + (completedDates.get(todayKey) ? habit.marks : 0);
  }, 0);

  // Calculate total possible marks today
  const totalPossibleMarks = habits.reduce((total, habit) => total + habit.marks, 0);

  // Calculate total completed this week (only past and today)
  const totalCompletedThisWeek = habits.reduce((total, habit) => {
    const completedDates = habit.completedDates instanceof Map ? habit.completedDates : new Map(Object.entries(habit.completedDates || {}));
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    return total + weekDates.filter(d => {
      const dateObj = new Date(d.date);
      return dateObj <= today && completedDates.get(d.dateKey);
    }).length;
  }, 0);

  // Calculate total marks earned this week (only past and today)
  const marksEarnedThisWeek = habits.reduce((total, habit) => {
    const completedDates = habit.completedDates instanceof Map ? habit.completedDates : new Map(Object.entries(habit.completedDates || {}));
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const completedDays = weekDates.filter(d => {
      const dateObj = new Date(d.date);
      return dateObj <= today && completedDates.get(d.dateKey);
    }).length;
    
    return total + (completedDays * habit.marks);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Main Content */}
      <div className="section">
        <div className="container-custom max-w-7xl">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Track your habits and build consistency, one day at a time
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
            <div className="card-hover card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-600">Today's Progress</span>
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {completedToday}/{totalHabits}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="card-hover card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-600">Marks Today</span>
                <span className="text-xl sm:text-2xl">⭐</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                {marksEarnedToday}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Points earned today</p>
            </div>

            <div className="card-hover card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-600">This Week</span>
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                {totalCompletedThisWeek}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Total completions</p>
            </div>

            <div className="card-hover card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-600">Week Points</span>
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                {marksEarnedThisWeek}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Earned this week</p>
            </div>
          </div>

          {/* Habit Tracker Grid */}
          <div className="card">
            <div className="card-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Weekly Tracker</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Check off your daily habits and earn marks</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary btn-sm w-full sm:w-auto"
              >
                + Add Habit
              </button>
            </div>

            {habits.length === 0 ? (
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="heading-4 mb-2">No habits yet</h3>
                <p className="text-body mb-4">Start building better habits today!</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                >
                  Add Your First Habit
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 w-32 sm:w-64">
                        Habit
                      </th>
                      {weekDates.map((date, index) => (
                        <th 
                          key={index}
                          className={`px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold min-w-[60px] sm:min-w-[80px] ${
                            date.isToday 
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
                              : 'text-gray-900'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="hidden sm:block">{date.day}</div>
                            <div className="sm:hidden">{date.day.charAt(0)}</div>
                            <div className="text-xs font-normal mt-1">
                              <span className="hidden sm:inline">{date.month} </span>{date.dayNum}
                            </div>
                          </div>
                        </th>
                      ))}
                      <th className="px-2 sm:px-4 py-3 sm:py-4 w-16 sm:w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {habits.map((habit) => {
                      const completedDates = habit.completedDates instanceof Map 
                        ? habit.completedDates 
                        : new Map(Object.entries(habit.completedDates || {}));
                      
                      return (
                        <tr key={habit._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                {habit.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-xs sm:text-base truncate">{habit.name}</div>
                                <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-1">
                                  <span className="hidden sm:inline">{habit.time}</span>
                                  <span className="text-yellow-600 font-semibold">⭐ {habit.marks}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          {weekDates.map((date, index) => {
                            const isFutureDate = new Date(date.date) > new Date();
                            const isCompleted = completedDates.get(date.dateKey);
                            
                            return (
                              <td key={index} className="px-2 sm:px-4 py-3 sm:py-4">
                                <div className="flex items-center justify-center">
                                  <button
                                    onClick={() => handleToggleHabitDay(habit._id, date.dateKey, date.date)}
                                    disabled={isFutureDate}
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                      isFutureDate
                                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                        : isCompleted
                                        ? 'bg-green-500 border-green-500 text-white scale-110'
                                        : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50 cursor-pointer'
                                    }`}
                                    title={isFutureDate ? 'Cannot mark future dates' : isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                  >
                                    {!isFutureDate && isCompleted && (
                                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => openEditModal(habit)}
                                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                                title="Edit habit"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteHabit(habit._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Delete habit"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Motivational Quote */}
          <div className="mt-8 text-center p-6 sm:p-8 glass rounded-xl">
            <p className="text-base sm:text-xl font-semibold text-gray-900 mb-2">
              "Motivation = temporary. Systems = permanent."
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              You don't need more discipline. You need a system that makes consistency inevitable.
            </p>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card glass max-w-md w-full">
            <div className="card-header flex items-center justify-between">
              <h3 className="heading-4">Add New Habit</h3>
              <button 
                onClick={() => setShowAddModal(false)}
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
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Morning Exercise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <TimePicker
                  value={newHabit.time}
                  onChange={(time) => setNewHabit({ ...newHabit, time })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  className="input"
                >
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Skills">Skills</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks/Points ⭐
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newHabit.marks}
                  onChange={(e) => setNewHabit({ ...newHabit, marks: e.target.value })}
                  className="input"
                  placeholder="5"
                />
                <p className="text-xs text-gray-500 mt-1">Points earned when completing this habit</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHabit}
                  className="btn-primary flex-1"
                >
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Habit Modal */}
      {showEditModal && editingHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card glass max-w-md w-full">
            <div className="card-header flex items-center justify-between">
              <h3 className="heading-4">Edit Habit</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingHabit(null);
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
                  Habit Name
                </label>
                <input
                  type="text"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Morning Exercise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <TimePicker
                  value={editingHabit.time}
                  onChange={(time) => setEditingHabit({ ...editingHabit, time })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editingHabit.category || 'Personal'}
                  onChange={(e) => setEditingHabit({ ...editingHabit, category: e.target.value })}
                  className="input"
                >
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Skills">Skills</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks/Points ⭐
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editingHabit.marks}
                  onChange={(e) => setEditingHabit({ ...editingHabit, marks: e.target.value })}
                  className="input"
                  placeholder="5"
                />
                <p className="text-xs text-gray-500 mt-1">Points earned when completing this habit</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingHabit(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditHabit}
                  className="btn-primary flex-1"
                >
                  Save Changes
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
        title="Delete Habit?"
        message="Are you sure you want to delete this habit? This action cannot be undone and all progress will be lost."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default HabitTracker;
