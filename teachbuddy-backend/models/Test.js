const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  }, // e.g., "Unit 1 Physics Quiz"
  grade: { 
    type: String, 
    required: true 
  }, // e.g., "8A"
  maxMarks: { 
    type: Number, 
    required: true 
  }, // e.g., 50
  date: { 
    type: Date, 
    default: Date.now 
  },
  
  // This array holds the actual grades. 
  // By defaulting to 'null', we know which students haven't been graded yet!
  scores: [{
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student' 
    },
    score: { 
      type: Number, 
      default: null 
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);