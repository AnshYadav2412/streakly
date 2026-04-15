const express = require('express');
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  toggleHabitCompletion,
  deleteHabit,
  getAnalytics,
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/').get(getHabits).post(createHabit);

router.route('/analytics').get(getAnalytics);

router.route('/:id').get(getHabit).put(updateHabit).delete(deleteHabit);

router.route('/:id/toggle').put(toggleHabitCompletion);

module.exports = router;
