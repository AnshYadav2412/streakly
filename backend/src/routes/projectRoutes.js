const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask
} = require('../controllers/projectController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Project routes
router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Task routes
router.route('/:id/tasks')
  .post(protect, addTask);

router.route('/:id/tasks/:taskId')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;