import React from 'react';
import { Bell, Trash2, CheckSquare, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/common/EmptyState';

export default function Notifications() {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications 
  } = useApp();

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
  };

  const getIcon = (type) => {
    const iconClass = "w-5 h-5 shrink-0";
    if (type === 'promo') return <Sparkles className={`${iconClass} text-indigo-500`} />;
    if (type === 'sale') return <AlertTriangle className={`${iconClass} text-rose-500`} />;
    return <ShieldCheck className={`${iconClass} text-emerald-500`} />;
  };

  return (
    <div className="pb-16 max-w-3xl mx-auto space-y-6">
      
      {/* Header controls */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Notifications Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay up to date with order tracking updates, sales, and account events.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all as read</span>
            </button>
            <button
              onClick={clearAllNotifications}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Alert List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 opacity-70'
                  : 'bg-white dark:bg-slate-900 border-primary-100 dark:border-primary-950/40 shadow-sm relative ring-2 ring-primary-500/5 dark:ring-primary-500/10'
              }`}
            >
              {/* Unread blue dot */}
              {!notif.read && (
                <span className="absolute top-5 right-5 block h-2 w-2 bg-primary-600 rounded-full animate-pulse" />
              )}

              {/* Icon Container */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                {getIcon(notif.type)}
              </div>

              {/* Info Text */}
              <div className="space-y-1 pr-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {notif.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {notif.message}
                </p>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 pt-1 font-semibold">
                  {notif.time}
                </span>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon="notifications"
            title="All caught up!"
            description="You don't have any notifications right now. We'll alert you when there are tracking or system events."
          />
        )}
      </div>

    </div>
  );
}
