import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import our modular Lego blocks
import TeachingHub from '../components/teaching/TeachingHub';
import LessonPlanner from '../components/teaching/LessonPlanner';
import QuizGenerator from '../components/teaching/QuizGenerator';
import WorksheetGenerator from '../components/teaching/WorksheetGenerator';
import NotesMaterials from '../components/teaching/NotesMaterials';

export default function Teaching() {
  const location = useLocation();
  // 'hub' is the default view showing the grid of tools
  const [activeTool, setActiveTool] = useState(location.state?.targetTool || 'hub');

  useEffect(() => {
    if (location.state?.targetTool) {
      setActiveTool(location.state.targetTool);
    }
  }, [location.state]);

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      {/* HEADER */}
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Teaching Hub</h1>
        <p className="text-slate-500 text-sm font-medium">AI assistants and classroom materials.</p>
      </div>

      {/* TRAFFIC COP LOGIC */}
      {activeTool === 'hub' && <TeachingHub setActiveTool={setActiveTool} />}
      {activeTool === 'lesson' && <LessonPlanner setActiveTool={setActiveTool} />}
      {activeTool === 'quiz' && <QuizGenerator setActiveTool={setActiveTool} />}
      {activeTool === 'worksheet' && <WorksheetGenerator setActiveTool={setActiveTool} />}
      {activeTool === 'notes' && <NotesMaterials setActiveTool={setActiveTool} />}
    </div>
  );
}