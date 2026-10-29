import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PhoneCall,
  Sparkles,
  Headphones,
  Search,
  Filter,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PhoneForwarded,
  ArrowRight,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, LeadScoreBadge, TemperatureBadge } from '../../components/common/Badge';

export function CallsList() {
  const { calls } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const activeCount = calls.filter((c) => c.status === 'Connected' || c.status === 'Calling').length;
  const completedCount = calls.filter((c) => c.status === 'Completed').length;
  const handoffCount = calls.filter((c) => c.status === 'Handoff').length;
  const failedCount = calls.filter((c) => c.status === 'Failed' || c.status === 'No Answer').length;

  const filtered = calls.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      c.customer.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.intent.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-indigo-400" />
            AI Voice Telephony Call Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated freight outreach, live voice transcripts, and supervisor handoffs.
          </p>
        </div>

        <button
          onClick={() => navigate('/calls/call-504/live')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-ai transition self-start sm:self-auto"
        >
          <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
          <span>Launch Live Call Monitor (Call #504)</span>
        </button>
      </div>

      {/* Top 4 Call Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('Connected')}
          className={`p-4 rounded-xl bg-navy-900 border cursor-pointer transition ${
            statusFilter === 'Connected' ? 'border-emerald-500' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Calls</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{activeCount || 1}</div>
          <span className="text-[11px] text-slate-500">Live on audio SIP stream</span>
        </div>

        <div
          onClick={() => setStatusFilter('Completed')}
          className={`p-4 rounded-xl bg-navy-900 border cursor-pointer transition ${
            statusFilter === 'Completed' ? 'border-blue-500' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{completedCount}</div>
          <span className="text-[11px] text-slate-500">Transcript generated</span>
        </div>

        <div
          onClick={() => setStatusFilter('Handoff')}
          className={`p-4 rounded-xl bg-navy-900 border cursor-pointer transition ${
            statusFilter === 'Handoff' ? 'border-purple-500' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Human Handoffs</span>
            <Headphones className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{handoffCount}</div>
          <span className="text-[11px] text-slate-500">Transferred to Sr. Rep</span>
        </div>

        <div
          onClick={() => setStatusFilter('Failed')}
          className={`p-4 rounded-xl bg-navy-900 border cursor-pointer transition ${
            statusFilter === 'Failed' ? 'border-rose-500' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>No Answer / Failed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{failedCount}</div>
          <span className="text-[11px] text-slate-500">Voicemail dropped</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-navy-900/80 border border-navy-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search calls by contact, carrier, or intent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Connected', 'Completed', 'Handoff'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-navy-900/70 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 border-b border-navy-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-4">Customer & Company</th>
                <th className="py-4 px-3">Call Status</th>
                <th className="py-4 px-3">Duration</th>
                <th className="py-4 px-3">Intent Detected</th>
                <th className="py-4 px-3">Outcome</th>
                <th className="py-4 px-3">Lead Score</th>
                <th className="py-4 px-3">Agent</th>
                <th className="py-4 px-3">Timestamp</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((call) => (
                <tr
                  key={call.id}
                  className="hover:bg-navy-800/40 transition group cursor-pointer"
                  onClick={() =>
                    call.status === 'Connected'
                      ? navigate(`/calls/${call.id}/live`)
                      : navigate(`/calls/${call.id}/summary`)
                  }
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-blue-400 transition">
                      {call.customer}
                    </div>
                    <div className="text-[11px] text-slate-400">{call.company}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={call.status} />
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                    {call.duration}
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-200 max-w-[200px] truncate">
                    {call.intent}
                  </td>

                  <td className="py-3.5 px-3 text-slate-300 max-w-[220px] truncate">
                    {call.outcome}
                  </td>

                  <td className="py-3.5 px-3">
                    <LeadScoreBadge score={call.leadScore} />
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {call.agent}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                    {call.date}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {call.status === 'Connected' ? (
                        <Link
                          to={`/calls/${call.id}/live`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-medium text-[11px] shadow-sm flex items-center gap-1 hover:bg-emerald-500 transition"
                        >
                          <Radio className="w-3 h-3 animate-pulse" />
                          Live Stream
                        </Link>
                      ) : (
                        <Link
                          to={`/calls/${call.id}/summary`}
                          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 font-medium text-[11px] transition flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-blue-400" />
                          Summary
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
