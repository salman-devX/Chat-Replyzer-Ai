import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  PhoneCall,
  CalendarCheck,
  Kanban,
  BarChart3,
  ShieldAlert,
  BookOpen,
  Bot,
  UserCheck,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useApp();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads', path: '/leads', icon: Users },
    { label: 'Customers', path: '/customers', icon: Building2 },
    { label: 'AI Calls', path: '/calls', icon: PhoneCall, badge: 'Live' },
    { label: 'Follow-ups', path: '/follow-ups', icon: CalendarCheck },
    { label: 'Deals', path: '/deals', icon: Kanban },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Objections', path: '/objections', icon: ShieldAlert },
    { label: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { label: 'AI Agent', path: '/ai-agent', icon: Bot, isAi: true },
    { label: 'Team', path: '/team', icon: UserCheck },
    { label: 'Notifications', path: '/notifications', icon: Bell, count: unreadNotificationsCount },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-navy-950/95 backdrop-blur-xl border-r border-navy-800/80 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-navy-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 p-0.5 flex items-center justify-center shadow-glow-sm shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">TruckPilot</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Freight Sales Engine</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-glow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-900/80'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.isAi ? 'text-indigo-400 group-hover:text-indigo-300' : ''}`} />

                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 font-semibold uppercase animate-pulse">
                    {item.badge}
                  </span>
                )}

                {!collapsed && typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold">
                    {item.count}
                  </span>
                )}

                {/* Floating tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded bg-navy-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-xl z-50 border border-navy-700">
                    {item.label}
                    {item.count > 0 && ` (${item.count})`}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3 border-t border-navy-800/80 bg-navy-950">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-navy-900/60 border border-navy-800 hover:border-navy-700 transition ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'User avatar'}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-blue-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-navy-950"></span>
          </div>

          {!collapsed && (
            <div className="truncate flex-1 min-w-0">
              <h5 className="text-xs font-semibold text-white truncate">{user?.name || 'Alex Rivera'}</h5>
              <p className="text-[11px] text-slate-400 truncate">{user?.role || 'Senior Freight Sales Rep'}</p>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={logout}
              title="Sign out"
              className="text-slate-400 hover:text-rose-400 p-1 rounded-md transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
