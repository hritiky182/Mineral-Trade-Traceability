import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatQuantity } from '../../utils/formatters';
import {
  BarChart3,
  Download,
  Filter,
  Layers,
  TrendingUp,
  PieChart as PieIcon,
  Globe2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { store } = useApp();

  const [selectedMineral, setSelectedMineral] = useState('All');

  // Filter listings by mineral if selected
  const filteredListings = selectedMineral === 'All'
    ? store.listings
    : store.listings.filter(l => l.mineral === selectedMineral);

  // 1. Pipeline Data
  const pipelineData = [
    { name: 'Listings', value: store.listings.reduce((sum, l) => sum + (l.availableQuantity * l.indicativePrice), 0) / 1000000 },
    { name: 'RFQs', value: store.rfqs.reduce((sum, r) => sum + (r.requiredQuantity * (r.targetUnitPrice || 8000)), 0) / 1000000 },
    { name: 'Confirmed POs', value: store.purchaseOrders.filter(p => p.status === 'Confirmed' || p.status === 'Fulfillment in Progress').reduce((sum, p) => sum + p.totalIndicativeValue, 0) / 1000000 },
    { name: 'Fulfilled', value: store.purchaseOrders.filter(p => p.status === 'Fulfilled').reduce((sum, p) => sum + p.totalIndicativeValue, 0) / 1000000 }
  ];

  // 2. Supplier Verification Status
  const verificationCounts = [
    { name: 'Verified', count: store.suppliers.filter(s => s.verificationStatus === 'Verified').length, color: '#18845B' },
    { name: 'Under Review', count: store.suppliers.filter(s => s.verificationStatus === 'Under Review').length, color: '#0F9D92' },
    { name: 'Submitted', count: store.suppliers.filter(s => s.verificationStatus === 'Submitted').length, color: '#2563EB' },
    { name: 'Action Required', count: store.suppliers.filter(s => s.verificationStatus === 'Additional Information Required').length, color: '#B7791F' },
    { name: 'Suspended / Rejected', count: store.suppliers.filter(s => s.verificationStatus === 'Suspended' || s.verificationStatus === 'Rejected').length, color: '#C64747' }
  ];

  // 3. Shipment Status Distribution
  const shipmentStatuses = [
    { name: 'In Transit', count: store.shipments.filter(s => s.status === 'In Transit').length },
    { name: 'Preparation', count: store.shipments.filter(s => s.status === 'Preparation').length },
    { name: 'Ready Dispatch', count: store.shipments.filter(s => s.status === 'Ready for Dispatch').length },
    { name: 'Customs', count: store.shipments.filter(s => s.status === 'Customs Processing').length },
    { name: 'Delivered', count: store.shipments.filter(s => s.status === 'Delivered').length },
    { name: 'Delayed', count: store.shipments.filter(s => s.status === 'Delayed').length }
  ];

  // 4. Commodity Volumes
  const commodityVolumes = ['Copper', 'Cobalt', 'Lithium', 'Manganese', 'Graphite', 'Nickel', 'Tin'].map(m => {
    const total = store.listings.filter(l => l.mineral === m).reduce((sum, l) => sum + l.availableQuantity, 0);
    return { mineral: m, quantity: total };
  });

  const handleExportCsv = () => {
    const headers = ['Listing ID', 'Mineral', 'Supplier', 'Quantity (MT)', 'Price (USD)', 'Status'];
    const rows = filteredListings.map(l => [
      l.id,
      l.mineral,
      `"${l.supplierName}"`,
      l.availableQuantity,
      l.indicativePrice,
      l.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MINERALINK_Trade_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Operational Business Intelligence & Trade Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated analytical metrics computed directly from active platform transactions, inventories, and shipments.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Report (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Analysis by Commodity:</span>
          <select
            value={selectedMineral}
            onChange={(e) => setSelectedMineral(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-navy-900 form-input-focus"
          >
            <option value="All">All Commodities</option>
            <option value="Copper">Copper</option>
            <option value="Cobalt">Cobalt</option>
            <option value="Lithium">Lithium</option>
            <option value="Manganese">Manganese</option>
            <option value="Graphite">Graphite</option>
            <option value="Nickel">Nickel</option>
            <option value="Tin">Tin</option>
          </select>
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Sample Data Size: {store.listings.length} Listings • {store.purchaseOrders.length} POs • {store.shipments.length} Shipments
        </span>
      </div>

      {/* Row 1: Pipeline Valuation & Commodity Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-navy-900">Commercial Pipeline Stage Value ($M USD)</h3>
              <p className="text-xs text-slate-500">Total indicative capital at each trade phase</p>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}M USD`, 'Stage Value']} />
                <Bar dataKey="value" fill="#0F9D92" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity Volume Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-navy-900">Available Supply by Mineral (Metric Tons)</h3>
              <p className="text-xs text-slate-500">Live inventory across registered origin producers</p>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commodityVolumes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" />
                <XAxis dataKey="mineral" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()} MT`, 'Total Available']} />
                <Bar dataKey="quantity" fill="#183750" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Verification Pie Chart & Shipment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Pie */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-navy-900">Supplier Verification Registry Status</h3>
              <p className="text-xs text-slate-500">Breakdown of supplier due diligence cases</p>
            </div>
          </div>

          <div className="h-64 pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {verificationCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} Organizations`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shipment Statuses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-navy-900">Logistics Consignment Statuses</h3>
              <p className="text-xs text-slate-500">Active multimodal consignments along export corridors</p>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shipmentStatuses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip formatter={(value: any) => [`${value} Shipments`, 'Consignments']} />
                <Bar dataKey="count" fill="#B7791F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
