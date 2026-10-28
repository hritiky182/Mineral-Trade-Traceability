import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentOpportunity, ProjectStage } from '../../types';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  FileText,
  ShieldCheck,
  AlertTriangle,
  X,
  PlusCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  const { store, submitExpressionOfInterest, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<InvestmentOpportunity | null>(null);
  const [eoiProject, setEoiProject] = useState<InvestmentOpportunity | null>(null);

  // EOI Form State
  const [ticketSize, setTicketSize] = useState<number>(5000000);
  const [investmentHorizon, setInvestmentHorizon] = useState('5-7 Years');
  const [eoiMessage, setEoiMessage] = useState('We are seeking strategic offtake-linked equity participation.');
  const [eoiSuccessFeedback, setEoiSuccessFeedback] = useState<string | null>(null);

  const stages: Array<ProjectStage | 'All'> = ['All', 'Early Exploration', 'Advanced Exploration', 'Development', 'Production'];

  const filteredProjects = store.investments.filter((p) => {
    if (stageFilter !== 'All' && p.stage !== stageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.projectName.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.projectOwner.toLowerCase().includes(q) ||
        p.mineralFocus.some(m => m.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleEoiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eoiProject) return;

    submitExpressionOfInterest(eoiProject.id, {
      investorId: currentUser.id || 'INV-01',
      investorName: currentUser.name || 'Strategic Investor',
      investorOrganization: currentUser.organizationName || 'Global Critical Minerals Fund',
      proposedTicketSize: Number(ticketSize),
      currency: 'USD',
      investmentHorizon,
      investorMessage: eoiMessage,
      status: 'Submitted'
    });

    setEoiSuccessFeedback(`Expression of Interest ($${(ticketSize / 1000000).toFixed(1)}M USD) submitted successfully for ${eoiProject.projectName}!`);
    setTimeout(() => {
      setEoiProject(null);
      setEoiSuccessFeedback(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            Mining Project Opportunities & Capital Syndication
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional exploration and production assets seeking international joint-venture and offtake-linked capital.
          </p>
        </div>
      </div>

      {/* Regulatory Disclosure Banner */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Institutional Disclosure:</strong> Mining project information and non-binding Expressions of Interest (EOI) presented herein are structured for institutional strategic evaluation under non-disclosure protocols. They do not constitute a public securities offering, retail solicitation, or guaranteed financial returns.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, mineral focus, region, or owner..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-navy-900 placeholder:text-slate-400 form-input-focus"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                stageFilter === st
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const badge = getStatusBadgeClass(project.stage);
          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-teal-500/60 shadow-subtle hover:shadow-card transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-teal-700 font-bold block">
                      {project.id} • {project.region}, {project.country}
                    </span>
                    <h3 className="font-bold text-sm text-navy-900 group-hover:text-teal-800 transition-colors line-clamp-1">
                      {project.projectName}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${badge.bg} ${badge.text}`}>
                    {project.stage}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.mineralFocus.map(m => (
                    <span key={m} className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {m}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {project.dueDiligenceStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {project.overview}
                </p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Funding Target</span>
                    <span className="font-bold text-navy-900 text-sm">
                      ${(project.estimatedFundingRequirement / 1000000).toFixed(1)}M {project.fundingCurrency}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Concession Size</span>
                    <span className="font-semibold text-navy-900 text-sm">
                      {project.concessionSizeKm2} km²
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-slate-600 hover:text-navy-900 font-semibold text-xs"
                >
                  Due Diligence Info
                </button>

                <button
                  onClick={() => setEoiProject(project)}
                  className="px-3.5 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors"
                >
                  Express Interest (EOI)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Due Diligence Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-teal-300 font-bold">
                  Institutional Project Dossier • {selectedProject.id}
                </span>
                <h3 className="font-bold text-base text-white">{selectedProject.projectName}</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Project Stage</span>
                  <span className="font-semibold text-navy-900 text-xs">{selectedProject.stage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Funding Target</span>
                  <span className="font-bold text-teal-700 text-xs">${(selectedProject.estimatedFundingRequirement / 1000000).toFixed(1)}M USD</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Concession Tenure</span>
                  <span className="font-mono font-semibold text-navy-900 text-xs">{selectedProject.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Audited Status</span>
                  <span className="font-semibold text-navy-900 text-xs">{selectedProject.dueDiligenceStatus}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-navy-900 block text-xs">Technical Project Overview & JORC Resource</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {selectedProject.overview}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-navy-900 block text-xs">Intended Capital Deployment & Infrastructure</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                  {selectedProject.intendedUseOfFunds}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1 text-amber-900">
                <span className="font-bold block text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Key Geological & Operational Risk Disclosures:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {selectedProject.riskDisclosures}
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {selectedProject.expressionsOfInterestCount} Expressions of Interest received
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-1.5 border border-slate-200 rounded text-slate-600 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const p = selectedProject;
                    setSelectedProject(null);
                    setEoiProject(p);
                  }}
                  className="px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded font-semibold"
                >
                  Express Interest (EOI)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expression of Interest Modal */}
      {eoiProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Submit Strategic Expression of Interest (EOI)</h3>
                <p className="text-xs text-slate-300">{eoiProject.projectName}</p>
              </div>
              <button onClick={() => setEoiProject(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {eoiSuccessFeedback ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-navy-900 text-base">EOI Recorded</h4>
                <p className="text-xs text-slate-600">{eoiSuccessFeedback}</p>
              </div>
            ) : (
              <form onSubmit={handleEoiSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Proposed Ticket Size (USD) *</label>
                    <input
                      type="number"
                      required
                      min={100000}
                      value={ticketSize}
                      onChange={(e) => setTicketSize(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Investment Horizon *</label>
                    <select
                      value={investmentHorizon}
                      onChange={(e) => setInvestmentHorizon(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                    >
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-7 Years">5-7 Years</option>
                      <option value="7-10 Years">7-10 Years (Long Term Offtake)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Syndication Message & Offtake Conditions *</label>
                  <textarea
                    rows={3}
                    required
                    value={eoiMessage}
                    onChange={(e) => setEoiMessage(e.target.value)}
                    placeholder="Specify structure: mezzanine debt, equity participation, or offtake pre-financing..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEoiProject(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold shadow-sm"
                  >
                    Transmit Institutional EOI
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
