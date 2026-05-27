import React, { useState } from 'react';

// Import our new modular Lego blocks
import HomeMain from '../components/home/HomeMain';
import NotificationsPanel from '../components/home/NotificationsPanel';
import TimetableView from '../components/home/TimetableView';

export default function HomeDashboard() {
  // State to manage which Home sub-screen we are looking at
  const [activeView, setActiveView] = useState('main'); 

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      {/* TRAFFIC COP LOGIC */}
      {activeView === 'main' && <HomeMain setActiveView={setActiveView} />}
      {activeView === 'notifications' && <NotificationsPanel setActiveView={setActiveView} />}
      {activeView === 'timetable' && <TimetableView setActiveView={setActiveView} />}
    </div>
  );
}
 