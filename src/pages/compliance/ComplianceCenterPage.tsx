import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplianceDocument, DocumentReviewStatus } from '../../types';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  FileLock2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Building2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  X,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export const ComplianceCenterPage: React.FC = () => {
  const { store, reviewComplianceDocument, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reviewingDoc, setReviewingDoc] = useState<ComplianceDocument | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Calculate Compliance Health KPIs
  const pendingReviews = store.documents.filter(d => d.reviewStatus === 'Submitted' || d.reviewStatus === 'Under Review');
  const approvedDocs = store.documents.filter(d => d.reviewStatus === 'Approved in Demo Workflow');
  const expiredDocs = store.documents.filter(d => d.reviewStatus === 'Expired');
  
  // Expiring within 60 days
  const soonExpiringDocs = store.documents.filter((d) => {
    if (!d.expiryDate) return false;
    const expiry = new Date(d.expiryDate).getTime();
    const now = new Date('2026-03-28').getTime(); // App date context
    const diffDays = (expiry - now) / (1000 * 3600 * 24);
    return diffDays > 0 && diffDays <= 60;
  });

  const filteredDocs = store.documents.filter((d) => {
    if (statusFilter !== 'All' && d.reviewStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.documentType.toLowerCase().includes(q) ||
        d.relatedOrganization.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenReview = (doc: ComplianceDocument) => {
    setReviewingDoc(doc);
    setReviewNotes(doc.reviewNotes || '');
  };

  const handleSaveDecision = (status: DocumentReviewStatus) => {
    if (!reviewingDoc) return;
    reviewComplianceDocument(reviewingDoc.id, status, reviewNotes);
    setReviewingDoc(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
          <FileLock2 className="w-6 h-6 text-teal-600" />
          Enterprise Compliance & Document Due-Diligence Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Statutory mining authorizations, OECD conflict-free mineral chain of custody, and environmental compliance review console.
        </p>
      </div>

      {/* Compliance Health KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Pending Officer Review</span>
          <span className="text-2xl font-bold text-navy-900 mt-1 block">{pendingReviews.length}</span>
          <span className="text-[11px] text-amber-600 mt-1 block font-medium">Statutory filings to review</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Expiring Within 60 Days</span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{soonExpiringDocs.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Environmental & cadastre permits</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Expired Filings</span>
          <span className="text-2xl font-bold text-rose-700 mt-1 block">{expiredDocs.length}</span>
          <span className="text-[11px] text-rose-600 mt-1 block font-medium">Supplier suspension active</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Approved Compliance Files</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">{approvedDocs.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Full audit compliance verified</span>
        </div>
      </div>

      {/* Expiring Documents Warning Banner if any */}
      {soonExpiringDocs.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Statutory Filings Nearing Expiry Warning:</span>
          </div>
          <div className="space-y-1.5 text-xs text-amber-900">
            {soonExpiringDocs.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between bg-white/70 p-2 rounded border border-amber-200">
                <span><strong>{d.title}</strong> ({d.relatedOrganization})</span>
                <span className="font-mono text-rose-700 font-bold">Expires: {d.expiryDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Review Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance files by title, organization, or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
          >
            <option value="All">All Compliance Review Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="Approved in Demo Workflow">Approved</option>
            <option value="Expired">Expired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Document ID / Title</th>
                <th className="py-3 px-3 font-semibold">Category Type</th>
                <th className="py-3 px-3 font-semibold">Organization</th>
                <th className="py-3 px-3 font-semibold">Expiry Date</th>
                <th className="py-3 px-3 font-semibold">Review Status</th>
                <th className="py-3 px-4 font-semibold text-right">Audit & Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.map((doc) => {
                const badge = getStatusBadgeClass(doc.reviewStatus);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900 max-w-sm">
                      <div className="truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {doc.id} • {doc.fileName} ({(doc.fileSizeKb / 1024).toFixed(1)} MB)
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{doc.documentType}</td>
                    <td className="py-3.5 px-3 font-medium text-navy-900">{doc.relatedOrganization}</td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {doc.expiryDate ? doc.expiryDate : 'Perpetual / N/A'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {doc.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(doc)}
                        className="px-3 py-1 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors"
                      >
                        Review Decision
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Decision Modal */}
      {reviewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                  Compliance Officer Desk • {reviewingDoc.id}
                </span>
                <h3 className="font-bold text-sm text-white">{reviewingDoc.title}</h3>
              </div>
              <button onClick={() => setReviewingDoc(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Organization</span>
                  <span className="font-semibold text-navy-900 text-xs">{reviewingDoc.relatedOrganization}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                  <span className="font-semibold text-navy-900 text-xs">{reviewingDoc.documentType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Submission Date</span>
                  <span className="font-semibold text-navy-900">{formatDate(reviewingDoc.submissionDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Current Review Status</span>
                  <span className="font-semibold text-navy-900">{reviewingDoc.reviewStatus}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-navy-900 block mb-1">Compliance Officer Notes & Audit Remarks</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record verification check against statutory cadastre registry or reason for rejection/resubmission..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setReviewingDoc(null)}
                className="px-4 py-1.5 border border-slate-200 rounded text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveDecision('Rejected')}
                  className="px-3.5 py-1.5 rounded bg-rose-50 border border-rose-300 text-rose-800 font-semibold"
                >
                  Reject Document
                </button>
                <button
                  onClick={() => handleSaveDecision('Approved in Demo Workflow')}
                  className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5"
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
