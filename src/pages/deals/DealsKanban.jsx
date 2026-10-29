import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  Truck,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeadScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function DealsKanban() {
  const { deals, moveDeal, addDeal, showToast } = useApp();

  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newDealForm, setNewDealForm] = useState({
    company: '',
    contact: '',
    dealValue: 45000,
    service: 'ELD & Fuel Card Program',
    stage: 'New',
    leadScore: 80,
    fleetSize: 30,
    expectedClose: 'Oct 20, 2026'
  });

  const stages = [
    { id: 'New', label: 'New Inbound', color: 'border-blue-500/40' },
    { id: 'Qualified', label: 'Qualified', color: 'border-indigo-500/40' },
    { id: 'Interested', label: 'Interested', color: 'border-violet-500/40' },
    { id: 'Follow-up', label: 'Follow-up', color: 'border-purple-500/40' },
    { id: 'Negotiation', label: 'Negotiation', color: 'border-amber-500/40' },
    { id: 'Won', label: 'Closed Won', color: 'border-emerald-500/40' },
    { id: 'Lost', label: 'Closed Lost', color: 'border-rose-500/40' },
  ];

  // Drag and drop handlers
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      moveDeal(dealId, targetStage);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newDealForm.company) {
      showToast('Carrier company is required', 'warning');
      return;
    }
    addDeal({
      ...newDealForm,
      dealValue: Number(newDealForm.dealValue),
      fleetSize: Number(newDealForm.fleetSize)
    });
    setIsCreateModalOpen(false);
  };

  const totalPipelineValue = deals.reduce((acc, d) => acc + (d.stage !== 'Lost' ? d.dealValue : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-amber-400" />
            Freight Deals Kanban Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Drag cards between stages to advance contract negotiations and track closed revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-navy-900 border border-navy-800 text-xs font-mono">
            <span className="text-slate-400">Total Active Pipeline: </span>
            <span className="text-emerald-400 font-bold">${totalPipelineValue.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Deal
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage.toLowerCase() === stage.id.toLowerCase());
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="w-72 shrink-0 bg-navy-900/60 border border-navy-800 rounded-2xl flex flex-col max-h-[calc(100vh-230px)] shadow-lg snap-start"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-navy-800/80 bg-navy-950/80 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.id === 'Won' ? 'bg-emerald-400' : stage.id === 'Lost' ? 'bg-rose-400' : 'bg-blue-400'}`}></span>
                  <h3 className="text-xs font-bold text-white">{stage.label}</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-navy-800 text-slate-400 font-mono">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  ${Math.round(stageTotal / 1000)}k
                </span>
              </div>

              {/* Deal Cards Container */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    onClick={() => setSelectedDeal(deal)}
                    className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 hover:border-blue-500/50 transition cursor-grab active:cursor-grabbing shadow-sm group hover:-translate-y-0.5 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-white group-hover:text-blue-400 transition truncate max-w-[150px]">
                        {deal.company}
                      </span>
                      <LeadScoreBadge score={deal.leadScore} />
                    </div>

                    <p className="text-[11px] text-slate-400 truncate">{deal.service}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-navy-800/80">
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        ${deal.dealValue.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-slate-500" />
                        {deal.fleetSize} Rigs
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>Rep: {deal.salesperson?.split(' ')[0]}</span>
                      <span className="font-mono">{deal.expectedClose}</span>
                    </div>

                    {/* Quick Move Trigger for Mobile / Non-drag users */}
                    <div className="flex items-center justify-end pt-1 gap-1 text-[10px]">
                      {stage.id !== 'Won' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextStageIndex = stages.findIndex((s) => s.id === stage.id) + 1;
                            if (nextStageIndex < stages.length) {
                              moveDeal(deal.id, stages[nextStageIndex].id);
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-navy-900 text-slate-400 hover:text-white border border-navy-800 flex items-center gap-1"
                        >
                          Next <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="py-8 text-center text-slate-600 text-[11px] border border-dashed border-navy-800/60 rounded-xl">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Detail Modal */}
      <Modal
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        title={selectedDeal ? `Deal Details: ${selectedDeal.company}` : ''}
      >
        {selectedDeal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-navy-950 rounded-xl border border-navy-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[11px]">Total Contract Value:</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                  ${selectedDeal.dealValue.toLocaleString()}
                </div>
              </div>
              <LeadScoreBadge score={selectedDeal.leadScore} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-navy-800">
                <span className="text-slate-400">Carrier Contact:</span>
                <span className="text-white font-medium">{selectedDeal.contact}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-800">
                <span className="text-slate-400">Service Package:</span>
                <span className="text-white">{selectedDeal.service}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-800">
                <span className="text-slate-400">Fleet Units:</span>
                <span className="text-white font-mono">{selectedDeal.fleetSize} Trucks</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-800">
                <span className="text-slate-400">Target Close Date:</span>
                <span className="text-white font-mono">{selectedDeal.expectedClose}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-800">
                <span className="text-slate-400">Assigned Salesperson:</span>
                <span className="text-white">{selectedDeal.salesperson}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-slate-300 font-medium mb-1">Update Pipeline Stage:</label>
              <select
                value={selectedDeal.stage}
                onChange={(e) => {
                  moveDeal(selectedDeal.id, e.target.value);
                  setSelectedDeal({ ...selectedDeal, stage: e.target.value });
                }}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs"
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Deal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Sales Pipeline Deal"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Carrier Company Name *</label>
            <input
              type="text"
              required
              value={newDealForm.company}
              onChange={(e) => setNewDealForm({ ...newDealForm, company: e.target.value })}
              placeholder="e.g. Apex Hauling Corp"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Contact Person</label>
            <input
              type="text"
              value={newDealForm.contact}
              onChange={(e) => setNewDealForm({ ...newDealForm, contact: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Estimated Value ($)</label>
              <input
                type="number"
                value={newDealForm.dealValue}
                onChange={(e) => setNewDealForm({ ...newDealForm, dealValue: e.target.value })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Fleet Units</label>
              <input
                type="number"
                value={newDealForm.fleetSize}
                onChange={(e) => setNewDealForm({ ...newDealForm, fleetSize: e.target.value })}
                className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Service</label>
            <select
              value={newDealForm.service}
              onChange={(e) => setNewDealForm({ ...newDealForm, service: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            >
              <option value="ELD & Fuel Card Program">ELD & Fuel Card Program</option>
              <option value="Dispatch & AI Scheduling">Dispatch & AI Scheduling</option>
              <option value="Freight Factoring (Non-recourse)">Freight Factoring (Non-recourse)</option>
              <option value="Safety & Telematics Suite">Safety & Telematics Suite</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Stage</label>
            <select
              value={newDealForm.stage}
              onChange={(e) => setNewDealForm({ ...newDealForm, stage: e.target.value })}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Add to Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
