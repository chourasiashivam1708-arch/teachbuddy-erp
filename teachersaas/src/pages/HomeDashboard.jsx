import React, { useState } from 'react';
// import React from 'react';
import { useAuth } from '../context/AuthContext';
// Import our new modular Lego blocks
import HomeMain from '../components/home/HomeMain';
import NotificationsPanel from '../components/home/NotificationsPanel';
import TimetableView from '../components/home/TimetableView';

export default function HomeDashboard() {
  // State to manage which Home sub-screen we are looking at
  const [activeView, setActiveView] = useState('main'); 
  // 1. Grab the current user from the Vault
  const { currentUser } = useAuth();

  // 2. Extract their first name
  const firstName = currentUser?.name?.split(' ')[0] || 'Teacher';

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      {/* 3. Inject the dynamic name! */}
      <h2 className="text-2xl font-black text-slate-800 mb-2">Welcome back, {firstName}! 👋</h2>
      {/* TRAFFIC COP LOGIC */}
      {activeView === 'main' && <HomeMain setActiveView={setActiveView} />}
      {activeView === 'notifications' && <NotificationsPanel setActiveView={setActiveView} />}
      {activeView === 'timetable' && <TimetableView setActiveView={setActiveView} />}
    </div>
  );
}
 