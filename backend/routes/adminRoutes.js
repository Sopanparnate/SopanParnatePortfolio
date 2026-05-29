const express = require('express');
const router = express.Router();
const {
  login, getSubmissions, toggleRead, deleteSubmission, downloadCV,
} = require('../controllers/adminController');
const {
  getProjects, createProject, updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// ── Auth ──────────────────────────────────────────────────────────────
router.post('/login', login);

// ── CV (public) ───────────────────────────────────────────────────────
router.get('/cv/download', downloadCV);

// ── Submissions (protected) ───────────────────────────────────────────
router.get('/submissions',            protect, getSubmissions);
router.patch('/submissions/:id/read', protect, toggleRead);
router.delete('/submissions/:id',     protect, deleteSubmission);

// ── Projects CRUD (protected) ─────────────────────────────────────────
router.get('/projects',         protect, getProjects);
router.post('/projects',        protect, upload.single('image'), createProject);
router.put('/projects/:id',     protect, upload.single('image'), updateProject);
router.delete('/projects/:id',  protect, deleteProject);

module.exports = router;
