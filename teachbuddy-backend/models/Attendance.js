// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  className: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true // We will format this as "YYYY-MM-DD"
  },
  // An array of the students and their status for that specific day
  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    name: String,
    rollNumber: String,
    currentStatus: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);