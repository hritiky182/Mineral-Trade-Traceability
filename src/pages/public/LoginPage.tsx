import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ChevronRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/workspace';

  const institutionalUsers: Array<{
    role: UserRole;
    name: string;
    org: string;
    title: string;
    email: string;
    badge: string;
    clearance: string;
    badgeColor: string;
    accentGlow: string;
  }> = [
      {
        role: 'buyer',
        name: 'Jin-Woo Park',
        org: 'Hanwha Global Resources (Seoul)',
        title: 'Head of Critical Metals Procurement',
        email: 'jinwoo.park@hanwha-materials.co.kr',
        badge: 'International Buyer',
        clearance: 'Commercial Trading Desk • Tier 1 Buyer',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
        accentGlow: 'hover:border-blue-400/80 hover:bg-blue-50/20'
      },
      {
        role: 'supplier',
        name: 'Mwamba Chilufya',
        org: 'Kafue Mineral Trading Ltd',
        title: 'Commercial Director',
        email: 'm.chilufya@kafueminerals.com',
        badge: 'Verified Mineral Supplier',
        clearance: 'Mining License #21904-HQ-LEL • Vetted Supplier',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/80',
        accentGlow: 'hover:border-teal-400/80 hover:bg-teal-50/20'
      },
      {
        role: 'admin',
        name: 'Mizinga Kaluba',
        org: 'MINERALINK Trade Authority',
        title: 'Principal Systems Administrator',
        email: 'm.kaluba@mineralink.org',
        badge: 'Platform Administrator',
        clearance: 'Full Mainnet Root Governance & Escrow Control',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
        accentGlow: 'hover:border-purple-400/80 hover:bg-purple-50/20'
      },
      {
        role: 'compliance',
        name: 'Bwalya Tembo',
        org: 'Global Extractive Compliance Unit',
        title: 'Senior Audit Inspector',
        email: 'b.tembo@compliance-authority.org',
        badge: 'Compliance Officer',
        clearance: 'Statutory Mining Assays & OECD Chain-of-Custody',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
        accentGlow: 'hover:border-amber-400/80 hover:bg-amber-50/20'
      },
      {
        role: 'investor',
        name: 'Seung-Min Lee',
        org: 'Korea Strategic Metals Fund',
        title: 'Senior Investment Director',
        email: 'sm.lee@k-metalsfund.co.kr',
        badge: 'Institutional Investor',
        clearance: 'Sovereign Mineral Supply Offtake & Finance',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        accentGlow: 'hover:border-emerald-400/80 hover:bg-emerald-50/20'
      }
    ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const matched = institutionalUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      const roleToAuth = matched ? matched.role : 'buyer';
      await login(roleToAuth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole, userEmail: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(role, userEmail);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError('Unable to authenticate with selected credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrefill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('••••••••••••');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col justify-between font-sans selection:bg-teal-100 selection:text-teal-900 relative overflow-x-hidden">
      {/* 1. TOP STATUTORY STATUS STRIP */}
      <div className="bg-slate-100 text-slate-700 border-b border-slate-200 px-4 sm:px-6 py-2 text-[11px]">
        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-900">Institutional Mainnet Node:</span>
            <span className="font-mono text-teal-700 font-semibold">GLOBAL-NODE-01 (Statutory Active)</span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline text-slate-600">Responsible Mineral Extraction Standards Aligned</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 whitespace-nowrap text-slate-600">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-teal-700" />
              <span>TLS 1.3 / FIPS-140-2</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>OECD Due Diligence</span>
            <span className="text-slate-300">•</span>
            <span>ESG Monitored</span>
          </div>
        </div>
      </div>

      {/* 2. TOP PORTAL HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center text-teal-400 shadow-sm border border-navy-700/50 group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-navy-900 font-heading whitespace-nowrap">MINERALINK</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 whitespace-nowrap">
                  Gateway
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-tight whitespace-nowrap">Institutional Mineral Trading & Traceability</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6 text-xs font-semibold whitespace-nowrap shrink-0">
            <Link to="/" className="text-slate-600 hover:text-navy-900 transition-colors whitespace-nowrap">
              Public Portal
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/request-access"
              className="text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1.5 font-bold whitespace-nowrap"
            >
              <span>Request Institutional Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. MAIN TERMINAL LOGIN INTERFACE */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Secure Terminal Authentication Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-9 shadow-card flex flex-col justify-between relative">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold text-xs border border-teal-200/80">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Secure Terminal Authentication</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-medium">PORTAL v3.4</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-1.5 font-heading tracking-tight">
                Sign In to Trading Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Access your organization's verified trading desk, digital assay archives, and smart escrow contracts.
              </p>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input with Icon */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Input with Icon and Show/Hide Toggle */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Security Password / Key
                    </label>
                    <span className="text-xs text-teal-700 hover:text-teal-800 hover:underline cursor-pointer font-medium">
                      Forgot credentials?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50/70 border border-slate-300 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Session Preferences & Encryption Pill */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500"
                    />
                    <span>Remember terminal session for 8 hours</span>
                  </label>
                  <span className="text-teal-700 font-mono text-[11px] flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    TLS 1.3 Active
                  </span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying Cryptographic Credentials...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Institutional Portal</span>
                      <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Single Sign-On Separator */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Enterprise Single Sign-On
                </span>
              </div>

              {/* SAML / Okta Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin('buyer', institutionalUsers[0].email)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-navy-900 font-semibold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs hover:border-slate-300"
              >
                <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                <span>Authenticate via Corporate SAML / Okta Identity</span>
              </button>
            </div>

            {/* Bottom Card Security Assurances */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>OECD Due Diligence Standard Aligned</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Logins Audited by SHA-256 Hash
              </span>
            </div>
          </div>

          {/* Right Column: Pre-Vetted Institutional Partner Accounts Directory */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-card flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Enterprise Accounts</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                  Instant Access
                </span>
              </div>

              <h2 className="text-xl font-bold text-navy-900 mb-1 font-heading">
                Direct Partner Access
              </h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Click any pre-vetted institutional persona to instantly launch the portal under their statutory clearance:
              </p>

              {/* Persona Cards List */}
              <div className="space-y-2.5">
                {institutionalUsers.map((user) => (
                  <div
                    key={user.role}
                    className={`p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 hover:border-teal-500/70 hover:shadow-subtle transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-2xs ${user.accentGlow}`}
                    onClick={() => handleQuickLogin(user.role, user.email)}
                  >
                    <div className="min-w-0 flex-1">
                      {/* Name without any leading icon, badge beside name */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-navy-900 group-hover:text-teal-700 transition-colors truncate">
                          {user.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${user.badgeColor} whitespace-nowrap`}>
                          {user.badge}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-700 font-semibold truncate">
                        {user.org}
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                        {user.email}
                      </div>

                      <div className="text-[10px] text-teal-700 font-medium mt-1 truncate">
                        {user.clearance}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 group-hover:bg-teal-600 group-hover:border-teal-600 flex items-center justify-center text-slate-500 group-hover:text-white transition-all shadow-2xs">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrefill(user.email);
                        }}
                        className="text-[10px] text-slate-500 hover:text-teal-700 transition-colors underline font-semibold"
                      >
                        Fill Form
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Registration CTA */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
              <span>New commercial entity?</span>
              <Link
                to="/request-access"
                className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 transition-colors group"
              >
                <span>Submit Institutional Application</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* 4. STATUTORY FOOTER */}
      <footer className="text-center text-[11px] text-slate-500 py-4 border-t border-slate-200 bg-white px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 MINERALINK International Ltd. Restricted to authorized commercial mining & trade entities.</span>
          <div className="flex items-center gap-3 text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Assay Protocol</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Statutory Mineral Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
