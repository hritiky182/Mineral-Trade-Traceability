import React from 'react';
import {
  TrendingUp,
  LineChart,
  ShieldAlert,
  Globe2,
  Anchor,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const MarketIntelligencePage: React.FC = () => {
  const benchmarkPrices = [
    {
      mineral: 'Copper Cathodes (Grade A 99.99%)',
      unit: 'MT',
      indicativePrice: 9150,
      changePercent: '+1.8%',
      trend: 'up',
      physicalPremium: '+$140 / MT CIF Asia',
      primaryCorridor: 'TAZARA / Dar es Salaam',
      keyFactor: 'Asian battery foil production demand surge.'
    },
    {
      mineral: 'Cobalt Hydroxide (30% Co content)',
      unit: 'MT',
      indicativePrice: 32500,
      changePercent: '+0.5%',
      trend: 'up',
      physicalPremium: 'Flat',
      primaryCorridor: 'TAZARA / Dar es Salaam',
      keyFactor: 'EV cathode chemical manufacturing stabilizing.'
    },
    {
      mineral: 'Lithium Spodumene (SC-6 6% Li2O)',
      unit: 'MT',
      indicativePrice: 1120,
      changePercent: '-1.2%',
      trend: 'down',
      physicalPremium: '-$30 / MT FOB Walvis',
      primaryCorridor: 'Trans-Kalahari / Walvis Bay',
      keyFactor: 'Refiner raw spodumene inventory destocking.'
    },
    {
      mineral: 'Metallurgical Manganese (48-50% Mn)',
      unit: 'MT',
      indicativePrice: 245,
      changePercent: '+2.4%',
      trend: 'up',
      physicalPremium: '+$12 / MT FOB Beira',
      primaryCorridor: 'TAZARA & Beira Corridor',
      keyFactor: 'High-purity sulphate (HPMSM) capacity expansions.'
    },
    {
      mineral: 'Jumbo Natural Flake Graphite (+50 mesh 95% C)',
      unit: 'MT',
      indicativePrice: 1420,
      changePercent: '+3.1%',
      trend: 'up',
      physicalPremium: '+$85 / MT CIF Gwangyang',
      primaryCorridor: 'TAZARA / Dar es Salaam',
      keyFactor: 'Ex-China anode supply chain diversification.'
    },
    {
      mineral: 'Nickel Sulphide Concentrate (13.8% Ni)',
      unit: 'MT',
      indicativePrice: 16800,
      changePercent: '+0.2%',
      trend: 'up',
      physicalPremium: '+$110 / MT CIF Rotterdam',
      primaryCorridor: 'Trans-Kalahari / Walvis Bay',
      keyFactor: 'Class-1 metal conversion premiums robust.'
    }
  ];

  const historicalCopperTrend = [
    { month: 'Oct 2025', price: 8450 },
    { month: 'Nov 2025', price: 8620 },
    { month: 'Dec 2025', price: 8580 },
    { month: 'Jan 2026', price: 8810 },
    { month: 'Feb 2026', price: 8990 },
    { month: 'Mar 2026', price: 9150 }
  ];

  const corridorComparison = [
    {
      corridor: 'Dar es Salaam Corridor (TAZARA Rail & Road)',
      leadTimeDays: '18-24 Days',
      capacityRating: 'High Volume (Primary Inland Route)',
      borderDwell: '2.5 Days (Nakonde/Tunduma)',
      securityRating: 'High (Dedicated Bonded Escort)',
      primaryDestination: 'East Asia (Busan, Shanghai, Yokohama)'
    },
    {
      corridor: 'Walvis Bay Corridor (Trans-Kalahari Road)',
      leadTimeDays: '14-18 Days',
      capacityRating: 'Fast Atlantic Transit',
      borderDwell: '1.2 Days (Katima Mulilo)',
      securityRating: 'Very High (Automated Single Window)',
      primaryDestination: 'Europe & Americas (Rotterdam, Hamburg, Baltimore)'
    },
    {
      corridor: 'Beira Corridor (Road to Mozambique)',
      leadTimeDays: '16-22 Days',
      capacityRating: 'Bulk Cargo & Manganese Priority',
      borderDwell: '3.0 Days (Machipanda)',
      securityRating: 'Moderate (Subject to Coastal Weather)',
      primaryDestination: 'India & Middle East (Mumbai, Mundra, Jebel Ali)'
    },
    {
      corridor: 'Lobito Atlantic Railway Corridor (Under Modernization)',
      leadTimeDays: '10-14 Days (Projected)',
      capacityRating: 'Future Priority Strategic Route',
      borderDwell: 'Pending Railway Commissioning',
      securityRating: 'High (Direct Rail Access)',
      primaryDestination: 'US & Western European Battery Corridors'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Mineral Market Intelligence & Trade Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Indicative commercial reference benchmarks, African export corridor efficiency metrics, and ESG compliance readiness.
        </p>
      </div>

      {/* Analytical Benchmark Notice */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong>Illustrative Intelligence Disclaimer:</strong> The commodity valuations and corridor figures below represent indicative operational estimates compiled for demonstration purposes. They reflect commercial physical premiums over base metal benchmark reference points rather than real-time exchange tickers.
        </div>
      </div>

      {/* Commodity Reference Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {benchmarkPrices.map((item) => (
          <div key={item.mineral} className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-xs text-navy-900 leading-tight">{item.mineral}</span>
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  item.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.changePercent}
              </span>
            </div>

            <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-2xl font-bold text-navy-900">${item.indicativePrice.toLocaleString()}</span>
                <span className="text-xs text-slate-400 ml-1">USD / {item.unit}</span>
              </div>
              <span className="text-[11px] text-teal-700 font-medium">{item.physicalPremium}</span>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div><strong className="text-slate-600">Primary Logistics Route:</strong> {item.primaryCorridor}</div>
              <div><strong className="text-slate-600">Market Note:</strong> {item.keyFactor}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart: Historical Benchmark Trend (Copper 6-Month) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-semibold text-sm text-navy-900">Indicative Copper Cathode Reference Trend (USD / MT)</h3>
            <p className="text-xs text-slate-500">6-Month monthly physical settlement indicator (Grade A 99.99%)</p>
          </div>
          <span className="text-[11px] px-2 py-1 rounded bg-teal-50 text-teal-800 font-mono font-medium">
            Recent Average: $8,766 / MT
          </span>
        </div>

        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLine data={historicalCopperTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis domain={[8200, 9400]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Benchmark Price']} />
              <Line type="monotone" dataKey="price" stroke="#0F9D92" strokeWidth={3} dot={{ r: 4, fill: '#0F9D92' }} />
            </RechartsLine>
          </ResponsiveContainer>
        </div>
      </div>

      {/* African Mineral Transport Corridor Benchmarking Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-semibold text-sm text-navy-900">Export Corridor Operational Efficiency Comparison</h3>
            <p className="text-xs text-slate-500">Multimodal logistics metrics connecting inland mining hubs with international seaports</p>
          </div>
          <Anchor className="w-4 h-4 text-teal-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Corridor Route</th>
                <th className="py-2.5 px-3 font-semibold">Average Lead Time</th>
                <th className="py-2.5 px-3 font-semibold">Border Dwell Time</th>
                <th className="py-2.5 px-3 font-semibold">Security / Escort Level</th>
                <th className="py-2.5 px-3 font-semibold">Primary Destination Market</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {corridorComparison.map((corridor) => (
                <tr key={corridor.corridor} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-navy-900">{corridor.corridor}</td>
                  <td className="py-3 px-3">{corridor.leadTimeDays}</td>
                  <td className="py-3 px-3">{corridor.borderDwell}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {corridor.securityRating}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{corridor.primaryDestination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
