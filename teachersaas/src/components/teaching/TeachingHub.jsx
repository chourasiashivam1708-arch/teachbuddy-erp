import React from 'react';
import { BrainCircuit, BookOpen, FileText, Library, Sparkles } from 'lucide-react';

export default function TeachingHub({ setActiveTool }) {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">AI Generators</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        
        <button onClick={() => setActiveTool('lesson')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start gap-3 hover:border-blue-300 hover:shadow-md transition-all text-left relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 stroke-[2px]" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800">Lesson Planner</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Auto-generate outlines</span>
          </div>
          <Sparkles className="absolute top-3 right-3 w-4 h-4 text-blue-200" />
        </button>

        <button onClick={() => setActiveTool('quiz')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start gap-3 hover:border-emerald-300 hover:shadow-md transition-all text-left relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 stroke-[2px]" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800">AI Quiz Maker</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Instant MCQs & Tests</span>
          </div>
          <Sparkles className="absolute top-3 right-3 w-4 h-4 text-emerald-200" />
        </button>

        <button onClick={() => setActiveTool('worksheet')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start gap-3 hover:border-purple-300 hover:shadow-md transition-all text-left relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5 stroke-[2px]" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800">Worksheets</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Practice questions</span>
          </div>
          <Sparkles className="absolute top-3 right-3 w-4 h-4 text-purple-200" />
        </button>

      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Resources</h2>
      <button onClick={() => setActiveTool('notes')} className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all text-left">
        <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
          <Library className="w-6 h-6 stroke-[2px]" />
        </div>
        <div>
          <span className="block text-base font-bold text-slate-800">Notes & Materials</span>
          <span className="block text-xs text-slate-500 mt-0.5">Upload PDFs, PPTs & Question Banks</span>
        </div>
      </button>
    </div>
  );
}