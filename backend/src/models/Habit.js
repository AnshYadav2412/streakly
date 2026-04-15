const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a habit name'],
      trim: true,
      maxlength: [100, 'Habit name cannot be more than 100 characters'],
    },
    icon: {
      type: String,
      default: '✨',
    },
    time: {
      type: String,
      default: '9:00 AM',
    },
    marks: {
      type: Number,
      default: 5,
      min: [1, 'Marks must be at least 1'],
      max: [100, 'Marks cannot exceed 100'],
    },
    completedDates: {
      type: Map,
      of: Boolean,
      default: {},
    },
    category: {
      type: String,
      enum: ['Health', 'Learning', 'Mindfulness', 'Skills', 'Personal', 'Work'],
      default: 'Personal',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
habitSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Habit', habitSchema);
