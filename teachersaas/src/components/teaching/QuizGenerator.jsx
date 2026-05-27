import React, { useState } from 'react';
import { ArrowLeft, Sparkles, BrainCircuit } from 'lucide-react';

export default function QuizGenerator({ setActiveTool }) {
  const [difficulty, setDifficulty] = useState('Medium');

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setActiveTool('hub')} className="text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold">Back</span>
        </button>
        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
          <BrainCircuit className="w-4 h-4" /> AI Quiz
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Class</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500">
              <option>8A</option>
              <option>9B</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Subject</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500">
              <option>Mathematics</option>
              <option>Physics</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Topic / Chapter</label>
          <input type="text" placeholder="e.g., Exponents and Powers" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"/>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Difficulty Level</label>
          <div className="flex gap-2">
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <button 
                key={level} 
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border-2 ${difficulty === level ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full mt-4 bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group">
          <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" /> Generate 10 MCQs
        </button>
      </div>
    </div>
  );
}