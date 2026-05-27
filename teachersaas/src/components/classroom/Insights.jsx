import React, { useState, useEffect } from 'react';
import { Table, Award, AlertTriangle, TrendingUp, Download, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Insights() {
  const { currentUser } = useAuth();
  
  // Teachers can view the register for any class they teach
  const availableClasses = currentUser.classesTaught || ['8A'];
  const [activeClass, setActiveClass] = useState(availableClasses[0]);
  
  const [registerData, setRegisterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegisterData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/students/register/${activeClass}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRegisterData(data);
        }
      } catch (error) {
        console.error("Error fetching register data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRegisterData();
  }, [activeClass]);

  // Helper to color code the average percentage
  const getScoreColor = (score) => {
    if (score === 'N/A') return 'text-slate-400';
    if (score >= 80) return 'text-emerald-600 font-bold';
    if (score >= 60) return 'text-amber-600 font-bold';
    return 'text-rose-600 font-bold';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
      
      {/* ========================================== */}
      {/* STICKY HEADER WRAPPER                        */}
      {/* ========================================== */}
      <div className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-md pt-2 pb-3 mb-4 -mx-2 px-2 rounded-b-xl border-b border-transparent flex justify-between items-center">
        
        {/* CLASS SELECTOR TABS */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
          {availableClasses.map((cls) => (
            <button 
              key={cls}
              onClick={() => setActiveClass(cls)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${
                activeClass === cls 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>

        {/* EXPORT BUTTON (Visual only for now) */}
        <button className="ml-3 bg-white border border-slate-200 text-slate-600 p-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-colors flex-shrink-0 flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span className="text-sm font-bold hidden sm:inline">Export</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* DATA TABLE SECTION                           */}
      {/* ========================================== */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <Table className="w-5 h-5 text-slate-400" />
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Master Register</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-500">Compiling Class Data...</p>
        </div>
      ) : !registerData || registerData.students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
          <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 mb-1">No Data Available</h3>
          <p className="text-slate-500 text-xs px-8">There are no students in Class {activeClass} yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              
              {/* TABLE HEADER */}
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Student</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center border-r border-slate-100">Att %</th>
                  
                  {/* DYNAMIC TEST COLUMNS */}
                  {registerData.testsAvailable.map((testName, idx) => (
                    <th key={idx} className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center border-r border-slate-100">
                      {testName}
                    </th>
                  ))}
                  
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center bg-blue-50/50">Overall Avg</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {registerData.students.map((student, index) => (
                  <tr key={student._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    
                    {/* STICKY STUDENT COLUMN */}
                    <td className="p-4 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {student.rollNumber}
                        </div>
                        <span className="font-bold text-slate-800 text-sm whitespace-nowrap">{student.name}</span>
                      </div>
                    </td>

                    {/* ATTENDANCE COLUMN */}
                    <td className="p-4 text-center font-bold text-sm text-slate-600 border-r border-slate-100">
                      {student.attendance || "100%"}
                    </td>

                    {/* DYNAMIC TEST SCORES */}
                    {registerData.testsAvailable.map((testName, idx) => {
                      const testData = student.examResults.find(t => t.testName === testName);
                      const score = testData ? testData.score : 'N/A';
                      const max = testData ? testData.maxMarks : '';
                      
                      return (
                        <td key={idx} className="p-4 text-center border-r border-slate-100">
                          {score === 'N/A' ? (
                            <span className="text-slate-300 font-medium text-sm">--</span>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-bold text-slate-800 text-sm">{score}</span>
                              <span className="text-[10px] font-bold text-slate-400">/ {max}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* OVERALL AVERAGE COLUMN */}
                    <td className="p-4 text-center bg-blue-50/30">
                      {student.overallAverage > 0 ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <TrendingUp className={`w-3.5 h-3.5 ${getScoreColor(student.overallAverage)}`} />
                          <span className={`text-sm ${getScoreColor(student.overallAverage)}`}>
                            {student.overallAverage}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-medium text-sm">--</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}