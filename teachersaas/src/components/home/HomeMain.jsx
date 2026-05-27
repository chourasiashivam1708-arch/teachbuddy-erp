import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, FileText, BrainCircuit, BookOpen, ChevronRight, Clock } from 'lucide-react';

export default function HomeMain({ setActiveView }) {
  const navigate = useNavigate();

  const todaysClasses = [
    { id: 1, time: '08:00 AM', name: 'Class 8A', subject: 'Mathematics', room: 'Room 102' },
    { id: 2, time: '08:45 AM', name: 'Class 9B', subject: 'Physics', room: 'Lab 3' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 pt-2">
        <div>
          <p className="text-slate-500 text-sm font-medium">Monday, May 25</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Good morning, Shivam!</h1>
        </div>
        {/* NEW: Navigates to Notifications */}
        <button 
          onClick={() => setActiveView('notifications')}
          className="relative p-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* ALERTS */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-2 hide-scrollbar">
        <div className="min-w-[140px] bg-amber-50 border border-amber-200 p-3 rounded-xl shadow-sm">
          <p className="text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-1">Pending Task</p>
          <p className="text-amber-900 font-semibold text-sm leading-tight">Grade 8A Unit Tests</p>
        </div>
        <div className="min-w-[140px] bg-blue-50 border border-blue-200 p-3 rounded-xl shadow-sm">
          <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1">Schedule</p>
          <p className="text-blue-900 font-semibold text-sm leading-tight">5 Classes Today</p>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/classroom', { state: { targetTab: 'attendance' } })} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Users className="w-5 h-5 stroke-[2px]" /></div>
            <span className="text-sm font-bold text-slate-700">Attendance</span>
          </button>
          <button onClick={() => navigate('/classroom', { state: { targetTab: 'grades' } })} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-purple-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-5 h-5 stroke-[2px]" /></div>
            <span className="text-sm font-bold text-slate-700">Homework</span>
          </button>
          <button onClick={() => navigate('/teaching', { state: { targetTool: 'quiz' } })} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-emerald-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><BrainCircuit className="w-5 h-5 stroke-[2px]" /></div>
            <span className="text-sm font-bold text-slate-700">AI Quiz</span>
          </button>
          <button onClick={() => navigate('/teaching', { state: { targetTool: 'lesson' } })} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-rose-300 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5 stroke-[2px]" /></div>
            <span className="text-sm font-bold text-slate-700">Lesson Plan</span>
          </button>
        </div>
      </div>

      {/* TODAY'S CLASSES */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Up Next</h2>
          {/* NEW: Navigates to Timetable */}
          <button onClick={() => setActiveView('timetable')} className="text-blue-600 text-xs font-bold hover:underline">View Timetable</button>
        </div>
        <div className="space-y-3">
          {todaysClasses.map((cls) => (
            <div key={cls.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 text-slate-600 p-2 rounded-xl text-center min-w-[60px]">
                  <Clock className="w-4 h-4 mx-auto mb-1 stroke-[2.5px]" />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">{cls.time}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{cls.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{cls.subject} • {cls.room}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-400 w-5 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}