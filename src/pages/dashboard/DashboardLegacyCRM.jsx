import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  AlertCircle,
  Headphones,
  Plus,
  Play
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
  CartesianGrid
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { TemperatureBadge, StatusBadge } from '../../components/common/Badge';

export function Dashboard() {
  const { user } = useAuth();
  const { followups, calls, leads, deals, showToast } = useApp();
  const navigate = useNavigate();
  const [revenueRange, setRevenueRange] = useState('month');

  // Revenue chart data
  const revenueData = [
    { period: 'Week 1', revenue: 38400, target: 35000 },
    { period: 'Week 2', revenue: 46200, target: 42000 },
    { period: 'Week 3', revenue: 52100, target: 48000 },
    { period: 'Week 4', revenue: 64800, target: 55000 },
  ];

  // Funnel stages data
  const funnelStages = [
    { label: 'New Inbound', count: 1248, pct: '100%', color: 'from-blue-600 to-blue-500' },
    { label: 'Contacted (AI)', count: 940, pct: '75%', color: 'from-blue-500 to-indigo-600' },
    { label: 'Qualified', count: 342, pct: '27%', color: 'from-indigo-600 to-purple-600' },
    { label: 'Interested', count: 186, pct: '15%', color: 'from-purple-600 to-pink-600' },
    { label: 'Negotiation', count: 86, pct: '7%', color: 'from-amber-500 to-orange-500' },
    { label: 'Closed Won', count: 48, pct: '4%', color: 'from-emerald-500 to-teal-500' },
  ];

  // Recent activity stream
  const recentActivities = [
    {
      id: 1,
      type: 'call',
      title: 'AI completed call with Marcus Vance',
      desc: 'ABC Logistics (42 trucks) agreed to contract buyout proposal.',
      time: '12 mins ago',
      icon: Sparkles,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      id: 2,
      type: 'handoff',
      title: 'Human handoff completed to Alex Rivera',
      desc: 'RoadKing Transport escalated for emergency factoring volume discount.',
      time: '45 mins ago',
      icon: Headphones,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 3,
      type: 'deal',
      title: 'Deal moved to Negotiation ($148,000)',
      desc: 'Summit Fleet Systems 120-truck enterprise TMS contract drafted.',
      time: '2 hours ago',
      icon: DollarSign,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 4,
      type: 'qualified',
      title: 'Lead moved to Qualified (Score 86)',
      desc: 'Ironclad Transport (64 trucks) confirmed EDI drayage automation requirement.',
      time: '4 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 5,
      type: 'followup',
      title: 'Follow-up scheduled with Craig Miller',
      desc: 'Great Lakes Hauling scheduled for Sep 26 at 9:00 AM regarding IFTA terms.',
      time: '5 hours ago',
      icon: Calendar,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-6 rounded-2xl border border-navy-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-blue-500/5 blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Pipeline Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your sales pipeline today. 148 automated calls placed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/calls/call-504/live')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-ai transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Watch Live AI Call
          </button>
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-slate-200 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Lead
          </button>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Leads"
          value="1,248"
          change="+12.4%"
          isPositive={true}
          icon={Users}
          accentColor="blue"
          badgeText="162 Added this week"
        />
        <KpiCard
          title="Qualified Leads"
          value="342"
          change="+8.7%"
          isPositive={true}
          icon={CheckCircle2}
          accentColor="purple"
          badgeText="Score ≥ 70"
        />
        <KpiCard
          title="Active Deals"
          value="86"
          change="+6.2%"
          isPositive={true}
          icon={TrendingUp}
          accentColor="amber"
          badgeText="Avg deal: $28.5k"
        />
        <KpiCard
          title="Pipeline Value"
          value="$184,500"
          change="+14.8%"
          isPositive={true}
          icon={DollarSign}
          accentColor="emerald"
          badgeText="Target: $170k"
        />
      </div>

      {/* Additional 4 Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Calls Today</span>
            <div className="text-lg font-bold text-white font-mono">148</div>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            +18% vs avg
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Connected Calls</span>
            <div className="text-lg font-bold text-white font-mono">118</div>
          </div>
          <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            79.7% rate
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Interested Leads</span>
            <div className="text-lg font-bold text-white font-mono">186</div>
          </div>
          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            🔥 32 Hot
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Follow-ups Due</span>
            <div className="text-lg font-bold text-white font-mono">12</div>
          </div>
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            3 High Priority
          </span>
        </div>
      </div>

      {/* Main Grid: Revenue & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart (2 cols) */}
        <div className="lg:col-span-2 bg-navy-900/70 border border-navy-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Pipeline Revenue Trajectory
              </h3>
              <p className="text-xs text-slate-400">Paced against monthly sales quota of $170,000</p>
            </div>

            <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-lg border border-navy-800 self-start sm:self-auto">
              {['week', 'month', 'last month', 'custom'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRevenueRange(tab)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition ${
                    revenueRange === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'month' ? 'This month' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2e54" vertical={false} />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1120',
                    borderColor: '#1e2e54',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Pipeline Closed/Active"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGlow)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  name="Quota Target"
                  stroke="#818cf8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#targetGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-navy-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Actual: $184,500
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Quota: $170,000
              </span>
            </div>
            <span className="text-emerald-400 font-semibold">+108.5% of Goal Achieved</span>
          </div>
        </div>

        {/* Sales Funnel Visualization (1 col) */}
        <div className="bg-navy-900/70 border border-navy-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Sales Funnel Conversion
              </h3>
              <span className="text-xs text-slate-400">Full Pipeline</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Lead progression through automated AI qualification stages.
            </p>

            <div className="space-y-3">
              {funnelStages.map((stage, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{stage.label}</span>
                    <span className="font-mono text-white">
                      {stage.count}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">({stage.pct})</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-500`}
                      style={{ width: stage.pct }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-navy-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Overall Win Rate</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">3.84% Total (14% Qual)</span>
          </div>
        </div>
      </div>

      {/* AI Call Activity Highlight Panel */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-navy-900 to-navy-900 border border-indigo-500/20 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Voice Agent Telemetry Today</h3>
              <p className="text-xs text-slate-400">Fleet cold qualification and objection handling metrics</p>
            </div>
          </div>
          <Link
            to="/calls"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            View all 148 call recordings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800/80">
            <span className="text-[11px] text-slate-400">Total AI Calls</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">148</div>
            <span className="text-[10px] text-slate-500">Scheduled: 180</span>
          </div>

          <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800/80">
            <span className="text-[11px] text-slate-400">Connected</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">118</div>
            <span className="text-[10px] text-emerald-400/80">79.7% connection</span>
          </div>

          <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800/80">
            <span className="text-[11px] text-slate-400">Completed (Full Pitch)</span>
            <div className="text-xl font-bold text-blue-400 font-mono mt-0.5">92</div>
            <span className="text-[10px] text-blue-400/80">62.1% engagement</span>
          </div>

          <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800/80">
            <span className="text-[11px] text-slate-400">Human Handoffs</span>
            <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">11</div>
            <span className="text-[10px] text-purple-300">100% picked up</span>
          </div>

          <div className="p-3 bg-navy-950/60 rounded-xl border border-navy-800/80 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400">Average Duration</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">3m 38s</div>
            <span className="text-[10px] text-slate-400">218 sec avg talk</span>
          </div>
        </div>
      </div>

      {/* Bottom Two Columns: Upcoming Follow-ups & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Follow-ups */}
        <div className="bg-navy-900/70 border border-navy-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Upcoming Follow-ups Today
              </h3>
              <p className="text-xs text-slate-400">Prioritized by lead temperature and deal value</p>
            </div>
            <Link
              to="/follow-ups"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              All Follow-ups →
            </Link>
          </div>

          <div className="space-y-3">
            {followups.slice(0, 4).map((fup) => (
              <div
                key={fup.id}
                className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 hover:border-navy-700 transition flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{fup.company}</span>
                    <TemperatureBadge temperature={fup.priority} size="xs" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{fup.reason}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="text-slate-300 font-medium">{fup.date} {fup.time}</span>
                    <span>•</span>
                    <span>Fleet: {fup.fleetSize || 42} trucks</span>
                    <span>•</span>
                    <span>Rep: {fup.assignedSalesman}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/calls/call-504/live')}
                  className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition shrink-0 ml-3"
                  title="Launch Call with AI or Rep"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="bg-navy-900/70 border border-navy-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Recent Activity & Events
              </h3>
              <p className="text-xs text-slate-400">Live feed from AI call center and reps</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border shrink-0 ${act.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white truncate">{act.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
