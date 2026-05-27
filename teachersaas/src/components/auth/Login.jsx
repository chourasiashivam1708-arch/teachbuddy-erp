import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Loader2, GraduationCap, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token); // Success! Save the badge.
      } else {
        setError(data.message || 'Failed to login.');
      }
    } catch (err) {
      setError('Cannot connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Teach<span className="text-blue-600">Buddy</span>
        </h1>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Teacher Login</h2>
        <p className="text-sm text-slate-500 mb-6">Enter your credentials to manage your classroom.</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}