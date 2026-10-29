import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export function TeamList() {
  const { team, showToast } = useApp();
  const [teamMembers, setTeamMembers] = useState(team);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Outbound SDR Specialist',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'Online'
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) {
      showToast('Name and email are required', 'warning');
      return;
    }
    const created = {
      id: `team-${Date.now()}`,
      callsToday: 0,
      activeLeads: 10,
      deals: 0,
      revenue: '$0',
      conversionRate: '0.0%',
      ...newMember
    };
    setTeamMembers([...teamMembers, created]);
    setIsAddModalOpen(false);
    showToast(`Team member "${created.name}" invited successfully!`);
  };

  const handleDeactivate = (id) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    showToast('Team member removed from workspace', 'error');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            Freight Sales Team Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage sales representatives, SIP call queues, lead assignment quotas, and individual closed revenue.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 bg-navy-900 border border-navy-800 rounded-2xl shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-blue-500/30"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-navy-900 ${
                      member.status === 'Online' ? 'bg-emerald-400' : member.status === 'In Call' ? 'bg-indigo-400' : 'bg-slate-500'
                    }`}></span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-slate-400">{member.role}</p>
                    <p className="text-[11px] text-blue-400 font-mono mt-0.5">{member.email}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  member.status === 'Online'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : member.status === 'In Call'
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {member.status}
                </span>
              </div>

              {/* Rep Metrics Strip */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-navy-800 text-center text-xs">
                <div className="p-2 bg-navy-950 rounded-xl border border-navy-850">
                  <span className="text-[10px] text-slate-500">Calls Today</span>
                  <div className="font-mono font-bold text-white mt-0.5">{member.callsToday}</div>
                </div>
                <div className="p-2 bg-navy-950 rounded-xl border border-navy-850">
                  <span className="text-[10px] text-slate-500">Active Leads</span>
                  <div className="font-mono font-bold text-indigo-400 mt-0.5">{member.activeLeads}</div>
                </div>
                <div className="p-2 bg-navy-950 rounded-xl border border-navy-850">
                  <span className="text-[10px] text-slate-500">Deals Won</span>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">{member.deals}</div>
                </div>
                <div className="p-2 bg-navy-950 rounded-xl border border-navy-850">
                  <span className="text-[10px] text-slate-500">Conversion</span>
                  <div className="font-mono font-bold text-white mt-0.5">{member.conversionRate}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-navy-800/80 text-xs">
              <span className="text-slate-400 font-mono">Total Revenue: <strong className="text-white">{member.revenue}</strong></span>
              <button
                onClick={() => handleDeactivate(member.id)}
                className="text-slate-500 hover:text-rose-400 text-xs transition"
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Invite Sales Representative"
      >
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="e.g. Rachel Torres"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Company Email *</label>
            <input
              type="email"
              required
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              placeholder="rachel.t@truckpilot.ai"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Role & Queue Assignment</label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            >
              <option value="Senior Freight Sales Rep">Senior Freight Sales Rep</option>
              <option value="Outbound SDR Specialist">Outbound SDR Specialist</option>
              <option value="Account & Retention Manager">Account & Retention Manager</option>
              <option value="Fleet Solutions Specialist">Fleet Solutions Specialist</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Send Workspace Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
