const express = require('express');
const router = express.Router(); 
const Teacher = require('../models/Teacher'); 

// 1. IMPORT MIDDLEWARE & CLOUD TOOLS
const auth = require('../middleware/authMiddleware'); // Make sure this path points to your JWT auth file!
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// 2. CONFIGURE CLOUDINARY
// This tells the backend how to log into your specific cloud bucket
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. CONFIGURE MULTER STORAGE
// This creates the rules for the files we accept
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'teachbuddy_timetables', // Creates a neat folder in your cloud bucket
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });

/* =========================================================
   ROUTE 1: POST /api/teachers/register (Your Original Route)
   ========================================================= */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newTeacher = new Teacher({
      name: name,
      email: email,
      password: password
    });

    const savedTeacher = await newTeacher.save();

    res.status(201).json({
      message: 'Teacher created successfully!',
      teacher: savedTeacher
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating teacher' });
  }
});

/* =========================================================
   ROUTE 2: POST /api/teachers/setup (NEW: ONBOARDING ROUTE)
   PURPOSE: Saves the assigned classes and timetable image
   ========================================================= */
// Notice we use 'auth' to block intruders, and 'upload.single' to catch the image
router.post('/setup', auth, upload.single('timetable'), async (req, res) => {
  try {
    // 1. Parse the classes from the frontend
    let classesTaught = [];
    if (req.body.classesTaught) {
      try {
        // FormData sends arrays as strings, so we must parse it back into a true array
        classesTaught = JSON.parse(req.body.classesTaught);
      } catch (e) {
        // Fallback just in case
        classesTaught = req.body.classesTaught.split(',');
      }
    }
    
    // 2. Get the secure Cloudinary URL of the uploaded image
    // If they didn't upload an image, it defaults to an empty string
    const timetableUrl = req.file ? req.file.path : "";

    // 3. Find the logged-in teacher and update their database profile
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.user.id, // req.user is provided by your 'auth' middleware
      { 
        classesTaught: classesTaught,
        timetableUrl: timetableUrl
      },
      { new: true } // This tells MongoDB to return the newly updated document
    );

    res.status(200).json({
      message: "Setup complete!",
      teacher: updatedTeacher
    });

  } catch (error) {
    console.error("Setup Error:", error);
    res.status(500).json({ message: "Server error during setup." });
  }
});

module.exports = router;