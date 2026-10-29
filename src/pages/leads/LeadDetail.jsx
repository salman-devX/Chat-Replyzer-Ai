import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  PhoneCall,
  Calendar,
  DollarSign,
  FileText,
  Edit,
  Bot,
  User,
  Truck,
  MapPin,
  Clock,
  ShieldAlert,
  Sparkles,
  CheckCircle,
  Plus,
  Send,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemperatureBadge, LeadScoreBadge, StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, addFollowup, addDeal, showToast } = useApp();

  const lead = leads.find((l) => l.id === id) || leads[0];

  // Local state for modals & forms
  const [activeTab, setActiveTab] = useState('overview'); // overview, conversation, timeline, notes
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([
    {
      id: 1,
      author: 'Alex Rivera',
      time: 'Today 10:20 AM',
      text: 'Marcus Vance indicated interest in our Love\'s diesel discount tiers. He confirmed their Motive contract has 45 days left.'
    },
    {
      id: 2,
      author: 'TruckPilot AI',
      time: 'Yesterday 3:15 PM',
      text: 'Auto-transcript summary: Objection regarding hardware replacement downtime successfully countered with OBD hot-swap guarantee.'
    }
  ]);

  const [followupForm, setFollowupForm] = useState({
    date: 'Today',
    time: '2:30 PM CST',
    reason: 'Review customized 42-truck pricing comparison PDF',
    priority: lead.temperature || 'HOT'
  });

  const [dealForm, setDealForm] = useState({
    dealValue: 38500,
    service: lead.service || 'ELD & Fuel Card Program',
    stage: 'Qualified'
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([
      {
        id: Date.now(),
        author: 'Alex Rivera',
        time: 'Just now',
        text: newNote
      },
      ...notesList
    ]);
    setNewNote('');
    showToast('Note saved to carrier file');
  };

  const handleScheduleFollowup = (e) => {
    e.preventDefault();
    addFollowup({
      customerName: lead.name,
      company: lead.company,
      date: followupForm.date,
      time: followupForm.time,
      reason: followupForm.reason,
      priority: followupForm.priority,
      leadId: lead.id,
      fleetSize: lead.fleetSize
    });
    setIsFollowupModalOpen(false);
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    addDeal({
      company: lead.company,
      contact: lead.name,
      dealValue: Number(dealForm.dealValue),
      service: dealForm.service,
      leadScore: lead.leadScore,
      stage: dealForm.stage,
      fleetSize: lead.fleetSize,
      expectedClose: 'Oct 15, 2026'
    });
    setIsDealModalOpen(false);
    navigate('/deals');
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/leads"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all leads
        </Link>
      </div>

      {/* Header Profile Bar */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Truck className="w-7 h-7 text-blue-400" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {lead.company}
              </h1>
              <TemperatureBadge temperature={lead.temperature} />
              <LeadScoreBadge score={lead.leadScore} />
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Contact: <span className="text-white font-medium">{lead.name}</span> ({lead.title}) • {lead.location}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/calls/call-504/live')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-ai transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            Call with AI
          </button>

          <button
            onClick={() => showToast(`Initiating manual VoIP call to ${lead.phone}...`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-slate-200 text-xs font-medium transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
            Call Manually
          </button>

          <button
            onClick={() => setIsFollowupModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-slate-200 text-xs font-medium transition"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            Schedule Follow-up
          </button>

          <button
            onClick={() => setIsDealModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Create Deal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-800 text-xs font-medium gap-6">
        {[
          { id: 'overview', label: 'Overview & Intelligence' },
          { id: 'conversation', label: 'AI Voice Conversation History' },
          { id: 'timeline', label: 'Event Timeline' },
          { id: 'notes', label: `Notes (${notesList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition relative ${
              activeTab === tab.id
                ? 'text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Intelligence */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Information (1 col) */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              Company Information
            </h3>

            <div className="space-y-3 divide-y divide-navy-800/60">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Company Name</span>
                <span className="text-white font-medium">{lead.company}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Primary Contact</span>
                <span className="text-white font-medium">{lead.name}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Phone</span>
                <span className="text-white font-mono">{lead.phone}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-blue-400 font-mono">{lead.email}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Terminal Location</span>
                <span className="text-white">{lead.location}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Fleet Size (Power Units)</span>
                <span className="text-white font-mono font-bold bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                  {lead.fleetSize} Trucks
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Equipment Type</span>
                <span className="text-white">{lead.truckType}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Current Provider</span>
                <span className="text-amber-400 font-medium">{lead.currentProvider}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Annual Deal Potential</span>
                <span className="text-emerald-400 font-mono font-bold">{lead.annualEstimate}</span>
              </div>
            </div>
          </div>

          {/* Lead Intelligence & Next Action (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Intelligence Card */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Lead Intelligence & Propensity Score
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Engine: Voice NLP v2.4
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400">Lead Score</span>
                  <div className="text-xl font-bold text-white font-mono mt-1">
                    {lead.leadScore} <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                </div>

                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400">Temperature</span>
                  <div className="text-base font-bold text-red-400 mt-1 flex items-center gap-1">
                    🔥 HOT
                  </div>
                </div>

                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400">Buying Intent</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    High (84%)
                  </div>
                </div>

                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-[11px] text-slate-400">Contract Status</span>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    Expires 45d
                  </div>
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 space-y-1.5">
                <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  Recommended Next Action
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Call Marcus Vance at 2:30 PM today. Present the $18,000/year estimated fuel discount savings breakdown and apply the 45-day contract buyout credit to neutralize Motive’s cancellation friction.
                </p>
              </div>
            </div>

            {/* Objections Identified */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Objections Encountered During AI Calls
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                  <span className="font-semibold text-rose-400">Price / Hardware</span>
                  <p className="text-slate-400 text-[11px]">Concerned about upfront cost for 42 new devices.</p>
                  <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Resolved: Free Lease
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                  <span className="font-semibold text-amber-400">Existing Provider</span>
                  <p className="text-slate-400 text-[11px]">45 days left on Motive subscription.</p>
                  <span className="inline-block text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    Pending Buyout Letter
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                  <span className="font-semibold text-purple-400">Downtime</span>
                  <p className="text-slate-400 text-[11px]">Cannot park trucks during haul season.</p>
                  <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Resolved: OBD Hot-Swap
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Voice Conversation History */}
      {activeTab === 'conversation' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-navy-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Live AI Call Transcript & Audio Telemetry
              </h3>
              <p className="text-xs text-slate-400">Session ID: call-501 • Duration: 4m 32s • Sentiment: Highly Positive</p>
            </div>
            <Link
              to="/calls/call-501/summary"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Full AI Call Summary & Analytics →
            </Link>
          </div>

          {/* Transcript bubbles */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-navy-950 border border-navy-800 rounded-2xl p-4 text-xs text-slate-200 max-w-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold text-indigo-300">TruckPilot AI Voice Agent</span>
                  <span>00:04</span>
                </div>
                <p>
                  &ldquo;Hi Marcus, this is Jordan calling from TruckPilot Logistics Intelligence. I noticed ABC Logistics recently expanded your dry van fleet along the Texas-Midwest corridor. How is your current ELD and telematics setup handling that extra capacity?&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 text-xs text-slate-200 max-w-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-blue-300">Marcus Vance (Fleet Operations Dir.)</span>
                  <span>00:15</span>
                </div>
                <p>
                  &ldquo;Hey Jordan. Yeah, we added 8 trailers last month. Honestly, we&apos;re with Motive right now. The hardware works fine, but our monthly per-truck software fees and fuel card margins are getting ridiculous.&rdquo;
                </p>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-navy-950 border border-navy-800 rounded-2xl p-4 text-xs text-slate-200 max-w-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold text-indigo-300">TruckPilot AI Voice Agent</span>
                  <span>00:32</span>
                </div>
                <p>
                  &ldquo;That is verbatim what three other 40-truck fleets told us this month. Motive charges upwards of $45 per truck on software alone. With TruckPilot, we bundle FMCSA-certified ELD, dispatch, and an average $0.52/gal fuel rebate for $24/unit. For 42 trucks, that saves you roughly $18,000 every single year.&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 text-xs text-slate-200 max-w-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-blue-300">Marcus Vance</span>
                  <span>00:58</span>
                </div>
                <p>
                  &ldquo;Eighteen grand is not pocket change. But what about my contract? I still have about 45 days left on our Motive agreement, and we can&apos;t afford to have trucks sitting idle swapping out hardware.&rdquo;
                </p>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Lead Activity Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-800">
            <div className="relative">
              <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-navy-900"></span>
              <div className="text-xs">
                <span className="text-[10px] text-slate-500">Today, 10:14 AM</span>
                <h4 className="font-semibold text-white mt-0.5">AI Voice Call Completed (4m 32s)</h4>
                <p className="text-slate-400">Lead qualified. Motive 45-day contract confirmed.</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-navy-900"></span>
              <div className="text-xs">
                <span className="text-[10px] text-slate-500">Today, 10:20 AM</span>
                <h4 className="font-semibold text-white mt-0.5">Follow-up Call Scheduled</h4>
                <p className="text-slate-400">Scheduled for Today at 2:30 PM CST with Alex Rivera.</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-navy-900"></span>
              <div className="text-xs">
                <span className="text-[10px] text-slate-500">Yesterday, 4:00 PM</span>
                <h4 className="font-semibold text-white mt-0.5">FMCSA SAFER Profile Imported</h4>
                <p className="text-slate-400">USDOT #3948191 verified: 42 power units, 0 critical violations.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notes */}
      {activeTab === 'notes' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Internal Sales & Account Notes
          </h3>

          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add internal note regarding pricing concessions, driver preferences, or call feedback..."
              className="w-full p-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Save Note
              </button>
            </div>
          </form>

          <div className="space-y-3 divide-y divide-navy-800">
            {notesList.map((n) => (
              <div key={n.id} className="pt-3 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-white">{n.author}</span>
                  <span className="text-slate-500">{n.time}</span>
                </div>
                <p className="text-slate-300">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Followup Modal */}
      <Modal
        isOpen={isFollowupModalOpen}
        onClose={() => setIsFollowupModalOpen(false)}
        title={`Schedule Follow-up with ${lead.name}`}
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
            <label className="block text-slate-300 font-medium mb-1">Time (with timezone)</label>
            <input
              type="text"
              required
              value={followupForm.time}
              onChange={(e) => setFollowupForm({ ...followupForm, time: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Objective / Reason</label>
            <input
              type="text"
              required
              value={followupForm.reason}
              onChange={(e) => setFollowupForm({ ...followupForm, reason: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Priority</label>
            <select
              value={followupForm.priority}
              onChange={(e) => setFollowupForm({ ...followupForm, priority: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            >
              <option value="HOT">🔥 HOT</option>
              <option value="WARM">🟡 WARM</option>
              <option value="COLD">🔵 COLD</option>
            </select>
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

      {/* Create Deal Modal */}
      <Modal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        title={`Create Sales Deal for ${lead.company}`}
      >
        <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Estimated Annual Deal Value ($)</label>
            <input
              type="number"
              required
              value={dealForm.dealValue}
              onChange={(e) => setDealForm({ ...dealForm, dealValue: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Product / Service Package</label>
            <input
              type="text"
              required
              value={dealForm.service}
              onChange={(e) => setDealForm({ ...dealForm, service: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Pipeline Stage</label>
            <select
              value={dealForm.stage}
              onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            >
              <option value="Qualified">Qualified</option>
              <option value="Interested">Interested</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDealModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              Add to Kanban Pipeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
