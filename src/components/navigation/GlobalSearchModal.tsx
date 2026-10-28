import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Building2,
  Package,
  FileText,
  FileCheck2,
  Truck,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { store } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: Array<{
      category: 'Suppliers' | 'Listings' | 'RFQs' | 'Purchase Orders' | 'Shipments' | 'Traceability' | 'Documents' | 'Investments';
      id: string;
      title: string;
      subtitle: string;
      badge?: string;
      path: string;
      icon: any;
    }> = [];

    // 1. Suppliers
    if (selectedCategory === 'all' || selectedCategory === 'suppliers') {
      store.suppliers.forEach((s) => {
        if (
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.mineralsSupplied.some((m) => m.toLowerCase().includes(q)) ||
          s.miningLicenseNumber.toLowerCase().includes(q)
        ) {
          results.push({
            category: 'Suppliers',
            id: s.id,
            title: s.name,
            subtitle: `${s.country} • ${s.mineralsSupplied.join(', ')} • ${s.businessCategory}`,
            badge: s.verificationStatus,
            path: `/workspace/suppliers?search=${encodeURIComponent(s.name)}`,
            icon: Building2
          });
        }
      });
    }

    // 2. Listings
    if (selectedCategory === 'all' || selectedCategory === 'listings') {
      store.listings.forEach((l) => {
        if (
          l.id.toLowerCase().includes(q) ||
          l.mineral.toLowerCase().includes(q) ||
          l.gradePurity.toLowerCase().includes(q) ||
          l.supplierName.toLowerCase().includes(q)
        ) {
          results.push({
            category: 'Listings',
            id: l.id,
            title: `${l.gradePurity} (${l.availableQuantity} ${l.unit})`,
            subtitle: `${l.supplierName} • $${l.indicativePrice}/${l.unit} • ${l.incoterm} ${l.deliveryPortOrLocation}`,
            badge: l.status,
            path: `/workspace/trade-opportunities?search=${encodeURIComponent(l.mineral)}`,
            icon: Package
          });
        }
      });
    }

    // 3. Purchase Orders
    if (selectedCategory === 'all' || selectedCategory === 'orders') {
      store.purchaseOrders.forEach((po) => {
        if (
          po.poNumber.toLowerCase().includes(q) ||
          po.buyerName.toLowerCase().includes(q) ||
          po.supplierName.toLowerCase().includes(q) ||
          po.mineral.toLowerCase().includes(q)
        ) {
          results.push({
            category: 'Purchase Orders',
            id: po.id,
            title: `${po.poNumber} — ${po.mineral} (${po.quantity} ${po.unit})`,
            subtitle: `Buyer: ${po.buyerName} → Supplier: ${po.supplierName} • $${po.totalIndicativeValue.toLocaleString()}`,
            badge: po.status,
            path: `/workspace/purchase-orders?search=${encodeURIComponent(po.poNumber)}`,
            icon: FileCheck2
          });
        }
      });
    }

    // 4. Shipments
    if (selectedCategory === 'all' || selectedCategory === 'shipments') {
      store.shipments.forEach((shp) => {
        if (
          shp.trackingNumber.toLowerCase().includes(q) ||
          shp.logisticsProvider.toLowerCase().includes(q) ||
          shp.vesselOrConsignmentNumber.toLowerCase().includes(q) ||
          shp.destinationPort.toLowerCase().includes(q)
        ) {
          results.push({
            category: 'Shipments',
            id: shp.id,
            title: `${shp.trackingNumber} — ${shp.shippedQuantity} ${shp.unit} ${shp.mineral}`,
            subtitle: `${shp.logisticsProvider} • ${shp.originPort} → ${shp.destinationPort}`,
            badge: shp.status,
            path: `/workspace/shipments?search=${encodeURIComponent(shp.trackingNumber)}`,
            icon: Truck
          });
        }
      });
    }

    // 5. Traceability Batches
    if (selectedCategory === 'all' || selectedCategory === 'traceability') {
      store.batches.forEach((b) => {
        if (
          b.id.toLowerCase().includes(q) ||
          b.mineSiteName.toLowerCase().includes(q) ||
          b.supplierName.toLowerCase().includes(q) ||
          b.mineral.toLowerCase().includes(q)
        ) {
          results.push({
            category: 'Traceability',
            id: b.id,
            title: `${b.id} — ${b.mineral} (${b.quantity} ${b.unit})`,
            subtitle: `Origin: ${b.mineSiteName} • Custody: ${b.currentCustodyHolder}`,
            badge: b.status,
            path: `/workspace/traceability?batch=${b.id}`,
            icon: Cpu
          });
        }
      });
    }

    // 6. Investments
    if (selectedCategory === 'all' || selectedCategory === 'investments') {
      store.investments.forEach((inv) => {
        if (
          inv.projectName.toLowerCase().includes(q) ||
          inv.region.toLowerCase().includes(q) ||
          inv.mineralFocus.some((m) => m.toLowerCase().includes(q))
        ) {
          results.push({
            category: 'Investments',
            id: inv.id,
            title: inv.projectName,
            subtitle: `${inv.region}, ${inv.country} • Target: $${(inv.estimatedFundingRequirement / 1000000).toFixed(1)}M • ${inv.stage}`,
            badge: inv.dueDiligenceStatus,
            path: `/workspace/investments?project=${inv.id}`,
            icon: TrendingUp
          });
        }
      });
    }

    return results;
  }, [query, selectedCategory, store]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suppliers, minerals, RFQs, purchase orders, shipments, batches..."
            className="w-full bg-transparent text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs text-slate-400 border border-slate-200 bg-white px-2 py-0.5 rounded shadow-sm">
            ESC
          </span>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs bg-white">
          <span className="text-slate-400 mr-1 font-medium">Filter:</span>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'suppliers', label: 'Suppliers' },
            { id: 'listings', label: 'Listings' },
            { id: 'orders', label: 'Purchase Orders' },
            { id: 'shipments', label: 'Shipments' },
            { id: 'traceability', label: 'Traceability' },
            { id: 'investments', label: 'Investments' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-navy-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="font-medium text-slate-600">Start typing to search the MINERALINK platform...</p>
              <p className="text-slate-400">Try searching for "Copper", "Kitwe", "PO-CCM", "MSC LILIAN", or "Lithium"</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p className="font-medium text-slate-600">No matching records found for "{query}"</p>
              <p className="text-slate-400 mt-1">Try broadening your search term or selecting 'All Records'.</p>
            </div>
          ) : (
            searchResults.map((res) => {
              const IconComponent = res.icon;
              return (
                <button
                  key={`${res.category}-${res.id}`}
                  onClick={() => handleSelect(res.path)}
                  className="w-full text-left p-3 hover:bg-teal-50/50 rounded-lg flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-700 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-navy-900 group-hover:text-teal-800 truncate">
                          {res.title}
                        </span>
                        {res.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {res.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{res.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-teal-600 shrink-0 text-xs">
                    <span className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Open
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>{searchResults.length} live records matched</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
