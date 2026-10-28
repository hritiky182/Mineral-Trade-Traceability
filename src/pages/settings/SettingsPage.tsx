import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { store, activeRole, currentUser, updateSettings, resetEnvironment, exportDataJson, importDataJson } = useApp();

  const [preferredCurrency, setPreferredCurrency] = useState(store.settings.preferredCurrency || 'USD');
  const [notifyVerification, setNotifyVerification] = useState(store.settings.notifyOnVerification);
  const [notifyRfq, setNotifyRfq] = useState(store.settings.notifyOnNewRfq);
  const [notifyMilestone, setNotifyMilestone] = useState(store.settings.notifyOnShipmentMilestone);
  const [notifyEscrow, setNotifyEscrow] = useState(store.settings.notifyOnEscrowStatus);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      preferredCurrency,
      notifyOnVerification: notifyVerification,
      notifyOnNewRfq: notifyRfq,
      notifyOnShipmentMilestone: notifyMilestone,
      notifyOnEscrowStatus: notifyEscrow
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJson = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MINERALINK_Store_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setImportStatus('Data successfully imported and synchronized!');
      } else {
        setImportStatus('Import failed: Invalid MINERALINK store format.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleExecuteReset = () => {
    resetEnvironment();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600" />
          Platform Settings & Data Environment
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure operational preferences, organizational identity, and local storage state synchronization.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>User preferences successfully saved!</span>
        </div>
      )}

      {importStatus && (
        <div className="p-3 bg-navy-800 text-white rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
      )}

      {/* Active User & Organization Profile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <UserCheck className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-sm text-navy-900">Current Session Organizational Identity</h3>
            <p className="text-xs text-slate-500">Determined by the active demo role perspective</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active User</span>
            <div className="font-bold text-navy-900 text-sm">{currentUser.name}</div>
            <div className="text-slate-500">{currentUser.title}</div>
            <div className="text-[11px] font-mono text-slate-600">{currentUser.email}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Affiliated Organization</span>
            <div className="font-bold text-navy-900 text-sm">{currentUser.organizationName}</div>
            <div className="text-slate-500">Org ID: <span className="font-mono text-teal-700">{currentUser.organizationId}</span></div>
            <div className="text-[11px] text-slate-600 capitalize">Role Context: {activeRole}</div>
          </div>
        </div>
      </div>

      {/* Operational Preferences */}
      <form onSubmit={handleSavePreferences} className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-navy-900">Operational System Preferences</h3>
          <p className="text-xs text-slate-500">Currency display and automated event alert settings</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="max-w-xs">
            <label className="font-semibold text-slate-700 block mb-1">Preferred Currency Format</label>
            <select
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 form-input-focus"
            >
              <option value="USD">USD ($) — United States Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="KRW">KRW (₩) — South Korean Won</option>
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <span className="font-semibold text-slate-700 block">Notification Routing Preferences:</span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyVerification}
                  onChange={(e) => setNotifyVerification(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Alert on new supplier onboarding and compliance verification decisions</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyRfq}
                  onChange={(e) => setNotifyRfq(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Alert when new commercial RFQs or bilateral counter-offers are submitted</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyMilestone}
                  onChange={(e) => setNotifyMilestone(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Alert on shipment milestone transit checkpoints and delay notices</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEscrow}
                  onChange={(e) => setNotifyEscrow(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Alert when escrow release conditions are satisfied and funds become eligible</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* System Data & Storage Administration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-sm text-navy-900">System Data & Storage Administration</h3>
            <p className="text-xs text-slate-500">Backup, restore, or reset the local storage database state</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Export JSON */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-navy-900 block">Export Application State</span>
              <p className="text-slate-500 text-[11px] mt-1">
                Download all suppliers, listings, RFQs, purchase orders, shipments, and audit logs as a single JSON file.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="w-full mt-3 px-3 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON Backup
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-navy-900 block">Restore from Backup</span>
              <p className="text-slate-500 text-[11px] mt-1">
                Restore a previously exported MINERALINK JSON dataset into your local browser storage.
              </p>
            </div>
            <label className="w-full mt-3 px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON File</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          {/* Reset Environment */}
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-rose-900 block">Restore Factory State</span>
              <p className="text-rose-700/80 text-[11px] mt-1">
                Restore the default initial institutional dataset. Reverts all local modifications, RFQs, and orders.
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full mt-3 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore Clean State
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-elevation border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 text-sm">Confirm Restore Initial State</h4>
                <p className="text-slate-500 text-xs">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Resetting will clear all user-created listings, negotiation messages, purchase orders, and shipment updates in your local browser storage, and restore the initial coherent seed dataset.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm"
              >
                Yes, Restore Initial Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
