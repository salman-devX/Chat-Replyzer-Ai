import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
  PhoneCall,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AiStatusDropdown } from '../common/AiStatusDropdown';

export function Header({ onMobileMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setIsSearchOpen, notifications, unreadNotificationsCount, markNotificationRead } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Compute breadcrumbs and title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const rootName = pathParts[0] || 'dashboard';

  const routeTitles = {
    dashboard: 'Sales Pipeline Dashboard',
    leads: 'Freight Leads Intelligence',
    customers: 'Fleet Customer Accounts',
    calls: 'AI Voice Call Center',
    'follow-ups': 'Smart Sales Follow-ups',
    deals: 'Kanban Deal Pipeline',
    analytics: 'Revenue & AI Call Analytics',
    objections: 'Objection Intelligence Matrix',
    'knowledge-base': 'Enterprise Knowledge Base',
    'ai-agent': 'AI Sales Agent Tuning',
    team: 'Sales Representatives & Teams',
    notifications: 'Notification Center',
    settings: 'Platform & SIP Settings',
  };

  const pageTitle = routeTitles[rootName] || (rootName.charAt(0).toUpperCase() + rootName.slice(1));

  return (
    <header className="sticky top-0 z-30 h-16 bg-navy-950/80 backdrop-blur-xl border-b border-navy-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle, Breadcrumb & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
            <Link to="/dashboard" className="hover:text-blue-400 transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 capitalize font-medium">{rootName.replace('-', ' ')}</span>
            {pathParts[1] && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-blue-400 font-mono text-[11px]">{pathParts[1]}</span>
              </>
            )}
          </div>
          <h1 className="text-base lg:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Search, AI status, Notifications, User menu */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Global Search shortcut button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-400 hover:text-slate-200 hover:border-navy-700 transition text-xs shadow-sm"
          title="Search (Ctrl + K)"
        >
          <Search className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-navy-800 rounded border border-navy-700">
            Ctrl K
          </kbd>
        </button>

        {/* AI Agent Status Pill */}
        <AiStatusDropdown />

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-400 hover:text-white hover:border-navy-700 transition"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-white">Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-navy-800 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setNotifOpen(false);
                      if (n.link) navigate(n.link);
                    }}
                    className={`p-2.5 text-xs hover:bg-navy-800/60 cursor-pointer transition rounded-lg my-1 ${
                      n.unread ? 'bg-navy-950/60 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-slate-300 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-navy-900 transition"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-500/40"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-navy-800">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Profile Settings
                </Link>
                <Link
                  to="/ai-agent"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI Voice Tuning
                </Link>
                <Link
                  to="/knowledge-base"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Knowledge Base
                </Link>
              </div>

              <div className="pt-1 border-t border-navy-800">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
