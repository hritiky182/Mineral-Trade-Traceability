import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RequestForQuotation, CommercialOffer } from '../../types';
import { formatCurrency, formatQuantity, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  FileText,
  Search,
  PlusCircle,
  Clock,
  ArrowRight,
  MessagesSquare,
  Building2,
  DollarSign,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const RfqsPage: React.FC = () => {
  const { store, activeRole, currentUser, submitCommercialOffer } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeOfferRfq, setActiveOfferRfq] = useState<RequestForQuotation | null>(null);

  // Supplier Offer Form State
  const [offerUnitPrice, setOfferUnitPrice] = useState<number>(9150);
  const [offerQuantity, setOfferQuantity] = useState<number>(100);
  const [offerIncoterm, setOfferIncoterm] = useState<CommercialOffer['incoterm']>('CIF');
  const [offerLocation, setOfferLocation] = useState('Busan Port, South Korea');
  const [offerDispatchDate, setOfferDispatchDate] = useState('2026-04-20');
  const [offerValidityDate, setOfferValidityDate] = useState('2026-04-10');
  const [offerPaymentTerms, setOfferPaymentTerms] = useState('100% Escrow deposit funded prior to ocean dispatch');
  const [offerNotes, setOfferNotes] = useState('Firm commercial offer. Independent AHK assay certificate and tamper RFID seal provided.');

  const filteredRfqs = store.rfqs.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.mineral.toLowerCase().includes(q) ||
        r.buyerName.toLowerCase().includes(q) ||
        r.supplierName.toLowerCase().includes(q) ||
        r.destinationPort.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenOfferModal = (rfq: RequestForQuotation) => {
    setActiveOfferRfq(rfq);
    setOfferUnitPrice(rfq.targetUnitPrice || 9000);
    setOfferQuantity(rfq.requiredQuantity);
    setOfferIncoterm(rfq.incoterm);
    setOfferLocation(rfq.destinationPort);
  };

  const handleCommercialOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfferRfq) return;

    submitCommercialOffer(activeOfferRfq.id, {
      supplierId: activeOfferRfq.supplierId,
      supplierName: activeOfferRfq.supplierName,
      unitPrice: Number(offerUnitPrice),
      currency: activeOfferRfq.currency,
      confirmedQuantity: Number(offerQuantity),
      unit: activeOfferRfq.unit,
      totalValue: Number(offerUnitPrice) * Number(offerQuantity),
      incoterm: offerIncoterm,
      deliveryLocation: offerLocation,
      estimatedDispatchDate: offerDispatchDate,
      offerValidityDate,
      paymentTerms: offerPaymentTerms,
      commercialNotes: offerNotes,
      status: 'Pending Buyer Review'
    });

    setActiveOfferRfq(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Requests for Quotation (RFQs)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Commercial inquiry requests, supplier formal price submissions, and bilateral trade negotiation threads.
          </p>
        </div>

        <button
          onClick={() => navigate('/workspace/trade-opportunities')}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New RFQ
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
            placeholder="Search by RFQ number, buyer, supplier, destination port..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
        >
          <option value="All">All RFQ Statuses</option>
          <option value="Submitted">Submitted (Awaiting Supplier)</option>
          <option value="Offer Received">Offer Received</option>
          <option value="Negotiation">Negotiation Active</option>
          <option value="Converted to Purchase Order">Converted to PO</option>
          <option value="Accepted">Accepted</option>
        </select>
      </div>

      {/* RFQs List */}
      <div className="space-y-3">
        {filteredRfqs.map((rfq) => {
          const badge = getStatusBadgeClass(rfq.status);
          const hasOffer = rfq.offers && rfq.offers.length > 0;
          const latestOffer = hasOffer ? rfq.offers[0] : null;

          return (
            <div
              key={rfq.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-500/60 shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {rfq.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                    {rfq.status}
                  </span>
                  <span className="text-xs text-slate-400">• Created: {formatDate(rfq.createdAt)}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy-900">
                    {rfq.requiredQuantity} {rfq.unit} of {rfq.mineral} ({rfq.requiredGradePurity || 'Certified Grade'})
                  </h3>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                    <span><strong>Buyer:</strong> {rfq.buyerName} ({rfq.buyerCountry})</span>
                    <span>→</span>
                    <span><strong>Supplier:</strong> {rfq.supplierName}</span>
                    <span>• Destination: {rfq.destinationPort}</span>
                  </div>
                </div>

                {latestOffer && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-500 font-medium">Latest Supplier Offer ({latestOffer.id}): </span>
                      <strong className="text-teal-800 font-semibold">${latestOffer.unitPrice}/{latestOffer.unit}</strong>
                      <span className="text-slate-600"> ({latestOffer.incoterm} {latestOffer.deliveryLocation})</span>
                    </div>
                    <span className="font-bold text-navy-900 font-mono text-[11px]">
                      Total: ${latestOffer.totalValue.toLocaleString()} USD
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* If role is supplier and no accepted offer yet, allow submitting offer */}
                {rfq.status !== 'Converted to Purchase Order' && rfq.status !== 'Accepted' && (
                  <button
                    onClick={() => handleOpenOfferModal(rfq)}
                    className="px-3.5 py-1.5 rounded-lg border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold shadow-sm transition-colors"
                  >
                    {hasOffer ? 'Revise Offer' : 'Submit Commercial Offer'}
                  </button>
                )}

                <button
                  onClick={() => navigate(`/workspace/negotiations?rfq=${rfq.id}`)}
                  className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <MessagesSquare className="w-3.5 h-3.5" />
                  Negotiation Room
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Commercial Offer Modal */}
      {activeOfferRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Submit Commercial Offer</h3>
                <p className="text-xs text-slate-300">Responding to inquiry from {activeOfferRfq.buyerName}</p>
              </div>
              <button
                onClick={() => setActiveOfferRfq(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCommercialOfferSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="font-semibold text-navy-900 block">Buyer Requirement Summary</span>
                <p className="text-slate-600">
                  {activeOfferRfq.requiredQuantity} {activeOfferRfq.unit} {activeOfferRfq.mineral} ({activeOfferRfq.requiredGradePurity}) to {activeOfferRfq.destinationPort}. Target price: ${activeOfferRfq.targetUnitPrice || 'N/A'}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Offered Unit Price (USD / {activeOfferRfq.unit}) *</label>
                  <input
                    type="number"
                    required
                    value={offerUnitPrice}
                    onChange={(e) => setOfferUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirmed Quantity ({activeOfferRfq.unit}) *</label>
                  <input
                    type="number"
                    required
                    value={offerQuantity}
                    onChange={(e) => setOfferQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Incoterm *</label>
                  <select
                    value={offerIncoterm}
                    onChange={(e) => setOfferIncoterm(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Destination *</label>
                  <input
                    type="text"
                    required
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estimated Dispatch Date *</label>
                  <input
                    type="date"
                    required
                    value={offerDispatchDate}
                    onChange={(e) => setOfferDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Offer Validity Expiry *</label>
                  <input
                    type="date"
                    required
                    value={offerValidityDate}
                    onChange={(e) => setOfferValidityDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Commercial Notes & Quality Assurances</label>
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveOfferRfq(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold shadow-sm"
                >
                  Submit Formal Commercial Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
