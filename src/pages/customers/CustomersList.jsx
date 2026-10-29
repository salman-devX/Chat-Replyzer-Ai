import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  DollarSign,
  Truck,
  ArrowRight,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../../components/common/Drawer';

export function CustomersList() {
  const { customers } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(
    (c) =>
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            Fleet Customer Accounts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active carrier relationships, telematics hardware fleets, and recurring contract values.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-navy-900 border border-navy-800 text-xs font-mono text-emerald-400">
            Total ARR: <span className="font-bold text-white">$300,600</span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-navy-900/80 border border-navy-800 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search active fleets by company, director, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Customers Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-navy-900/70 border border-navy-800 rounded-2xl p-5 shadow-lg hover:border-navy-700 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                      {c.company}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {c.relationshipStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.contactPerson} • {c.role} ({c.location})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Account Value</span>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {c.accountValue}
                  </div>
                </div>
              </div>

              {/* Fleet & Services Badges */}
              <div className="mt-4 pt-3 border-t border-navy-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-navy-950 text-slate-300 font-mono border border-navy-800 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-400" />
                  {c.fleetSize} Trucks
                </span>
                {c.services.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[11px] border border-indigo-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-slate-400">
                Last Interaction: <span className="text-slate-200">{c.lastInteraction}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-navy-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Account Rep: {c.assignedRep}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCustomer(c)}
                  className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 transition"
                >
                  Quick Drawer
                </button>
                <Link
                  to={`/customers/${c.id}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-medium transition flex items-center gap-1"
                >
                  Full Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.company || 'Customer Detail'}
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Account Value</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {selectedCustomer.accountValue}
              </div>
              <p className="text-slate-400 text-[11px] mt-1">Health Score: {selectedCustomer.healthScore}/100 • {selectedCustomer.satisfaction}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white">Fleet Profile</h4>
              <div className="p-3 bg-navy-950/70 rounded-xl border border-navy-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Power Units:</span>
                  <span className="text-white font-mono">{selectedCustomer.fleetSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Haul Type:</span>
                  <span className="text-white">{selectedCustomer.truckType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Since:</span>
                  <span className="text-white">{selectedCustomer.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white">Active Subscriptions</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCustomer.services.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to={`/customers/${selectedCustomer.id}`}
              onClick={() => setSelectedCustomer(null)}
              className="block w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center shadow-sm"
            >
              Open Complete CRM Profile →
            </Link>
          </div>
        )}
      </Drawer>
    </div>
  );
}
