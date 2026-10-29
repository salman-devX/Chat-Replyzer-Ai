import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PhoneCall,
  Flame,
  ShieldAlert,
  Bot,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { analyticsData, initialTeam } from '../../data/mockData';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('30 Days');

  const { callVolume, objectionsChart, aiMetrics } = analyticsData;

  const funnelData = [
    { stage: 'Calls Placed', count: 1248, fill: '#3b82f6' },
    { stage: 'Connected', count: 940, fill: '#60a5fa' },
    { stage: 'Qualified', count: 342, fill: '#6366f1' },
    { stage: 'Interested', count: 186, fill: '#8b5cf6' },
    { stage: 'Won', count: 48, fill: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Revenue & AI Call Intelligence Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative telemetry across automated SIP outbound, rep conversion, and pipeline velocity.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-navy-900 p-1 rounded-xl border border-navy-800 text-xs self-start sm:self-auto">
          {['Today', '7 Days', '30 Days', '90 Days', 'Custom'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* AI Performance Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-navy-900 border border-navy-800 rounded-2xl">
          <span className="text-[11px] text-slate-400">Total Completed Calls</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {aiMetrics.callsCompleted.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400">100% FMCSA audited</span>
        </div>

        <div className="p-4 bg-navy-900 border border-navy-800 rounded-2xl">
          <span className="text-[11px] text-slate-400">Avg Call Duration</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">3m 38s</div>
          <span className="text-[10px] text-slate-500">218 sec conversational</span>
        </div>

        <div className="p-4 bg-navy-900 border border-navy-800 rounded-2xl">
          <span className="text-[11px] text-slate-400">Human Handoff Rate</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {aiMetrics.handoffRate}
          </div>
          <span className="text-[10px] text-purple-300">Target &lt; 12%</span>
        </div>

        <div className="p-4 bg-navy-900 border border-navy-800 rounded-2xl">
          <span className="text-[11px] text-slate-400">Qualification Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {aiMetrics.qualificationRate}
          </div>
          <span className="text-[10px] text-emerald-300">Score &gt; 70 criteria</span>
        </div>

        <div className="p-4 bg-navy-900 border border-navy-800 rounded-2xl col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400">Follow-up Creation</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {aiMetrics.followupCreationRate}
          </div>
          <span className="text-[10px] text-blue-300">Booked into CRM</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Weekly Trends */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                Call Volume & Connection Velocity
              </h3>
              <p className="text-xs text-slate-400">Comparing total dials vs answered carrier connects</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              79.7% Avg Connect
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="connGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2e54" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1120',
                    borderColor: '#1e2e54',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="aiCalls" name="Total Calls" stroke="#3b82f6" strokeWidth={2} fill="url(#callsGrad)" />
                <Area type="monotone" dataKey="connected" name="Connected" stroke="#10b981" strokeWidth={2} fill="url(#connGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Objections Frequency & Resolution */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Top Carrier Objections Encountered
              </h3>
              <p className="text-xs text-slate-400">Total objections detected vs successfully countered</p>
            </div>
            <span className="text-xs font-mono text-blue-400">68% Win Rate on Price</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={objectionsChart} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2e54" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1120',
                    borderColor: '#1e2e54',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Encountered" fill="#ef4444" radius={[0, 4, 4, 0]} />
                <Bar dataKey="resolved" name="Resolved by AI" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales Team Performance Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Freight Sales Team Conversion Scoreboard
          </h3>
          <p className="text-xs text-slate-400">Handoff pickup, deal closure, and revenue conversion by representative</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Sales Representative</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Calls Taken</th>
                <th className="py-3 px-3">Qualified Leads</th>
                <th className="py-3 px-3">Deals Closed</th>
                <th className="py-3 px-3">Pipeline Revenue</th>
                <th className="py-3 px-4 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {initialTeam.map((rep) => (
                <tr key={rep.id} className="hover:bg-navy-800/40 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={rep.avatar} alt={rep.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30" />
                    <span className="font-semibold text-white">{rep.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{rep.role}</td>
                  <td className="py-3 px-3 font-mono text-white">{rep.callsToday}</td>
                  <td className="py-3 px-3 font-mono text-indigo-400">{rep.activeLeads}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{rep.deals}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{rep.revenue}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold">{rep.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
