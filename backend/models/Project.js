const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    stack: {
      // Stored as array of strings e.g. ["React", "Node.js"]
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Full-Stack', 'Frontend', 'Backend', 'Tool', 'Other'],
      default: 'Full-Stack',
    },
    status: {
      type: String,
      enum: ['Live', 'In Progress', 'Archived'],
      default: 'Live',
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    live: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      // Relative path stored, served via /uploads/projects/filename
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    order: {
      // Controls display order; lower = shown first
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
