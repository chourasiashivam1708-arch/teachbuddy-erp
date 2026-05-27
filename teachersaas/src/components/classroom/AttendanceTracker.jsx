import React, { useState, useEffect } from 'react';
import { Calendar, Save, Upload, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

export default function AttendanceTracker({ students }) {
  const { currentUser } = useAuth(); 
  
  const [activeClass, setActiveClass] = useState('8A');
  const [attendanceList, setAttendanceList] = useState([]);

  const isClassTeacher = currentUser.classTeacherOf === activeClass;

  useEffect(() => {
    const classStudents = students.filter(student => student.grade === activeClass);
    
    const initializedStudents = classStudents.map(student => ({
      ...student,
      currentStatus: 'Present' 
    }));
    
    setAttendanceList(initializedStudents);
  }, [students, activeClass]);

  const presentCount = attendanceList.filter(s => s.currentStatus === 'Present').length;
  const absentCount = attendanceList.filter(s => s.currentStatus === 'Absent').length;
  const totalCount = attendanceList.length;

  const toggleStatus = (studentId, currentStatus) => {
    if (!isClassTeacher) {
      alert(`Access Denied: Only the Class Teacher of ${activeClass} can modify this attendance record.`);
      return;
    }

    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    setAttendanceList(prevList => prevList.map(student => 
      student._id === studentId ? { ...student, currentStatus: newStatus } : student
    ));
  };

  const handleSaveAttendance = async () => {
    try {
     await Promise.all(
        attendanceList.map(async (student) => {
          // REPLACE THE FETCH BLOCK WITH THIS:
          await fetch(`http://localhost:5000/api/students/${student._id}/attendance`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
            },
            body: JSON.stringify({ status: student.currentStatus })
          });
        })
      );
      alert(`Successfully saved attendance for Class ${activeClass}!`);
    } catch (error) {
      console.error("Error saving bulk attendance:", error);
      alert("Failed to save attendance.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex justify-between items-center mb-2 mt-2">
        <h2 className="font-bold text-slate-800">Today's Attendance</h2>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5" /> 27 May
        </div>
      </div>

      {/* ========================================== */}
      {/* 🚀 THE NEW STICKY HEADER WRAPPER 🚀          */}
      {/* bg-slate-50 matches your background, z-30 keeps it on top */}
      {/* ========================================== */}
      <div className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-md pt-2 pb-3 mb-2 -mx-2 px-2 rounded-b-xl border-b border-transparent">
        
        {/* CLASS SELECTOR */}
        <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
          {['8A', '8B', '9A', '9B'].map((cls) => {
            const isMyClass = cls === currentUser.classTeacherOf;
            const isActive = activeClass === cls;
            
            return (
              <button 
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${
                  isActive 
                    ? isMyClass 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-slate-800 border-slate-800 text-white' 
                    : isMyClass 
                      ? 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                }`}
              >
                Class {cls}
              </button>
            );
          })}
        </div>

        {/* READ-ONLY WARNING MESSAGE */}
        {!isClassTeacher && attendanceList.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3 flex gap-3 items-center">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 font-medium">
              You are viewing this class in <span className="font-bold">Read-Only mode</span>. Only the Class Teacher can make changes.
            </p>
          </div>
        )}

        {/* LIVE SUMMARY DASHBOARD */}
        {attendanceList.length > 0 && (
          <div className="flex gap-3">
            <div className="flex-1 bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex flex-col justify-center items-center shadow-sm">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Present</span>
              <span className="text-xl font-black text-emerald-700">{presentCount}</span>
            </div>
            <div className="flex-1 bg-rose-50 border border-rose-100 p-3 rounded-2xl flex flex-col justify-center items-center shadow-sm">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-0.5">Absent</span>
              <span className="text-xl font-black text-rose-700">{absentCount}</span>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col justify-center items-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total</span>
              <span className="text-xl font-black text-slate-700">{totalCount}</span>
            </div>
          </div>
        )}
      </div>
      {/* ========================================== */}
      {/* END STICKY WRAPPER                           */}
      {/* ========================================== */}

      <div className="space-y-3 mb-6 relative z-10">
        {attendanceList.length > 0 ? (
          attendanceList.map((student) => (
            <div 
              key={student._id} 
              onClick={() => toggleStatus(student._id, student.currentStatus)}
              className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-all select-none ${
                isClassTeacher ? 'cursor-pointer active:scale-[0.98]' : 'cursor-not-allowed opacity-90'
              } ${
                student.currentStatus === 'Present' 
                  ? 'bg-white border-slate-100 hover:border-emerald-200' 
                  : 'bg-rose-50/80 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  student.currentStatus === 'Present' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {student.rollNumber}
                </div>
                <div>
                  <h3 className={`font-bold ${student.currentStatus === 'Present' ? 'text-slate-800' : 'text-rose-900'}`}>
                    {student.name}
                  </h3>
                </div>
              </div>
              
              <div>
                {student.currentStatus === 'Present' ? (
                  <span className="text-emerald-600 font-extrabold text-sm tracking-wide">PRESENT</span>
                ) : (
                  <span className="text-rose-600 font-extrabold text-sm tracking-wide">ABSENT</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-700 mb-1">No students in Class {activeClass}</h3>
            {isClassTeacher ? (
              <p className="text-slate-500 text-xs px-8">Head over to the Students tab to add members or upload an Excel roster.</p>
            ) : (
              <p className="text-slate-500 text-xs px-8">The Class Teacher has not added any students yet.</p>
            )}
          </div>
        )}
      </div>

      {isClassTeacher && attendanceList.length > 0 && (
        <button 
          onClick={handleSaveAttendance}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Attendance for {activeClass}
        </button>
      )}

    </div>
  );
}