import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

import Login from './components/auth/Login';
import BottomNav from './components/BottomNav';

import HomeDashboard from './pages/HomeDashboard';
import Classroom from './pages/Classroom';
import Teaching from './pages/Teaching';
import Insights from './pages/Insights';
import Profile from './pages/Profile';

// 1. The inner app that actually checks the security badge
function MainContent() {
  const { currentUser, loading } = useAuth();
  // ADD THIS LINE:
  console.log("Loading Status:", loading, "Current User:", currentUser);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800 selection:bg-blue-200">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/teaching" element={<Teaching />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

// 2. The outer app that wraps everything in the Vault
export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}