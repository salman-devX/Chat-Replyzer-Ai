import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Truck,
  PhoneCall,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, calls, deals, followups } = useApp();

  const customer = customers.find((c) => c.id === id) || customers[0];
  const [activeTab, setActiveTab] = useState('overview');

  const customerCalls = calls.filter((c) => c.company === customer.company);
  const customerDeals = deals.filter((d) => d.company === customer.company);
  const customerFollowups = followups.filter((f) => f.company === customer.company);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/customers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all customers
        </Link>
      </div>

      {/* Top Banner Profile */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-7 h-7 text-emerald-400" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {customer.company}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                {customer.relationshipStatus}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {customer.fleetSize} Power Units
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Contact: <span className="text-white font-medium">{customer.contactPerson}</span> ({customer.role}) • {customer.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/calls/call-504/live')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-ai transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            Launch AI Review Call
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-800 text-xs font-medium gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Fleet Specs' },
          { id: 'calls', label: `AI Calls (${customerCalls.length})` },
          { id: 'deals', label: `Active Deals (${customerDeals.length})` },
          { id: 'followups', label: `Follow-ups (${customerFollowups.length})` },
          { id: 'activity', label: 'Account Activity Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition whitespace-nowrap relative ${
              activeTab === tab.id
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              Carrier Operations Profile
            </h3>
            <div className="divide-y divide-navy-800 space-y-2.5">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Total Trucks:</span>
                <span className="text-white font-mono font-bold">{customer.fleetSize}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Haul Type:</span>
                <span className="text-white">{customer.truckType}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Current Provider:</span>
                <span className="text-amber-400">{customer.currentProvider}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Annual Contract:</span>
                <span className="text-emerald-400 font-mono font-bold">{customer.accountValue}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Joined Date:</span>
                <span className="text-white">{customer.joinedDate}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Account Rep:</span>
                <span className="text-white">{customer.assignedRep}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Active TruckPilot Solutions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {customer.services.map((srv, idx) => (
                  <div key={idx} className="p-3 bg-navy-950 rounded-xl border border-navy-800 space-y-1">
                    <span className="text-emerald-400 font-semibold text-xs">{srv}</span>
                    <p className="text-[11px] text-slate-400">Operational & FMCSA sync verified.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-white">Carrier Health & NPS Telemetry</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-slate-400 text-[10px]">Health Score</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{customer.healthScore} / 100</div>
                </div>
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-slate-400 text-[10px]">Satisfaction</span>
                  <div className="text-sm font-semibold text-white mt-1">{customer.satisfaction}</div>
                </div>
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-slate-400 text-[10px]">Active Hardware</span>
                  <div className="text-xl font-bold font-mono text-blue-400 mt-1">{customer.activeTrucks} units</div>
                </div>
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-slate-400 text-[10px]">Churn Risk</span>
                  <div className="text-sm font-semibold text-emerald-400 mt-1">Low (2%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Calls */}
      {activeTab === 'calls' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white">AI Voice Interactions with {customer.company}</h3>
          {customerCalls.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No AI calls recorded for this customer yet.</p>
          ) : (
            <div className="space-y-3">
              {customerCalls.map((c) => (
                <div key={c.id} className="p-4 bg-navy-950 rounded-xl border border-navy-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-white">{c.intent}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Outcome: {c.outcome} • Duration: {c.duration}</div>
                  </div>
                  <Link
                    to={`/calls/${c.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition font-medium"
                  >
                    View Recording & Summary
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Deals */}
      {activeTab === 'deals' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white">Associated Pipeline Deals</h3>
          {customerDeals.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No active pipeline deals found for this account.</p>
          ) : (
            <div className="space-y-3">
              {customerDeals.map((d) => (
                <div key={d.id} className="p-4 bg-navy-950 rounded-xl border border-navy-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-white">{d.service}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Stage: {d.stage} • Close Date: {d.expectedClose}</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">${d.dealValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Follow-ups */}
      {activeTab === 'followups' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white">Scheduled Follow-ups</h3>
          {customerFollowups.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No pending follow-ups for this carrier.</p>
          ) : (
            <div className="space-y-3">
              {customerFollowups.map((f) => (
                <div key={f.id} className="p-4 bg-navy-950 rounded-xl border border-navy-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-white">{f.reason}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{f.date} at {f.time} • Rep: {f.assignedSalesman}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{f.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Activity */}
      {activeTab === 'activity' && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Customer Activity Timeline
          </h3>
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500">Today, 10:14 AM</span>
              <h4 className="font-semibold text-white">AI Voice Call Completed</h4>
              <p className="text-slate-400">Discussed hardware upgrade and fuel card discount terms with Marcus Vance.</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">2 days ago</span>
              <h4 className="font-semibold text-white">IFTA Quarterly Tax Report Generated</h4>
              <p className="text-slate-400">Automated miles calculated across Texas, Oklahoma, and Kansas.</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Jan 14, 2026</span>
              <h4 className="font-semibold text-white">Contract Commenced</h4>
              <p className="text-slate-400">42 OBD-II units deployed; drivers onboarded via mobile app.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
