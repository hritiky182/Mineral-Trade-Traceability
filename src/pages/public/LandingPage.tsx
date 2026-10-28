import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  ShieldCheck,
  Cpu,
  Coins,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe2,
  FileCheck2,
  Building2,
  Layers,
  Award,
  ChevronRight,
  BarChart3,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { store, isAuthenticated, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const featuredListings = store.listings.filter(l => l.status === 'Published').slice(0, 6);

  const marketBenchmarks = [
    { mineral: 'Copper Cathodes (Grade A 99.9935%)', price: 9485, unit: 'MT', change: '+1.4%', positive: true, benchmark: 'LME Cash Official' },
    { mineral: 'Cobalt Hydroxide (28.5% Co)', price: 28500, unit: 'MT', change: '+0.8%', positive: true, benchmark: 'Fastmarkets In-Warehouse' },
    { mineral: 'Spodumene Lithium (SC 6.0%)', price: 1150, unit: 'MT', change: '+2.1%', positive: true, benchmark: 'Asian Metal Index' },
    { mineral: 'High-Grade Manganese (48% Mn)', price: 4.65, unit: 'dmtu', change: '+0.5%', positive: true, benchmark: 'Platts CIF Tianjin' },
    { mineral: 'Flake Graphite (-195 Mesh 94% C)', price: 680, unit: 'MT', change: '-0.3%', positive: false, benchmark: 'Benchmark Minerals' },
    { mineral: 'Nickel Briquettes (99.8% Ni)', price: 16850, unit: 'MT', change: '+0.4%', positive: true, benchmark: 'LME Settlement' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B3A] font-sans flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* 1. TOP ANNOUNCEMENT & INSTITUTIONAL HEADER */}
      <div className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200 whitespace-nowrap shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
              Institutional Mainnet
            </span>
            <span className="text-slate-600 truncate hidden md:inline font-medium">
              International Mineral Trade & Responsible Extraction Standards Aligned
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-teal-700" /> 256-Bit TLS 1.3
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline">OECD Due Diligence Standard</span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline">ESG Compliant</span>
          </div>
        </div>
      </div>

      {/* 2. PUBLIC NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center text-teal-400 shadow-md border border-navy-700/50 group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-6 h-6 fill-current text-teal-400" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-navy-900 font-heading whitespace-nowrap">MINERALINK</span>
                {/* <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-navy-100 text-navy-800 border border-navy-200 whitespace-nowrap">
                  Global
                </span> */}
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-tight whitespace-nowrap">Mineral Trade & Traceability Platform</p>
            </div>
          </Link>

          {/* Navigation Links - Single line guaranteed */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 2xl:gap-8 text-[13px] xl:text-sm font-semibold text-slate-600 shrink-0">
            <a href="#marketplace" className="hover:text-teal-700 transition-colors whitespace-nowrap">Verified Minerals</a>
            <a href="#traceability" className="hover:text-teal-700 transition-colors whitespace-nowrap">Traceability Engine</a>
            <a href="#escrow" className="hover:text-teal-700 transition-colors whitespace-nowrap">Trade Escrow</a>
            <a href="#corridors" className="hover:text-teal-700 transition-colors whitespace-nowrap">Logistics Corridors</a>
            <a href="#compliance" className="hover:text-teal-700 transition-colors whitespace-nowrap">Compliance & Standards</a>
          </nav>

          {/* Action CTAs - Single line guaranteed */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block text-right shrink-0">
                  <div className="text-xs font-semibold text-navy-900 whitespace-nowrap">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium truncate max-w-[150px] whitespace-nowrap">{currentUser.organizationName}</div>
                </div>
                <button
                  onClick={() => navigate('/workspace')}
                  className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 group whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Operations Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  to="/request-access"
                  className="hidden sm:inline-flex px-4 py-2.5 rounded-lg text-slate-700 hover:text-navy-900 hover:bg-slate-100 font-semibold text-sm transition-colors border border-slate-200 whitespace-nowrap shrink-0"
                >
                  Request Access
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 group border border-navy-700 whitespace-nowrap shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="whitespace-nowrap">Portal Sign In</span>
                  <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in fade-in">
            <a href="#marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700">Verified Minerals</a>
            <a href="#traceability" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700">Traceability Engine</a>
            <a href="#escrow" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700">Trade Escrow</a>
            <a href="#corridors" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700">Logistics Corridors</a>
            <a href="#compliance" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700">Compliance & Standards</a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/workspace'); }}
                    className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-semibold text-sm text-center"
                  >
                    Operations Workspace →
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/request-access"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm"
                  >
                    Request Access
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-navy-900 text-white font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-teal-400" />
                    <span>Portal Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-20 pb-24 border-b border-slate-200">
        {/* Subtle geometric pattern background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Verified Minerals • Transparent Trade • Global Opportunities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.15] mb-6 font-heading max-w-4xl mx-auto">
            The Institutional Gateway for Global Mineral Trade &amp; Cryptographic Traceability
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-3xl mx-auto">
            Connecting vetted mineral extraction enterprises with sovereign and industrial buyers worldwide. Verified mining licenses, ISO/IEC 17025 laboratory assays, SHA-256 tamper-evident provenance, and milestone-locked trade finance escrow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto">
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 group"
            >
              <span>Launch Institutional Portal</span>
              <ArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#marketplace"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 hover:text-navy-900 font-semibold text-base border border-slate-300 shadow-2xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Verified Supply</span>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </a>
          </div>

          {/* Key Trust Stats Bar */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-navy-900 font-mono">$48.6M+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Verified Inquiries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-teal-700 font-mono">16 Vetted</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Mining Enterprises</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-navy-900 font-mono">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">ISO 17025 Assayed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-teal-700 font-mono">0 Breaches</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">SHA-256 Provenance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE COMMODITY MARKET TICKER */}
      <section className="bg-slate-100/90 border-b border-slate-200 py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-8 min-w-max text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-teal-800 border-r border-slate-300 pr-4">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
            Market Indicatives
          </div>
          {marketBenchmarks.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">{item.mineral}:</span>
              <span className="font-mono font-bold text-navy-900">${formatNumber(item.price)} / {item.unit}</span>
              <span className={`font-mono font-semibold ${item.positive ? 'text-emerald-700' : 'text-rose-700'}`}>
                {item.change}
              </span>
              <span className="text-[10px] text-slate-500">({item.benchmark})</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THE FOUR PILLARS OF INSTITUTIONAL TRUST */}
      <section id="trust-pillars" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-200">
              Supply Chain Rigor
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-heading">
              Four Pillars of Institutional Integrity
            </h2>
            <p className="text-slate-600 mt-4 text-base">
              Eliminating cross-border trade friction, fraud, and uncertified minerals with a verified digital architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">1. Vetted Mining Licences</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Systematic audit of statutory mining licences, corporate incorporation records, and environmental compliance permits before admission.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-teal-700 gap-1">
                <span>Statutory Compliance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">2. ISO 17025 Assays</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tethered laboratory assay reports from Alfred H Knight, SGS, and Alex Stewart International with full elemental spectroscopy and penalty analysis.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-teal-700 gap-1">
                <span>Accredited Assays</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">3. SHA-256 Provenance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Client-side Web Crypto API SHA-256 mathematical hash chaining for tamper-evident chain of custody from extraction pit to ocean dispatch.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-teal-700 gap-1">
                <span>Zero Gas Fee Hashing</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">4. Conditioned Escrow</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Milestone-locked commercial settlement simulation where funds release requires verified bills of lading, customs clearance, and destination arrival.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-teal-700 gap-1">
                <span>Risk-Mitigated Trade</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED MINERAL SUPPLY CATALOG PREVIEW */}
      <section id="marketplace" className="py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-bold uppercase tracking-wider mb-3">
                Live Inventory
              </div>
              <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
                Verified Mineral Supply Availability
              </h2>
              <p className="text-slate-600 mt-2 text-sm max-w-xl">
                Ready for commercial quotation and international contract allocation. Authenticated with statutory export quotas.
              </p>
            </div>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>View Full Trading Desk ({store.listings.length} Lots)</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200 uppercase">
                      {listing.mineral}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-medium">{listing.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 line-clamp-1 mb-1">
                    {listing.gradePurity}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{listing.supplierName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Available Tonnage</span>
                      <span className="font-bold text-navy-900 font-mono text-sm">{formatNumber(listing.availableQuantity)} {listing.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Indicative Term</span>
                      <span className="font-bold text-teal-700 font-mono text-sm">${formatNumber(listing.indicativePrice)} / {listing.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Incoterm</span>
                      <span className="font-semibold text-slate-700">{listing.incoterm || 'FOB'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Delivery Node</span>
                      <span className="font-semibold text-slate-700 truncate block">{listing.deliveryPortOrLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lab Assay Linked</span>
                  </div>
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-lg bg-navy-50 hover:bg-teal-50 hover:text-teal-800 text-navy-900 font-semibold text-xs transition-colors border border-slate-200 flex items-center gap-1"
                  >
                    <span>Request RFQ</span>
                    <ArrowRight className="w-3 h-3 text-teal-600" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CRYPTOGRAPHIC TRACEABILITY SHOWCASE */}
      <section id="traceability" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-200">
                <Cpu className="w-4 h-4 text-teal-600" />
                Cryptographic Audit Ledger
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-heading mb-6">
                Chain of Custody Mathematically Secured from Pit Face to Ocean Port
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Every batch registered on MINERALINK is protected by client-side SHA-256 cryptographic hash chaining. When physical possession changes, a canonical payload binds the custodian, location, assay certificate, and preceding event hash.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">Deterministic Web Crypto Verification</h4>
                    <p className="text-xs text-slate-500">Calculated directly in the browser using the W3C Web Cryptography API with zero reliance on paid blockchain nodes or volatile crypto tokens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">OECD Due Diligence Annex II Auditability</h4>
                    <p className="text-xs text-slate-500">Provides international customs and smelters with verifiable conflict-free proof of origin and legal extraction titles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">Instant Tamper Detection</h4>
                    <p className="text-xs text-slate-500">Any unauthorized modification of quantity, grade, or actor breaks the downstream hash chain and triggers automated platform quarantine.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-all"
              >
                <span>Audit Batch Traceability</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </Link>
            </div>

            {/* Visual Cryptographic Hash Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-800 shadow-card font-mono text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="flex items-center gap-2 text-teal-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  BATCH-GL-2026-CU01
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold font-sans">
                  SHA-256 CHAIN VALID
                </span>
              </div>

              <div className="space-y-3.5 my-6">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-sans font-semibold text-navy-900">Event 1: Extraction & Batch Genesis</span>
                    <span>Primary Extraction Site</span>
                  </div>
                  <div className="text-[10px] text-slate-600 truncate font-mono">Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-sans font-semibold text-navy-900">Event 2: Lab Assay Spectrometry Attached</span>
                    <span>Alfred H Knight Laboratory</span>
                  </div>
                  <div className="text-[10px] text-slate-600 truncate font-mono">Prev: e3b0c442... | Hash: 8f4e2b17a9c3d5e681b0a234f9e17c093a4b7d...</div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                  <div className="flex justify-between text-[11px] text-teal-900 mb-1">
                    <span className="font-sans font-semibold text-teal-950">Event 3: Inland Corridor Dispatch</span>
                    <span className="text-teal-700">TAZARA Logistics Terminal</span>
                  </div>
                  <div className="text-[10px] text-teal-800 truncate font-mono">Prev: 8f4e2b17... | Hash: 4a9d7f12e8b0c3a561d2f789e0b14c562a3f8e...</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Algorithm: SHA-256 (Web Crypto)</span>
                <span className="text-teal-700 font-sans font-semibold">100% Cryptographic Continuity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MULTIMODAL LOGISTICS CORRIDORS */}
      <section id="corridors" className="py-24 bg-[#F5F7FA] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-bold uppercase tracking-wider mb-3">
              Export Corridors
            </div>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
              Strategic African Transit Corridors to Global Sea Lanes
            </h2>
            <p className="text-slate-600 mt-4 text-base">
              Tracking bulk containerized mineral freight across established rail and bonded road transport networks with automated milestone updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded">Primary Rail Corridor</span>
                <span className="text-xs font-semibold text-emerald-600">Active / Low Risk</span>
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Dar es Salaam Corridor</h3>
              <p className="text-sm text-slate-600 mb-4">
                TAZARA rail freight connecting Ndola & Kapiri Mposhi directly to the Port of Dar es Salaam, Tanzania for Indian Ocean container shipping to Busan, South Korea.
              </p>
              <div className="text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                Avg Transit: 12-16 Days • Bonded Road & Rail
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded">Atlantic Fast-Track</span>
                <span className="text-xs font-semibold text-emerald-600">Active / Low Congestion</span>
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Walvis Bay Corridor</h3>
              <p className="text-sm text-slate-600 mb-4">
                Trans-Caprivi highway corridor linking Livingstone through Namibia to the deep-water Port of Walvis Bay, providing rapid access to European Atlantic ports.
              </p>
              <div className="text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                Avg Transit: 8-11 Days • Dedicated Mineral Terminal
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded">Southeast Gateway</span>
                <span className="text-xs font-semibold text-amber-600">Seasonal Monitoring</span>
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Beira Corridor</h3>
              <p className="text-sm text-slate-600 mb-4">
                Connecting inland mineral extraction basins through multi-corridor transit to the Port of Beira in Mozambique for short-sea feeder routes and East African transshipment hubs.
              </p>
              <div className="text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                Avg Transit: 10-14 Days • Multimodal Road & Rail
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="bg-gradient-to-b from-slate-50 to-white text-slate-900 py-20 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            Institutional Clearance
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-heading mb-4">
            Begin Verified Institutional Trading Operations
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto mb-8">
            Access the live marketplace desk, audit lab documentation, issue commercial RFQs, or onboard an authorized mineral production organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In to Institutional Portal</span>
              <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/request-access"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-2xs transition-all"
            >
              Request Enterprise Access
            </Link>
          </div>
        </div>
      </section>

      {/* 10. ENTERPRISE FOOTER */}
      <footer className="bg-white text-slate-600 text-xs py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 text-navy-900 font-bold text-lg mb-3">
                <div className="w-7 h-7 rounded-lg bg-navy-900 flex items-center justify-center text-teal-400">
                  <svg className="w-4 h-4 fill-current text-teal-400" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span>MINERALINK</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-xs">
                Verified Minerals. Transparent Trade. Global Opportunities. An enterprise commodity ecosystem bridging African mineral production with international demand.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 uppercase tracking-wider text-[11px] mb-3">Institutional Desks</h4>
              <ul className="space-y-2 text-slate-600">
                <li><span className="text-navy-900 font-medium">Operations Desk</span>: Extraction Oversight &amp; Trade Facilitation</li>
                <li><span className="text-navy-900 font-medium">Seoul</span>: Asia-Pacific Buyer Desk (Gangnam)</li>
                <li><span className="text-navy-900 font-medium">Geneva</span>: Trade Finance &amp; Logistics Desk</li>
                <li><span className="text-navy-900 font-medium">London</span>: LME Liaison &amp; Market Intelligence</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 uppercase tracking-wider text-[11px] mb-3">Compliance Standards</h4>
              <ul className="space-y-2 text-slate-600">
                <li>International Mining Standards &amp; Best Practice</li>
                <li>ISO 14001 Environmental Management Standards</li>
                <li>Responsible Minerals Initiative (RMI)</li>
                <li>OECD Due Diligence Guidance (Annex II)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 uppercase tracking-wider text-[11px] mb-3">Security &amp; Compliance</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
                Restricted to authorized commercial entities. All transactions and cryptographic chain-of-custody hashes are recorded on an immutable operational audit log.
              </p>
              <div className="text-[11px] text-teal-700 font-mono font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                System Status: Operational • All Nodes Nominal
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
            <div>© 2026 MINERALINK International Ltd. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-800 cursor-pointer">Terms of Trade</span>
              <span className="hover:text-slate-800 cursor-pointer">Statutory Compliance Notice</span>
              <span className="hover:text-slate-800 cursor-pointer">Cryptographic Audit Spec</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
