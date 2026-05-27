import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, ChevronRight, CheckCircle2, AlertCircle, BarChart2, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Gradebook({ students }) {
  const { currentUser } = useAuth();
  const availableClasses = currentUser.classesTaught || ['8A'];
  
  const [activeClass, setActiveClass] = useState(availableClasses[0]);
  const [tests, setTests] = useState([]);
  
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [maxMarks, setMaxMarks] = useState('');

  const [activeTest, setActiveTest] = useState(null);
  const [draftScores, setDraftScores] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tests/${activeClass}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    setActiveTest(null); 
    fetchTests();
  }, [activeClass]);

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tests/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
        },
        body: JSON.stringify({ title: testTitle, grade: activeClass, maxMarks: Number(maxMarks) })
      });

      if (response.ok) {
        const newTest = await response.json();
        setTests([newTest, ...tests]); 
        setShowNewTestModal(false);
        setTestTitle(''); setMaxMarks('');
      }
    } catch (error) {
      alert("Failed to create the test.");
    }
  };

  // ==========================================
  // 🚀 BULLETPROOF GRADING VIEW LOGIC 🚀
  // ==========================================
  const openGradingView = (test) => {
    setActiveTest(test);
    
    // 1. Get all CURRENT students for this specific class using our safe filter
    const classStudents = students.filter(s => 
      s.grade === activeClass || s.class === activeClass || s.className === activeClass
    );

    // 2. Build the grading sheet dynamically! 
    // If they already have a saved score in the database, keep it. 
    // If they are a newly uploaded student, set their score to null.
    const dynamicScores = classStudents.map(student => {
      const existingRecord = test.scores?.find(score => score.studentId === student._id);
      return {
        studentId: student._id,
        score: existingRecord && existingRecord.score !== null ? existingRecord.score : null
      };
    });

    setDraftScores(dynamicScores);
  };

  const handleScoreChange = (studentId, newScore) => {
    setDraftScores(prev => prev.map(s => 
      s.studentId === studentId ? { ...s, score: newScore === '' ? null : Number(newScore) } : s
    ));
  };

  const handleSaveGrades = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tests/${activeTest._id}/scores`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
        },
        body: JSON.stringify({ scores: draftScores })
      });
      if (response.ok) {
        const updatedTest = await response.json();
        setTests(tests.map(t => t._id === updatedTest._id ? updatedTest : t));
        alert("Grades successfully saved!");
        setActiveTest(null); 
      }
    } catch (error) {
      alert("Failed to save grades.");
    }
  };

  const getTestStatus = (test) => {
    if (!test.scores || test.scores.length === 0) return 'empty';
    const isFullyGraded = test.scores.every(s => s.score !== null);
    const isPartiallyGraded = test.scores.some(s => s.score !== null);
    if (isFullyGraded) return 'completed';
    if (isPartiallyGraded) return 'partial';
    return 'pending';
  };

  if (activeTest) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-300">
        <div className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-md pt-2 pb-3 mb-4 -mx-2 px-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTest(null)} className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-slate-800 leading-tight">{activeTest.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class {activeTest.grade} • Max {activeTest.maxMarks}</p>
            </div>
          </div>
          <button onClick={handleSaveGrades} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-blue-700">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>

        <div className="space-y-3 pb-20">
          {draftScores.map((scoreEntry) => {
            const studentInfo = students.find(s => s._id === scoreEntry.studentId);
            if (!studentInfo) return null; 

            return (
              <div key={scoreEntry.studentId} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                    {studentInfo.rollNumber}
                  </div>
                  <h3 className="font-bold text-slate-800">{studentInfo.name}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="0" 
                    max={activeTest.maxMarks}
                    value={scoreEntry.score === null ? '' : scoreEntry.score}
                    onChange={(e) => handleScoreChange(scoreEntry.studentId, e.target.value)}
                    placeholder="--"
                    className="w-16 p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-black text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-400">/ {activeTest.maxMarks}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-md pt-2 pb-3 mb-4 -mx-2 px-2 rounded-b-xl border-b border-transparent flex justify-between items-center">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
          {availableClasses.map((cls) => (
            <button 
              key={cls} onClick={() => setActiveClass(cls)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${
                activeClass === cls ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNewTestModal(true)} className="ml-3 bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-colors flex-shrink-0">
          <Plus className="w-5 h-5 stroke-[2.5px]" />
        </button>
      </div>

      <h3 className="font-bold text-slate-800 mb-3 px-1 text-sm uppercase tracking-wider">Recent Exams</h3>
      
      <div className="space-y-3 relative z-10">
        {tests.length > 0 ? (
          tests.map((test) => {
            const status = getTestStatus(test);
            return (
              <div 
                key={test._id} 
                onClick={() => openGradingView(test)} 
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {status === 'completed' ? <BarChart2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{test.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">MAX: {test.maxMarks}</span>
                      {status === 'completed' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Graded</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600"><AlertCircle className="w-3 h-3" /> Needs Grading</span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3"><FileText className="w-6 h-6 text-slate-400" /></div>
            <h3 className="font-bold text-slate-700 mb-1">No tests created yet</h3>
            <p className="text-slate-500 text-xs px-8">Click the blue plus button at the top to create your first exam for Class {activeClass}.</p>
          </div>
        )}
      </div>

      {showNewTestModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800">Create New Exam</h2>
              <button onClick={() => setShowNewTestModal(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Exam Title</label>
                <input type="text" required value={testTitle} onChange={(e) => setTestTitle(e.target.value)} placeholder="e.g. Midterm Mathematics" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Target Class</label>
                  <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed flex items-center justify-center">Class {activeClass}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Max Marks</label>
                  <input type="number" required min="1" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} placeholder="e.g. 50" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" className="w-full mt-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-blue-700 transition-colors">Create & Generate Grading Sheet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}