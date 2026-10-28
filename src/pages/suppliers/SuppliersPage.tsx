import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Supplier, VerificationStatus } from '../../types';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  PlusCircle,
  X,
  ShieldCheck,
  Package
} from 'lucide-react';

export const SuppliersPage: React.FC = () => {
  const { store } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = useMemo(() => {
    return store.suppliers.filter((s) => {
      if (statusFilter !== 'All' && s.verificationStatus !== statusFilter) return false;
      if (categoryFilter !== 'All' && s.businessCategory !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCity = s.city.toLowerCase().includes(q);
        const matchLicense = s.miningLicenseNumber.toLowerCase().includes(q);
        const matchMineral = s.mineralsSupplied.some(m => m.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchLicense && !matchMineral) return false;
      }
      return true;
    });
  }, [store.suppliers, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Verified Supplier Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of licensed mining companies, processors, and aggregators across primary mineral extraction regions.
          </p>
        </div>

        <NavLink
          to="/workspace/supplier-onboarding"
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Onboard New Supplier
        </NavLink>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, city, licence number, or mineral..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-navy-900 form-input-focus"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Under Review">Under Review</option>
            <option value="Submitted">Submitted (Pending)</option>
            <option value="Additional Information Required">Info Required</option>
            <option value="Suspended">Suspended</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-navy-900 form-input-focus"
          >
            <option value="All">All Business Categories</option>
            <option value="Large Enterprise Mining">Large Enterprise Mining</option>
            <option value="Medium Commercial">Medium Commercial</option>
            <option value="Trading Aggregator">Trading Aggregator</option>
            <option value="Artisanal & Small Scale">Artisanal & Small Scale</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Supplier Organization</th>
                <th className="py-3 px-3 font-semibold">Business Category</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Minerals Supplied</th>
                <th className="py-3 px-3 font-semibold">Mining Licence</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.map((supplier) => {
                const badge = getStatusBadgeClass(supplier.verificationStatus);
                const activeListingsCount = store.listings.filter(l => l.supplierId === supplier.id).length;

                return (
                  <tr key={supplier.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div>{supplier.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {supplier.id} • Est. {supplier.yearEstablished}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{supplier.businessCategory}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{supplier.city}, {supplier.country}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {supplier.mineralsSupplied.map((m) => (
                          <span
                            key={m}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {supplier.miningLicenseNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {supplier.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedSupplier(supplier)}
                        className="px-3 py-1 rounded border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-navy-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredSuppliers.length} of {store.suppliers.length} registered suppliers</span>
          <NavLink to="/workspace/supplier-verification" className="text-teal-700 hover:underline font-semibold">
            Open Verification Queue →
          </NavLink>
        </div>
      </div>

      {/* Supplier Profile Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                  {selectedSupplier.id} • {selectedSupplier.businessCategory}
                </span>
                <h3 className="font-bold text-base text-white">{selectedSupplier.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              {/* Verification Stamp Banner */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Verification Status</span>
                  <span className="font-bold text-navy-900 text-sm">{selectedSupplier.verificationStatus}</span>
                  {selectedSupplier.verifiedBy && (
                    <span className="text-[11px] text-slate-500 block">Stamped by: {selectedSupplier.verifiedBy}</span>
                  )}
                </div>
                {selectedSupplier.verificationNotes && (
                  <p className="text-[11px] text-slate-500 max-w-xs text-right">
                    "{selectedSupplier.verificationNotes}"
                  </p>
                )}
              </div>

              {/* Legal & Registration Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Corporate Reg No.</span>
                  <span className="font-semibold text-navy-900 font-mono">{selectedSupplier.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Mining Lease / License</span>
                  <span className="font-semibold text-navy-900 font-mono">{selectedSupplier.miningLicenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Tax PIN (TPIN)</span>
                  <span className="font-semibold text-navy-900 font-mono">{selectedSupplier.taxIdentificationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Location</span>
                  <span className="font-semibold text-navy-900">{selectedSupplier.address}, {selectedSupplier.city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Primary Minerals</span>
                  <span className="font-semibold text-navy-900">{selectedSupplier.mineralsSupplied.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Compliance Documents</span>
                  <span className="font-semibold text-navy-900">{selectedSupplier.documentsSubmittedCount} Submitted</span>
                </div>
              </div>

              {/* Primary Contact Rep */}
              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <span className="font-semibold text-navy-900 block text-xs">Authorized Commercial Representative</span>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 text-[11px]">
                  <span><strong>{selectedSupplier.primaryContact.name}</strong> ({selectedSupplier.primaryContact.title})</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {selectedSupplier.primaryContact.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {selectedSupplier.primaryContact.phone}</span>
                </div>
              </div>

              {/* Available Supply Description */}
              <div className="space-y-1">
                <span className="font-semibold text-navy-900 block text-xs">Production & Supply Availability</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  {selectedSupplier.availableSupplyDescription}
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Registered: {formatDate(selectedSupplier.createdAt)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigate(`/trade-opportunities?search=${encodeURIComponent(selectedSupplier.name)}`);
                    setSelectedSupplier(null);
                  }}
                  className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold"
                >
                  View Active Listings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
