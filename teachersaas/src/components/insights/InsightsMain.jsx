import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertTriangle, BrainCircuit, CheckCircle2, Users, BarChart2 } from 'lucide-react';

export default function InsightsMain({ setActiveView, activeClass }) {
  const navigate = useNavigate();

  const handleApplySuggestion = (e) => {
    e.target.innerHTML = "Added to Lesson Plan!";
    e.target.classList.add('bg-emerald-100', 'text-emerald-700', 'border-emerald-200');
    e.target.classList.remove('bg-white', 'text-purple-700');
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* QUICK STATS */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Avg Score</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-black text-slate-800">74%</span>
            <TrendingUp className="w-3 h-3 text-emerald-500 stroke-[3px]" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Attendance</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-black text-slate-800">88%</span>
            <TrendingDown className="w-3 h-3 text-rose-500 stroke-[3px]" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">HW Done</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-black text-emerald-600">92%</span>
          </div>
        </div>
      </div>
      
      {/* NEW: View Detailed Analytics Button */}
      <button 
        onClick={() => setActiveView('analytics')}
        className="w-full bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl mb-6 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
      >
        <BarChart2 className="w-4 h-4" /> View Full Trend Analytics
      </button>

      {/* AI RECOMMENDATIONS */}
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
        <BrainCircuit className="w-4 h-4 text-purple-500" /> AI Suggestions
      </h2>
      <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 mb-6 shadow-sm">
        <h3 className="font-bold text-purple-900 mb-2">Pacing Alert for {activeClass}</h3>
        <p className="text-sm text-purple-800 mb-3 leading-relaxed">
          The class average dropped by 12% on the recent Word Problems quiz. Consider a 15-minute revision session before starting the next chapter.
        </p>
        <button 
          onClick={handleApplySuggestion}
          className="bg-white border border-purple-200 text-purple-700 text-sm font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-purple-50 transition-colors w-full flex justify-center items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Add Revision to Plan
        </button>
      </div>

      {/* WEAK STUDENTS */}
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-500" /> Needs Attention
      </h2>
      <div className="space-y-3">
        <div onClick={() => navigate('/classroom', { state: { targetTab: 'students', search: 'Rahul Verma' } })} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center border-l-4 border-l-rose-400 cursor-pointer hover:border-blue-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Rahul Verma</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md">Roll 101</span>
            </div>
            <p className="text-rose-600 text-sm font-semibold mt-1">Failed last 2 unit tests</p>
          </div>
          <button className="text-slate-400 bg-slate-50 p-2 rounded-xl"><Users className="w-5 h-5" /></button>
        </div>
      </div>

    </div>
  );
}