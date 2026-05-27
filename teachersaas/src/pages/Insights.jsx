import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, X, Table, List, Download, BarChart2, Sparkles, CheckCircle2, AlertTriangle, User, Activity } from 'lucide-react';

export default function Insights() {
  const { currentUser } = useAuth();
  
  const myClasses = currentUser?.classesTaught || [];
  const [activeClass, setActiveClass] = useState(myClasses[0] || '');

  const [activeSheet, setActiveSheet] = useState(null);
  const [attendanceViewMode, setAttendanceViewMode] = useState('timeline'); 
  
  const [attendanceStat, setAttendanceStat] = useState('--');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [classTests, setClassTests] = useState([]);

  // ==========================================
  // 1. DATA FETCHERS
  // ==========================================
  useEffect(() => {
    const fetchClassStats = async () => {
      if (!activeClass) return;
      try {
        const response = await fetch(`http://localhost:5000/api/attendance/${activeClass}/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAttendanceStat(data.percentage);
        }
      } catch (error) {}
    };
    fetchClassStats();
  }, [activeClass]); 

  useEffect(() => {
    const fetchStudentsAndTests = async () => {
      if (!activeClass) return;
      try {
        const stuRes = await fetch('http://localhost:5000/api/students', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}` }
        });
        if (stuRes.ok) {
          const allStudents = await stuRes.json();
          const filtered = allStudents.filter(s => s.class === activeClass || s.grade === activeClass || s.className === activeClass);
          filtered.sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));
          setClassStudents(filtered);
        }

        const testRes = await fetch(`http://localhost:5000/api/tests/${activeClass}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}` }
        });
        if (testRes.ok) {
          let tests = await testRes.json();
          const isClassTeacher = currentUser?.classTeacherOf === activeClass;
          if (!isClassTeacher) {
            tests = tests.filter(test => test.teacherId === currentUser?._id || test.teacherEmail === currentUser?.email);
          }
          setClassTests(tests);
        }
      } catch (error) {}
    };
    fetchStudentsAndTests();
  }, [activeClass, currentUser]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeClass) {
        try {
          const response = await fetch(`http://localhost:5000/api/attendance/${activeClass}/history`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('teachbuddy_token')}` }
          });
          if (response.ok) setAttendanceHistory(await response.json());
        } catch (error) {}
      }
    };
    fetchHistory();
  }, [activeClass]);

  // ==========================================
  // 2. ANALYTICAL ENGINE & AT-RISK LOGIC
  // ==========================================
  const isClassTeacher = currentUser?.classTeacherOf === activeClass;

  // Calculate individual student attendance percentages globally
  const studentAttendanceStats = useMemo(() => {
    if (!attendanceHistory.length || !classStudents.length) return [];
    return classStudents.map(student => {
      let pCount = 0; let aCount = 0;
      attendanceHistory.forEach(day => {
        const record = day.records.find(r => r.studentId === student._id || r.rollNumber === student.rollNumber);
        if (record) {
          if (record.currentStatus === 'Present') pCount++;
          if (record.currentStatus === 'Absent') aCount++;
        }
      });
      const total = pCount + aCount;
      const percentage = total === 0 ? 100 : Math.round((pCount / total) * 100);
      return { ...student, pCount, aCount, percentage };
    });
  }, [attendanceHistory, classStudents]);

  const lowAttendanceStudents = studentAttendanceStats.filter(s => s.percentage < 75);

  const [insightsData, setInsightsData] = useState({
    avgScore: '--', suggestionTitle: 'Analyzing...', suggestionMessage: 'Gathering data...', suggestionAction: 'Awaiting Data', suggestionColor: 'purple', atRisk: []
  });

  useEffect(() => {
    if (!classTests.length || !classStudents.length) {
      setInsightsData({ avgScore: '--', suggestionTitle: `Welcome to Class ${activeClass}`, suggestionMessage: 'Upload test scores and log attendance to unlock dynamic AI pacing alerts.', suggestionAction: 'Add Test Scores', suggestionColor: 'purple', atRisk: [] });
      return;
    }
    const atRisk = [];
    let totalClassScore = 0; let totalClassMax = 0;

    classStudents.forEach(student => {
      let studentTotal = 0; let studentMax = 0; let failedCount = 0;
      classTests.forEach(test => {
        const record = test.scores?.find(s => s.studentId === student._id);
        if (record?.score != null) {
          studentTotal += record.score; studentMax += test.maxMarks;
          if ((record.score / test.maxMarks) < 0.4) failedCount++;
        }
      });
      if (studentMax > 0) {
        const avg = studentTotal / studentMax;
        totalClassScore += studentTotal; totalClassMax += studentMax;
        if (avg < 0.4 || failedCount >= 2) {
          atRisk.push({ ...student, reason: failedCount >= 2 ? `Failed last ${failedCount} tests` : `Overall average is critical (${Math.round(avg*100)}%)` });
        }
      }
    });

    const classAvg = totalClassMax > 0 ? (totalClassScore / totalClassMax) : 0;
    const formattedAvg = totalClassMax > 0 ? Math.round(classAvg * 100) : '--';
    let title, message, action, color;
    if (classAvg > 0.75) { title = `Excellent Pacing`; message = `Class average is strong at ${formattedAvg}%. Introduce challenge questions.`; action = 'Generate Challenge Set'; color = 'emerald'; } 
    else if (classAvg > 0.0 && classAvg < 0.50) { title = `Intervention Required`; message = `Average dropped to ${formattedAvg}%. Schedule revision.`; action = 'Schedule Remedial'; color = 'rose'; } 
    else { title = `Steady Progress`; message = `Performance is stable. Focus on the ${atRisk.length} at-risk students.`; action = 'Review Profiles'; color = 'blue'; }

    setInsightsData({ avgScore: formattedAvg, suggestionTitle: title, suggestionMessage: message, suggestionAction: action, suggestionColor: color, atRisk: atRisk.slice(0, 3) });
  }, [classTests, classStudents, activeClass]);

  // ==========================================
  // 3. EXPORTS & RENDERERS
  // ==========================================
  const exportLowAttendanceCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Roll Number,Student Name,Attendance %\n";
    lowAttendanceStudents.forEach(student => {
      csvContent += `${student.rollNumber},${student.name},${student.percentage}%\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Defaulters_Class_${activeClass}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const renderAttendanceSheet = () => { 
    const today = new Date();
    const currentMonth = today.getMonth(); const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const studentMap = new Map(); const statusMap = {}; 

    attendanceHistory.forEach(dayRecord => {
      const recordDate = new Date(dayRecord.date);
      if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
        const dayNumber = recordDate.getDate();
        dayRecord.records.forEach(student => {
          const uniqueKey = student.rollNumber;
          if (!studentMap.has(uniqueKey)) studentMap.set(uniqueKey, { rollNumber: student.rollNumber, name: student.name });
          if (!statusMap[uniqueKey]) statusMap[uniqueKey] = {};
          statusMap[uniqueKey][dayNumber] = student.currentStatus === 'Present' ? 'P' : 'A';
        });
      }
    });

    const studentsList = Array.from(studentMap.entries()).map(([id, data]) => ({ id, ...data })).sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber));

    return (
      <div className="animate-in fade-in flex flex-col h-full bg-slate-50">
        <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0 sticky left-0 w-full z-40">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{today.toLocaleString('default', { month: 'short', year: 'numeric' })} Register</h3>
          <button onClick={() => setAttendanceViewMode('timeline')} className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
            <List className="w-4 h-4" /> Timeline
          </button>
        </div>
        {studentsList.length > 0 ? (
          // 🚀 ADDED pb-24 HERE to allow scrolling past bottom nav!
          <div className="flex-1 overflow-auto hide-scrollbar bg-white pb-24">
            <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
              <thead className="sticky top-0 z-30 bg-slate-100 shadow-sm">
                <tr className="text-slate-500 uppercase tracking-wider font-black">
                  <th className="p-3 sticky left-0 top-0 z-40 bg-slate-200 border-b border-r border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Student</th>
                  {daysArray.map(d => <th key={d} className="p-2 text-center border-b border-r border-slate-200 min-w-[36px]">{d}</th>)}
                  <th className="p-2 text-center border-b border-slate-200 text-blue-600 min-w-[50px] bg-blue-50/50">%</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map(student => {
                  let pCount = 0; let aCount = 0;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-b border-r border-slate-200 font-bold text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{student.rollNumber} - {student.name}</td>
                      {daysArray.map(d => {
                        const status = statusMap[student.id]?.[d];
                        if (status === 'P') pCount++; if (status === 'A') aCount++;
                        return <td key={d} className={`p-2 text-center border-b border-r border-slate-100 font-black ${status === 'P' ? 'text-emerald-500 bg-emerald-50/30' : status === 'A' ? 'text-rose-500 bg-rose-50/50' : 'text-slate-200'}`}>{status || '-'}</td>
                      })}
                      <td className="p-2 text-center border-b border-slate-200 font-black text-blue-700 bg-slate-50">{Math.round((pCount / (pCount + aCount || 1)) * 100)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white flex-1"><p className="text-slate-500 font-medium">No attendance recorded.</p></div>
        )}
      </div>
    );
  };

  const renderScoreSheet = () => { 
    return (
      <div className="animate-in fade-in flex flex-col h-full bg-slate-50">
        <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0 sticky left-0 w-full z-40">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Test Scores</h3>
            <p className="text-[10px] font-bold text-slate-400">{isClassTeacher ? "Showing all subjects" : "Showing only your subjects"}</p>
          </div>
        </div>
        {classTests.length > 0 && classStudents.length > 0 ? (
          // 🚀 ADDED pb-24 HERE
          <div className="flex-1 overflow-auto hide-scrollbar bg-white pb-24">
            <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
              <thead className="sticky top-0 z-30 bg-slate-100 shadow-sm">
                <tr className="text-slate-500 uppercase tracking-wider font-black">
                  <th className="p-3 sticky left-0 top-0 z-40 bg-slate-200 border-b border-r border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Student</th>
                  {classTests.map(test => (
                    <th key={test._id} className="p-2 text-center border-b border-r border-slate-200 min-w-[80px]">
                      <div className="truncate w-20" title={test.title}>{test.title}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">/ {test.maxMarks}</div>
                    </th>
                  ))}
                  <th className="p-2 text-center border-b border-slate-200 text-blue-600 min-w-[60px] bg-blue-50/50">Avg %</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => {
                  let totalScore = 0; let totalMax = 0;
                  return (
                    <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-b border-r border-slate-200 font-bold text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{student.rollNumber} - {student.name}</td>
                      {classTests.map(test => {
                        const studentScoreRecord = test.scores?.find(s => s.studentId === student._id);
                        const score = studentScoreRecord?.score;
                        if (score != null) { totalScore += score; totalMax += test.maxMarks; }
                        return <td key={test._id} className="p-2 text-center border-b border-r border-slate-100 font-bold text-slate-600">{score != null ? score : <span className="text-slate-300">-</span>}</td>
                      })}
                      <td className="p-2 text-center border-b border-slate-200 font-black text-blue-700 bg-slate-50">{totalMax === 0 ? '-' : `${Math.round((totalScore / totalMax) * 100)}%`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white flex-1"><p className="text-slate-500 font-medium">No tests found for this class.</p></div>
        )}
      </div>
    );
  };

  const renderHomeworkSheet = () => { 
    const mockHwDays = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28'];
    return (
      <div className="animate-in fade-in flex flex-col h-full bg-slate-50">
        <div className="flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0 sticky left-0 w-full z-40">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Homework Register</h3>
        </div>
        {classStudents.length > 0 ? (
          // 🚀 ADDED pb-24 HERE
          <div className="flex-1 overflow-auto hide-scrollbar bg-white pb-24">
            <table className="w-full text-left text-xs whitespace-nowrap border-separate border-spacing-0">
              <thead className="sticky top-0 z-30 bg-slate-100 shadow-sm">
                <tr className="text-slate-500 uppercase tracking-wider font-black">
                  <th className="p-3 sticky left-0 top-0 z-40 bg-slate-200 border-b border-r border-slate-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Student</th>
                  {mockHwDays.map(d => <th key={d} className="p-2 text-center border-b border-r border-slate-200 min-w-[60px]">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-b border-r border-slate-200 font-bold text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">{student.rollNumber} - {student.name}</td>
                    {mockHwDays.map(d => <td key={d} className="p-2 text-center border-b border-r border-slate-100 text-slate-300 font-black"><CheckCircle2 className="w-4 h-4 mx-auto text-emerald-500/30" /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white flex-1"><p className="text-slate-500 font-medium">No students found.</p></div>
        )}
      </div>
    );
  };

  // ==========================================
  // 4. TRENDS BAR CHARTS (NATIVE CSS)
  // ==========================================
  const renderTrendsSheet = () => {
    // 1. Calculate Test Score Averages
    const testAverages = classTests.map(test => {
      let totalScore = 0; let count = 0;
      test.scores?.forEach(s => { if(s.score != null) { totalScore += s.score; count++; } });
      const avg = count === 0 ? 0 : (totalScore / (count * test.maxMarks)) * 100;
      return { title: test.title, avg: Math.round(avg) };
    }).slice(0, 6); // Show max 6 recent tests

    // 2. Calculate Recent Attendance Trends
    const recentAttendance = attendanceHistory.slice(0, 7).reverse().map(day => {
      const present = day.records.filter(r => r.currentStatus === 'Present').length;
      const total = day.records.length;
      const avg = total === 0 ? 0 : Math.round((present/total)*100);
      return { date: new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), avg };
    });

    return (
      <div className="animate-in fade-in flex flex-col h-full bg-slate-50 pb-20 overflow-y-auto hide-scrollbar">
        
        {/* Test Performance Bar Chart */}
        <div className="p-5">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-blue-600"/> Subject Averages</h3>
          {testAverages.length > 0 ? (
            <div className="flex items-end gap-3 h-48 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto hide-scrollbar">
              {testAverages.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 min-w-[48px] flex-1">
                  <span className="text-[10px] font-black text-blue-600">{t.avg}%</span>
                  <div className="w-full bg-blue-50 rounded-t-lg relative flex justify-center h-28">
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000" style={{height: `${t.avg}%`}}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 truncate w-full text-center" title={t.title}>{t.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">Not enough test data.</div>
          )}
        </div>

        {/* Attendance Bar Chart */}
        <div className="px-5 pb-5">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600"/> Last 7 Days Attendance</h3>
          {recentAttendance.length > 0 ? (
            <div className="flex items-end gap-2 h-48 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto hide-scrollbar">
              {recentAttendance.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 min-w-[40px] flex-1">
                  <span className="text-[10px] font-black text-emerald-600">{d.avg}%</span>
                  <div className="w-full bg-emerald-50 rounded-t-md relative flex justify-center h-28">
                    <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md transition-all duration-1000" style={{height: `${d.avg}%`}}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 truncate w-full text-center">{d.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">Not enough attendance data.</div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 max-w-md mx-auto pb-24 animate-in fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">AI Insights</h1>
        <p className="text-slate-500 text-sm font-medium">Performance analytics and recommendations.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {myClasses.length > 0 ? (
          myClasses.map((cls) => (
            <button key={cls} onClick={() => setActiveClass(cls)} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${activeClass === cls ? 'bg-[#1e293b] border-[#1e293b] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {cls} 
            </button>
          ))
        ) : (
           <span className="text-sm font-medium text-slate-500">No classes assigned.</span>
        )}
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => setActiveSheet('score')} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-blue-300 transition-colors">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Score</span>
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-slate-800">{insightsData.avgScore}{insightsData.avgScore !== '--' ? '%' : ''}</span>
            {insightsData.avgScore >= 50 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
          </div>
        </button>

        <button onClick={() => { setActiveSheet('attendance'); setAttendanceViewMode('timeline'); }} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-blue-300 transition-colors">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance</span>
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-slate-800">{attendanceStat}%</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          </div>
        </button>

        <button onClick={() => setActiveSheet('homework')} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-blue-300 transition-colors">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">HW Done</span>
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-emerald-600">92%</span>
          </div>
        </button>
      </div>

      <button onClick={() => setActiveSheet('trends')} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 mb-8 hover:bg-slate-50 transition-colors active:scale-95">
        <BarChart2 className="w-5 h-5 text-slate-400" /> View Full Trend Analytics
      </button>

      {/* 🚀 NEW: CLASS TEACHER ONLY LOW ATTENDANCE ALERT */}
      {isClassTeacher && lowAttendanceStudents.length > 0 && (
        <div className="mb-8 bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-rose-900 font-black mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5"/> Mandatory Attendance Alert
          </h3>
          <p className="text-sm text-rose-700 mb-4 leading-relaxed font-medium">
            <span className="font-bold">{lowAttendanceStudents.length} students</span> in Class {activeClass} have fallen below the mandatory 75% attendance threshold.
          </p>
          <button onClick={exportLowAttendanceCSV} className="w-full bg-white text-rose-700 font-bold py-3 rounded-xl border border-rose-200 shadow-sm flex items-center justify-center gap-2 hover:bg-rose-100 active:scale-95 transition-all">
            <Download className="w-4 h-4"/> Download Defaulters CSV
          </button>
        </div>
      )}

      {/* AI Suggestions */}
      <div className="mb-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-500" /> AI Suggestions
        </h3>
        <div className={`bg-${insightsData.suggestionColor}-50/50 border border-${insightsData.suggestionColor}-100 p-4 rounded-2xl`}>
          <h4 className={`font-bold text-${insightsData.suggestionColor}-900 mb-1.5`}>{insightsData.suggestionTitle}</h4>
          <p className={`text-sm text-${insightsData.suggestionColor}-700/90 mb-4 leading-relaxed`}>{insightsData.suggestionMessage}</p>
          <button className={`w-full bg-white border border-${insightsData.suggestionColor}-200 text-${insightsData.suggestionColor}-700 font-bold py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-${insightsData.suggestionColor}-50 transition-colors`}>
            <CheckCircle2 className="w-4 h-4" /> {insightsData.suggestionAction}
          </button>
        </div>
      </div>

      {/* Needs Attention */}
      <div className="mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-500" /> Needs Attention
        </h3>
        {insightsData.atRisk.length > 0 ? (
          <div className="space-y-3">
            {insightsData.atRisk.map(student => (
              <div key={student._id} className="bg-white border-l-4 border-l-rose-500 border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between hover:border-rose-200 cursor-pointer">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-800">{student.name}</h4>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">Roll {student.rollNumber}</span>
                  </div>
                  <p className="text-xs font-bold text-rose-600">{student.reason}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center"><User className="w-5 h-5 text-rose-400" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
             <h4 className="font-bold text-slate-800 mb-1">All Clear!</h4>
             <p className="text-xs text-slate-500">No students are currently flagged for low performance.</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {activeSheet !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-md h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-800 capitalize">{activeSheet} Record</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class {activeClass}</p>
              </div>
              <button onClick={() => { setActiveSheet(null); setAttendanceViewMode('timeline'); }} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto ${activeSheet === 'attendance' && attendanceViewMode === 'timeline' ? 'p-5' : 'p-0'}`}>
              
              {activeSheet === 'attendance' && (
                attendanceViewMode === 'timeline' ? (
                  <div className="space-y-4 pb-20">
                    {attendanceHistory.length > 0 ? (
                      attendanceHistory.map((day) => {
                        const presentCount = day.records.filter(r => r.currentStatus === 'Present').length;
                        const absentStudents = day.records.filter(r => r.currentStatus === 'Absent');
                        const formattedDate = new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        return (
                          <div key={day._id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-bold text-slate-800">{formattedDate}</h3>
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md uppercase tracking-wide">{presentCount} Present</span>
                            </div>
                            {absentStudents.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-200/60">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Absentees</p>
                                <div className="flex flex-wrap gap-2">
                                  {absentStudents.map(student => (
                                    <span key={student.rollNumber} className="text-xs font-bold text-rose-700 bg-rose-100/80 px-2 py-1 rounded-md">{student.rollNumber} - {student.name}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10"><p className="text-slate-500 font-medium">No attendance history found.</p></div>
                    )}
                    <div className="pt-6">
                      <button onClick={() => setAttendanceViewMode('sheet')} className="bg-slate-800 w-full text-white font-bold px-6 py-4 rounded-2xl shadow-md hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Table className="w-5 h-5" /> Open Attendance Sheet
                      </button>
                    </div>
                  </div>
                ) : (
                  renderAttendanceSheet()
                )
              )}

              {activeSheet === 'score' && renderScoreSheet()}
              {activeSheet === 'homework' && renderHomeworkSheet()}
              {activeSheet === 'trends' && renderTrendsSheet()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}