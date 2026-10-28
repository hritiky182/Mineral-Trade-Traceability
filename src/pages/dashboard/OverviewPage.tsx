import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatQuantity, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Building2,
  Package,
  FileText,
  FileCheck2,
  Truck,
  ShieldCheck,
  Coins,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Activity
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
  CartesianGrid
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { store, activeRole, currentUser } = useApp();
  const navigate = useNavigate();

  // 1. Calculate live KPI metrics
  const verifiedSuppliersCount = store.suppliers.filter(s => s.verificationStatus === 'Verified').length;
  const activeListingsCount = store.listings.filter(l => l.status === 'Published').length;
  const openRfqsCount = store.rfqs.filter(r => r.status === 'Submitted' || r.status === 'Offer Received' || r.status === 'Negotiation').length;
  const activePosCount = store.purchaseOrders.filter(p => p.status === 'Confirmed' || p.status === 'Fulfillment in Progress').length;
  const inTransitShipmentsCount = store.shipments.filter(s => s.status === 'In Transit' || s.status === 'Customs Processing').length;
  const pendingComplianceCount = store.suppliers.filter(s => s.verificationStatus === 'Submitted' || s.verificationStatus === 'Under Review').length +
    store.documents.filter(d => d.reviewStatus === 'Under Review').length;
  const activeEscrowValue = store.escrows
    .filter(e => e.status === 'Funded in Simulation' || e.status === 'Awaiting Release Conditions' || e.status === 'Release Eligible in Simulation')
    .reduce((sum, e) => sum + e.principalAmount, 0);
  const openInvestmentsCount = store.investments.length;

  // 2. Trade Pipeline Funnel calculation
  const pipelineData = [
    {
      stage: 'Discovery & Listings',
      count: store.listings.length,
      estimatedValue: store.listings.reduce((sum, l) => sum + (l.availableQuantity * l.indicativePrice), 0),
      color: '#183750'
    },
    {
      stage: 'RFQs & Negotiations',
      count: store.rfqs.length,
      estimatedValue: store.rfqs.reduce((sum, r) => sum + (r.requiredQuantity * (r.targetUnitPrice || 8000)), 0),
      color: '#0F9D92'
    },
    {
      stage: 'Confirmed POs',
      count: store.purchaseOrders.filter(p => p.status === 'Confirmed' || p.status === 'Fulfillment in Progress').length,
      estimatedValue: store.purchaseOrders
        .filter(p => p.status === 'Confirmed' || p.status === 'Fulfillment in Progress')
        .reduce((sum, p) => sum + p.totalIndicativeValue, 0),
      color: '#10243A'
    },
    {
      stage: 'Fulfillment & Logistics',
      count: store.shipments.length,
      estimatedValue: store.shipments.reduce((sum, s) => sum + (s.shippedQuantity * 9150), 0),
      color: '#B7791F'
    },
    {
      stage: 'Settled & Completed',
      count: store.purchaseOrders.filter(p => p.status === 'Fulfilled').length,
      estimatedValue: store.purchaseOrders
        .filter(p => p.status === 'Fulfilled')
        .reduce((sum, p) => sum + p.totalIndicativeValue, 0),
      color: '#18845B'
    }
  ];

  // 3. Mineral Supply distribution
  const mineralBreakdown = ['Copper', 'Cobalt', 'Lithium', 'Manganese', 'Graphite', 'Nickel', 'Tin'].map((mineral) => {
    const totalQty = store.listings
      .filter(l => l.mineral === mineral)
      .reduce((sum, l) => sum + l.availableQuantity, 0);
    return { name: mineral, quantity: totalQty };
  });

  const COLORS = ['#0F9D92', '#183750', '#2563EB', '#D97706', '#059669', '#7C3AED', '#DC2626'];

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 rounded-xl text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium border border-teal-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Cross-Border Mineral Corridor • Commercial Origin to Global Markets
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            MINERALINK Enterprise Operations Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Welcome, <span className="text-white font-semibold">{currentUser.name}</span> ({currentUser.organizationName}).
            All workflows reflect real-time local storage state with verifiable chain-of-custody and trade-finance simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/workspace/trade-opportunities')}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            Explore Marketplace
          </button>
          <button
            onClick={() => navigate('/workspace/rfqs')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            Create RFQ
          </button>
        </div>
      </div>

      {/* 8 Live Calculated KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => navigate('/workspace/suppliers')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verified Suppliers</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-2">{verifiedSuppliersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">+{store.suppliers.length - verifiedSuppliersCount} pending</span>
            <span>in registry</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/workspace/trade-opportunities')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Listings</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-2">{activeListingsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Copper, Cobalt, Li, Mn, Gr</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/workspace/rfqs')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Open RFQs</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-2">{openRfqsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-blue-600 font-medium">South Korea & EU</span>
            <span>inquiries</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/workspace/purchase-orders')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Purchase Orders</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-2">{activePosCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Confirmed & in fulfillment</div>
        </div>

        <div
          onClick={() => navigate('/workspace/shipments')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Shipments In Transit</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-2">{inTransitShipmentsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Dar es Salaam / Durban sea lanes</div>
        </div>

        <div
          onClick={() => navigate('/workspace/compliance')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Compliance</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-2">{pendingComplianceCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Reviews & expiring permits</div>
        </div>

        <div
          onClick={() => navigate('/workspace/escrow')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Escrow Value</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-navy-900 mt-2">
            ${(activeEscrowValue / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Locked in simulated escrow</div>
        </div>

        <div
          onClick={() => navigate('/workspace/investments')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500/50 shadow-subtle hover:shadow-card cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Mining Opportunities</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-2">{openInvestmentsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Due diligence ready projects</div>
        </div>
      </div>

      {/* Row 2: Trade Pipeline Stage Funnel & Supply Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Pipeline Funnel (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-navy-900">Commercial Trade Lifecycle Pipeline</h3>
              <p className="text-xs text-slate-500">Live transaction volume and indicative stage values</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 font-mono text-slate-600">
              Total Pipeline: ${(pipelineData.reduce((s, p) => s + p.estimatedValue, 0) / 1000000).toFixed(1)}M USD
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {pipelineData.map((stage) => {
              const maxVal = Math.max(...pipelineData.map(p => p.estimatedValue), 1);
              const percentage = Math.min(100, Math.round((stage.estimatedValue / maxVal) * 100));
              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-navy-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                      {stage.stage}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{stage.count} records</span>
                      <span className="font-semibold text-navy-900">${(stage.estimatedValue / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: stage.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex items-center justify-between">
            <span>Pipeline value represents illustrative commercial volume across all negotiation and order stages.</span>
            <NavLink to="/workspace/analytics" className="text-teal-700 hover:underline font-semibold flex items-center gap-1">
              Detailed BI <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>

        {/* Mineral Supply Breakdown (1 Col) */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-sm text-navy-900">Available Supply by Commodity</h3>
                <p className="text-xs text-slate-500">Metric Tons in published inventory</p>
              </div>
            </div>

            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mineralBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="quantity"
                  >
                    {mineralBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()} MT`, 'Available']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {mineralBreakdown.slice(0, 6).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  {item.name}
                </span>
                <span className="font-semibold text-navy-900">{item.quantity.toLocaleString()} MT</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Strategic Trade Corridors & Recent Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Corridor Routing (1 Col) */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-navy-900">Strategic Trade Corridors</h3>
              <p className="text-xs text-slate-500">Multimodal transit routes & export corridors</p>
            </div>
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-navy-900">
                <span>TAZARA / Dar es Salaam Corridor</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">High Volume</span>
              </div>
              <p className="text-[11px] text-slate-500">Kitwe / Ndola → Nakonde Border → Port of Dar es Salaam → Busan / Incheon</p>
              <div className="text-[10px] text-teal-700 font-medium pt-1">Active transit: Copper Cathodes (PO-2026-001)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-navy-900">
                <span>Walvis Bay Corridor (Trans-Kalahari)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800">Fast Atlantic</span>
              </div>
              <p className="text-[11px] text-slate-500">Munali / Solwezi → Katima Mulilo → Port of Walvis Bay → Rotterdam / Hamburg</p>
              <div className="text-[10px] text-teal-700 font-medium pt-1">Active transit: Nickel Sulphide (EuroMetals)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-navy-900">
                <span>Beira Corridor (Mozambique)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">Bulk Minerals</span>
              </div>
              <p className="text-[11px] text-slate-500">Luapula / Mansa → Machipanda Border → Port of Beira → Mumbai</p>
              <div className="text-[10px] text-amber-700 font-medium pt-1">Active transit: Manganese Lump (Delayed weather)</div>
            </div>
          </div>
        </div>

        {/* Live Append-Only Activity Log (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-navy-900">Live Platform Activity Feed</h3>
              <p className="text-xs text-slate-500">Immutable chronological audit trail from user actions</p>
            </div>
            <NavLink to="/workspace/audit-trail" className="text-xs text-teal-700 hover:underline font-semibold flex items-center gap-1">
              Full Audit Trail <ChevronRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {store.activities.slice(0, 6).map((act) => (
              <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    {act.actor.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-700 font-medium leading-snug">
                      <span className="font-semibold text-navy-900">{act.actor}</span> ({act.role}): {act.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">{act.entityReference}</span>
                      <span>•</span>
                      <span>{formatDate(act.timestamp, 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 shrink-0">
                  {act.entityType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
