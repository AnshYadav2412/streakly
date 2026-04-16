const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true,
    maxlength: [200, 'Task name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'learning', 'exercise', 'other'],
    default: 'work'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual for formatted duration
timeEntrySchema.virtual('formattedDuration').get(function() {
  const totalSeconds = this.duration;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
});

// Virtual for current duration (if running)
timeEntrySchema.virtual('currentDuration').get(function() {
  if (this.isRunning && this.startTime) {
    const now = new Date();
    const elapsed = Math.floor((now - this.startTime) / 1000);
    return this.duration + elapsed;
  }
  return this.duration;
});

// Ensure virtual fields are serialized
timeEntrySchema.set('toJSON', { virtuals: true });

// Index for better query performance
timeEntrySchema.index({ user: 1, createdAt: -1 });
timeEntrySchema.index({ user: 1, isRunning: 1 });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);