const Project = require('../models/Project');

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, dueDate, priority, color } = req.body;

    const project = await Project.create({
      title,
      description,
      dueDate,
      priority,
      color,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: project
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

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    let project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const { isCompleted } = req.body;
    
    // If marking as completed, set completedAt
    if (isCompleted && !project.isCompleted) {
      req.body.completedAt = new Date();
    }
    
    // If marking as incomplete, remove completedAt
    if (!isCompleted && project.isCompleted) {
      req.body.completedAt = null;
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: project
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

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

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

// @desc    Add task to project
// @route   POST /api/projects/:id/tasks
// @access  Private
const addTask = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const { title, description, dueDate, priority } = req.body;

    project.tasks.push({
      title,
      description,
      dueDate,
      priority
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project
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

// @desc    Update task
// @route   PUT /api/projects/:id/tasks/:taskId
// @access  Private
const updateTask = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const task = project.tasks.id(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { isCompleted } = req.body;
    
    // If marking as completed, set completedAt
    if (isCompleted && !task.isCompleted) {
      req.body.completedAt = new Date();
    }
    
    // If marking as incomplete, remove completedAt
    if (!isCompleted && task.isCompleted) {
      req.body.completedAt = null;
    }

    // Update task fields
    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];
    });

    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/projects/:id/tasks/:taskId
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const task = project.tasks.id(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    project.tasks.pull(req.params.taskId);
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask
};