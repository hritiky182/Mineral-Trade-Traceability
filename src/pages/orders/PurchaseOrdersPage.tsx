import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder } from '../../types';
import { formatCurrency, formatQuantity, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Coins,
  Cpu,
  Building2,
  X,
  Printer,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const PurchaseOrdersPage: React.FC = () => {
  const { store, confirmPurchaseOrder } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  const filteredPos = store.purchaseOrders.filter((po) => {
    if (statusFilter !== 'All' && po.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        po.poNumber.toLowerCase().includes(q) ||
        po.buyerName.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.mineral.toLowerCase().includes(q) ||
        po.deliveryDestination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-teal-600" />
            Purchase Order Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Binding commercial orders, automated financial calculations, and fulfillment milestone triggers.
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
            placeholder="Search by PO number, buyer, supplier, destination..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
        >
          <option value="All">All PO Statuses</option>
          <option value="Supplier Acknowledgment Pending">Pending Supplier Ack</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Fulfillment in Progress">In Fulfillment</option>
          <option value="Fulfilled">Fulfilled (Completed)</option>
        </select>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">PO Number / Date</th>
                <th className="py-3 px-3 font-semibold">Buyer & Supplier</th>
                <th className="py-3 px-3 font-semibold">Commodity & Quantity</th>
                <th className="py-3 px-3 font-semibold">Unit Price</th>
                <th className="py-3 px-3 font-semibold">Total Indicative Value</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPos.map((po) => {
                const badge = getStatusBadgeClass(po.status);
                return (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div className="font-mono text-teal-700 text-xs">{po.poNumber}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{formatDate(po.creationDate)}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-navy-900 truncate">{po.buyerName}</div>
                      <div className="text-[11px] text-slate-500 truncate">Supplier: {po.supplierName}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-navy-900">
                        {po.quantity} {po.unit} {po.mineral}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{po.specification}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-navy-900">
                      ${po.unitPrice} / {po.unit}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-teal-800 text-sm font-mono">
                      ${po.totalIndicativeValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {po.status === 'Supplier Acknowledgment Pending' && (
                          <button
                            onClick={() => confirmPurchaseOrder(po.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold"
                          >
                            Acknowledge
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedPo(po)}
                          className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 rounded text-slate-700 text-[11px] font-semibold"
                        >
                          Invoice View
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

      {/* PO Commercial Invoice Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-300 font-bold uppercase">
                  Official Commercial Purchase Order
                </span>
                <h3 className="font-bold text-base text-white">{selectedPo.poNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedPo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Invoice Body */}
            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              {/* Buyer & Supplier Addresses */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Buyer Organization</span>
                  <div className="font-bold text-navy-900 text-sm">{selectedPo.buyerName}</div>
                  <div className="text-slate-500">{selectedPo.buyerCountry}</div>
                  <div className="text-[11px] text-slate-500">Destination: {selectedPo.deliveryDestination}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Supplier Producer</span>
                  <div className="font-bold text-navy-900 text-sm">{selectedPo.supplierName}</div>
                  <div className="text-slate-500">{selectedPo.supplierCountry}</div>
                  <div className="text-[11px] text-slate-500">Incoterm: {selectedPo.incoterm}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Commodity Item</th>
                      <th className="py-2.5 px-3 font-semibold">Quantity</th>
                      <th className="py-2.5 px-3 font-semibold">Unit Price</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-bold text-navy-900">{selectedPo.mineral}</div>
                        <div className="text-[11px] text-slate-500">{selectedPo.specification}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold">{selectedPo.quantity} {selectedPo.unit}</td>
                      <td className="py-3 px-3">${selectedPo.unitPrice.toLocaleString()} / {selectedPo.unit}</td>
                      <td className="py-3 px-3 font-mono font-bold text-navy-900 text-right">
                        ${selectedPo.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 max-w-sm ml-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Commodity Subtotal:</span>
                  <span className="font-semibold text-navy-900">${selectedPo.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Logistics & Transit Insurance:</span>
                  <span className="font-semibold text-navy-900">${selectedPo.logisticsInsuranceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Export Levy Estimate:</span>
                  <span className="font-semibold text-navy-900">${selectedPo.exportLevyEstimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-teal-800">
                  <span>Total Indicative Value:</span>
                  <span className="font-mono">${selectedPo.totalIndicativeValue.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Payment Terms & Escrow Link */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 space-y-1">
                <span className="font-semibold block">Settlement & Escrow Terms:</span>
                <p className="text-[11px] leading-relaxed">
                  {selectedPo.paymentTerms}. Linked Escrow Account: <strong className="font-mono">{selectedPo.escrowId || 'ESC-PENDING'}</strong>.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Expected Delivery: {formatDate(selectedPo.expectedDeliveryDate)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPo(null)}
                  className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Close
                </button>
                {selectedPo.escrowId && (
                  <button
                    onClick={() => {
                      navigate(`/escrow?po=${selectedPo.id}`);
                      setSelectedPo(null);
                    }}
                    className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    Open Escrow Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
