import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../../components/common/Drawer';

export function ObjectionsList() {
  const { objections } = useApp();
  const [selectedObjection, setSelectedObjection] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            Objection Intelligence Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time objection clustering, conversational approved battle-cards, and resolution history.
          </p>
        </div>
      </div>

      {/* Top 3 High-Impact Objection Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-navy-900 to-navy-900 border border-rose-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold uppercase tracking-wider">
            <span>#1 Top Objection</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">Hardware & Upfront Pricing</div>
          <div className="text-xs text-slate-400 mt-1">42% of negative carrier conversations</div>
          <div className="mt-4 pt-3 border-t border-navy-800 flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-medium">68% Resolution Rate</span>
            <span className="text-slate-500 font-mono">+4.2% this month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-navy-900 to-navy-900 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span>#2 Top Objection</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">Existing Competitor Lock-in</div>
          <div className="text-xs text-slate-400 mt-1">28% of outreach dialogues (Motive/Samsara)</div>
          <div className="mt-4 pt-3 border-t border-navy-800 flex justify-between items-center text-xs">
            <span className="text-blue-400 font-medium">54% Resolution Rate</span>
            <span className="text-slate-500 font-mono">-1.8% this month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-navy-900 to-navy-900 border border-indigo-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider">
            <span>#3 Top Objection</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">Installation & Driver Downtime</div>
          <div className="text-xs text-slate-400 mt-1">18% of fleet operations hesitation</div>
          <div className="mt-4 pt-3 border-t border-navy-800 flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-medium">81% Resolution Rate</span>
            <span className="text-slate-500 font-mono">-3.1% this month</span>
          </div>
        </div>
      </div>

      {/* Objections List Cards */}
      <div className="space-y-4">
        {objections.map((obj) => (
          <div
            key={obj.id}
            onClick={() => setSelectedObjection(obj)}
            className="p-5 bg-navy-900/80 border border-navy-800 hover:border-blue-500/40 rounded-2xl transition cursor-pointer group shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {obj.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{obj.frequency} Frequency</span>
                  <span className="text-[11px] text-slate-500">({obj.trend})</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                  {obj.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-slate-500 text-[10px] block">Historical Win Rate</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">
                    {obj.historicalResolutionRate}
                  </span>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-navy-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white transition flex items-center gap-1 font-medium">
                  Battle-Card <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quote Snippet */}
            <div className="mt-3 p-3 rounded-xl bg-navy-950/70 border border-navy-850 text-xs italic text-slate-300">
              {obj.exampleQuote}
            </div>

            {/* Approved Response Teaser */}
            <div className="mt-3 flex items-start gap-2 text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <p className="line-clamp-2">
                <strong className="text-white">Approved Rep Response: </strong>
                {obj.approvedResponse}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Objection Detail Drawer */}
      <Drawer
        isOpen={!!selectedObjection}
        onClose={() => setSelectedObjection(null)}
        title={selectedObjection?.category || 'Objection Battle-Card'}
      >
        {selectedObjection && (
          <div className="space-y-6 text-xs">
            <div>
              <span className="text-blue-400 font-semibold uppercase text-[10px] tracking-wider">
                {selectedObjection.category}
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {selectedObjection.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-navy-950 rounded-xl border border-navy-800">
              <div>
                <span className="text-slate-500 text-[10px]">Occurrence Frequency</span>
                <div className="font-mono font-bold text-white text-base mt-0.5">
                  {selectedObjection.frequency}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Historical Resolution Rate</span>
                <div className="font-mono font-bold text-emerald-400 text-base mt-0.5">
                  {selectedObjection.historicalResolutionRate}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">
                Common Carrier Verbatim Quote
              </h4>
              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 italic text-slate-300">
                {selectedObjection.exampleQuote}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved Verbal Response (Historically Associated with Positive Outcomes)
              </h4>
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-slate-200 leading-relaxed">
                {selectedObjection.approvedResponse}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">
                Suggested Next Action for Rep
              </h4>
              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-slate-300">
                {selectedObjection.suggestedNextAction}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">
                Related Solutions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedObjection.relatedServices.map((srv, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-navy-950 border border-navy-800 text-slate-300">
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
