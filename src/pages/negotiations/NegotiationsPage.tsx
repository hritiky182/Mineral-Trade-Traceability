import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatQuantity, formatDate, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import {
  MessagesSquare,
  FileCheck2,
  DollarSign,
  Send,
  CheckCircle2,
  XCircle,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Coins
} from 'lucide-react';

export const NegotiationsPage: React.FC = () => {
  const { store, activeRole, currentUser, acceptCommercialOffer, declineCommercialOffer, sendNegotiationMessage } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeRfqId = searchParams.get('rfq') || store.rfqs[0]?.id;
  const currentRfq = store.rfqs.find(r => r.id === activeRfqId) || store.rfqs[0];

  const [messageInput, setMessageInput] = useState('');
  const [counterPrice, setCounterPrice] = useState<string>('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const latestOffer = currentRfq?.offers && currentRfq.offers.length > 0 ? currentRfq.offers[0] : null;
  const isAcceptedOrConverted = currentRfq?.status === 'Accepted' || currentRfq?.status === 'Converted to Purchase Order';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !counterPrice) return;
    if (!currentRfq) return;

    sendNegotiationMessage(
      currentRfq.id,
      messageInput.trim() || `Proposed revised price: $${counterPrice}/MT`,
      counterPrice ? Number(counterPrice) : undefined
    );

    setMessageInput('');
    setCounterPrice('');
  };

  const handleAcceptOffer = () => {
    if (!currentRfq || !latestOffer) return;
    const { po, escrow } = acceptCommercialOffer(currentRfq.id, latestOffer.id);
    setSuccessBanner(`Commercial offer accepted! Generated Purchase Order ${po.poNumber} and Escrow ${escrow.id}.`);
  };

  const handleDeclineOffer = () => {
    if (!currentRfq || !latestOffer) return;
    declineCommercialOffer(currentRfq.id, latestOffer.id, 'Counter-proposal requested via negotiation room.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <MessagesSquare className="w-6 h-6 text-teal-600" />
            Trade Negotiations & Commercial Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bilateral commercial negotiation workspace with counter-offers, message history, and automated purchase-order conversion.
          </p>
        </div>

        {currentRfq?.associatedPurchaseOrderId && (
          <button
            onClick={() => navigate(`/workspace/purchase-orders?search=${currentRfq.associatedPurchaseOrderId}`)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileCheck2 className="w-4 h-4" />
            View Generated PO ({currentRfq.associatedPurchaseOrderId})
          </button>
        )}
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successBanner}</span>
          </div>
          <button
            onClick={() => navigate('/purchase-orders')}
            className="px-3 py-1 bg-emerald-700 text-white rounded text-xs font-semibold"
          >
            Go to POs
          </button>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: RFQs List (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-3 space-y-2">
          <div className="px-2 py-1 text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Active Negotiation Threads
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {store.rfqs.map((rfq) => {
              const isSelected = rfq.id === currentRfq?.id;
              const badge = getStatusBadgeClass(rfq.status);
              return (
                <div
                  key={rfq.id}
                  onClick={() => setSearchParams({ rfq: rfq.id })}
                  className={`p-3 rounded-lg text-xs cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-teal-50/60 border-teal-500 shadow-sm'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span className="font-bold text-navy-900">{rfq.id}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${badge.bg} ${badge.text}`}>
                      {rfq.status}
                    </span>
                  </div>
                  <div className="font-semibold text-navy-900 mt-1 line-clamp-1">
                    {rfq.requiredQuantity} {rfq.unit} {rfq.mineral}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {rfq.buyerName} ↔ {rfq.supplierName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Negotiation Room & Thread (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-subtle flex flex-col min-h-[600px] overflow-hidden">
          {/* Room Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  {currentRfq?.id}
                </span>
                <span className="font-bold text-sm text-navy-900">
                  {currentRfq?.requiredQuantity} {currentRfq?.unit} {currentRfq?.mineral}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Buyer: <strong>{currentRfq?.buyerName}</strong> ({currentRfq?.buyerCountry}) • Supplier: <strong>{currentRfq?.supplierName}</strong>
              </p>
            </div>

            {/* Decision CTAs */}
            {latestOffer && !isAcceptedOrConverted && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDeclineOffer}
                  className="px-3 py-1.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Decline Offer
                </button>
                <button
                  onClick={handleAcceptOffer}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Accept Offer & Issue PO
                </button>
              </div>
            )}
          </div>

          {/* Agreed Terms / Offer Snapshot */}
          {latestOffer && (
            <div className="p-4 bg-teal-50/40 border-b border-teal-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-900">Current Active Offer Terms ({latestOffer.id}):</span>
                <span className="font-mono text-teal-800 font-bold text-sm">
                  Total Value: ${latestOffer.totalValue.toLocaleString()} USD
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-slate-600 text-[11px]">
                <div>Offered Price: <strong className="text-navy-900">${latestOffer.unitPrice}/{latestOffer.unit}</strong></div>
                <div>Confirmed Qty: <strong className="text-navy-900">{latestOffer.confirmedQuantity} {latestOffer.unit}</strong></div>
                <div>Terms: <strong className="text-navy-900">{latestOffer.incoterm} {latestOffer.deliveryLocation}</strong></div>
                <div>Est. Dispatch: <strong className="text-navy-900">{formatDate(latestOffer.estimatedDispatchDate)}</strong></div>
              </div>
            </div>
          )}

          {/* Messages Thread (Scrollable) */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[400px]">
            {currentRfq?.messages.map((msg) => {
              const isBuyer = msg.senderRole === 'buyer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>({msg.senderOrganization})</span>
                    <span>•</span>
                    <span>{formatDateTime(msg.timestamp)}</span>
                  </div>

                  <div
                    className={`max-w-lg p-3 rounded-xl text-xs space-y-1.5 ${
                      isBuyer
                        ? 'bg-slate-100 text-navy-900 border border-slate-200'
                        : 'bg-navy-800 text-white shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.message}</p>
                    {msg.proposedPrice && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 text-teal-300">
                        Proposed Price: ${msg.proposedPrice}/MT
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type message, counter-terms, or inspection stipulation..."
              className="flex-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-navy-900 form-input-focus"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder="Counter $/MT"
                className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono form-input-focus"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
