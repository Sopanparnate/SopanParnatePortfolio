const express = require('express');
const router = express.Router();
const { getPublicProjects } = require('../controllers/projectController');

// GET /api/projects — public, used by frontend pages
router.get('/', getPublicProjects);

module.exports = router;
