const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// ── GET /api/projects  (PUBLIC — used by frontend) ────────────────────
const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch projects.' });
  }
};

// ── GET /api/admin/projects  (PROTECTED) ──────────────────────────────
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch projects.' });
  }
};

// ── POST /api/admin/projects  (PROTECTED) ─────────────────────────────
const createProject = async (req, res) => {
  try {
    const {
      title, tagline, description, stack,
      category, status, github, live, featured, year, order,
    } = req.body;

    if (!title || !tagline || !description) {
      return res.status(400).json({ success: false, error: 'Title, tagline and description are required.' });
    }

    // stack can arrive as comma-separated string or JSON array
    let stackArr = [];
    if (stack) {
      stackArr = typeof stack === 'string'
        ? stack.split(',').map((s) => s.trim()).filter(Boolean)
        : stack;
    }

    const image = req.file ? `/uploads/projects/${req.file.filename}` : '';

    const project = await Project.create({
      title, tagline, description,
      stack: stackArr,
      category: category || 'Full-Stack',
      status: status || 'Live',
      github: github || '',
      live: live || '',
      image,
      featured: featured === 'true' || featured === true,
      year: year || new Date().getFullYear().toString(),
      order: order ? parseInt(order) : 0,
    });

    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ── PUT /api/admin/projects/:id  (PROTECTED) ──────────────────────────
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    const {
      title, tagline, description, stack,
      category, status, github, live, featured, year, order,
    } = req.body;

    // Handle stack
    if (stack !== undefined) {
      project.stack = typeof stack === 'string'
        ? stack.split(',').map((s) => s.trim()).filter(Boolean)
        : stack;
    }

    // If a new image was uploaded, delete the old one
    if (req.file) {
      if (project.image) {
        const oldPath = path.join(__dirname, '..', project.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      project.image = `/uploads/projects/${req.file.filename}`;
    }

    if (title !== undefined)       project.title = title;
    if (tagline !== undefined)     project.tagline = tagline;
    if (description !== undefined) project.description = description;
    if (category !== undefined)    project.category = category;
    if (status !== undefined)      project.status = status;
    if (github !== undefined)      project.github = github;
    if (live !== undefined)        project.live = live;
    if (featured !== undefined)    project.featured = featured === 'true' || featured === true;
    if (year !== undefined)        project.year = year;
    if (order !== undefined)       project.order = parseInt(order);

    await project.save();
    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ── DELETE /api/admin/projects/:id  (PROTECTED) ───────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    // Delete image file if exists
    if (project.image) {
      const imgPath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await project.deleteOne();
    return res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getPublicProjects, getProjects, createProject, updateProject, deleteProject };
