import React, { useState } from 'react';
import { useApp } from './context';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { InvoicesView } from './components/InvoicesView';
import { EvidenceLedgerView } from './components/EvidenceLedgerView';
import { IssueResolutionView } from './components/IssueResolutionView';
import { SupplierFollowUpsView } from './components/SupplierFollowUpsView';
import { AccountantWorkspaceView } from './components/AccountantWorkspaceView';
import { EvidencePackView } from './components/EvidencePackView';
import { AuditHistoryView } from './components/AuditHistoryView';
import { SettingsView } from './components/SettingsView';
import { DemoGuideModal } from './components/DemoGuideModal';
import { 
  X, CheckCircle, AlertCircle, Info, AlertTriangle, Compass 
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeTab, toasts, dismissToast } = useApp();
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);

  // Render active view based on ActiveTab
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'invoices':
        return <InvoicesView />;
      case 'upload':
        return <UploadView />;
      case 'ledger':
        return <EvidenceLedgerView />;
      case 'resolution':
        return <IssueResolutionView />;
      case 'followups':
        return <SupplierFollowUpsView />;
      case 'accountant':
        return <AccountantWorkspaceView />;
      case 'evidence_packs':
        return <EvidencePackView />;
      case 'audit_history':
        return <AuditHistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-800 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar onOpenDemoGuide={() => setIsDemoGuideOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
          {renderView()}
        </main>
      </div>

      {/* Floating Demo Tour Trigger Pill */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsDemoGuideOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 hover:scale-105 transition-all text-xs font-bold group"
        >
          <Compass className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
          <span>Judge Walkthrough Tour</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
            6 STEPS
          </span>
        </button>
      </div>

      {/* Judge Walkthrough Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
              toast.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' :
              toast.type === 'warning' ? 'bg-amber-50 text-amber-900 border-amber-200' :
              'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 hover:opacity-75 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
