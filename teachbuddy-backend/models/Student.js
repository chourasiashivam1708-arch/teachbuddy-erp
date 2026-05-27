// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  rollNumber: { 
    type: String, 
    required: true 
  },
  grade: { 
    type: String, 
    required: true // e.g., '8A' or '9B'
  },
  attendance: { 
    type: String, 
    default: '100%' 
  },
  status: { 
    type: String, 
    default: 'Good' // We can change this to 'Defaulter' later based on attendance
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);