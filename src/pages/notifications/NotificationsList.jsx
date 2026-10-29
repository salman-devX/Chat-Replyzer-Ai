import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Headphones,
  Calendar,
  DollarSign,
  Users,
  Sparkles,
  CheckCircle2,
  Trash2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function NotificationsList() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount
  } = useApp();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'UNREAD') return n.unread;
    if (filterType === 'HANDOFF') return n.type === 'handoff';
    if (filterType === 'FOLLOWUP') return n.type === 'followup';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'handoff':
        return <Headphones className="w-4 h-4 text-purple-400" />;
      case 'followup':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'deal':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'lead':
        return <Users className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-400" />
            Notification Intelligence Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time supervisor alerts, AI voice handoffs, and deal status milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 text-xs font-medium hover:bg-navy-850"
            >
              <Check className="w-3.5 h-3.5 text-blue-400" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['ALL', 'UNREAD', 'HANDOFF', 'FOLLOWUP'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              filterType === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-navy-800'
            }`}
          >
            {tab === 'ALL' ? 'All Alerts' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center p-12 bg-navy-900/40 rounded-2xl border border-dashed border-navy-800 text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id);
                if (item.link) navigate(item.link);
              }}
              className={`p-4 rounded-2xl bg-navy-900/80 border transition cursor-pointer flex items-start justify-between gap-4 ${
                item.unread
                  ? 'border-blue-500/50 bg-navy-900/90 shadow-glow-sm'
                  : 'border-navy-800/80 hover:border-navy-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{item.message}</p>
                  <span className="text-[10px] text-slate-500 block font-mono">{item.time}</span>
                </div>
              </div>

              <span className="text-xs text-blue-400 font-medium whitespace-nowrap hover:underline shrink-0">
                View Details →
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
