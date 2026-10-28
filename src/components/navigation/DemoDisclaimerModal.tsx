import React from 'react';
import { X, ShieldCheck, Database, Cpu, AlertCircle, ExternalLink } from 'lucide-react';

interface DemoDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoDisclaimerModal: React.FC<DemoDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-base tracking-tight text-white">MINERALINK Demo Environment Specification</h3>
              <p className="text-xs text-slate-300">Enterprise Product Demonstration & Prototype Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-600 leading-relaxed max-h-[75vh] overflow-y-auto">
          <div className="p-3.5 bg-teal-50 border border-teal-200/60 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-900">
              <span className="font-semibold">Enterprise Prototype Notice:</span> This application illustrates end-to-end commercial workflows, traceability chains, and trade finance logic for international mineral procurement. All organizations, shipments, and laboratory reports are simulated for product demonstration.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-navy-800 font-semibold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4 text-teal-600" />
                Data Persistence
              </div>
              <p className="text-xs text-slate-600">
                Application state is maintained locally in your browser’s <code className="bg-slate-200 px-1 py-0.5 rounded text-navy-900 font-mono">localStorage</code>. You can perform full workflows (onboarding, RFQs, escrow funding, milestone logging) and changes will persist across browser reloads.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-navy-800 font-semibold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-teal-600" />
                Simulated Ledger Evidence
              </div>
              <p className="text-xs text-slate-600">
                Event hashes are deterministically generated via the browser’s native <code className="bg-slate-200 px-1 py-0.5 rounded text-navy-900 font-mono">Web Crypto API (SHA-256)</code>, chaining chronological events. No public gas fees, external tokens, or real blockchain nodes are required.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-navy-800 text-sm">Key Workflow Rules</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Trade Settlements:</strong> Escrow deposits and releases demonstrate condition-locked logic without moving real fiat or digital currencies.</li>
              <li><strong>Physical Verification:</strong> Real-world production deployment interfaces with certified assayers (AHK, SGS, Alex Stewart) and port authorities (TAZARA, Port of Dar es Salaam).</li>
              <li><strong>Role-Based Views:</strong> Evaluators can switch freely between Administrator, Supplier, Buyer, Compliance Officer, and Investor roles using the top-right role selector.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>MINERALINK v1.0.0 Enterprise Build</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg font-medium transition-colors"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
