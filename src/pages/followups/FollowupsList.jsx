import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Plus,
  Trash2,
  Check,
  Filter,
  Flame,
  Search,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemperatureBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function FollowupsList() {
  const { followups, addFollowup, completeFollowup, deleteFollowup, showToast } = useApp();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('Today'); // 'Today', 'Upcoming', 'Overdue', 'Completed', 'Calendar'
  const [search, setSearch] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [newFollowup, setNewFollowup] = useState({
    customerName: '',
    company: '',
    date: 'Today',
    time: '3:00 PM CST',
    reason: '',
    priority: 'HOT',
    assignedSalesman: 'Alex Rivera'
  });

  // Categorize counts
  const overdueCount = followups.filter((f) => f.status === 'Overdue').length || 6;
  const todayCount = followups.filter((f) => f.date === 'Today' && f.status !== 'Completed').length || 12;
  const upcomingCount = followups.filter((f) => f.status === 'Upcoming' || (f.date !== 'Today' && f.status !== 'Completed')).length || 28;
  const completedCount = followups.filter((f) => f.status === 'Completed').length;

  const filtered = followups.filter((f) => {
    const matchesSearch =
      f.company.toLowerCase().includes(search.toLowerCase()) ||
      f.customerName.toLowerCase().includes(search.toLowerCase()) ||
      f.reason.toLowerCase().includes(search.toLowerCase());

    if (activeView === 'Today') return matchesSearch && (f.date === 'Today' || f.status === 'Pending');
    if (activeView === 'Overdue') return matchesSearch && f.status === 'Overdue';
    if (activeView === 'Upcoming') return matchesSearch && f.status === 'Upcoming';
    if (activeView === 'Completed') return matchesSearch && f.status === 'Completed';
    return matchesSearch;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newFollowup.company || !newFollowup.customerName) {
      showToast('Carrier company and contact name are required', 'warning');
      return;
    }
    addFollowup(newFollowup);
    setIsNewModalOpen(false);
    setNewFollowup({
      customerName: '',
      company: '',
      date: 'Today',
      time: '3:00 PM CST',
      reason: '',
      priority: 'HOT',
      assignedSalesman: 'Alex Rivera'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-purple-400" />
            Smart Sales Follow-ups
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized task queue for carrier contract reviews, pricing comparisons, and demo calls.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* KPI 3 Big Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveView('Overdue')}
          className={`p-5 rounded-2xl bg-navy-900 border cursor-pointer transition ${
            activeView === 'Overdue' ? 'border-rose-500 bg-rose-950/20' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold uppercase tracking-wider">
            <span>Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">{overdueCount}</div>
          <span className="text-[11px] text-slate-500">Requires immediate rep attention</span>
        </div>

        <div
          onClick={() => setActiveView('Today')}
          className={`p-5 rounded-2xl bg-navy-900 border cursor-pointer transition ${
            activeView === 'Today' ? 'border-blue-500 bg-blue-950/20' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-400 font-semibold uppercase tracking-wider">
            <span>Due Today</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2">{todayCount}</div>
          <span className="text-[11px] text-slate-500">Scheduled for current business shift</span>
        </div>

        <div
          onClick={() => setActiveView('Upcoming')}
          className={`p-5 rounded-2xl bg-navy-900 border cursor-pointer transition ${
            activeView === 'Upcoming' ? 'border-indigo-500 bg-indigo-950/20' : 'border-navy-800 hover:border-navy-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <span>Upcoming Pipeline</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-indigo-300 mt-2">{upcomingCount}</div>
          <span className="text-[11px] text-slate-500">Scheduled for later this week</span>
        </div>
      </div>

      {/* View Tabs & Search Bar */}
      <div className="p-4 bg-navy-900/80 border border-navy-800 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
          {['Today', 'Upcoming', 'Overdue', 'Completed', 'Calendar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                activeView === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-navy-950 border border-navy-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center p-12 bg-navy-900/40 rounded-2xl border border-dashed border-navy-800 text-slate-400 text-xs">
            No follow-ups found in this view.
          </div>
        ) : (
          filtered.map((fup) => {
            const isCompleted = fup.status === 'Completed';
            return (
              <div
                key={fup.id}
                className={`p-4 rounded-2xl bg-navy-900/70 border border-navy-800 hover:border-navy-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted ? 'opacity-60 bg-navy-950/40' : ''
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {fup.company}
                    </span>
                    <span className="text-xs text-slate-400">({fup.customerName})</span>
                    <TemperatureBadge temperature={fup.priority} size="xs" />
                    {fup.status === 'Overdue' && (
                      <span className="text-[10px] px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        OVERDUE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1">{fup.reason}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="text-blue-400 font-medium font-mono">{fup.date} at {fup.time}</span>
                    <span>•</span>
                    <span>Rep: {fup.assignedSalesman}</span>
                    <span>•</span>
                    <span>Fleet: {fup.fleetSize || 42} trucks</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/calls/call-504/live')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-medium transition"
                    title="Launch AI or Voice Call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => completeFollowup(fup.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-medium transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  )}

                  <button
                    onClick={() => deleteFollowup(fup.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Follow-up Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Schedule New Sales Follow-up"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Company / Motor Carrier *</label>
            <input
              type="text"
              required
              value={newFollowup.company}
              onChange={(e) => setNewFollowup({ ...newFollowup, company: e.target.value })}
              placeholder="e.g. ABC Logistics"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Fleet Contact Name *</label>
            <input
              type="text"
              required
              value={newFollowup.customerName}
              onChange={(e) => setNewFollowup({ ...newFollowup, customerName: e.target.value })}
              placeholder="e.g. Marcus Vance"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Scheduled Date</label>
              <input
                type="text"
                value={newFollowup.date}
                onChange={(e) => setNewFollowup({ ...newFollowup, date: e.target.value })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Scheduled Time</label>
              <input
                type="text"
                value={newFollowup.time}
                onChange={(e) => setNewFollowup({ ...newFollowup, time: e.target.value })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Objective / Discussion Reason</label>
            <textarea
              rows={2}
              required
              value={newFollowup.reason}
              onChange={(e) => setNewFollowup({ ...newFollowup, reason: e.target.value })}
              placeholder="e.g. Pricing comparison follow-up and contract buyout review"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Priority</label>
            <select
              value={newFollowup.priority}
              onChange={(e) => setNewFollowup({ ...newFollowup, priority: e.target.value })}
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
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Save Follow-up
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
