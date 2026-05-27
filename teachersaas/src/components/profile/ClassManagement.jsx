import React from 'react';
import { ArrowLeft, Plus, GraduationCap, Users } from 'lucide-react';

export default function ClassManagement({ setActiveView }) {
  const classes = [
    { id: 1, name: '8A Mathematics', students: 34, room: 'Room 102' },
    { id: 2, name: '9B Physics', students: 28, room: 'Lab 3' },
    { id: 3, name: '10C Mathematics', students: 30, room: 'Room 205' },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">My Classes</h1>
        </div>
      </div>

      <button className="w-full bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors font-bold mb-6">
        <Plus className="w-5 h-5 stroke-[2.5px]" />
        Request New Class
      </button>

      <div className="space-y-3">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 text-slate-600 p-2.5 rounded-xl">
                <GraduationCap className="w-6 h-6 stroke-[2px]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{cls.name}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Users className="w-3 h-3" /> {cls.students} Students • {cls.room}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}