import React from 'react';
import { ArrowLeft, Bell, AlertCircle, CalendarClock, CheckCircle2 } from 'lucide-react';

export default function NotificationsPanel({ setActiveView }) {
  const notifications = [
    { id: 1, type: 'alert', title: 'Gradebook Missing', message: 'You have not entered marks for 8A Unit Test.', time: '2 hours ago', unread: true },
    { id: 2, type: 'calendar', title: 'Staff Meeting', message: 'Reminder: All-hands meeting today at 3:00 PM in the Main Hall.', time: '5 hours ago', unread: true },
    { id: 3, type: 'success', title: 'Homework Uploaded', message: '9B Physics assignment has been published successfully.', time: '1 day ago', unread: false },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveView('main')} className="p-2 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Notifications</h1>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:underline">Mark all read</button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-2xl border shadow-sm flex gap-3 ${notif.unread ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100'}`}>
            <div className="mt-1">
              {notif.type === 'alert' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {notif.type === 'calendar' && <CalendarClock className="w-5 h-5 text-amber-500" />}
              {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <div>
              <h3 className={`text-sm font-bold ${notif.unread ? 'text-slate-800' : 'text-slate-600'}`}>{notif.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
              <span className="text-[10px] font-bold text-slate-400 mt-2 block uppercase">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}