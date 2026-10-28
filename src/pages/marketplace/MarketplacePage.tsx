import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MineralListing, MineralType } from '../../types';
import { formatCurrency, formatQuantity, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Package,
  Search,
  Filter,
  Star,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  X,
  CheckCircle2,
  Info,
  SlidersHorizontal
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { store, activeRole, currentUser, toggleWatchlist, createRfq } = useApp();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIncoterm, setSelectedIncoterm] = useState<string>('All');
  const [onlyWatchlisted, setOnlyWatchlisted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'qty_desc' | 'newest'>('newest');

  // Modal states
  const [activeListingModal, setActiveListingModal] = useState<MineralListing | null>(null);
  const [rfqModalListing, setRfqModalListing] = useState<MineralListing | null>(null);

  // RFQ Form state
  const [rfqQuantity, setRfqQuantity] = useState<number>(100);
  const [rfqTargetPrice, setRfqTargetPrice] = useState<number>(9000);
  const [rfqDestination, setRfqDestination] = useState<string>('Busan Port, South Korea');
  const [rfqDeliveryDate, setRfqDeliveryDate] = useState<string>('2026-05-15');
  const [rfqIncoterm, setRfqIncoterm] = useState<'FOB' | 'CIF' | 'EXW'>('CIF');
  const [rfqInstructions, setRfqInstructions] = useState<string>('Requires independent preshipment assay cert and ICGLR conflict-free documentation.');
  const [rfqSubmittedSuccess, setRfqSubmittedSuccess] = useState<string | null>(null);

  const categories = ['All', 'Copper', 'Cobalt', 'Lithium', 'Manganese', 'Graphite', 'Nickel', 'Tin'];

  // Filter listings
  const filteredListings = useMemo(() => {
    return store.listings.filter((l) => {
      // Must be Published or Fully Allocated for marketplace browsing
      if (l.status === 'Draft' || l.status === 'Pending Review') return false;

      // Category filter
      if (selectedCategory !== 'All' && l.mineral !== selectedCategory) return false;

      // Incoterm filter
      if (selectedIncoterm !== 'All' && l.incoterm !== selectedIncoterm) return false;

      // Watchlist filter
      if (onlyWatchlisted && !l.isWatchlisted) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMineral = l.mineral.toLowerCase().includes(q);
        const matchSupplier = l.supplierName.toLowerCase().includes(q);
        const matchGrade = l.gradePurity.toLowerCase().includes(q);
        const matchPort = l.deliveryPortOrLocation.toLowerCase().includes(q);
        if (!matchMineral && !matchSupplier && !matchGrade && !matchPort) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.indicativePrice - b.indicativePrice;
      if (sortBy === 'price_desc') return b.indicativePrice - a.indicativePrice;
      if (sortBy === 'qty_desc') return b.availableQuantity - a.availableQuantity;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [store.listings, selectedCategory, selectedIncoterm, onlyWatchlisted, searchQuery, sortBy]);

  const handleOpenRfqModal = (listing: MineralListing) => {
    setRfqModalListing(listing);
    setRfqQuantity(listing.minimumOrderQuantity || 50);
    setRfqTargetPrice(listing.indicativePrice);
    setRfqIncoterm(listing.incoterm as any || 'CIF');
    setRfqSubmittedSuccess(null);
  };

  const handleCreateRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqModalListing) return;

    createRfq({
      buyerId: currentUser.organizationId || 'BUY-EXT-01',
      buyerName: currentUser.organizationName || 'International Commodity Buyer',
      buyerCountry: 'South Korea',
      supplierId: rfqModalListing.supplierId,
      supplierName: rfqModalListing.supplierName,
      listingId: rfqModalListing.id,
      mineral: rfqModalListing.mineral,
      requiredQuantity: Number(rfqQuantity),
      unit: rfqModalListing.unit,
      targetUnitPrice: Number(rfqTargetPrice),
      currency: rfqModalListing.currency,
      requiredGradePurity: rfqModalListing.gradePurity,
      incoterm: rfqIncoterm,
      destinationPort: rfqDestination,
      requiredDeliveryDate: rfqDeliveryDate,
      responseDeadline: '2026-04-15',
      specialInstructions: rfqInstructions
    });

    setRfqSubmittedSuccess(`RFQ successfully submitted to ${rfqModalListing.supplierName}! You can track discussions in Trade Negotiations.`);
    setTimeout(() => {
      setRfqModalListing(null);
      setRfqSubmittedSuccess(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Global Mineral Trade Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Commercial marketplace of verified African mineral supply with certified assay references and origin tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyWatchlisted(!onlyWatchlisted)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              onlyWatchlisted
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyWatchlisted ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            Watchlist ({store.listings.filter(l => l.isWatchlisted).length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mineral, grade (e.g. 99.99%), supplier name, or delivery port..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedIncoterm}
              onChange={(e) => setSelectedIncoterm(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
            >
              <option value="All">All Incoterms</option>
              <option value="CIF">CIF (Cost, Insurance & Freight)</option>
              <option value="FOB">FOB (Free On Board)</option>
              <option value="EXW">EXW (Ex Works)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
            >
              <option value="newest">Sort: Newly Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="qty_desc">Available Quantity: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mineral Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Indicative Pricing Disclaimer Alert */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Commercial Indication Notice:</strong> Indicative prices shown are commercial producer indications based on standard physical premiums over international base metal cash references. Final binding commercial terms are established during RFQ negotiations.
        </span>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5]" />
          <h3 className="font-semibold text-navy-900 text-sm">No mineral listings match your current filters</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or reset category filters to view all available copper, cobalt, lithium, and manganese lots.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedIncoterm('All');
              setOnlyWatchlisted(false);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => {
            const supplier = store.suppliers.find(s => s.id === listing.supplierId);
            const isVerified = supplier?.verificationStatus === 'Verified';

            return (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-teal-500/60 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase font-mono">
                        {listing.id} • {listing.mineral}
                      </span>
                      <h3 className="font-semibold text-sm text-navy-900 group-hover:text-teal-800 transition-colors line-clamp-1">
                        {listing.gradePurity}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleWatchlist(listing.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-500 transition-colors shrink-0"
                      title={listing.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star className={`w-4 h-4 ${listing.isWatchlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-medium truncate">{listing.supplierName}</span>
                    {isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Specs */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Available Supply</span>
                      <span className="font-bold text-navy-900 text-sm">
                        {formatQuantity(listing.availableQuantity, listing.unit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Indicative Price</span>
                      <span className="font-bold text-teal-700 text-sm">
                        {formatCurrency(listing.indicativePrice, listing.currency)} / {listing.unit}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-slate-600 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Terms / Incoterm:</span>
                      <span className="font-semibold text-navy-900">{listing.incoterm} ({listing.deliveryPortOrLocation})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Minimum Order:</span>
                      <span>{listing.minimumOrderQuantity} {listing.unit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Assay Reference:</span>
                      <span className="font-mono text-teal-700 font-medium">
                        {listing.assayReferenceNumber || 'Attached on Request'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveListingModal(listing)}
                    className="text-xs text-slate-600 hover:text-navy-900 font-semibold px-2.5 py-1.5 rounded hover:bg-slate-200/60 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleOpenRfqModal(listing)}
                    disabled={listing.status === 'Fully Allocated'}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      listing.status === 'Fully Allocated'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-navy-800 hover:bg-navy-900 text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {listing.status === 'Fully Allocated' ? 'Allocated' : 'Request RFQ'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Listing Detail Modal */}
      {activeListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                  {activeListingModal.id} • {activeListingModal.mineral}
                </span>
                <h3 className="font-bold text-base text-white">{activeListingModal.gradePurity}</h3>
              </div>
              <button
                onClick={() => setActiveListingModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Supplier Organization</span>
                  <span className="font-semibold text-navy-900 text-xs">{activeListingModal.supplierName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Mine Site Location</span>
                  <span className="font-semibold text-navy-900 text-xs">{activeListingModal.mineLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Country of Origin</span>
                  <span className="font-semibold text-navy-900 text-xs">{activeListingModal.countryOfOrigin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Available Stock</span>
                  <span className="font-semibold text-navy-900 text-xs">{activeListingModal.availableQuantity} {activeListingModal.unit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Indicative Price</span>
                  <span className="font-semibold text-teal-700 text-xs">${activeListingModal.indicativePrice} / {activeListingModal.unit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Incoterm & Port</span>
                  <span className="font-semibold text-navy-900 text-xs">{activeListingModal.incoterm} {activeListingModal.deliveryPortOrLocation}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-navy-900 block">Packaging & Handling Specification</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  {activeListingModal.packagingType}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-navy-900 block">Assay & Independent Lab Testing</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  Certified Laboratory Reference: <strong className="font-mono text-teal-700">{activeListingModal.assayReferenceNumber}</strong>. Conforms to international export specifications with continuous tamper-sealed chain-of-custody logging.
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Lead time: ~{activeListingModal.leadTimeDays} days</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveListingModal(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const l = activeListingModal;
                    setActiveListingModal(null);
                    handleOpenRfqModal(l);
                  }}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Proceed to RFQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Creation Modal */}
      {rfqModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Create Request for Quotation (RFQ)</h3>
                <p className="text-xs text-slate-300">Target Supplier: {rfqModalListing.supplierName}</p>
              </div>
              <button
                onClick={() => setRfqModalListing(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rfqSubmittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-navy-900 text-base">RFQ Sent Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">{rfqSubmittedSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateRfqSubmit} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900">
                  <span className="font-semibold block">{rfqModalListing.gradePurity}</span>
                  <span className="text-[11px] text-teal-700">
                    Supplier Listed Indicative: ${rfqModalListing.indicativePrice}/{rfqModalListing.unit} • Available: {rfqModalListing.availableQuantity} {rfqModalListing.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Required Quantity ({rfqModalListing.unit}) *</label>
                    <input
                      type="number"
                      required
                      min={rfqModalListing.minimumOrderQuantity || 1}
                      max={rfqModalListing.availableQuantity}
                      value={rfqQuantity}
                      onChange={(e) => setRfqQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Price (USD / {rfqModalListing.unit}) *</label>
                    <input
                      type="number"
                      required
                      value={rfqTargetPrice}
                      onChange={(e) => setRfqTargetPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Incoterm *</label>
                    <select
                      value={rfqIncoterm}
                      onChange={(e) => setRfqIncoterm(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                    >
                      <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                      <option value="FOB">FOB (Free On Board)</option>
                      <option value="EXW">EXW (Ex Works)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Delivery Date *</label>
                    <input
                      type="date"
                      required
                      value={rfqDeliveryDate}
                      onChange={(e) => setRfqDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Destination Port or Facility *</label>
                  <input
                    type="text"
                    required
                    value={rfqDestination}
                    onChange={(e) => setRfqDestination(e.target.value)}
                    placeholder="e.g. Busan Port, South Korea"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Commercial Notes & Requirements</label>
                  <textarea
                    rows={3}
                    value={rfqInstructions}
                    onChange={(e) => setRfqInstructions(e.target.value)}
                    placeholder="Inspection stipulations, assay requirements, escrow milestones..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRfqModalListing(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Transmit Commercial RFQ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
