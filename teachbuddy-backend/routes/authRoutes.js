const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

// 1. ROUTE: POST /api/auth/register (Create a new Teacher account)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, classTeacherOf, classesTaught } = req.body;

    // Check if a teacher with this email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'A teacher with this email already exists.' });
    }

    // Hash (scramble) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new teacher with the scrambled password
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      classTeacherOf: classTeacherOf || null,
      classesTaught: classesTaught || []
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully!' });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});





// 2. ROUTE: POST /api/auth/login (Verify credentials and generate JWT badge)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // See if the teacher exists in the database
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the typed password with the scrambled password in the database
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate the Digital ID Badge (JWT)
    // Note: In production, 'teachbuddy_secret_key' goes in a hidden .env file!
    const token = jwt.sign(
      { id: teacher._id }, 
      'teachbuddy_secret_key', 
      { expiresIn: '1d' } // Badge expires in 1 day
    );

    // Send the token and the teacher's profile data back to React
    res.status(200).json({
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        classTeacherOf: teacher.classTeacherOf,
        classesTaught: teacher.classesTaught
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;