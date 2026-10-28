import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MineralType, Supplier } from '../../types';
import {
  Building2,
  FileText,
  UserCheck,
  Package,
  FolderArchive,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const SupplierOnboardingPage: React.FC = () => {
  const { createSupplier } = useApp();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionComplete, setSubmissionComplete] = useState<Supplier | null>(null);

  // Form State
  const [orgName, setOrgName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<Supplier['businessCategory']>('Medium Commercial');
  const [country, setCountry] = useState('South Africa');
  const [city, setCity] = useState('Johannesburg');
  const [address, setAddress] = useState('');
  const [yearEstablished, setYearEstablished] = useState<number>(2020);

  // Step 2: Registration
  const [regNumber, setRegNumber] = useState('');
  const [tpin, setTpin] = useState('');
  const [miningLicense, setMiningLicense] = useState('');

  // Step 3: Representative
  const [repName, setRepName] = useState('');
  const [repTitle, setRepTitle] = useState('Commercial Director');
  const [repEmail, setRepEmail] = useState('');
  const [repPhone, setRepPhone] = useState('+27 11');

  // Step 4: Minerals
  const [selectedMinerals, setSelectedMinerals] = useState<MineralType[]>(['Copper']);
  const [supplyDescription, setSupplyDescription] = useState('');

  // Step 5: Documents uploaded simulation
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    incorporationDoc: true,
    miningLicense: true,
    tpin: true,
    eia: false
  });

  const allMinerals: MineralType[] = ['Copper', 'Cobalt', 'Lithium', 'Manganese', 'Graphite', 'Nickel', 'Tin'];

  const toggleMineral = (m: MineralType) => {
    if (selectedMinerals.includes(m)) {
      if (selectedMinerals.length > 1) {
        setSelectedMinerals(selectedMinerals.filter(x => x !== m));
      }
    } else {
      setSelectedMinerals([...selectedMinerals, m]);
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!orgName.trim() || !address.trim() || !city.trim()) {
        setErrorMessage('Please fill in all organization details, including registered legal name and physical address.');
        return false;
      }
    } else if (step === 2) {
      if (!regNumber.trim() || !tpin.trim() || !miningLicense.trim()) {
        setErrorMessage('All statutory registration identifiers (Corporate Registration, Tax ID, and Mining License) are required.');
        return false;
      }
    } else if (step === 3) {
      if (!repName.trim() || !repEmail.trim() || !repPhone.trim()) {
        setErrorMessage('Authorized representative contact details are mandatory for official trade communications.');
        return false;
      }
    } else if (step === 4) {
      if (selectedMinerals.length === 0 || !supplyDescription.trim()) {
        setErrorMessage('Please select at least one mineral produced and provide a brief supply description.');
        return false;
      }
    } else if (step === 5) {
      if (!uploadedDocs.incorporationDoc || !uploadedDocs.miningLicense || !uploadedDocs.tpin) {
        setErrorMessage('Statutory documents (Certificate of Incorporation, Mining License, and Tax Clearance) must be attached.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(6, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createSupplier({
        name: orgName,
        registrationNumber: regNumber,
        country,
        city,
        address,
        primaryContact: {
          name: repName,
          email: repEmail,
          phone: repPhone,
          title: repTitle
        },
        businessCategory,
        mineralsSupplied: selectedMinerals,
        verificationStatus: 'Submitted',
        documentsSubmittedCount: Object.values(uploadedDocs).filter(Boolean).length,
        availableSupplyDescription: supplyDescription,
        miningLicenseNumber: miningLicense,
        taxIdentificationNumber: tpin,
        yearEstablished: Number(yearEstablished),
        hasAssayReports: false
      });

      setIsSubmitting(false);
      setSubmissionComplete(created);
    }, 600);
  };

  const steps = [
    { num: 1, label: 'Organization' },
    { num: 2, label: 'Licences' },
    { num: 3, label: 'Contact Rep' },
    { num: 4, label: 'Mineral Profile' },
    { num: 5, label: 'Documents' },
    { num: 6, label: 'Review & Submit' }
  ];

  if (submissionComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">
            Supplier Registration Successfully Transmitted!
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your onboarding dossier for <strong className="text-navy-900">{submissionComplete.name}</strong> (Assigned ID:{' '}
            <span className="font-mono text-teal-700 font-bold">{submissionComplete.id}</span>) has been placed in the
            Compliance Officer queue with status <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Submitted</span>.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Mining Licence:</span>
              <span className="font-mono font-semibold text-navy-900">{submissionComplete.miningLicenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Representative:</span>
              <span className="font-semibold text-navy-900">{submissionComplete.primaryContact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Attached Documents:</span>
              <span className="font-semibold text-navy-900">{submissionComplete.documentsSubmittedCount} Files</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/workspace/suppliers')}
              className="px-5 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Open Supplier Directory
            </button>
            <button
              onClick={() => navigate('/workspace/supplier-verification')}
              className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              View Verification Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Supplier Onboarding & Due-Diligence Registration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the 6-step registration process to establish verified supplier status on the MINERALINK international trading platform.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {steps.map((st, idx) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <React.Fragment key={st.num}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${isCurrent ? 'text-navy-900' : 'text-slate-400'}`}>
                    {st.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > st.num ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 space-y-5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Organization Details */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Step 1: Legal Entity & Organization Details
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Registered Corporate Name *</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Copper Ridge Mining Ltd"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Category *</label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                >
                  <option value="Large Enterprise Mining">Large Enterprise Mining</option>
                  <option value="Medium Commercial">Medium Commercial</option>
                  <option value="Trading Aggregator">Trading Aggregator</option>
                  <option value="Artisanal & Small Scale">Artisanal & Small Scale Cooperative</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Year Established</label>
                <input
                  type="number"
                  value={yearEstablished}
                  onChange={(e) => setYearEstablished(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">City / Mining Hub *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kitwe, Ndola, Solwezi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Physical Corporate & Mine Address *</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot number, industrial area, road..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
              />
            </div>
          </div>
        )}

        {/* Step 2: Statutory Registration */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Step 2: Statutory Registration & Mining Tenure
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Corporate Registration / Incorporation Number *</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. REG-18920-4491"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono form-input-focus"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tax Identification Number (TPIN) *</label>
              <input
                type="text"
                value={tpin}
                onChange={(e) => setTpin(e.target.value)}
                placeholder="e.g. TPIN-1004928172"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono form-input-focus"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mining Cadastre Licence / Lease Number *</label>
              <input
                type="text"
                value={miningLicense}
                onChange={(e) => setMiningLicense(e.target.value)}
                placeholder="e.g. LML-2021-00812-HQ or SML-2023-00411-MR"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono form-input-focus"
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact Rep */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Step 3: Authorized Commercial Representative
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Representative Full Name *</label>
                <input
                  type="text"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder="e.g. Dr. Mwamba Chileshe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designation / Title *</label>
                <input
                  type="text"
                  value={repTitle}
                  onChange={(e) => setRepTitle(e.target.value)}
                  placeholder="e.g. Commercial Director"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Direct Business Email *</label>
                <input
                  type="email"
                  value={repEmail}
                  onChange={(e) => setRepEmail(e.target.value)}
                  placeholder="rep@yourcompany.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  value={repPhone}
                  onChange={(e) => setRepPhone(e.target.value)}
                  placeholder="+1 555 XXX XXXX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Mineral Profile */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Step 4: Minerals Supplied & Capacity Profile
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-2">Select Primary Commodity Categories *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allMinerals.map((mineral) => {
                  const isChecked = selectedMinerals.includes(mineral);
                  return (
                    <button
                      type="button"
                      key={mineral}
                      onClick={() => toggleMineral(mineral)}
                      className={`p-2.5 rounded-lg border text-left font-semibold transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'bg-teal-50 border-teal-500 text-teal-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{mineral}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Production & Export Supply Description *</label>
              <textarea
                rows={3}
                value={supplyDescription}
                onChange={(e) => setSupplyDescription(e.target.value)}
                placeholder="Specify grades, monthly processing volume, bagging method, and primary export route (e.g., Dar es Salaam or Walvis Bay)..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
              />
            </div>
          </div>
        )}

        {/* Step 5: Document Uploads */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Step 5: Mandatory Document Upload Verification
            </h3>

            <div className="space-y-2">
              {[
                { key: 'incorporationDoc', title: 'Certificate of Corporate Incorporation', required: true },
                { key: 'miningLicense', title: 'Official Mining Cadastre Licence', required: true },
                { key: 'tpin', title: 'National Tax Clearance Certificate', required: true },
                { key: 'eia', title: 'Environmental Impact Assessment Approval (EIA)', required: false }
              ].map((doc) => (
                <div key={doc.key} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    <div>
                      <span className="font-semibold text-navy-900">{doc.title}</span>
                      {doc.required && <span className="text-rose-600 ml-1 font-bold">*</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadedDocs(prev => ({ ...prev, [doc.key]: !prev[doc.key] }))}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                      uploadedDocs[doc.key]
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {uploadedDocs[doc.key] ? 'Attached ✓' : '+ Upload File'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Review & Final Submission */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Step 6: Review Application Dossier
            </h3>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Organization</span>
                <span className="font-bold text-navy-900 text-sm">{orgName}</span>
                <span className="text-slate-500 block">{city}, {country}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Mining Lease</span>
                <span className="font-mono font-semibold text-navy-900">{miningLicense}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Authorized Contact</span>
                <span className="font-semibold text-navy-900">{repName} ({repTitle})</span>
                <span className="text-slate-500 block">{repEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Commodities</span>
                <span className="font-semibold text-navy-900">{selectedMinerals.join(', ')}</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 space-y-1">
              <span className="font-semibold block">Declaration of Authenticity:</span>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                By submitting this application, you declare that all mineral origin records, tenure boundaries, and environmental clearances conform to responsible mining statutory regulations and the ICGLR Regional Certification Mechanism.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              {isSubmitting ? 'Transmitting...' : 'Transmit Application to Verification Queue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
