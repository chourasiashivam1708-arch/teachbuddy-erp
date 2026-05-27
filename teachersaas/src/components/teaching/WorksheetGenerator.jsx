import React from 'react';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';

export default function WorksheetGenerator({ setActiveTool }) {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button 
          onClick={() => setActiveTool('hub')}
          className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Worksheet Generator</h1>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center py-10">
        <FileText className="w-12 h-12 text-purple-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Custom Worksheets</h2>
        <p className="text-slate-500 text-sm mt-2 mb-4">Enter a topic to generate a printable PDF worksheet with an answer key.</p>
        <button className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-purple-700 mx-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Create Now
        </button>
      </div>
    </div>
  );
}