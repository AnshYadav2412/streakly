const Habit = require('../models/Habit');

// @desc    Get all habits for logged in user
// @route   GET /api/habits
// @access  Private
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this habit',
      });
    }

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
exports.createHabit = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const habit = await Habit.create(req.body);

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
exports.updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this habit',
      });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle habit completion for a specific date
// @route   PUT /api/habits/:id/toggle
// @access  Private
exports.toggleHabitCompletion = async (req, res) => {
  try {
    const { dateKey } = req.body;

    if (!dateKey) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date key',
      });
    }

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this habit',
      });
    }

    // Toggle completion
    const currentValue = habit.completedDates.get(dateKey);
    if (currentValue) {
      habit.completedDates.delete(dateKey);
    } else {
      habit.completedDates.set(dateKey, true);
    }

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    // Make sure user owns habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this habit',
      });
    }

    // Soft delete
    habit.isActive = false;
    await habit.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get habit analytics
// @route   GET /api/habits/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true });

    // Calculate analytics
    const totalHabits = habits.length;
    const totalMarks = habits.reduce((sum, habit) => sum + habit.marks, 0);
    
    // Get today's completions
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates.get(today)).length;
    const marksEarnedToday = habits
      .filter(h => h.completedDates.get(today))
      .reduce((sum, h) => sum + h.marks, 0);

    // Get this week's data (last 7 days)
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const completed = habits.filter(h => h.completedDates.get(dateKey)).length;
      const marks = habits
        .filter(h => h.completedDates.get(dateKey))
        .reduce((sum, h) => sum + h.marks, 0);

      weekData.push({
        date: dateKey,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        total: totalHabits,
        marks,
      });
    }

    // Category distribution
    const categoryData = {};
    habits.forEach(habit => {
      const category = habit.category || 'Personal';
      if (!categoryData[category]) {
        categoryData[category] = { count: 0, marks: 0 };
      }
      categoryData[category].count++;
      categoryData[category].marks += habit.marks;
    });

    // Individual habit performance with proper streak calculation
    const habitPerformance = habits.map(habit => {
      // Calculate total completions from all dates
      const totalCompletions = habit.completedDates.size;
      
      // Calculate current streak
      let currentStreak = 0;
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) { // Check up to a year back
        const checkDate = new Date(todayDate);
        checkDate.setDate(todayDate.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        if (habit.completedDates.get(dateKey)) {
          currentStreak++;
        } else if (i > 0) { // Don't break on first day (today) if not completed
          break;
        }
      }
      
      // Calculate completion rate based on days since habit creation
      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      const daysSinceCreation = Math.max(1, Math.ceil((todayDate - createdDate) / (1000 * 60 * 60 * 24)));
      const completionRate = Math.min(100, Math.round((totalCompletions / daysSinceCreation) * 100));
      
      return {
        id: habit._id,
        name: habit.name,
        icon: habit.icon,
        completionRate,
        totalCompletions,
        currentStreak,
        marksEarned: totalCompletions * habit.marks,
      };
    });

    // Calculate total marks earned (all time)
    const totalMarksEarned = habitPerformance.reduce((sum, h) => sum + h.marksEarned, 0);

    // Calculate longest streak across all habits
    const longestStreak = habitPerformance.length > 0 
      ? Math.max(...habitPerformance.map(h => h.currentStreak))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalHabits,
          totalMarks,
          completedToday,
          marksEarnedToday,
          completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
          totalMarksEarned,
          longestStreak,
        },
        weekData,
        categoryData,
        habitPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
