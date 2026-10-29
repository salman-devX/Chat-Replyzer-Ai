import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/brand/BrandLogo';
import {
  LayoutDashboard,
  MessageSquare,
  Sliders,
  FlaskConical,
  ShieldCheck,
  Zap,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const DAILY_FREE_REPLY_LIMIT = 150;

export const DashboardLayout: React.FC = () => {
  const { currentUser, logout, isFirebaseLive } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Unified Inbox', path: '/dashboard/conversations', icon: MessageSquare },
    { name: 'Personality Studio', path: '/dashboard/personality', icon: Sliders },
    { name: 'Conversation Lab', path: '/dashboard/lab', icon: FlaskConical },
    { name: 'Setup Wizard', path: '/onboarding', icon: Sparkles },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-navy-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/90 p-5 justify-between">
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <BrandLogo size="md" withTagline={true} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-50 text-brand-700 shadow-subtle border border-brand-200/60'
                      : 'text-navy-700 hover:bg-slate-100 hover:text-navy-950'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Device & Session Status Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-navy-900">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Session Security
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                E2EE Active
              </span>
            </div>
            <p className="text-[11px] text-navy-600 leading-snug">
              Linked sessions run securely. We never store personal photos or passwords.
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
              {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-bold text-navy-900 truncate">{currentUser?.displayName || 'Active User'}</p>
              <p className="text-[10px] text-navy-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/90 py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-navy-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-navy-500 hidden sm:inline">
              Chat Replyzer AI Studio &bull; Multi-Platform Messaging
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isFirebaseLive && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Dev Sandbox Mode
              </span>
            )}

            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-navy-700 border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600"></span>
            </button>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-navy-700 hover:bg-slate-100 border border-slate-200"
            >
              Public Site
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 z-40">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold ${
                    isActive(item.path) ? 'bg-brand-50 text-brand-700' : 'text-navy-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-navy-500">{currentUser?.email}</span>
              <button onClick={handleLogout} className="text-rose-600 font-semibold">Sign Out</button>
            </div>
          </div>
        )}

        {/* Notification Flyout */}
        {notificationsOpen && (
          <div className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-elevated border border-slate-200 p-4 z-50 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-navy-950 pb-2 border-b border-slate-100">
              <span>Security & Status</span>
              <button onClick={() => setNotificationsOpen(false)} className="text-navy-400 hover:text-navy-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  E2E Privacy Encryption Ready
                </p>
                <p className="text-[11px] text-emerald-700">Device pairing communicates over local cryptographically signed sessions.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-700 space-y-1">
                <p className="font-semibold text-navy-900">Smart Pause Guardrails</p>
                <p className="text-[11px] text-navy-500">Auto-reply will suspend on any sensitive money transfers or requests.</p>
              </div>
            </div>
          </div>
        )}

        {/* Page Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
