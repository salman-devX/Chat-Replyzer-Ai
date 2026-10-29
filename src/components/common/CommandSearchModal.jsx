import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, PhoneCall, DollarSign, Calendar, Building2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function CommandSearchModal() {
  const { isSearchOpen, setIsSearchOpen, leads, customers, calls, deals, followups } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredLeads = q
    ? leads.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.service.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const filteredCustomers = q
    ? customers.filter((c) => c.company.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const filteredCalls = q
    ? calls.filter((c) => c.customer.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.intent.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const filteredDeals = q
    ? deals.filter((d) => d.company.toLowerCase().includes(q) || d.service.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const filteredFollowups = q
    ? followups.filter((f) => f.company.toLowerCase().includes(q) || f.customerName.toLowerCase().includes(q) || f.reason.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  const totalResults =
    filteredLeads.length +
    filteredCustomers.length +
    filteredCalls.length +
    filteredDeals.length +
    filteredFollowups.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center pt-20 px-4">
        <div
          className="relative w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-navy-800 bg-navy-950/80">
            <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search leads, fleet customers, calls, deals, follow-ups..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-navy-800 rounded border border-navy-700">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!q ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <p>Type keywords to search across TruckPilot intelligence pipeline.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-1 bg-navy-800/80 rounded border border-navy-700 text-slate-300">ABC Logistics</span>
                  <span className="px-2 py-1 bg-navy-800/80 rounded border border-navy-700 text-slate-300">ELD Mandate</span>
                  <span className="px-2 py-1 bg-navy-800/80 rounded border border-navy-700 text-slate-300">Factoring</span>
                  <span className="px-2 py-1 bg-navy-800/80 rounded border border-navy-700 text-slate-300">Marcus Vance</span>
                </div>
              </div>
            ) : totalResults === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No results found for &ldquo;<span className="text-white">{query}</span>&rdquo;
              </div>
            ) : (
              <>
                {/* Leads */}
                {filteredLeads.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> Leads ({filteredLeads.length})
                    </div>
                    <div className="space-y-1">
                      {filteredLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => handleSelect(`/leads/${lead.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-navy-800 cursor-pointer group transition"
                        >
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-blue-400 transition">
                              {lead.name} • <span className="text-slate-300">{lead.company}</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              Fleet: {lead.fleetSize} trucks • {lead.service}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customers */}
                {filteredCustomers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Customers ({filteredCustomers.length})
                    </div>
                    <div className="space-y-1">
                      {filteredCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => handleSelect(`/customers/${cust.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-navy-800 cursor-pointer group transition"
                        >
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition">
                              {cust.company}
                            </div>
                            <div className="text-xs text-slate-400">
                              {cust.contactPerson} • {cust.accountValue}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Calls */}
                {filteredCalls.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-400" /> Calls ({filteredCalls.length})
                    </div>
                    <div className="space-y-1">
                      {filteredCalls.map((call) => (
                        <div
                          key={call.id}
                          onClick={() => handleSelect(`/calls/${call.id}`)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-navy-800 cursor-pointer group transition"
                        >
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition">
                              {call.company} ({call.customer})
                            </div>
                            <div className="text-xs text-slate-400">
                              Intent: {call.intent} • {call.duration}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deals */}
                {filteredDeals.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Deals ({filteredDeals.length})
                    </div>
                    <div className="space-y-1">
                      {filteredDeals.map((deal) => (
                        <div
                          key={deal.id}
                          onClick={() => handleSelect('/deals')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-navy-800 cursor-pointer group transition"
                        >
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-amber-400 transition">
                              {deal.company} — ${deal.dealValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">
                              Stage: {deal.stage} • Rep: {deal.salesperson}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-ups */}
                {filteredFollowups.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 px-2 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> Follow-ups ({filteredFollowups.length})
                    </div>
                    <div className="space-y-1">
                      {filteredFollowups.map((fup) => (
                        <div
                          key={fup.id}
                          onClick={() => handleSelect('/follow-ups')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-navy-800 cursor-pointer group transition"
                        >
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-purple-400 transition">
                              {fup.company} ({fup.customerName})
                            </div>
                            <div className="text-xs text-slate-400">
                              {fup.date} at {fup.time} • {fup.reason}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
