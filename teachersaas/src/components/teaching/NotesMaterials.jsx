import React, { useState } from 'react';
import { ArrowLeft, FileText, UploadCloud, Folder, Search } from 'lucide-react';

export default function NotesMaterials({ setActiveTool }) {
  const [activeSubject, setActiveSubject] = useState('Math');

  const files = [
    { id: 1, name: 'Algebra_Formula_Sheet.pdf', type: 'pdf', subject: 'Math', size: '2.4 MB' },
    { id: 2, name: 'Ch3_Linear_Eq_Presentation.pptx', type: 'ppt', subject: 'Math', size: '5.1 MB' },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setActiveTool('hub')} className="text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-bold">Back</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center mb-6 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer group">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="font-bold text-slate-800">Upload Material</h3>
        <p className="text-xs text-slate-500 mt-1">Drag and drop PDFs, PPTs, or Docs</p>
      </div>

      {/* Organization Folders */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {['Math', 'Physics', 'Science', 'English'].map((sub) => (
          <button 
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubject === sub ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Folder className={`w-4 h-4 ${activeSubject === sub ? 'text-blue-400' : 'text-slate-400'}`} /> {sub}
          </button>
        ))}
      </div>

      {/* File List */}
      <div className="space-y-3">
        {files.filter(f => f.subject === activeSubject).map((file) => (
          <div key={file.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${file.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm truncate max-w-[180px]">{file.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{file.size} • {file.type.toUpperCase()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}