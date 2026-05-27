import React, { useState } from 'react';

// Import our new modular Lego blocks
import ProfileMain from '../components/profile/ProfileMain';
import ClassManagement from '../components/profile/ClassManagement';
import AccountSecurity from '../components/profile/AccountSecurity';

export default function Profile() {
  // State to manage which settings screen we are looking at
  const [activeView, setActiveView] = useState('main'); 

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      
      {/* TRAFFIC COP LOGIC */}
      {activeView === 'main' && <ProfileMain setActiveView={setActiveView} />}
      {activeView === 'classes' && <ClassManagement setActiveView={setActiveView} />}
      {activeView === 'security' && <AccountSecurity setActiveView={setActiveView} />}
      
    </div>
  );
}