import React, { useState } from 'react';
import { User, Moon, Bell, Shield, LogOut, ChevronRight, GraduationCap } from 'lucide-react';

export default function ProfileMain({ setActiveView }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    // In Phase 2, this will clear the JWT token and redirect to login
    alert("Logging out of TeachBuddy...");
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Settings</h1>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl shadow-md text-white flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
            <span className="text-2xl font-bold">SC</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Shivam Chourasia</h2>
            <p className="text-slate-300 text-sm font-medium flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="w-4 h-4" /> Senior Math Teacher
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Workspace</h2>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        
        {/* NEW: Navigates to Class Management */}
        <button onClick={() => setActiveView('classes')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <span className="font-bold text-slate-700">Class Management</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>

        {/* NEW: Navigates to Account Security */}
        <button onClick={() => setActiveView('security')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <span className="font-bold text-slate-700">Account Security</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>

      </div>

      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Preferences</h2>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <span className="block font-bold text-slate-700">Push Notifications</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mt-0.5">Daily Summaries</span>
            </div>
          </div>
          <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-slate-200'}`}>
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></span>
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Moon className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <span className="block font-bold text-slate-700">Dark Theme</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase mt-0.5">Beta Feature</span>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
          </button>
        </div>

      </div>

      <button onClick={handleLogout} className="w-full bg-white border border-rose-200 text-rose-600 p-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors font-bold text-lg">
        <LogOut className="w-5 h-5 stroke-[2.5px]" />
        Sign Out
      </button>
    </div>
  );
}