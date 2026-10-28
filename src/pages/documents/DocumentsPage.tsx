import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplianceDocument, DocumentType } from '../../types';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  FolderArchive,
  Search,
  Upload,
  Download,
  Eye,
  FileText,
  Building2,
  Calendar,
  X,
  FileCheck2,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { store, uploadComplianceDocument, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [previewDoc, setPreviewDoc] = useState<ComplianceDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Commercial Invoice');
  const [relatedOrg, setRelatedOrg] = useState(currentUser.organizationName || 'Copperbelt Consolidated Mining Ltd');
  const [issueDate, setIssueDate] = useState('2026-03-25');
  const [expiryDate, setExpiryDate] = useState('');
  const [fileName, setFileName] = useState('Commercial_Invoice_2026.pdf');

  const docTypes: Array<DocumentType | 'All'> = [
    'All',
    'Business Registration',
    'Supplier Identity Documentation',
    'Mineral Origin Documentation',
    'Assay Report',
    'Export Documentation',
    'Shipping Documentation',
    'Purchase Order',
    'Commercial Invoice',
    'Compliance Declaration',
    'Project Due-Diligence Document'
  ];

  const filteredDocs = store.documents.filter((d) => {
    if (selectedType !== 'All' && d.documentType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.relatedOrganization.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    uploadComplianceDocument({
      title: docTitle,
      documentType: docType,
      fileName,
      fileSizeKb: Math.floor(500 + Math.random() * 2500),
      relatedOrganization: relatedOrg,
      relatedOrganizationId: currentUser.organizationId || 'ORG-01',
      issueDate,
      expiryDate: expiryDate || undefined,
      reviewStatus: 'Submitted',
      reviewNotes: 'Uploaded by authorized organizational user. Pending compliance review.'
    });

    setIsUploadModalOpen(false);
    setDocTitle('');
  };

  const handleSimulatedDownload = (doc: ComplianceDocument) => {
    const dummyContent = `MINERALINK OFFICIAL TRADE DOCUMENT RECORD\n\nDocument ID: ${doc.id}\nTitle: ${doc.title}\nCategory: ${doc.documentType}\nOrganization: ${doc.relatedOrganization}\nIssue Date: ${doc.issueDate}\nExpiry: ${doc.expiryDate || 'N/A'}\nStatus: ${doc.reviewStatus}\n\n[Simulated Encrypted Digital Hash Payload]\n0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}\n\nGenerated from MINERALINK Platform v1.0.0`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-teal-600" />
            Digital Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized archive of verified mineral trade contracts, ocean bills of lading, assay certificates, and customs manifests.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document title, filename, or issuing organization..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
          >
            {docTypes.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Document Categories' : t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const badge = getStatusBadgeClass(doc.reviewStatus);
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-500/60 shadow-subtle hover:shadow-card transition-all p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] text-teal-700 font-bold block">
                    {doc.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                    {doc.reviewStatus}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-navy-900 line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong className="text-navy-900">Category:</strong> {doc.documentType}</div>
                  <div><strong className="text-navy-900">Organization:</strong> {doc.relatedOrganization}</div>
                  <div className="font-mono text-[11px] text-slate-400 truncate">
                    File: {doc.fileName} ({(doc.fileSizeKb / 1024).toFixed(1)} MB)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Issued: {formatDate(doc.issueDate)}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSimulatedDownload(doc)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-navy-900"
                    title="Simulate Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 font-semibold text-[11px]"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Document Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                  Document Dossier • {previewDoc.id}
                </span>
                <h3 className="font-bold text-sm text-white">{previewDoc.title}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                  <span className="font-semibold text-navy-900">{previewDoc.documentType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Issuing Organization</span>
                  <span className="font-semibold text-navy-900">{previewDoc.relatedOrganization}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Issue Date</span>
                  <span className="font-semibold text-navy-900">{formatDate(previewDoc.issueDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Expiry Date</span>
                  <span className="font-semibold text-navy-900">{previewDoc.expiryDate || 'N/A'}</span>
                </div>
              </div>

              {previewDoc.reviewNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-semibold text-navy-900 block">Reviewer Notes:</span>
                  <p className="text-slate-700">{previewDoc.reviewNotes}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleSimulatedDownload(previewDoc)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Record
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Upload Compliance / Trade Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Clean On-Board Bill of Lading (MSC LILIAN)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Document Category *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    {docTypes.filter(t => t !== 'All').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={relatedOrg}
                    onChange={(e) => setRelatedOrg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Simulated File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono form-input-focus"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold shadow-sm"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
