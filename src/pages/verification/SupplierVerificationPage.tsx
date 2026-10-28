import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier, VerificationStatus } from '../../types';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Building2,
  UserCheck,
  X,
  FileCheck2,
  AlertCircle,
  Eye
} from 'lucide-react';

export const SupplierVerificationPage: React.FC = () => {
  const { store, updateVerificationStatus, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'action_required' | 'all'>('pending');
  const [reviewingSupplier, setReviewingSupplier] = useState<Supplier | null>(null);

  // Decision form states
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionError, setDecisionError] = useState<string | null>(null);

  const pendingList = store.suppliers.filter(
    s => s.verificationStatus === 'Submitted' || s.verificationStatus === 'Under Review'
  );
  const actionRequiredList = store.suppliers.filter(
    s => s.verificationStatus === 'Additional Information Required' || s.verificationStatus === 'Suspended'
  );
  const verifiedList = store.suppliers.filter(s => s.verificationStatus === 'Verified');

  const displayedSuppliers = () => {
    switch (activeTab) {
      case 'pending': return pendingList;
      case 'action_required': return actionRequiredList;
      case 'verified': return verifiedList;
      case 'all': default: return store.suppliers;
    }
  };

  const handleOpenReview = (s: Supplier) => {
    setReviewingSupplier(s);
    setDecisionNotes(s.verificationNotes || '');
    setDecisionError(null);
  };

  const handleExecuteDecision = (targetStatus: VerificationStatus) => {
    if (!reviewingSupplier) return;

    if ((targetStatus === 'Rejected' || targetStatus === 'Suspended' || targetStatus === 'Additional Information Required') && !decisionNotes.trim()) {
      setDecisionError(`A mandatory operational explanation note is required when setting status to '${targetStatus}'.`);
      return;
    }

    updateVerificationStatus(reviewingSupplier.id, targetStatus, decisionNotes);
    setReviewingSupplier(null);
    setDecisionNotes('');
    setDecisionError(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          Supplier Verification & Compliance Queue
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review legal registration, statutory mining licences, tax clearances, and assay accreditation before granting verified market access.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <span>Pending Submissions</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('action_required')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'action_required'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <span>Info Required / Suspended</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800">
            {actionRequiredList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('verified')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'verified'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <span>Verified Suppliers</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {verifiedList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-4 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          All Applications ({store.suppliers.length})
        </button>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Organization</th>
                <th className="py-3 px-3 font-semibold">Mining Licence</th>
                <th className="py-3 px-3 font-semibold">Minerals</th>
                <th className="py-3 px-3 font-semibold">Docs Count</th>
                <th className="py-3 px-3 font-semibold">Current Status</th>
                <th className="py-3 px-3 font-semibold">Last Audit / Verified By</th>
                <th className="py-3 px-4 font-semibold text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedSuppliers().map((s) => {
                const badge = getStatusBadgeClass(s.verificationStatus);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div>{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {s.id} • {s.city}, {s.country}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {s.miningLicenseNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-600">{s.mineralsSupplied.join(', ')}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-navy-900">
                      {s.documentsSubmittedCount} Documents
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {s.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {s.verifiedBy ? s.verifiedBy : 'Pending Officer Review'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(s)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs shadow-sm transition-colors"
                      >
                        Audit Case
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Review Modal */}
      {reviewingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-teal-300 font-bold">
                  Compliance Officer Desk • {reviewingSupplier.id}
                </span>
                <h3 className="font-bold text-base text-white">{reviewingSupplier.name}</h3>
              </div>
              <button
                onClick={() => setReviewingSupplier(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              {decisionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{decisionError}</span>
                </div>
              )}

              {/* Company Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Corporate Registration</span>
                  <span className="font-mono font-semibold text-navy-900">{reviewingSupplier.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Mining Lease Number</span>
                  <span className="font-mono font-semibold text-navy-900">{reviewingSupplier.miningLicenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Tax Identification (TPIN)</span>
                  <span className="font-mono font-semibold text-navy-900">{reviewingSupplier.taxIdentificationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                  <span className="font-semibold text-navy-900">{reviewingSupplier.businessCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Minerals</span>
                  <span className="font-semibold text-navy-900">{reviewingSupplier.mineralsSupplied.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Current Status</span>
                  <span className="font-semibold text-navy-900">{reviewingSupplier.verificationStatus}</span>
                </div>
              </div>

              {/* Compliance Checklist Simulation */}
              <div className="space-y-2">
                <span className="font-semibold text-navy-900 block text-xs">Statutory Compliance Checklist</span>
                <div className="space-y-1.5">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Certificate of Incorporation verified with Corporate Registrar</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PASSED
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Official Mining Cadastre active tenure validation</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PASSED
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>National Revenue & Customs tax clearance certificate</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PASSED
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ICGLR Regional Certification Mechanism (RCM) conflict-free audit</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PASSED
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Notes & Decision Rationale */}
              <div className="space-y-1">
                <label className="font-semibold text-navy-900 block text-xs">
                  Compliance Officer Decision Notes & Rationale *
                </label>
                <textarea
                  rows={3}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Record formal verification rationale, additional documents needed, or reason for suspension/rejection..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setReviewingSupplier(null)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Cancel
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExecuteDecision('Additional Information Required')}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold"
                >
                  Request Info
                </button>

                {reviewingSupplier.verificationStatus === 'Verified' ? (
                  <button
                    type="button"
                    onClick={() => handleExecuteDecision('Suspended')}
                    className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold"
                  >
                    Suspend Supplier
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleExecuteDecision('Rejected')}
                    className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold"
                  >
                    Reject Application
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleExecuteDecision('Verified')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
