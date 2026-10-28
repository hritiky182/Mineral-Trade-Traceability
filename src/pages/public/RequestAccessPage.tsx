import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MineralType } from '../../types';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Lock,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export const RequestAccessPage: React.FC = () => {
  const { createSupplier } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    country: 'South Africa',
    city: 'Johannesburg',
    address: '',
    contactName: '',
    contactTitle: 'Managing Director',
    contactEmail: '',
    contactPhone: '',
    businessCategory: 'Medium Commercial' as const,
    miningLicenseNumber: '',
    monthlyVolume: '500 - 1,500 MT',
    notes: ''
  });

  const [selectedMinerals, setSelectedMinerals] = useState<MineralType[]>(['Copper', 'Cobalt']);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const availableMinerals: MineralType[] = [
    'Copper', 'Cobalt', 'Lithium', 'Manganese', 'Graphite', 'Nickel', 'Tin'
  ];

  const handleMineralToggle = (mineral: MineralType) => {
    if (selectedMinerals.includes(mineral)) {
      if (selectedMinerals.length > 1) {
        setSelectedMinerals(selectedMinerals.filter(m => m !== mineral));
      }
    } else {
      setSelectedMinerals([...selectedMinerals, mineral]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSupplier = createSupplier({
      name: formData.organizationName,
      registrationNumber: formData.registrationNumber || `REG-${Math.floor(10000 + Math.random() * 90000)}`,
      country: formData.country,
      city: formData.city,
      address: formData.address || 'Plot 104, Industrial Area',
      primaryContact: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone || '+260 212 000 000',
        title: formData.contactTitle
      },
      businessCategory: formData.businessCategory as any,
      mineralsSupplied: selectedMinerals,
      verificationStatus: 'Submitted',
      documentsSubmittedCount: 3,
      availableSupplyDescription: `Estimated capacity ${formData.monthlyVolume}. Specializing in certified high-purity extraction.`,
      miningLicenseNumber: formData.miningLicenseNumber || `LML-${Math.floor(1000 + Math.random() * 9000)}/2026`,
      taxIdentificationNumber: `TPIN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      yearEstablished: 2021,
      hasAssayReports: true
    });

    setSubmittedId(newSupplier.id);
  };

  if (submittedId) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-navy-900 text-lg">
            <span className="w-8 h-8 rounded-lg bg-navy-900 text-teal-400 flex items-center justify-center font-bold">M</span>
            <span>MINERALINK</span>
          </Link>
          <Link to="/login" className="text-xs font-semibold text-teal-700 hover:underline">
            Go to Portal Sign In
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-navy-900 mb-2">Application Submitted</h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Your institutional onboarding application has been forwarded to the MINERALINK Compliance & Licensing Review Committee.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left mb-6 font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Application ID:</span>
                <span className="font-bold text-navy-900">{submittedId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Organization:</span>
                <span className="font-bold text-navy-900 truncate max-w-[180px]">{formData.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Initial Status:</span>
                <span className="text-amber-700 font-bold">Submitted / Under Compliance Review</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Portal Login</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </Link>
              <Link
                to="/"
                className="block text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
              >
                Return to Public Website
              </Link>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-200 bg-white">
          © 2026 MINERALINK International Ltd. Statutory Mining Framework Aligned.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-teal-400 shadow-xs shrink-0">
            <svg className="w-5 h-5 fill-current text-teal-400" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="shrink-0">
            <span className="text-xl font-bold tracking-tight text-navy-900 whitespace-nowrap">MINERALINK</span>
            <span className="text-[11px] text-slate-500 font-medium ml-2 whitespace-nowrap">Institutional Onboarding</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
          <Link to="/" className="hover:text-navy-900 transition-colors whitespace-nowrap">Public Website</Link>
          <span className="text-slate-300">•</span>
          <Link to="/login" className="text-teal-700 hover:text-teal-800 font-bold whitespace-nowrap">
            Portal Sign In
          </Link>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
            Request Institutional Access
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Apply for trading, supply allocation, or sovereign procurement authorization on MINERALINK.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Section 1: Corporate Details */}
          <div>
            <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>1. Corporate & Statutory Entity Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Legal Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="e.g. Copper Ridge Resources Ltd"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Registration Number (National Registry / Corporate ID) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="e.g. 120240098231"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Country of Incorporation *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm bg-white"
                >
                  <option value="South Africa">South Africa</option>
                  <option value="Democratic Republic of Congo">Democratic Republic of Congo</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Namibia">Namibia</option>
                  <option value="South Korea">South Korea</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Japan">Japan</option>
                  <option value="Singapore">Singapore</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mining License / Statutory Permit No. (if producer)
                </label>
                <input
                  type="text"
                  value={formData.miningLicenseNumber}
                  onChange={(e) => setFormData({ ...formData, miningLicenseNumber: e.target.value })}
                  placeholder="e.g. LML-20412/2026"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Representative */}
          <div>
            <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>2. Authorized Corporate Officer</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Chanda Mumba"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Executive Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactTitle}
                  onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                  placeholder="e.g. Chief Operating Officer"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="name@organization.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Direct Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+260 977 123 456"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Minerals & Volume */}
          <div>
            <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-200 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>3. Minerals of Core Commercial Focus</span>
            </h2>
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Relevant Commodities:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableMinerals.map(mineral => {
                  const isSelected = selectedMinerals.includes(mineral);
                  return (
                    <button
                      type="button"
                      key={mineral}
                      onClick={() => handleMineralToggle(mineral)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mineral} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Compliance Checkbox */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <input type="checkbox" required id="oecd-compliance" className="mt-0.5 rounded border-slate-300 text-teal-600" />
              <label htmlFor="oecd-compliance" className="cursor-pointer">
                I certify that our organization adheres to the <span className="font-semibold text-navy-900">OECD Due Diligence Guidance for Responsible Supply Chains</span> and statutory mining regulations of the host nation.
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>Submit Institutional Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-200 bg-white">
        © 2026 MINERALINK International Ltd. All applications are subject to compliance verification.
      </footer>
    </div>
  );
};
