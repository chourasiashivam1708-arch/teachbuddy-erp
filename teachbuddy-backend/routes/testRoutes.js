const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Student = require('../models/Student');

// 1. ROUTE: POST /api/tests/create (Create a new test & auto-populate students)
router.post('/create', async (req, res) => {
  try {
    const { title, grade, maxMarks } = req.body;

    // A. Find all students currently enrolled in this specific class
    const students = await Student.find({ grade: grade });

    // B. Create a blank grading sheet for everyone
    const initialScores = students.map(student => ({
      studentId: student._id,
      score: null 
    }));

    // C. Save the new Test to the database
    const newTest = new Test({
      title,
      grade,
      maxMarks,
      scores: initialScores
    });

    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ message: 'Error creating test' });
  }
});

// 2. ROUTE: GET /api/tests/:grade (Fetch all tests for a specific class)
router.get('/:grade', async (req, res) => {
  try {
    // Sorts by newest first
    const tests = await Test.find({ grade: req.params.grade }).sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

// 3. ROUTE: PUT /api/tests/:testId/scores (Save graded marks)
router.put('/:testId/scores', async (req, res) => {
  try {
    const { scores } = req.body;
    
    // Find the test by ID and completely update the scores array
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.testId,
      { scores: scores },
      { new: true }
    );
    
    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.status(200).json(updatedTest);
  } catch (error) {
    console.error("Error saving scores:", error);
    res.status(500).json({ message: 'Error saving scores' });
  }
});

module.exports = router;