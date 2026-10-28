import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssayReport, AssayMeasurement, MineralType } from '../../types';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  FileCheck2,
  X,
  ExternalLink,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';

export const AssaysPage: React.FC = () => {
  const { store, createAssayReport } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssay, setSelectedAssay] = useState<AssayReport | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Assay Form
  const [supplierId, setSupplierId] = useState(store.suppliers[0]?.id || 'SUP-ZM-101');
  const [labName, setLabName] = useState('Alfred H Knight International Ltd');
  const [mineral, setMineral] = useState<MineralType>('Copper');
  const [sampleRef, setSampleRef] = useState('SAMP-2026-AHK-990');
  const [purityResult, setPurityResult] = useState('99.9930% Cu Grade A Cathode');
  const [primaryPurityVal, setPrimaryPurityVal] = useState<number>(99.993);
  const [ironVal, setIronVal] = useState<number>(1.9);
  const [sulphurVal, setSulphurVal] = useState<number>(4.1);
  const [arsenicVal, setArsenicVal] = useState<number>(0.3);
  const [inspectorName, setInspectorName] = useState('Eng. Hastings Mulenga, Chief Assayer');
  const [notes, setNotes] = useState('Certified conforming to BS EN 1978:1998 specifications.');

  const filteredAssays = store.assays.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.sampleReference.toLowerCase().includes(q) ||
        a.supplierName.toLowerCase().includes(q) ||
        a.laboratoryName.toLowerCase().includes(q) ||
        a.mineral.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateAssaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = store.suppliers.find(s => s.id === supplierId);
    const now = new Date().toISOString();

    const measurements: AssayMeasurement[] = [
      { element: `${mineral} Main Content`, value: Number(primaryPurityVal), unit: '%', specificationRange: '>= 99.99%' },
      { element: 'Fe (Iron)', value: Number(ironVal), unit: 'ppm', specificationRange: '<= 10.0 ppm' },
      { element: 'S (Sulphur)', value: Number(sulphurVal), unit: 'ppm', specificationRange: '<= 15.0 ppm' },
      { element: 'As (Arsenic)', value: Number(arsenicVal), unit: 'ppm', specificationRange: '<= 5.0 ppm', isPenaltyElement: true }
    ];

    createAssayReport({
      supplierId,
      supplierName: sup?.name || 'Verified Supplier',
      laboratoryName: labName,
      labAccreditation: 'ISO/IEC 17025:2017 Accredited',
      sampleReference: sampleRef,
      samplingDate: now,
      testDate: now,
      reportDate: now,
      mineral,
      purityResult,
      measurements,
      status: 'Verified',
      documentReference: `DOC-${sampleRef}.pdf`,
      inspectorName,
      reviewerNotes: notes
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-teal-600" />
            Assay & Laboratory Quality Documentation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Independent metallurgical certificates from ISO/IEC 17025 accredited testing laboratories verifying mineral grade and penalty elements.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Register Assay Certificate
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by assay ID, sample reference, laboratory, or producer..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>
      </div>

      {/* Assays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssays.map((assay) => {
          const badge = getStatusBadgeClass(assay.status);
          return (
            <div
              key={assay.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-500/60 shadow-subtle hover:shadow-card transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-teal-700 font-bold block">
                      {assay.id} • {assay.mineral}
                    </span>
                    <h3 className="font-bold text-sm text-navy-900 mt-0.5 line-clamp-1">
                      {assay.purityResult}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                    {assay.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong className="text-navy-900">Lab:</strong> {assay.laboratoryName}</div>
                  <div className="text-[11px] text-slate-500">{assay.labAccreditation}</div>
                  <div><strong className="text-navy-900">Producer:</strong> {assay.supplierName}</div>
                  <div className="font-mono text-[11px] text-slate-500">Ref: {assay.sampleReference}</div>
                </div>

                {/* Primary measurements preview */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                  {assay.measurements.slice(0, 3).map((m) => (
                    <div key={m.element} className="flex justify-between">
                      <span className="text-slate-500">{m.element}</span>
                      <span className="font-bold text-navy-900">{m.value} {m.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px]">Certified: {formatDate(assay.reportDate)}</span>
                <button
                  onClick={() => setSelectedAssay(assay)}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 font-semibold transition-colors"
                >
                  View Full Assay
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assay Detail Modal */}
      {selectedAssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                  Certified Laboratory Report • {selectedAssay.id}
                </span>
                <h3 className="font-bold text-base text-white">{selectedAssay.purityResult}</h3>
              </div>
              <button
                onClick={() => setSelectedAssay(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Testing Laboratory</span>
                  <span className="font-semibold text-navy-900">{selectedAssay.laboratoryName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Lab Accreditation</span>
                  <span className="font-semibold text-teal-700">{selectedAssay.labAccreditation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Sample Reference</span>
                  <span className="font-mono font-semibold text-navy-900">{selectedAssay.sampleReference}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Sampling Date</span>
                  <span className="font-semibold text-navy-900">{formatDate(selectedAssay.samplingDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Report Date</span>
                  <span className="font-semibold text-navy-900">{formatDate(selectedAssay.reportDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Lead Assayer</span>
                  <span className="font-semibold text-navy-900">{selectedAssay.inspectorName}</span>
                </div>
              </div>

              {/* Elemental Table */}
              <div className="space-y-2">
                <span className="font-semibold text-navy-900 block text-xs">Certified Elemental Breakdown</span>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Element / Compound</th>
                        <th className="py-2 px-3 font-semibold">Tested Value</th>
                        <th className="py-2 px-3 font-semibold">Specification Limit</th>
                        <th className="py-2 px-3 font-semibold">Penalty Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedAssay.measurements.map((m) => (
                        <tr key={m.element} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-navy-900">{m.element}</td>
                          <td className="py-2.5 px-3 font-bold text-teal-800">{m.value} {m.unit}</td>
                          <td className="py-2.5 px-3 text-slate-500">{m.specificationRange || 'Standard'}</td>
                          <td className="py-2.5 px-3">
                            {m.isPenaltyElement ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                Penalty Monitored
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Conforming</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedAssay.reviewerNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="font-semibold text-navy-900 block">Assayer Reviewer Remarks:</span>
                  <p className="text-slate-700">{selectedAssay.reviewerNotes}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Attached file: {selectedAssay.documentReference}</span>
              <button
                onClick={() => setSelectedAssay(null)}
                className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Assay Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Register Lab Assay Quality Certificate</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssaySubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Supplier Organization *</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    {store.suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Testing Laboratory *</label>
                  <select
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    <option value="Alfred H Knight International Ltd">Alfred H Knight International</option>
                    <option value="SGS Minerals Inspection Services">SGS Minerals Inspection Services</option>
                    <option value="Alex Stewart International Ltd">Alex Stewart International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Commodity Mineral *</label>
                  <select
                    value={mineral}
                    onChange={(e) => setMineral(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    <option value="Copper">Copper</option>
                    <option value="Cobalt">Cobalt</option>
                    <option value="Lithium">Lithium</option>
                    <option value="Manganese">Manganese</option>
                    <option value="Graphite">Graphite</option>
                    <option value="Nickel">Nickel</option>
                    <option value="Tin">Tin</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sample Reference Code *</label>
                  <input
                    type="text"
                    required
                    value={sampleRef}
                    onChange={(e) => setSampleRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono form-input-focus"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Certified Grade Summary *</label>
                <input
                  type="text"
                  required
                  value={purityResult}
                  onChange={(e) => setPurityResult(e.target.value)}
                  placeholder="e.g. 99.9930% Cu Grade A Cathode"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-1">Purity % *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={primaryPurityVal}
                    onChange={(e) => setPrimaryPurityVal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-1">Fe (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ironVal}
                    onChange={(e) => setIronVal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-1">S (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sulphurVal}
                    onChange={(e) => setSulphurVal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-1">As (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={arsenicVal}
                    onChange={(e) => setArsenicVal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lead Assayer / Inspector Name *</label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold shadow-sm"
                >
                  Register Certified Assay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
