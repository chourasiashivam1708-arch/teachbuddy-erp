// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

/* 💡 INTERVIEW TOPIC: HTTP GET vs POST
   POST is for sending data TO the server (like filling out a form).
   GET is for asking the server for data (like opening a webpage).
   Notice how the GET route doesn't use `req.body` because we aren't sending data, 
   we are just asking for the list!
*/

// 1. ROUTE: POST /api/students/add (Add a new student)
router.post('/add', async (req, res) => {
  try {
    const { name, rollNumber, grade } = req.body;
    
    const newStudent = new Student({ name, rollNumber, grade });
    const savedStudent = await newStudent.save();
    
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding student' });
  }
});

// 2. ROUTE: GET /api/students (Fetch all students)
router.get('/', async (req, res) => {
  try {
    // Student.find() asks MongoDB to return every single document in the Student collection
    const students = await Student.find(); 
    
    // Send the array of students back to the frontend
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// 3. ROUTE: PUT /api/students/:id/attendance (Update a student's attendance)
router.put('/:id/attendance', async (req, res) => {
  try {
    // req.params.id grabs the ID from the URL (e.g., /api/students/12345/attendance)
    const studentId = req.params.id;
    // req.body grabs the new attendance status sent from React
    const { status } = req.body; 

    // Find the student by their ID and update their 'status' field
    // { new: true } tells Mongoose to send back the UPDATED document, not the old one
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId, 
      { status: status }, 
      { new: true } 
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating attendance' });
  }
});

// 4. ROUTE: POST /api/students/bulk/:grade (Replace an entire class roster)
router.post('/bulk/:grade', async (req, res) => {
  try {
    // 1. Grab the target class from the URL (e.g., '8A')
    const targetGrade = req.params.grade;
    // 2. Grab the massive array of students sent by our React Excel parser
    const { students } = req.body; 

    if (!students || students.length === 0) {
      return res.status(400).json({ message: 'No student data provided in the file.' });
    }

    // 3. BULK DELETE: Wipe the slate clean for this specific class ONLY
    // We pass { grade: targetGrade } so it doesn't accidentally delete Class 9B!
    await Student.deleteMany({ grade: targetGrade });

    // 4. BULK INSERT: Save the entire array to the database in one single trip
    const insertedStudents = await Student.insertMany(students);

    // 5. Send back a success response with the total count
    res.status(201).json({
      message: `Successfully replaced Class ${targetGrade}`,
      count: insertedStudents.length
    });
    
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: 'Error processing bulk Excel upload' });
  }
});

// 5. ROUTE: GET /api/students/register/:grade (Fetch Master Dashboard Data)
router.get('/register/:grade', async (req, res) => {
  try {
    const targetGrade = req.params.grade;

    // 1. Fetch all students for this class. 
    // .lean() makes the MongoDB objects much faster and easier to modify in JavaScript
    const students = await Student.find({ grade: targetGrade }).lean();

    // 2. Fetch all exams that belong to this class
    // We import the Test model at the top of the file if it isn't there yet!
    const Test = require('../models/Test'); 
    const classTests = await Test.find({ grade: targetGrade }).lean();

    // 3. The Data Merge: Map over every student and attach their specific test scores
    const masterRegister = students.map(student => {
      
      // Look through every test and find this specific student's score
      const studentGrades = classTests.map(test => {
        // Find the score entry where the studentId matches
        const scoreEntry = test.scores.find(
          s => s.studentId.toString() === student._id.toString()
        );

        return {
          testName: test.title,
          maxMarks: test.maxMarks,
          score: scoreEntry && scoreEntry.score !== null ? scoreEntry.score : 'N/A'
        };
      });

      // Calculate an overall average for the student (ignoring N/A)
      const validScores = studentGrades.filter(g => g.score !== 'N/A');
      let averagePercentage = 0;
      
      if (validScores.length > 0) {
        const totalEarned = validScores.reduce((sum, g) => sum + g.score, 0);
        const totalPossible = validScores.reduce((sum, g) => sum + g.maxMarks, 0);
        averagePercentage = Math.round((totalEarned / totalPossible) * 100);
      }

      // Return the unified profile
      return {
        ...student, // Includes name, rollNumber, and their current attendance string
        examResults: studentGrades,
        overallAverage: averagePercentage
      };
    });

    // Sort numerically by Roll Number before sending to React
    masterRegister.sort((a, b) => {
      const rollA = String(a.rollNumber || "0");
      const rollB = String(b.rollNumber || "0");
      return rollA.localeCompare(rollB, undefined, { numeric: true });
    });

    res.status(200).json({
      class: targetGrade,
      testsAvailable: classTests.map(t => t.title),
      students: masterRegister
    });

  } catch (error) {
    console.error("Master Register Error:", error);
    res.status(500).json({ message: 'Error generating class register' });
  }
});

module.exports = router;