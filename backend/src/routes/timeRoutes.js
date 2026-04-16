const express = require('express');
const {
  getTimeEntries,
  getTimeEntry,
  createTimeEntry,
  updateTimeEntry,
  startTimer,
  stopTimer,
  deleteTimeEntry,
  getTimeStats
} = require('../controllers/timeController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Time entry routes
router.route('/')
  .get(protect, getTimeEntries)
  .post(protect, createTimeEntry);

router.route('/stats')
  .get(protect, getTimeStats);

router.route('/:id')
  .get(protect, getTimeEntry)
  .put(protect, updateTimeEntry)
  .delete(protect, deleteTimeEntry);

// Timer control routes
router.route('/:id/start')
  .put(protect, startTimer);

router.route('/:id/stop')
  .put(protect, stopTimer);

module.exports = router;