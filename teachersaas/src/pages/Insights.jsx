import React, { useState } from 'react';

// Import our modular Lego blocks
import InsightsMain from '../components/insights/InsightsMain';
import DetailedAnalytics from '../components/insights/DetailedAnalytics';

export default function Insights() {
  // Traffic Cop States
  const [activeView, setActiveView] = useState('main'); 
  const [activeClass, setActiveClass] = useState('8A Math'); // Lifted state so analytics knows which class to show

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      
      {/* HEADER */}
      <div className="mb-4 pt-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Insights</h1>
        <p className="text-slate-500 text-sm font-medium">Performance analytics and recommendations.</p>
      </div>

      {/* CLASS SELECTOR PILLS (Always visible) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {['8A Math', '9B Physics', '10C Math'].map((cls) => (
          <button 
            key={cls}
            onClick={() => setActiveClass(cls)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeClass === cls ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* TRAFFIC COP LOGIC */}
      {activeView === 'main' && <InsightsMain setActiveView={setActiveView} activeClass={activeClass} />}
      {activeView === 'analytics' && <DetailedAnalytics setActiveView={setActiveView} activeClass={activeClass} />}
      
    </div>
  );
}