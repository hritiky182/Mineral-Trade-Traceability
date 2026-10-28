import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Shipment, ShipmentMilestone } from '../../types';
import { formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Anchor,
  MapPin,
  Calendar,
  X,
  PlusCircle,
  FileText,
  AlertCircle,
  Cpu
} from 'lucide-react';

export const ShipmentsPage: React.FC = () => {
  const { store, addShipmentMilestone, recordShipmentDelay } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);

  // Milestone Modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneLocation, setMilestoneLocation] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');

  // Delay Modal
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [revisedEta, setRevisedEta] = useState('');

  const filteredShipments = store.shipments.filter((s) => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.trackingNumber.toLowerCase().includes(q) ||
        s.mineral.toLowerCase().includes(q) ||
        s.logisticsProvider.toLowerCase().includes(q) ||
        s.destinationPort.toLowerCase().includes(q) ||
        s.originPort.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLogMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShipment) return;

    addShipmentMilestone(activeShipment.id, {
      title: milestoneTitle,
      location: milestoneLocation,
      status: 'Completed',
      description: milestoneDesc,
      recordedBy: 'Logistics Operations Officer'
    });

    setIsMilestoneModalOpen(false);
    setMilestoneTitle('');
    setMilestoneLocation('');
    setMilestoneDesc('');
    // refresh active shipment
    const updated = store.shipments.find(s => s.id === activeShipment.id);
    if (updated) setActiveShipment(updated);
  };

  const handleReportDelaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShipment) return;

    recordShipmentDelay(activeShipment.id, delayReason, revisedEta);
    setIsDelayModalOpen(false);
    setDelayReason('');
    setRevisedEta('');
    const updated = store.shipments.find(s => s.id === activeShipment.id);
    if (updated) setActiveShipment(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-teal-600" />
            Shipments & International Logistics Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multimodal container and break-bulk logistics across the Dar es Salaam, Walvis Bay, and Beira export corridors.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tracking number, vessel, port, or logistics carrier..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
        >
          <option value="All">All Shipment Statuses</option>
          <option value="In Transit">In Transit</option>
          <option value="Preparation">Preparation</option>
          <option value="Ready for Dispatch">Ready for Dispatch</option>
          <option value="Customs Processing">Customs Processing</option>
          <option value="Delayed">Delayed</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Tracking Number</th>
                <th className="py-3 px-3 font-semibold">Commodity & Quantity</th>
                <th className="py-3 px-3 font-semibold">Logistics Carrier & Vessel</th>
                <th className="py-3 px-3 font-semibold">Route (Origin → Destination)</th>
                <th className="py-3 px-3 font-semibold">ETA / Dispatch</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredShipments.map((shp) => {
                const badge = getStatusBadgeClass(shp.status);
                return (
                  <tr key={shp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div className="font-mono text-teal-700 text-xs">{shp.trackingNumber}</div>
                      <div className="text-[10px] text-slate-400 font-normal">PO: {shp.purchaseOrderId}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-navy-900">
                        {shp.shippedQuantity} {shp.unit} {shp.mineral}
                      </div>
                      <div className="text-[10px] text-slate-500">{shp.transportMode}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-navy-900">{shp.logisticsProvider}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{shp.vesselOrConsignmentNumber}</div>
                    </td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="text-slate-600 truncate">{shp.originPort}</div>
                      <div className="text-[10px] text-teal-700 font-semibold truncate">→ {shp.destinationPort}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-slate-700 font-semibold">
                        ETA: {shp.revisedArrivalDate || shp.estimatedArrivalDate}
                      </div>
                      <div className="text-[10px] text-slate-400">Departed: {formatDate(shp.dispatchDate)}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {shp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveShipment(shp)}
                        className="px-3 py-1 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors"
                      >
                        Milestones & Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Milestones Detail Modal */}
      {activeShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-300 font-bold uppercase">
                  Consignment Milestones • {activeShipment.trackingNumber}
                </span>
                <h3 className="font-bold text-base text-white">
                  {activeShipment.shippedQuantity} {activeShipment.unit} of {activeShipment.mineral}
                </h3>
              </div>
              <button
                onClick={() => setActiveShipment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              {/* Delay Warning Alert if delayed */}
              {activeShipment.isDelayed && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Consignment Operational Delay Notice</span>
                    <p className="text-[11px] mt-0.5">{activeShipment.delayReason}</p>
                    <span className="text-[11px] font-semibold block mt-1">
                      Revised ETA: {activeShipment.revisedArrivalDate}
                    </span>
                  </div>
                </div>
              )}

              {/* Route Summary Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Logistics Provider</span>
                  <span className="font-semibold text-navy-900">{activeShipment.logisticsProvider}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Vessel / Consignment</span>
                  <span className="font-semibold text-navy-900">{activeShipment.vesselOrConsignmentNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Transport Mode</span>
                  <span className="font-semibold text-navy-900">{activeShipment.transportMode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Origin Facility</span>
                  <span className="font-semibold text-navy-900">{activeShipment.originPort}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Destination Seaport</span>
                  <span className="font-semibold text-navy-900">{activeShipment.destinationPort}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Traceability Batch</span>
                  <span className="font-mono font-semibold text-teal-700">{activeShipment.batchId}</span>
                </div>
              </div>

              {/* Milestones Chronological Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-navy-900">Recorded Transit Milestones</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDelayModalOpen(true)}
                      className="px-2.5 py-1 rounded text-rose-700 bg-rose-50 border border-rose-200 text-[11px] font-semibold hover:bg-rose-100"
                    >
                      Report Delay
                    </button>
                    <button
                      onClick={() => setIsMilestoneModalOpen(true)}
                      className="px-2.5 py-1 rounded text-teal-800 bg-teal-50 border border-teal-200 text-[11px] font-semibold hover:bg-teal-100 flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Log Milestone
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2 relative pl-6 border-l-2 border-teal-200 ml-2">
                  {activeShipment.milestones.map((m) => (
                    <div key={m.id} className="relative space-y-1">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-teal-600 ring-4 ring-white"></div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-navy-900">{m.title}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(m.timestamp)}</span>
                      </div>
                      <div className="text-[11px] text-teal-800 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        {m.location}
                      </div>
                      <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                        {m.description}
                      </p>
                      <span className="text-[10px] text-slate-400 block">Logged by: {m.recordedBy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => navigate(`/traceability?batch=${activeShipment.batchId}`)}
                className="text-xs text-teal-700 hover:underline font-semibold flex items-center gap-1"
              >
                <Cpu className="w-3.5 h-3.5" />
                View Traceability Batch Ledger
              </button>
              <button
                onClick={() => setActiveShipment(null)}
                className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-navy-900">Record New Shipment Milestone</h4>
              <button onClick={() => setIsMilestoneModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleLogMilestoneSubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Milestone Event Title *</label>
                <input
                  type="text"
                  required
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. Cleared Singapore Port Transshipment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Location *</label>
                <input
                  type="text"
                  required
                  value={milestoneLocation}
                  onChange={(e) => setMilestoneLocation(e.target.value)}
                  placeholder="e.g. Port of Singapore, Berth 12"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  placeholder="Details of inspection, container seal verification, or bunkering..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 text-white rounded font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Delay Modal */}
      {isDelayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Report Consignment Delay
              </h4>
              <button onClick={() => setIsDelayModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <form onSubmit={handleReportDelaySubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Mandatory Delay Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="Specify cause (port congestion, cyclone weather, railway maintenance)..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Revised Estimated Arrival Date (ETA) *</label>
                <input
                  type="date"
                  required
                  value={revisedEta}
                  onChange={(e) => setRevisedEta(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDelayModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold"
                >
                  Record Delay & Notify Trade Partners
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
