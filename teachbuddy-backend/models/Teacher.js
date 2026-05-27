// models/Teacher.js
const mongoose = require('mongoose');

/* INTERVIEW TOPIC: What is a Schema?
  A Schema defines the structure of the document, default values, and validation rules.
  For example, if a user tries to sign up without an email, Mongoose will throw an error 
  because we set `required: true`.
*/

const teacherSchema = new mongoose.Schema({
  // The teacher's full name. Must be a string, and cannot be left blank.
  name: { 
    type: String, 
    required: true 
  },
  
  // The email must be a string, required, and 'unique' ensures no two teachers 
  // can sign up with the exact same email address.
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // We will store the password here. (Later, we will learn about "Hashing" 
  // so we don't store raw text passwords - a big security interview topic!)
  password: { 
    type: String, 
    required: true 
  },
  
 // ==========================================
  // NEW: ROLE-BASED ACCESS CONTROL (RBAC) FIELDS
  // ==========================================
  
  // 1. The class they officially manage (e.g., "8A"). 
  // If this matches the class they are viewing, they get full Edit/Add/Delete rights.
  classTeacherOf: { 
    type: String, 
    default: null 
  },
  
  // 2. An array of classes they teach subjects for (e.g., ["8A", "8B", "9A"]).
  // They can view attendance/registers for these classes, but not edit them.
  classesTaught: [{ 
    type: String 
  }]
}, 
// The timestamps option automatically creates 'createdAt' and 'updatedAt' fields for us!
{ timestamps: true });

// We compile the Schema into a "Model" and export it so we can use it in our routes to create, read, update, or delete Teachers.
module.exports = mongoose.model('Teacher', teacherSchema);