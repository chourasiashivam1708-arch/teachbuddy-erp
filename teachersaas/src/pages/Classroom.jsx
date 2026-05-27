import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Calendar, Plus, X, UploadCloud, ImageIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

import StudentList from '../components/classroom/StudentList';
import AttendanceTracker from '../components/classroom/AttendanceTracker';
import Gradebook from '../components/classroom/Gradebook';

export default function Classroom() {
  const location = useLocation();
  const { currentUser, login } = useAuth();
  
  // Normal Classroom State
  const [activeTab, setActiveTab] = useState(location.state?.targetTab || 'students');
  const initialSearch = location.state?.search || '';
  const [students, setStudents] = useState([]);

  // ==========================================
  // ONBOARDING (EMPTY STATE) LOGIC
  // ==========================================
  // Check if teacher has no classes assigned yet
  const [needsSetup, setNeedsSetup] = useState(!currentUser?.classesTaught || currentUser.classesTaught.length === 0);
  
  // Setup Form State
  const [myClasses, setMyClasses] = useState([]);
  const [classInput, setClassInput] = useState('');
  const [timetableImage, setTimetableImage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle adding a class tag
  const handleAddClass = (e) => {
    e.preventDefault();
    if (classInput.trim() && !myClasses.includes(classInput.toUpperCase())) {
      setMyClasses([...myClasses, classInput.toUpperCase()]);
      setClassInput('');
    }
  };

  // Handle image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL to preview the image immediately
      setTimetableImage(URL.createObjectURL(file));
    }
  };

// ==========================================
  // SEND SETUP DATA TO BACKEND
  // ==========================================
  const handleCompleteSetup = async () => {
    try {
      // 1. Create our digital envelope
      const formData = new FormData();
      
      // 2. Add the array of classes (must be converted to a string for FormData)
      formData.append('classesTaught', JSON.stringify(myClasses));
      
      // 3. Grab the actual image file from the hidden input and add it
      const file = fileInputRef.current?.files[0];
      if (file) {
        formData.append('timetable', file);
      }

      // 4. Send it to our new secure backend route
      const response = await fetch('http://localhost:5000/api/teachers/setup', {
        method: 'POST',
        headers: {
          // Notice: We DO NOT set 'Content-Type': 'application/json' here.
          // The browser automatically sets the correct headers for FormData!
          'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Success! The database is updated.
        console.log("Setup saved:", data);
        login(data.teacher, localStorage.getItem('teachbuddy_token'));
        // Hide the setup screen and show the real classroom!
        setNeedsSetup(false);
      } else {
        console.error("Setup failed:", data.message);
        alert("Failed to save setup. Please try again.");
      }
    } catch (error) {
      console.error("Network error during setup:", error);
      alert("Cannot connect to the server.");
    }
  };

  // ==========================================
  // DATA FETCHING (Only runs if setup is done)
  // ==========================================
  useEffect(() => {
    const fetchStudents = async () => {
      if (needsSetup) return; 

      try {
        const response = await fetch('http://localhost:5000/api/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
          }
        });
        const allStudents = await response.json();
        
        // 🚀 THE BULLETPROOF FILTER 🚀
        const myStudents = allStudents.filter(student => {
          // 1. Grab whatever field the database used to save their class name
          const studentClass = student.grade || student.class || student.className;
          
          // 2. Check if this class is in the teacher's "classesTaught" array
          const isTaughtClass = currentUser?.classesTaught?.includes(studentClass);
          
          // 3. Check if this class is the one they are the official "classTeacherOf"
          const isMyMainClass = studentClass === currentUser?.classTeacherOf;

          // 4. If either is true, keep the student!
          return isTaughtClass || isMyMainClass;
        });
        
        // Put ONLY the filtered students into our React state
        setStudents(myStudents); 

      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, [needsSetup, currentUser]); // Re-run this if setup finishes OR if the teacher profile updates

  // ==========================================
  // 1. RENDER ONBOARDING SCREEN
  // ==========================================
  if (needsSetup) {
    return (
      <div className="p-4 max-w-md mx-auto pb-24 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Welcome Header */}
        <div className="text-center mt-8 mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome to your Classroom!</h1>
          <p className="text-slate-500 text-sm mt-2">Let's get your workspace set up for the new semester.</p>
        </div>

        {/* Step 1: Add Classes */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold">1</span>
            </div>
            <h2 className="font-bold text-slate-800">Which classes do you teach?</h2>
          </div>
          
          <form onSubmit={handleAddClass} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="e.g. 10A, 9B, 11-Science" 
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* Class Tags Display */}
          <div className="flex flex-wrap gap-2">
            {myClasses.length === 0 && <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No classes added yet</span>}
            {myClasses.map(cls => (
              <div key={cls} className="bg-indigo-50 text-indigo-700 text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 border border-indigo-100">
                {cls}
                <button type="button" onClick={() => setMyClasses(myClasses.filter(c => c !== cls))} className="hover:bg-indigo-200 rounded-full p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Upload Timetable */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <span className="font-bold">2</span>
            </div>
            <h2 className="font-bold text-slate-800">Upload your Timetable</h2>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />

          {!timetableImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <UploadCloud className="w-8 h-8 mb-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <p className="text-sm font-bold text-slate-700 mb-1">Tap to upload image</p>
              <p className="text-xs font-medium">PNG, JPG up to 5MB</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <img src={timetableImage} alt="Timetable preview" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-800 font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4" /> Change Image
                </button>
                <button onClick={() => setTimetableImage(null)} className="bg-rose-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <X className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleCompleteSetup}
          disabled={myClasses.length === 0}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${myClasses.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          {myClasses.length > 0 ? <><CheckCircle2 className="w-5 h-5" /> Complete Setup</> : 'Add at least 1 class to continue'}
        </button>

      </div>
    );
  }

  // ==========================================
  // 2. RENDER NORMAL CLASSROOM SCREEN
  // ==========================================
  return (
    <div className="p-4 max-w-md mx-auto pb-24 animate-in fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Classroom</h1>
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