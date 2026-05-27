import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Import the specific professional icons we need
import { Home, Users, BookOpen, BarChart2, Settings } from 'lucide-react';

export default function BottomNav() {
  // 2. Map the imported components to our tabs instead of emojis
  const tabs = [
    { id: 'home', path: '/', label: 'Home', icon: Home },
    { id: 'classroom', path: '/classroom', label: 'Classroom', icon: Users },
    { id: 'teaching', path: '/teaching', label: 'Teaching', icon: BookOpen },
    { id: 'insights', path: '/insights', label: 'Insights', icon: BarChart2 },
    { id: 'profile', path: '/profile', label: 'Profile', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center pt-3 pb-5 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.05)] z-50">
      {tabs.map((tab) => {
        // 3. Store the icon in a capitalized variable so React knows it is a component
        const Icon = tab.icon; 
        
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) => 
              `flex flex-col items-center w-full transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* 4. Render the SVG and make it slightly thicker when active */}
                <Icon 
                  className={`mb-1 transition-all duration-200 ${
                    isActive ? 'w-7 h-7 stroke-[2.5px]' : 'w-6 h-6 stroke-[2px]'
                  }`} 
                />
                <span className={`text-[10px] uppercase tracking-wide ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}