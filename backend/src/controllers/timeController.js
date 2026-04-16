const TimeEntry = require('../models/TimeEntry');

// @desc    Get all time entries for user
// @route   GET /api/time
// @access  Private
const getTimeEntries = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, completed } = req.query;
    
    const query = { user: req.user.id };
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by completion status if provided
    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }
    
    const timeEntries = await TimeEntry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await TimeEntry.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: timeEntries.length,
      total,
      data: timeEntries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single time entry
// @route   GET /api/time/:id
// @access  Private
const getTimeEntry = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new time entry (start timer)
// @route   POST /api/time
// @access  Private
const createTimeEntry = async (req, res) => {
  try {
    const { task, description, category, tags } = req.body;

    // Check if user has any running timers
    const runningTimer = await TimeEntry.findOne({ 
      user: req.user.id, 
      isRunning: true 
    });

    if (runningTimer) {
      return res.status(400).json({
        success: false,
        message: 'You already have a running timer. Please stop it before starting a new one.'
      });
    }

    const timeEntry = await TimeEntry.create({
      task,
      description,
      category,
      tags: tags || [],
      user: req.user.id,
      startTime: new Date(),
      isRunning: true
    });

    res.status(201).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message[0]
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update time entry
// @route   PUT /api/time/:id
// @access  Private
const updateTimeEntry = async (req, res) => {
  try {
    let timeEntry = await TimeEntry.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    const { isCompleted } = req.body;
    
    // If marking as completed, set completedAt and stop timer if running
    if (isCompleted && !timeEntry.isCompleted) {
      req.body.completedAt = new Date();
      
      // If timer is running, stop it
      if (timeEntry.isRunning) {
        const now = new Date();
        const elapsed = Math.floor((now - timeEntry.startTime) / 1000);
        req.body.endTime = now;
        req.body.duration = timeEntry.duration + elapsed;
        req.body.isRunning = false;
      }
    }
    
    // If marking as incomplete, remove completedAt
    if (!isCompleted && timeEntry.isCompleted) {
      req.body.completedAt = null;
    }

    timeEntry = await TimeEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message[0]
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Start timer for existing time entry
// @route   PUT /api/time/:id/start
// @access  Private
const startTimer = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    if (timeEntry.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'Timer is already running'
      });
    }

    if (timeEntry.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot start timer for completed task'
      });
    }

    // Check if user has any other running timers
    const runningTimer = await TimeEntry.findOne({ 
      user: req.user.id, 
      isRunning: true 
    });

    if (runningTimer) {
      return res.status(400).json({
        success: false,
        message: 'You already have a running timer. Please stop it before starting another one.'
      });
    }

    timeEntry.startTime = new Date();
    timeEntry.isRunning = true;
    await timeEntry.save();

    res.status(200).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Stop timer for time entry
// @route   PUT /api/time/:id/stop
// @access  Private
const stopTimer = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    if (!timeEntry.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'Timer is not running'
      });
    }

    const now = new Date();
    const elapsed = Math.floor((now - timeEntry.startTime) / 1000);
    
    timeEntry.endTime = now;
    timeEntry.duration = timeEntry.duration + elapsed;
    timeEntry.isRunning = false;
    
    await timeEntry.save();

    res.status(200).json({
      success: true,
      data: timeEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete time entry
// @route   DELETE /api/time/:id
// @access  Private
const deleteTimeEntry = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    await TimeEntry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get time tracking statistics
// @route   GET /api/time/stats
// @access  Private
const getTimeStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate = new Date();
    
    // Calculate start date based on period
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const timeEntries = await TimeEntry.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    });

    // Calculate statistics
    const totalEntries = timeEntries.length;
    const completedEntries = timeEntries.filter(entry => entry.isCompleted).length;
    const totalDuration = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const avgDuration = totalEntries > 0 ? Math.round(totalDuration / totalEntries) : 0;
    
    // Group by category
    const categoryStats = timeEntries.reduce((acc, entry) => {
      if (!acc[entry.category]) {
        acc[entry.category] = { count: 0, duration: 0 };
      }
      acc[entry.category].count++;
      acc[entry.category].duration += entry.duration;
      return acc;
    }, {});

    // Get running timer
    const runningTimer = await TimeEntry.findOne({ 
      user: req.user.id, 
      isRunning: true 
    });

    res.status(200).json({
      success: true,
      data: {
        totalEntries,
        completedEntries,
        totalDuration,
        avgDuration,
        categoryStats,
        runningTimer,
        period
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getTimeEntries,
  getTimeEntry,
  createTimeEntry,
  updateTimeEntry,
  startTimer,
  stopTimer,
  deleteTimeEntry,
  getTimeStats
};