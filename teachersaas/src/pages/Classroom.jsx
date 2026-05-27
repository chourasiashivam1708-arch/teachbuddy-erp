import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import StudentList from '../components/classroom/StudentList';
import AttendanceTracker from '../components/classroom/AttendanceTracker';
import Gradebook from '../components/classroom/Gradebook';

export default function Classroom() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.targetTab || 'students');
  const initialSearch = location.state?.search || '';
// 1. Start with an empty array. No more fake data!
  const [students, setStudents] = useState([]);

  // 2. The useEffect hook runs automatically when the component loads
  // 2. The useEffect hook runs automatically when the component loads
  useEffect(() => {
    // We define an async function to fetch the data
    const fetchStudents = async () => {
      try {
        // ADDED THE SECURE HEADERS HERE:
        const response = await fetch('http://localhost:5000/api/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
          }
        });
        const data = await response.json();
        
        // Put the real database data into our React state
        setStudents(data); 
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    // Call the function
    fetchStudents();
  }, []); // The empty array [] means "only do this once when the page loads"

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Classroom</h1>
        <p className="text-slate-500 text-sm font-medium">Manage students, attendance, and grades.</p>
      </div>

      <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6">
        <button onClick={() => setActiveTab('students')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Students</button>
        <button onClick={() => setActiveTab('attendance')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Attendance</button>
        <button onClick={() => setActiveTab('grades')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'grades' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Gradebook</button>
      </div>

      {activeTab === 'students' && <StudentList students={students} setStudents={setStudents} initialSearch={initialSearch} />}
      {activeTab === 'attendance' && <AttendanceTracker students={students} />}
      {activeTab === 'grades' && <Gradebook students={students} />}
    </div>
  );
}