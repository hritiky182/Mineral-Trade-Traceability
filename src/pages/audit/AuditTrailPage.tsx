import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  History,
  Search,
  Download,
  Filter,
  ShieldCheck,
  Building2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const { store } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('All');

  const entityTypes = [
    'All',
    'Supplier',
    'Listing',
    'Assay',
    'Batch',
    'RFQ',
    'PurchaseOrder',
    'Shipment',
    'Escrow',
    'Document',
    'Project'
  ];

  const filteredActivities = store.activities.filter((act) => {
    if (selectedEntity !== 'All' && act.entityType !== selectedEntity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.actor.toLowerCase().includes(q) ||
        act.action.toLowerCase().includes(q) ||
        act.entityReference.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['Event ID', 'Timestamp', 'Actor', 'Role', 'Action', 'Entity Type', 'Reference', 'Description'];
    const rows = filteredActivities.map(a => [
      a.id,
      a.timestamp,
      `"${a.actor}"`,
      a.role,
      a.action,
      a.entityType,
      a.entityReference,
      `"${a.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MINERALINK_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-teal-600" />
            Immutable System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chronological audit log tracking administrative verifications, commercial negotiation events, and trade settlement operations.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Audit Log (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action type, reference ID, or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
        >
          {entityTypes.map((t) => (
            <option key={t} value={t}>{t === 'All' ? 'All Entity Types' : t}</option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-3 font-semibold">Actor / Role</th>
                <th className="py-3 px-3 font-semibold">Action</th>
                <th className="py-3 px-3 font-semibold">Entity Type</th>
                <th className="py-3 px-3 font-semibold">Reference</th>
                <th className="py-3 px-4 font-semibold">Operational Narrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDateTime(act.timestamp)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-navy-900">{act.actor}</div>
                    <div className="text-[10px] text-teal-700 font-medium uppercase tracking-wide">{act.role}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] font-semibold text-navy-800">
                    {act.action}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {act.entityType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-teal-700 font-semibold text-[11px]">
                    {act.entityReference}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    {act.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          Showing {filteredActivities.length} append-only audit trail events
        </div>
      </div>
    </div>
  );
};
