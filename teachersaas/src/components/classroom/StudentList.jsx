import React, { useState } from 'react';
import { Search, UserPlus, ChevronRight, Filter, X, Upload, AlertTriangle, ShieldCheck } from 'lucide-react';
import * as XLSX from 'xlsx'; 
import { useAuth } from '../../context/AuthContext'; // 1. IMPORT AUTH

export default function StudentList({ students, setStudents, initialSearch }) {
  const { currentUser } = useAuth(); // 2. GRAB USER DATA
  
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [showFilter, setShowFilter] = useState(false);
  const [filterClass, setFilterClass] = useState('All');
  const [filterAttendance, setFilterAttendance] = useState('All');
  const [filterMarks, setFilterMarks] = useState('All'); 
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRoll, setNewRoll] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null); 

  // 3. SECURE & SORT THE DATA
  const filteredAndSortedStudents = students
    .filter(student => {
      const safeRoll = student.rollNumber || ''; 
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || safeRoll.includes(searchQuery);
      const matchesClass = filterClass === 'All' || student.grade === filterClass;
      
      let matchesAttendance = true;
      if (filterAttendance !== 'All') {
        const attNum = parseInt(student.attendance) || 0;
        if (filterAttendance === '>75%') matchesAttendance = attNum >= 75;
        if (filterAttendance === '<75%') matchesAttendance = attNum < 75;
      }
      return matchesSearch && matchesClass && matchesAttendance;
    })
    .sort((a, b) => {
      // numeric: true ensures "2" comes before "10"
      const rollA = String(a.rollNumber || "0");
      const rollB = String(b.rollNumber || "0");
      return rollA.localeCompare(rollB, undefined, { numeric: true });
    });

  const isFilterActive = filterClass !== 'All' || filterAttendance !== 'All' || filterMarks !== 'All';
  // Check if they are actually a class teacher
  const isClassTeacher = !!currentUser.classTeacherOf; 

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newName || !newRoll) return;

    try {
     const response = await fetch('http://localhost:5000/api/students/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
        },
        body: JSON.stringify({ name: newName, rollNumber: newRoll, grade: currentUser.classTeacherOf }) 
      });

      if (response.ok) {
        const savedStudent = await response.json(); 
        setStudents([...students, savedStudent]); 
        setShowAddModal(false); 
        setNewName(''); setNewRoll('');
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleExcelUpload = (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Please select an Excel file first!");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedStudents = jsonData.map(row => {
          const flatRow = Object.keys(row).reduce((acc, key) => {
            acc[key.toLowerCase().replace(/[^a-z0-9]/g, '')] = row[key];
            return acc;
          }, {});

          return {
            name: flatRow['name'] || flatRow['studentname'] || flatRow['fullname'] || flatRow['student'] || "Unknown", 
            rollNumber: String(flatRow['rollno'] || flatRow['rollnumber'] || flatRow['roll'] || flatRow['id'] || "0"),
            grade: currentUser.classTeacherOf // FORCED SECURITY
          };
        });

        const response = await fetch(`http://localhost:5000/api/students/bulk/${currentUser.classTeacherOf}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
          },
          body: JSON.stringify({ students: formattedStudents })
        });

       if (response.ok) {
          alert(`Success! Class ${currentUser.classTeacherOf} has been replaced.`);
          
          // 1. Close the modal and clear the file
          setShowUploadModal(false); 
          setUploadFile(null); 

          // 2. Fetch the fresh list from the database instantly!
          try {
            const refreshResponse = await fetch('http://localhost:5000/api/students', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
              }
            });
            const allStudents = await refreshResponse.json();
            
            // 3. Filter them exactly like we did in Classroom.jsx
            const myStudents = allStudents.filter(student => 
              currentUser?.classesTaught?.includes(student.grade || student.class || student.className)
            );
            
            // 4. Update React's memory without reloading the page!
            setStudents(myStudents); 
            
          } catch (refreshError) {
            console.error("Failed to refresh the UI:", refreshError);
          }

        } else {
          alert("Failed to save to the database.");
        }
      } catch (error) {
        alert("Error reading file.");
      }
    };
    reader.readAsArrayBuffer(uploadFile); 
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="flex gap-2 mb-4 mt-2 relative z-20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="relative">
          <button onClick={() => setShowFilter(!showFilter)} className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${isFilterActive ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600'}`}>
            <Filter className="w-4 h-4" />
          </button>
          
          {showFilter && (
             <div className="absolute right-0 top-12 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl p-4">
               {/* ... (Keep your existing filter dropdown UI code here) ... */}
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Options</h3>
                 <button onClick={() => { setFilterClass('All'); setFilterAttendance('All'); setFilterMarks('All'); }} className="text-[10px] font-bold text-blue-600 hover:underline">Reset</button>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-slate-600 block mb-1.5">By Class</label>
                   <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500">
                     <option value="All">All Classes</option>
                     <option value="8A">Class 8A</option><option value="8B">Class 8B</option>
                     <option value="9A">Class 9A</option><option value="9B">Class 9B</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-600 block mb-1.5">By Attendance</label>
                   <select value={filterAttendance} onChange={(e) => setFilterAttendance(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500">
                     <option value="All">Any Attendance</option><option value=">75%">Above 75%</option><option value="<75%">Below 75%</option>
                   </select>
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* 4. HIDE BUTTONS IF NOT A CLASS TEACHER */}
        {isClassTeacher && (
          <>
            <button onClick={() => setShowUploadModal(true)} className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-2.5 rounded-xl hover:bg-emerald-100 shadow-sm transition-colors">
              <Upload className="w-4 h-4 stroke-[2.5px]" />
            </button>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
              <UserPlus className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </>
        )}
      </div>

      <div className="space-y-3 z-0 relative">
        {filteredAndSortedStudents.length > 0 ? (
          filteredAndSortedStudents.map((student) => (
            <div key={student._id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 cursor-pointer transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">{student.rollNumber}</div>
                <div>
                  <h3 className="font-bold text-slate-800">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{student.grade}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 border-dashed">
             <p className="text-slate-500 text-sm font-medium">No students match your active filters.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">Add to Class {currentUser.classTeacherOf}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Roll No.</label>
                <input type="text" required value={newRoll} onChange={(e) => setNewRoll(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full mt-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-blue-700">Add to Class</button>
            </form>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Upload Roster</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-5 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 font-medium">You are the official class teacher of <span className="font-bold">{currentUser.classTeacherOf}</span>. Uploading will completely replace your current class roster.</p>
            </div>

            <form onSubmit={handleExcelUpload} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Select File (.xlsx, .csv)</label>
                <input type="file" required accept=".xlsx, .xls, .csv" onChange={(e) => setUploadFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
              </div>
              <button type="submit" className="w-full mt-2 bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-emerald-700">Replace Class {currentUser.classTeacherOf}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}