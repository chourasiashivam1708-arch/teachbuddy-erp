import React from 'react';
import { ArrowLeft, Target, Award, Calendar } from 'lucide-react';

export default function DetailedAnalytics({ setActiveView, activeClass }) {
  // Mock data for our beautiful CSS charts
  const testScores = [
    { name: 'Unit Test 1', score: 82 },
    { name: 'Midterm Exam', score: 78 },
    { name: 'Unit Test 2', score: 65 },
    { name: 'Unit Test 3', score: 74 },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Analytics: {activeClass}</h2>
      </div>

      {/* CHART 1: Performance Trends */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-slate-800">Class Average Trend</h3>
        </div>
        
        <div className="space-y-4">
          {testScores.map((test, index) => (
            <div key={index}>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{test.name}</span>
                <span className={test.score < 70 ? 'text-rose-500' : 'text-slate-700'}>{test.score}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${test.score < 70 ? 'bg-rose-400' : 'bg-purple-500'}`} 
                  style={{ width: `${test.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHART 2: Topic Mastery */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-slate-800">Topic Mastery</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-bold text-slate-700">Algebra Basics</span>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">Mastered</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-bold text-slate-700">Geometry</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">On Track</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 border-l-4 border-l-amber-400">
            <span className="text-sm font-bold text-slate-700">Word Problems</span>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md">Struggling</span>
          </div>
        </div>
      </div>

    </div>
  );
}