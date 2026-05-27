import React from 'react';
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';

export default function AccountSecurity({ setActiveView }) {
  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Password updated successfully!");
    setActiveView('main');
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Security</h1>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <Shield className="w-8 h-8 text-emerald-500" />
          <div>
            <h2 className="font-bold text-slate-800">Change Password</h2>
            <p className="text-xs text-slate-500">Ensure your account is secure</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Current Password</label>
            <input type="password" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all"/>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">New Password</label>
            <input type="password" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all"/>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Confirm New Password</label>
            <input type="password" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all"/>
          </div>

          <button type="submit" className="w-full mt-4 bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
}