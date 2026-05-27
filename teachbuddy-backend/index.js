// index.js
const express = require('express');
const mongoose = require('mongoose'); // Mongoose is the bridge between Node.js and MongoDB
const cors = require('cors');
require('dotenv').config(); // This loads our secret variables from the .env file

const app = express();

// --- MIDDLEWARE ---
// Middleware are functions that run BEFORE your routes. 
app.use(cors()); // Allows our frontend (running on port 5173) to securely request data from our backend (port 5000)
app.use(express.json()); // Tells Express to automatically parse incoming JSON data from the frontend

// --- DATABASE CONNECTION ---
// We use mongoose.connect() and pass it our secret URL from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // If successful, this block runs
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch((error) => {
    // If it fails (e.g., database is offline), this block catches the error
    console.error('❌ MongoDB connection error:', error);
  });

// ==========================================
// ROUTE IMPORTS & SECURITY (THE BOUNCER)
// ==========================================

// 1. PUBLIC ROUTES (No Bouncer needed here!)
// We must leave authRoutes open so teachers can actually log in and register.
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'TeachBuddy API is running' });
});

// 2. IMPORT THE BOUNCER
// This is the middleware we just built that checks for the digital ID badge (JWT)
const authMiddleware = require('./middleware/authMiddleware');

// 3. PRIVATE/PROTECTED ROUTES (Bouncer stands in front of these!)
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const testRoutes = require('./routes/testRoutes');

// We pass `authMiddleware` as the second argument. 
// Express will run the bouncer first. If it passes, it allows access to the routes!
app.use('/api/teachers', authMiddleware, teacherRoutes); 
app.use('/api/students', authMiddleware, studentRoutes); 
app.use('/api/tests', authMiddleware, testRoutes);
// Add this line in your index.js
app.use('/api/attendance', require('./routes/attendanceRoutes'));
// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});