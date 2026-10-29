import React from 'react';
import { Flame, Sun, Snowflake, CheckCircle2, Clock, AlertCircle, PhoneCall, Sparkles } from 'lucide-react';

export function TemperatureBadge({ temperature, size = 'sm' }) {
  const temp = (temperature || '').toUpperCase();
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (temp === 'HOT') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-red-500/15 text-red-400 border border-red-500/30 ${padding}`}>
        <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
        HOT
      </span>
    );
  }
  if (temp === 'WARM') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${padding}`}>
        <Sun className="w-3.5 h-3.5 text-amber-400" />
        WARM
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 ${padding}`}>
      <Snowflake className="w-3.5 h-3.5 text-sky-400" />
      COLD
    </span>
  );
}

export function LeadScoreBadge({ score }) {
  let color = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
  if (score >= 80) color = 'text-red-400 bg-red-500/10 border-red-500/30';
  else if (score >= 60) color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded border ${color}`}>
      <span>{score}</span>
      <span className="text-[10px] text-slate-500 font-normal">/100</span>
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();

  const configs = {
    new: { label: 'New', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    contacted: { label: 'Contacted', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    qualified: { label: 'Qualified', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    interested: { label: 'Interested', bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
    negotiation: { label: 'Negotiation', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    won: { label: 'Won', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    lost: { label: 'Lost', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
    
    // Call statuses
    calling: { label: 'Calling...', bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-400/40' },
    connected: { label: 'Connected', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    completed: { label: 'Completed', bg: 'bg-slate-700/50', text: 'text-slate-300', border: 'border-slate-600/40' },
    handoff: { label: 'Handoff', bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
    'no answer': { label: 'No Answer', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25' },
    failed: { label: 'Failed', bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25' },
  };

  const config = configs[s] || { label: status, bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}
