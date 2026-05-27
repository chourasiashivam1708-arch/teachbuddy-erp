// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/authMiddleware'); // Check your auth file name!

// GET: Fetch today's attendance for a specific class
router.get('/:className/today', auth, async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format (e.g., "2026-05-27")
    const today = new Date().toISOString().split('T')[0]; 
    
    const record = await Attendance.findOne({ className: req.params.className, date: today });

    if (!record) {
      return res.status(404).json({ message: "No attendance found for today." });
    }

    // Return just the records array so the React frontend can map over it easily
    res.status(200).json(record.records);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching attendance" });
  }
});

// POST: Save or Update today's attendance
router.post('/:className/today', auth, async (req, res) => {
   try {
     const today = new Date().toISOString().split('T')[0];
     const { records } = req.body;

     // The Magic 'Upsert': Updates if it exists, Creates if it doesn't!
     const attendance = await Attendance.findOneAndUpdate(
       { className: req.params.className, date: today },
       { records: records },
       { new: true, upsert: true } 
     );

     res.status(200).json(attendance);
   } catch (error) {
      res.status(500).json({ message: "Server error saving attendance" });
   }
});

// GET: Calculate overall attendance percentage for the Insights Tab
router.get('/:className/stats', auth, async (req, res) => {
  try {
    // 1. Find every attendance day saved for this specific class
    const allDays = await Attendance.find({ className: req.params.className });
    
    if (!allDays || allDays.length === 0) {
      return res.status(200).json({ percentage: 0 }); // No data yet
    }

    let totalSlots = 0;
    let presentCount = 0;

    // 2. Loop through every day, and every student in that day
    allDays.forEach(day => {
      day.records.forEach(student => {
        totalSlots++;
        if (student.currentStatus === 'Present') {
          presentCount++;
        }
      });
    });

    // 3. Calculate the average percentage
    const percentage = totalSlots === 0 ? 0 : Math.round((presentCount / totalSlots) * 100);
    
    res.status(200).json({ percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error calculating stats" });
  }
});

// GET: Fetch historical attendance (Last 30 days) for the Insights Tab
router.get('/:className/history', auth, async (req, res) => {
  try {
    // Find records for this class, sort by newest date (-1), and limit to 30
    const history = await Attendance.find({ className: req.params.className })
      .sort({ date: -1 }) 
      .limit(30);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching history" });
  }
});


module.exports = router;