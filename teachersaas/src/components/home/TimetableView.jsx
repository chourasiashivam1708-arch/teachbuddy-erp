import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function TimetableView({ setActiveView }) {
  const [activeDay, setActiveDay] = useState('Mon');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const schedule = [
    { id: 1, time: '08:00 AM - 08:45 AM', name: 'Class 8A', subject: 'Mathematics', room: 'Room 102' },
    { id: 2, time: '08:45 AM - 09:30 AM', name: 'Class 9B', subject: 'Physics', room: 'Lab 3' },
    { id: 3, time: '10:00 AM - 10:45 AM', name: 'Class 10C', subject: 'Mathematics', room: 'Room 205' },
    { id: 4, time: '11:30 AM - 12:15 PM', name: 'Class 8B', subject: 'Physics', room: 'Lab 1' },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Weekly Timetable</h1>
      </div>

      <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6">
        {days.map(day => (
          <button 
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeDay === day ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {schedule.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
             <div className="bg-slate-50 text-slate-600 p-2.5 rounded-xl text-center min-w-[70px]">
              <Clock className="w-5 h-5 mx-auto mb-1 stroke-[2px]" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 mb-1">{cls.time}</p>
              <h3 className="font-bold text-slate-800">{cls.name}</h3>
              <p className="text-sm text-slate-500 font-medium">{cls.subject} • {cls.room}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}