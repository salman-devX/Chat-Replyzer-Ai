import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function KpiCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  badgeText,
  accentColor = 'blue'
}) {
  const accentBorders = {
    blue: 'hover:border-blue-500/40',
    purple: 'hover:border-indigo-500/40',
    emerald: 'hover:border-emerald-500/40',
    amber: 'hover:border-amber-500/40',
  };

  const iconColors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={`relative bg-navy-900/80 backdrop-blur-md rounded-xl p-5 border border-navy-700/60 shadow-lg transition-all duration-200 ${accentBorders[accentColor] || accentBorders.blue} group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1.5 font-mono">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${iconColors[accentColor] || iconColors.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          {change && (
            <span className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          <span className="text-slate-500">{subtitle || 'vs last month'}</span>
        </div>

        {badgeText && (
          <span className="text-[11px] px-2 py-0.5 rounded bg-navy-800 text-slate-400 border border-navy-700">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
