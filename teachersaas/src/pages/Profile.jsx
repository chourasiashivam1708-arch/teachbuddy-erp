import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import the Vault!

// Import our modular Lego blocks
import ProfileMain from '../components/profile/ProfileMain';
import ClassManagement from '../components/profile/ClassManagement';
import AccountSecurity from '../components/profile/AccountSecurity';

export default function Profile() {
  // 2. Grab the real teacher data and logout function
  const { currentUser, logout } = useAuth();
  
  // State to manage which settings screen we are looking at
  const [activeView, setActiveView] = useState('main'); 

  return (
    <div className="p-4 max-w-md mx-auto pb-24 animate-in fade-in right">
      
      {/* TRAFFIC COP LOGIC - Passing the data down as props! */}
      {activeView === 'main' && (
        <ProfileMain 
          setActiveView={setActiveView} 
          currentUser={currentUser} 
          logout={logout} 
        />
      )}
      
      {activeView === 'classes' && (
        <ClassManagement 
          setActiveView={setActiveView} 
          currentUser={currentUser} 
        />
      )}
      
      {activeView === 'security' && (
        <AccountSecurity 
          setActiveView={setActiveView} 
          currentUser={currentUser} 
        />
      )}
      
    </div>
  );
}