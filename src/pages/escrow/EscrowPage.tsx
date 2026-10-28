import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EscrowRecord } from '../../types';
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import {
  Coins,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  FileCheck2,
  Info,
  X,
  AlertCircle,
  Building2,
  ArrowRight
} from 'lucide-react';

export const EscrowPage: React.FC = () => {
  const { store, fundEscrowSimulation, releaseEscrowSimulation, disputeEscrow, toggleEscrowCondition } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetPo = searchParams.get('po');

  const [searchQuery, setSearchQuery] = useState(targetPo || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowRecord | null>(null);

  // Dispute Modal
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [releaseFeedback, setReleaseFeedback] = useState<string | null>(null);

  const filteredEscrows = store.escrows.filter((e) => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.id.toLowerCase().includes(q) ||
        e.poNumber.toLowerCase().includes(q) ||
        e.buyerName.toLowerCase().includes(q) ||
        e.supplierName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFund = (escrowId: string) => {
    fundEscrowSimulation(escrowId);
    setReleaseFeedback(`Simulated funding recorded! Escrow now locked awaiting milestone conditions.`);
    setTimeout(() => setReleaseFeedback(null), 3000);
  };

  const handleRelease = (escrowId: string) => {
    const success = releaseEscrowSimulation(escrowId);
    if (success) {
      setReleaseFeedback('Simulated trade settlement successfully released to supplier! Purchase order fulfilled.');
    } else {
      setReleaseFeedback('Release blocked: All milestone conditions must be verified before funds can be released.');
    }
    setTimeout(() => setReleaseFeedback(null), 4000);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscrow) return;

    disputeEscrow(selectedEscrow.id, disputeReason);
    setIsDisputeModalOpen(false);
    setDisputeReason('');
    const updated = store.escrows.find(e => e.id === selectedEscrow.id);
    if (updated) setSelectedEscrow(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <Coins className="w-6 h-6 text-teal-600" />
            Transaction-Linked Escrow & Settlement Facility
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programmed condition-locked smart escrow protecting buyer capital and securing producer export payments.
          </p>
        </div>
      </div>

      {/* Institutional Settlement Notice */}
      <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-xl space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Institutional Trade Settlement Safeguards</span>
        </div>
        <p className="text-xs text-teal-800 leading-relaxed">
          This facility executes programmed settlement logic where capital release is strictly governed by verified pre-shipment assay certification, statutory customs export clearance, and ocean Bill of Lading milestones.
        </p>
      </div>

      {releaseFeedback && (
        <div className="p-3 bg-navy-800 text-white rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <span>{releaseFeedback}</span>
          <button onClick={() => setReleaseFeedback(null)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search escrow accounts by ID, PO number, buyer, or supplier..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
        >
          <option value="All">All Escrow Statuses</option>
          <option value="Awaiting Funding">Awaiting Funding</option>
          <option value="Funded in Simulation">Funded (Conditions Pending)</option>
          <option value="Release Eligible in Simulation">Release Eligible</option>
          <option value="Released in Simulation">Released (Settled)</option>
          <option value="Disputed">Disputed</option>
        </select>
      </div>

      {/* Escrow Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Escrow ID / Ref</th>
                <th className="py-3 px-3 font-semibold">Linked Purchase Order</th>
                <th className="py-3 px-3 font-semibold">Buyer ↔ Supplier</th>
                <th className="py-3 px-3 font-semibold">Principal Escrow Amount</th>
                <th className="py-3 px-3 font-semibold">Release Conditions</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEscrows.map((escrow) => {
                const badge = getStatusBadgeClass(escrow.status);
                const satisfiedCount = escrow.conditions.filter(c => c.isSatisfied).length;
                const totalCount = escrow.conditions.length;
                const isAllSatisfied = satisfiedCount === totalCount;

                return (
                  <tr key={escrow.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div className="font-mono text-teal-700 text-xs">{escrow.id}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {escrow.fundedDate ? `Funded ${formatDate(escrow.fundedDate)}` : 'Unfunded'}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-semibold text-navy-900">{escrow.poNumber}</div>
                      <div className="text-[10px] text-slate-400">ID: {escrow.purchaseOrderId}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-navy-900 truncate">{escrow.buyerName}</div>
                      <div className="text-[11px] text-slate-500 truncate">→ {escrow.supplierName}</div>
                    </td>
                    <td className="py-3.5 px-3 font-bold font-mono text-teal-800 text-sm">
                      ${escrow.principalAmount.toLocaleString()} {escrow.currency}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isAllSatisfied ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {satisfiedCount} / {totalCount} Met
                        </span>
                        {isAllSatisfied && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${isAllSatisfied ? 'bg-emerald-600' : 'bg-teal-500'}`}
                          style={{ width: `${(satisfiedCount / totalCount) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {escrow.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {escrow.fundingStatus === 'Unfunded' && (
                          <button
                            onClick={() => handleFund(escrow.id)}
                            className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px]"
                          >
                            Simulate Fund
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedEscrow(escrow)}
                          className="px-3 py-1 rounded bg-navy-800 hover:bg-navy-900 text-white font-semibold text-[11px]"
                        >
                          Audit Escrow
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Audit & Release Modal */}
      {selectedEscrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-300 font-bold uppercase">
                  Escrow Contract Desk • {selectedEscrow.id}
                </span>
                <h3 className="font-bold text-base text-white">
                  ${selectedEscrow.principalAmount.toLocaleString()} {selectedEscrow.currency}
                </h3>
              </div>
              <button onClick={() => setSelectedEscrow(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              {/* Summary Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Buyer Depositor</span>
                  <span className="font-semibold text-navy-900 text-xs">{selectedEscrow.buyerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Supplier Beneficiary</span>
                  <span className="font-semibold text-navy-900 text-xs">{selectedEscrow.supplierName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Purchase Order</span>
                  <span className="font-mono font-semibold text-navy-900 text-xs">{selectedEscrow.poNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Contract Status</span>
                  <span className="font-semibold text-navy-900 text-xs">{selectedEscrow.status}</span>
                </div>
              </div>

              {selectedEscrow.simulatedTxHash && (
                <div className="p-2.5 bg-navy-900 rounded-lg text-[10px] font-mono text-teal-300 space-y-0.5 overflow-x-auto">
                  <div className="text-slate-400">Simulated Contract Transaction Reference:</div>
                  <div className="text-teal-400 font-bold select-all break-all">{selectedEscrow.simulatedTxHash}</div>
                </div>
              )}

              {/* Release Conditions Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-navy-900">Programmed Escrow Release Conditions</span>
                  <span className="text-[11px] text-slate-400">Click to toggle verified status</span>
                </div>

                <div className="space-y-2">
                  {selectedEscrow.conditions.map((cond) => (
                    <div
                      key={cond.id}
                      onClick={() => {
                        toggleEscrowCondition(selectedEscrow.id, cond.id);
                        // sync modal state
                        const updated = store.escrows.find(e => e.id === selectedEscrow.id);
                        if (updated) setSelectedEscrow(updated);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        cond.isSatisfied
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          {cond.isSatisfied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{cond.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{cond.description}</p>
                        {cond.verifiedBy && (
                          <span className="text-[10px] text-emerald-700 block">
                            Verified by: {cond.verifiedBy} ({formatDate(cond.satisfiedAt)})
                          </span>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          cond.isSatisfied ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cond.isSatisfied ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold"
              >
                Lodge Dispute
              </button>

              <div className="flex items-center gap-2">
                {selectedEscrow.fundingStatus === 'Unfunded' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleFund(selectedEscrow.id);
                      const updated = store.escrows.find(e => e.id === selectedEscrow.id);
                      if (updated) setSelectedEscrow(updated);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm"
                  >
                    Simulate Funding Deposit
                  </button>
                )}

                {selectedEscrow.status !== 'Released in Simulation' && (
                  <button
                    type="button"
                    disabled={!selectedEscrow.conditions.every(c => c.isSatisfied)}
                    onClick={() => {
                      handleRelease(selectedEscrow.id);
                      const updated = store.escrows.find(e => e.id === selectedEscrow.id);
                      if (updated) setSelectedEscrow(updated);
                    }}
                    className={`px-5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 ${
                      selectedEscrow.conditions.every(c => c.isSatisfied)
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Simulate Escrow Release
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lodge Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Open Trade Escrow Dispute
              </h4>
              <button onClick={() => setIsDisputeModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Reason for Dispute *</label>
                <textarea
                  rows={3}
                  required
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Detail discrepancies in destination assay, damaged packaging, or non-delivery..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold"
                >
                  Confirm Escrow Dispute Freeze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
