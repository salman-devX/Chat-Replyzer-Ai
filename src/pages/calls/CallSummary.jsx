import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Truck,
  Flame,
  ShieldAlert,
  TrendingUp,
  FileText,
  DollarSign,
  Share2,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemperatureBadge, LeadScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function CallSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { calls, addFollowup, showToast } = useApp();

  const call = calls.find((c) => c.id === id) || calls[0];
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);

  const [followupForm, setFollowupForm] = useState({
    date: 'Today',
    time: '2:30 PM CST',
    reason: 'Send customized 42-truck Motive buyout & fuel savings PDF',
    priority: 'HOT'
  });

  const handleScheduleFollowup = (e) => {
    e.preventDefault();
    addFollowup({
      customerName: call.customer,
      company: call.company,
      date: followupForm.date,
      time: followupForm.time,
      reason: followupForm.reason,
      priority: followupForm.priority,
      leadId: call.leadId,
      fleetSize: 42
    });
    setIsFollowupModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/calls"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Call Center
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Summary exported to PDF')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 text-xs hover:bg-navy-850"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button
            onClick={() => setIsFollowupModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm"
          >
            <Calendar className="w-3.5 h-3.5" /> Schedule Follow-up
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  AI Post-Call Intelligence Brief: {call.company}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Spoke with <span className="text-white font-medium">{call.customer}</span> • Call Completed at 10:14 AM
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TemperatureBadge temperature={call.leadTemp || 'HOT'} />
            <LeadScoreBadge score={call.leadScore || 82} />
          </div>
        </div>

        {/* Call Overview KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
            <span className="text-slate-400 text-[11px]">Talk Duration</span>
            <div className="font-mono font-bold text-white text-base mt-0.5">{call.duration}</div>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
            <span className="text-slate-400 text-[11px]">Call Outcome</span>
            <div className="font-semibold text-emerald-400 text-xs mt-0.5">{call.outcome}</div>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
            <span className="text-slate-400 text-[11px]">Intent Class</span>
            <div className="font-semibold text-blue-400 text-xs mt-0.5">{call.intent}</div>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
            <span className="text-slate-400 text-[11px]">Assigned Rep</span>
            <div className="font-semibold text-slate-200 text-xs mt-0.5">Alex Rivera</div>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 col-span-2 sm:col-span-1">
            <span className="text-slate-400 text-[11px]">Customer Sentiment</span>
            <div className="font-semibold text-emerald-400 text-xs mt-0.5">Receptive / Positive (84%)</div>
          </div>
        </div>
      </div>

      {/* Grid of Extracted Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Summary & Objections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              AI Synthesized Call Summary
            </h3>
            <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800/80 text-slate-200 leading-relaxed text-xs">
              &ldquo;Customer Marcus Vance is actively seeking to reduce operating overhead across his 42-truck dry van and reefer fleet. He acknowledged high dissatisfaction with Motive&apos;s escalating monthly software costs ($45/unit) and insufficient fuel discounts. His contract with Motive has approximately 45 days remaining. The AI agent presented our zero-downtime hot-swap OBD package and offered a 45-day contract buyout credit, which resolved his primary friction point. Marcus requested an itemized pricing sheet and agreed to a follow-up call with Alex Rivera today at 2:30 PM CST.&rdquo;
            </div>
          </div>

          {/* Objections Addressed */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Objections Handled During Dialogue
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-navy-950 rounded-xl border border-navy-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-rose-400">Objection: 45 Days Remaining on Motive Contract</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Successfully Addressed</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Customer raised concern of paying double subscriptions if switching before end of month.
                </p>
                <div className="text-indigo-300 font-medium text-[11px] pt-1">
                  AI Solution Applied: 45-Day Overlapping Invoice Buyout Credit ($1,080 value).
                </div>
              </div>

              <div className="p-3.5 bg-navy-950 rounded-xl border border-navy-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-amber-400">Objection: Vehicle Maintenance Yard Downtime</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Successfully Addressed</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Marcus noted rigs cannot afford to sit idle in terminal waiting for professional tech installers.
                </p>
                <div className="text-indigo-300 font-medium text-[11px] pt-1">
                  AI Solution Applied: 4-minute plug-and-play OBD-II self-install during regular DOT rest breaks.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Key Extracted Intelligence & Next Action */}
        <div className="space-y-6">
          {/* Key Facts Extracted */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Structured Facts Extracted
            </h3>

            <div className="divide-y divide-navy-800 space-y-2">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Fleet Size:</span>
                <span className="text-white font-mono font-bold">42 Trucks</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Current Provider:</span>
                <span className="text-amber-400">Motive (KeepTruckin)</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Interested Services:</span>
                <span className="text-blue-400">ELD Mandate + Fuel Card</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Budget Sensitivity:</span>
                <span className="text-rose-400 font-medium">High ($18k target savings)</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Decision Timeline:</span>
                <span className="text-emerald-400 font-medium">1–2 Weeks</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Decision Maker:</span>
                <span className="text-white">Marcus Vance (Solo authority)</span>
              </div>
            </div>
          </div>

          {/* Recommended Next Action Card */}
          <div className="bg-gradient-to-br from-blue-950/70 via-navy-900 to-navy-900 border border-blue-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <Clock className="w-4 h-4 text-blue-400" />
              Recommended Next Action
            </div>

            <p className="text-slate-200 text-xs leading-relaxed">
              Execute scheduled phone consultation today at 2:30 PM CST. Confirm receipt of the 42-truck comparison spreadsheet and review the buyout credit agreement.
            </p>

            <button
              onClick={() => setIsFollowupModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center shadow-glow-sm transition"
            >
              Lock In Follow-up Calendar Event
            </button>
          </div>
        </div>
      </div>

      {/* Follow-up Modal */}
      <Modal
        isOpen={isFollowupModalOpen}
        onClose={() => setIsFollowupModalOpen(false)}
        title={`Schedule Follow-up with ${call.customer}`}
      >
        <form onSubmit={handleScheduleFollowup} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Date</label>
            <input
              type="text"
              required
              value={followupForm.date}
              onChange={(e) => setFollowupForm({ ...followupForm, date: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Time</label>
            <input
              type="text"
              required
              value={followupForm.time}
              onChange={(e) => setFollowupForm({ ...followupForm, time: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Objective / Notes</label>
            <input
              type="text"
              required
              value={followupForm.reason}
              onChange={(e) => setFollowupForm({ ...followupForm, reason: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFollowupModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Confirm Follow-up
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
