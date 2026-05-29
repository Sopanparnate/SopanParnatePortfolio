const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve all uploaded files (CV + project images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contact',  contactRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => res.json({ message: 'Portfolio API is running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
