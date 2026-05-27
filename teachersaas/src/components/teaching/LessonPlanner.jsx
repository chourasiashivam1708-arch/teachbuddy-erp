import React from 'react';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

export default function LessonPlanner({ setActiveTool }) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button 
          onClick={() => setActiveTool('hub')}
          className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">AI Lesson Planner</h1>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Topic / Chapter</label>
          <input type="text" placeholder="e.g., Linear Equations" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>
        <button className="w-full mt-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-blue-700 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> Generate Lesson Plan
        </button>
      </div>
    </div>
  );
}