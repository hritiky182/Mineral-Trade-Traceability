import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MineralListing, MineralType, ListingStatus } from '../../types';
import { formatCurrency, formatQuantity, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  XCircle,
  Layers,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { store, activeRole, currentUser, createListing, updateListingStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Listing Form State
  const [mineral, setMineral] = useState<MineralType>('Copper');
  const [gradePurity, setGradePurity] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'MT' | 'KG'>('MT');
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState<number>(50);
  const [indicativePrice, setIndicativePrice] = useState<number>(9150);
  const [incoterm, setIncoterm] = useState<MineralListing['incoterm']>('CIF');
  const [deliveryPort, setDeliveryPort] = useState('Busan Port, South Korea');
  const [packagingType, setPackagingType] = useState('Steel-strapped bundles on wooden skids');
  const [leadTimeDays, setLeadTimeDays] = useState<number>(25);
  const [mineLocation, setMineLocation] = useState('Central Mining Site');
  const [assayReference, setAssayReference] = useState('AK-GL-2026-991');

  // Filter listings
  const filteredListings = store.listings.filter((l) => {
    // If supplier role, allow viewing all or own org
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!l.mineral.toLowerCase().includes(q) && !l.gradePurity.toLowerCase().includes(q) && !l.supplierName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalAvailableStock = store.listings.reduce((sum, l) => sum + l.availableQuantity, 0);
  const totalAllocatedStock = store.listings.reduce((sum, l) => sum + (l.allocatedQuantity || 0), 0);
  const totalValuation = store.listings.reduce((sum, l) => sum + (l.availableQuantity * l.indicativePrice), 0);

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createListing({
      mineral,
      supplierId: currentUser.organizationId || 'SUP-ZM-101',
      supplierName: currentUser.organizationName || 'Copperbelt Consolidated Mining Ltd',
      countryOfOrigin: 'Primary Mining District',
      mineLocation,
      availableQuantity: Number(availableQuantity),
      allocatedQuantity: 0,
      unit,
      gradePurity,
      minimumOrderQuantity: Number(minimumOrderQuantity),
      indicativePrice: Number(indicativePrice),
      currency: 'USD',
      incoterm,
      deliveryPortOrLocation: deliveryPort,
      packagingType,
      status: 'Published',
      leadTimeDays: Number(leadTimeDays),
      assayReferenceNumber: assayReference
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Mineral Inventory & Supply Allocations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage mineral stocks, allocate quantities against incoming purchase orders, and publish verified commercial lots.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </button>
      </div>

      {/* Stock Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Total Available Stock</span>
          <span className="text-2xl font-bold text-navy-900 mt-1 block">
            {formatQuantity(totalAvailableStock, 'MT')}
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">Ready for immediate contract allocation</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Contracted / Allocated Stock</span>
          <span className="text-2xl font-bold text-teal-700 mt-1 block">
            {formatQuantity(totalAllocatedStock, 'MT')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Committed to active purchase orders</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-xs text-slate-400 block font-medium">Total Indicative Valuation</span>
          <span className="text-2xl font-bold text-navy-900 mt-1 block">
            ${(totalValuation / 1000000).toFixed(2)}M USD
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Based on physical commercial prices</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory by commodity, specification, or supplier..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-navy-900 form-input-focus"
        >
          <option value="All">All Listing Statuses</option>
          <option value="Published">Published (Active)</option>
          <option value="Paused">Paused</option>
          <option value="Fully Allocated">Fully Allocated</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Listing ID / Commodity</th>
                <th className="py-3 px-3 font-semibold">Specification</th>
                <th className="py-3 px-3 font-semibold">Producer</th>
                <th className="py-3 px-3 font-semibold">Stock (Avail / Alloc)</th>
                <th className="py-3 px-3 font-semibold">Price Indication</th>
                <th className="py-3 px-3 font-semibold">Terms</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredListings.map((listing) => {
                const badge = getStatusBadgeClass(listing.status);
                return (
                  <tr key={listing.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div className="font-mono text-teal-700 text-[11px]">{listing.id}</div>
                      <div className="text-xs">{listing.mineral}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-navy-900 max-w-xs truncate">
                      {listing.gradePurity}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 truncate">{listing.supplierName}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-navy-900">
                        {listing.availableQuantity} {listing.unit}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Allocated: {listing.allocatedQuantity || 0} {listing.unit}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-navy-900">
                      ${listing.indicativePrice} / {listing.unit}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {listing.incoterm} ({listing.deliveryPortOrLocation})
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {listing.status === 'Published' ? (
                        <button
                          onClick={() => updateListingStatus(listing.id, 'Paused')}
                          className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-semibold"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => updateListingStatus(listing.id, 'Published')}
                          className="px-2.5 py-1 rounded border border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100 text-[11px] font-semibold"
                        >
                          Publish
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Create New Mineral Supply Listing</h3>
                <p className="text-xs text-slate-300">Publish commodity stock to the international marketplace</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListingSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mineral Category *</label>
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
                  <label className="font-semibold text-slate-700 block mb-1">Mine Site / Source *</label>
                  <input
                    type="text"
                    required
                    value={mineLocation}
                    onChange={(e) => setMineLocation(e.target.value)}
                    placeholder="e.g. Kitwe Deep Shaft, Copperbelt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Grade & Purity Specification *</label>
                <input
                  type="text"
                  required
                  value={gradePurity}
                  onChange={(e) => setGradePurity(e.target.value)}
                  placeholder="e.g. Grade A LME Copper Cathodes (99.9935% Cu)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    <option value="MT">Metric Tons (MT)</option>
                    <option value="KG">Kilograms (KG)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Indicative Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={indicativePrice}
                    onChange={(e) => setIndicativePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Incoterm *</label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  >
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Port / Location *</label>
                  <input
                    type="text"
                    required
                    value={deliveryPort}
                    onChange={(e) => setDeliveryPort(e.target.value)}
                    placeholder="e.g. Busan Port, South Korea"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Packaging Method</label>
                  <input
                    type="text"
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assay Cert Reference</label>
                  <input
                    type="text"
                    value={assayReference}
                    onChange={(e) => setAssayReference(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>
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
                  Publish Listing Immediately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
