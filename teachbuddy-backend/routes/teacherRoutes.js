// routes/teacherRoutes.js
const express = require('express');
const router = express.Router(); // This creates a mini-app just for teacher routes
const Teacher = require('../models/Teacher'); // Import our Teacher blueprint

/* ROUTE: POST /api/teachers/register
  PURPOSE: Creates a new teacher in the database
*/

// 💡 INTERVIEW TOPIC: Async / Await
// Talking to a database takes time (a few milliseconds). If we don't use 'async/await', 
// Node.js will try to move on to the next line of code before the database finishes saving!
// 'async' tells Node this function takes time. 'await' tells Node to pause and wait for the database.
router.post('/register', async (req, res) => {
  try {
    // req.body contains the JSON data sent from the frontend (React)
    const { name, email, password } = req.body;

    // 1. Create a new teacher using our Mongoose Model
    const newTeacher = new Teacher({
      name: name,
      email: email,
      password: password
    });

    // 2. AWAIT the database to permanently save this teacher
    const savedTeacher = await newTeacher.save();

    // 3. Send a success response back to the frontend
    res.status(201).json({
      message: 'Teacher created successfully!',
      teacher: savedTeacher
    });

  } catch (error) {
    // If something goes wrong (like missing a required field), we catch the error
    console.error(error);
    res.status(500).json({ message: 'Server error while creating teacher' });
  }
});

module.exports = router; // Export the router so index.js can use it