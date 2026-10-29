import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Download,
  Upload,
  PhoneCall,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Truck,
  MapPin,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemperatureBadge, LeadScoreBadge, StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { EmptyState } from '../../components/common/EmptyState';

export function LeadsList() {
  const { leads, addLead, deleteLead, showToast } = useApp();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [temperatureFilter, setTemperatureFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('leadScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Row selection
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [quickViewLead, setQuickViewLead] = useState(null);

  // Add lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    title: 'Fleet Manager',
    company: '',
    fleetSize: 24,
    truckType: 'Dry Van',
    location: '',
    service: 'ELD & Fuel Card Program',
    phone: '',
    email: '',
    currentProvider: 'Motive',
  });

  // Filter & Sort Logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.service.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTemp =
          temperatureFilter === 'ALL' || lead.temperature === temperatureFilter;

        const matchesStatus =
          statusFilter === 'ALL' || lead.status === statusFilter;

        return matchesSearch && matchesTemp && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [leads, searchQuery, temperatureFilter, statusFilter, sortField, sortAsc]);

  // Pagination slice
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Select all handler
  const handleSelectAll = () => {
    if (selectedLeadIds.length === paginatedLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(paginatedLeads.map((l) => l.id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Add Lead Submit
  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.company) {
      showToast('Name and Company are required', 'warning');
      return;
    }
    addLead(newLeadForm);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      title: 'Fleet Manager',
      company: '',
      fleetSize: 24,
      truckType: 'Dry Van',
      location: '',
      service: 'ELD & Fuel Card Program',
      phone: '',
      email: '',
      currentProvider: 'Motive',
    });
  };

  const handleExportCSV = () => {
    showToast('Exporting leads data to CSV...');
  };

  const handleBulkAiCall = () => {
    showToast(`AI Voice Queue initiated for ${selectedLeadIds.length} carriers!`);
    setSelectedLeadIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Freight Leads Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage target motor carriers, AI qualification scores, and conversion pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 text-xs font-medium transition"
          >
            <Upload className="w-3.5 h-3.5" />
            Import Leads
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => navigate('/calls/call-504/live')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-ai transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            Start AI Call
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-navy-900/80 border border-navy-800 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by company, contact, location, or service..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-navy-950 border border-navy-700/80 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Temperature Filter */}
            <div className="flex items-center gap-1.5 bg-navy-950 border border-navy-800 rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400 text-[11px]">Temp:</span>
              <select
                value={temperatureFilter}
                onChange={(e) => {
                  setTemperatureFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL" className="bg-navy-900">All Temps</option>
                <option value="HOT" className="bg-navy-900">🔥 HOT</option>
                <option value="WARM" className="bg-navy-900">🟡 WARM</option>
                <option value="COLD" className="bg-navy-900">🔵 COLD</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-navy-950 border border-navy-800 rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400 text-[11px]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL" className="bg-navy-900">All Statuses</option>
                <option value="New" className="bg-navy-900">New</option>
                <option value="Contacted" className="bg-navy-900">Contacted</option>
                <option value="Qualified" className="bg-navy-900">Qualified</option>
                <option value="Interested" className="bg-navy-900">Interested</option>
                <option value="Negotiation" className="bg-navy-900">Negotiation</option>
              </select>
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1.5 bg-navy-950 border border-navy-800 rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400 text-[11px]">Sort:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="leadScore" className="bg-navy-900">Lead Score</option>
                <option value="fleetSize" className="bg-navy-900">Fleet Size</option>
                <option value="company" className="bg-navy-900">Company Name</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="text-slate-400 hover:text-white p-0.5"
                title={sortAsc ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Banner when rows selected */}
        {selectedLeadIds.length > 0 && (
          <div className="p-2.5 bg-blue-950/60 border border-blue-500/40 rounded-xl flex items-center justify-between animate-in fade-in duration-150 text-xs">
            <span className="text-blue-300 font-medium">
              {selectedLeadIds.length} lead(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkAiCall}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Trigger Batch AI Calls
              </button>
              <button
                onClick={() => {
                  selectedLeadIds.forEach((id) => deleteLead(id));
                  setSelectedLeadIds([]);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Leads Table */}
      {paginatedLeads.length === 0 ? (
        <EmptyState
          title="No leads match your filter"
          description="Try modifying your search criteria or add a new carrier lead to get started."
          actionLabel="Add Lead"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-navy-900/70 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950/80 border-b border-navy-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 w-10">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                      {selectedLeadIds.length === paginatedLeads.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-3">Lead & Contact</th>
                  <th className="py-4 px-3">Company</th>
                  <th className="py-4 px-3">Fleet Size</th>
                  <th className="py-4 px-3">Location</th>
                  <th className="py-4 px-3">Target Service</th>
                  <th className="py-4 px-3">Score</th>
                  <th className="py-4 px-3">Temperature</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Next Follow-up</th>
                  <th className="py-4 px-3">Rep</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {paginatedLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-navy-800/40 transition group cursor-pointer ${
                        isSelected ? 'bg-blue-950/30' : ''
                      }`}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectRow(lead.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-white group-hover:text-blue-400 transition">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{lead.title}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-200">{lead.company}</div>
                        <div className="text-[10px] text-slate-500">{lead.currentProvider}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-white bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                          {lead.fleetSize}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">rigs</span>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[100px]">{lead.location}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300 max-w-[150px] truncate">
                        {lead.service}
                      </td>

                      <td className="py-3 px-3">
                        <LeadScoreBadge score={lead.leadScore} />
                      </td>

                      <td className="py-3 px-3">
                        <TemperatureBadge temperature={lead.temperature} />
                      </td>

                      <td className="py-3 px-3">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {lead.nextFollowup}
                      </td>

                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {lead.assignedTo}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate('/calls/call-504/live')}
                            className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition"
                            title="Start AI Call"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setQuickViewLead(lead)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
                            title="Quick View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400 bg-navy-950/60">
            <div>
              Showing <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-semibold text-white">
                {Math.min(currentPage * itemsPerPage, filteredLeads.length)}
              </span>{' '}
              of <span className="font-semibold text-white">{filteredLeads.length}</span> leads
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-slate-200">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Trucking Fleet Lead"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddLeadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={newLeadForm.name}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                placeholder="Marcus Vance"
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company / Fleet *</label>
              <input
                type="text"
                required
                value={newLeadForm.company}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                placeholder="ABC Logistics"
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fleet Size (Power Units)</label>
              <input
                type="number"
                value={newLeadForm.fleetSize}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, fleetSize: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Trailer / Equipment Type</label>
              <select
                value={newLeadForm.truckType}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, truckType: e.target.value })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Dry Van">Dry Van</option>
                <option value="Reefer (Temperature Controlled)">Reefer (Temperature Controlled)</option>
                <option value="Flatbed & Step Deck">Flatbed & Step Deck</option>
                <option value="Intermodal Drayage">Intermodal Drayage</option>
                <option value="Tanker / Hazmat">Tanker / Hazmat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location (City, State)</label>
              <input
                type="text"
                value={newLeadForm.location}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
                placeholder="Dallas, TX"
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Service</label>
              <select
                value={newLeadForm.service}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, service: e.target.value })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="ELD & Fuel Card Program">ELD & Fuel Card Program</option>
                <option value="Freight Factoring (Non-recourse)">Freight Factoring (Non-recourse)</option>
                <option value="Dispatch & AI Scheduling">Dispatch & AI Scheduling</option>
                <option value="Safety & IFTA Automation">Safety & IFTA Automation</option>
                <option value="Full Enterprise TMS">Full Enterprise TMS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={newLeadForm.phone}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                placeholder="+1 (555) 234-8901"
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <input
                type="email"
                value={newLeadForm.email}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                placeholder="marcus@abclogistics.com"
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-navy-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-medium hover:bg-navy-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm"
            >
              Save & Queue for AI Call
            </button>
          </div>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Carrier Leads (CSV / Excel / FMCSA Registry)"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-400">
            Upload carrier contacts from CSV or sync directly with the FMCSA SAFER database by USDOT number.
          </p>

          <div className="p-8 border-2 border-dashed border-navy-700 rounded-2xl bg-navy-950/60 text-center space-y-2">
            <Upload className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-white font-medium">Drag and drop carrier .csv file here</p>
            <p className="text-slate-500 text-[11px]">Supports USDOT#, Fleet Size, Contact Phone, Equipment Class</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast('Importing 250 carriers from FMCSA registry...');
                setIsImportModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium"
            >
              Upload & Map Fields
            </button>
          </div>
        </div>
      </Modal>

      {/* Quick View Drawer */}
      <Drawer
        isOpen={!!quickViewLead}
        onClose={() => setQuickViewLead(null)}
        title={quickViewLead?.company || 'Lead Quick View'}
      >
        {quickViewLead && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{quickViewLead.name}</h3>
                <p className="text-slate-400">{quickViewLead.title}</p>
              </div>
              <TemperatureBadge temperature={quickViewLead.temperature} />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-navy-950 rounded-xl border border-navy-800">
              <div>
                <span className="text-slate-500 text-[10px]">Lead Score</span>
                <div className="font-mono font-bold text-white text-base mt-0.5">
                  {quickViewLead.leadScore} / 100
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Fleet Capacity</span>
                <div className="font-mono font-bold text-white text-base mt-0.5">
                  {quickViewLead.fleetSize} Trucks
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Status</span>
                <div className="mt-0.5">
                  <StatusBadge status={quickViewLead.status} />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Current Provider</span>
                <div className="font-semibold text-slate-300 mt-0.5">
                  {quickViewLead.currentProvider}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-slate-400">
                Contact Details
              </h4>
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-white font-mono">{quickViewLead.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-blue-400 font-mono">{quickViewLead.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-300">{quickViewLead.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-slate-400">
                AI Next Best Action
              </h4>
              <p className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                Lead is nearing competitor contract expiration. Suggested action: pitch 45-day contract buyout credit with zero-downtime hot-swap OBD hardware.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setQuickViewLead(null);
                  navigate('/calls/call-504/live');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-glow-ai"
              >
                <PhoneCall className="w-4 h-4" />
                Launch Live AI Voice Call
              </button>

              <button
                onClick={() => {
                  setQuickViewLead(null);
                  navigate(`/leads/${quickViewLead.id}`);
                }}
                className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 font-medium text-center"
              >
                Open Full CRM Profile
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
