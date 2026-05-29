const jwt = require('jsonwebtoken');
const Contact = require('../models/Contact');
const path = require('path');
const fs = require('fs');

// ── POST /api/admin/login ──────────────────────────────────────────────
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required.' });
  }

  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = password === process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return res.status(200).json({ success: true, token });
};

// ── GET /api/admin/submissions ─────────────────────────────────────────
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });

    const total = submissions.length;
    const unread = submissions.filter((s) => !s.isRead).length;

    return res.status(200).json({
      success: true,
      stats: { total, unread, read: total - unread },
      data: submissions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch submissions.' });
  }
};

// ── PATCH /api/admin/submissions/:id/read ──────────────────────────────
const toggleRead = async (req, res) => {
  try {
    const submission = await Contact.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    submission.isRead = !submission.isRead;
    await submission.save();

    return res.status(200).json({ success: true, data: submission });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update submission.' });
  }
};

// ── DELETE /api/admin/submissions/:id ──────────────────────────────────
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Contact.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }
    return res.status(200).json({ success: true, message: 'Deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete submission.' });
  }
};

// ── GET /api/cv/download ───────────────────────────────────────────────
const downloadCV = (req, res) => {
  const cvPath = path.join(__dirname, '..', 'uploads', 'cv', 'resume.pdf');

  if (!fs.existsSync(cvPath)) {
    return res.status(404).json({ success: false, error: 'CV not found. Please upload resume.pdf to backend/uploads/cv/' });
  }

  res.setHeader('Content-Disposition', 'attachment; filename="Resume.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  return res.sendFile(cvPath);
};

module.exports = { login, getSubmissions, toggleRead, deleteSubmission, downloadCV };
