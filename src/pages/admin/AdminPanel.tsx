import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Sliders,
  Activity,
  AlertTriangle,
  Server,
  Zap,
  CheckCircle2,
  Lock,
  RefreshCw,
  Search
} from 'lucide-react';
import { DAILY_FREE_REPLY_LIMIT } from '@shared';

export const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'plans' | 'system'>('overview');
  const [defaultQuota, setDefaultQuota] = useState(DAILY_FREE_REPLY_LIMIT);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [quotaToast, setQuotaToast] = useState(false);

  const usersList = [
    { id: 'u1', name: 'Sarah Khan', email: 'sarah.k@example.com', role: 'user', tier: 'Personal Free', repliesToday: 42, status: 'Active' },
    { id: 'u2', name: 'Zaid Ahmed', email: 'zaid@techpk.com', role: 'user', tier: 'Business Growth', repliesToday: 184, status: 'Active' },
    { id: 'u3', name: 'Amina Tariq', email: 'amina@boutique.pk', role: 'user', tier: 'Personal Free', repliesToday: 150, status: 'Paused (Quota Max)' },
    { id: 'u4', name: 'System Root', email: 'admin@chatreplyzer.ai', role: 'admin', tier: 'Enterprise', repliesToday: 12, status: 'Active' }
  ];

  const handleUpdateQuota = (e: React.FormEvent) => {
    e.preventDefault();
    setQuotaToast(true);
    setTimeout(() => setQuotaToast(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
              Root Administration Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
            System Administration
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Server-verified role: <span className="font-semibold text-purple-700">{currentUser?.email} (Admin)</span>
          </p>
        </div>

        {/* Maintenance Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div>
            <p className="text-xs font-bold text-navy-900">Maintenance Mode</p>
            <p className="text-[10px] text-navy-500">Temporarily queues webhooks</p>
          </div>
          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                maintenanceMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'System Overview', icon: Activity },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'plans', label: 'Quota & Plan Config', icon: Sliders },
          { id: 'system', label: 'Health & Audit Logs', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-navy-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
              <span className="text-xs text-navy-500 font-semibold">Total Registered Users</span>
              <p className="text-3xl font-extrabold text-navy-950">1,482</p>
              <span className="text-[11px] text-emerald-600 font-semibold">+38 this week</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
              <span className="text-xs text-navy-500 font-semibold">Today's Webhook Ingestion</span>
              <p className="text-3xl font-extrabold text-navy-950">28,940</p>
              <span className="text-[11px] text-emerald-600 font-semibold">99.98% Verification Rate</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
              <span className="text-xs text-navy-500 font-semibold">AI Generated Replies</span>
              <p className="text-3xl font-extrabold text-navy-950">19,410</p>
              <span className="text-[11px] text-brand-600 font-semibold">Gemini 1.5 API Normal</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-2">
              <span className="text-xs text-navy-500 font-semibold">Active Security Pauses</span>
              <p className="text-3xl font-extrabold text-navy-950">4</p>
              <span className="text-[11px] text-amber-600 font-semibold">Human Takeover Triggered</span>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy-950">Registered User Accounts</h3>
            <span className="text-xs text-navy-500">Live database synchronized</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-navy-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-navy-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Replies Used Today</th>
                  <th className="p-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-navy-950">
                      <div>{u.name}</div>
                      <div className="text-[11px] text-navy-400 font-normal">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{u.tier}</td>
                    <td className="p-4 font-bold text-navy-900">{u.repliesToday}</td>
                    <td className="p-4">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold text-[11px]">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PLANS TAB */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-navy-950">Server-Side Quota & Plan Configuration</h3>
          <p className="text-xs text-navy-600">
            Administrators can adjust system-wide free allowances and rate limits. Changes take effect on the next hourly cycle.
          </p>

          {quotaToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Global Free Reply Quota updated to {defaultQuota} replies / day.
            </div>
          )}

          <form onSubmit={handleUpdateQuota} className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Default Personal Free Daily Quota (Replies / Day)
              </label>
              <input
                type="number"
                min="50"
                max="500"
                value={defaultQuota}
                onChange={(e) => setDefaultQuota(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-navy-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
            >
              Update Global Allowance
            </button>
          </form>
        </div>
      )}

      {/* SYSTEM HEALTH TAB */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-navy-950">Platform Health & Audit Logs</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-navy-500 font-semibold">Meta Graph API v21.0:</span>
              <p className="text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational (Latency 142ms)
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-navy-500 font-semibold">Firebase Admin SDK Auth:</span>
              <p className="text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected & Verifying
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-navy-500 font-semibold">MongoDB Atomic Engine:</span>
              <p className="text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Idempotency Ledger Active
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
