import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  UploadCloud,
  FileSpreadsheet,
  Cpu,
  MessageSquare,
  Briefcase,
  FileCheck2,
  History,
  Settings,
  BookOpen,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { ActiveTab } from '../types';

interface SidebarProps {
  onOpenDemoGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDemoGuide }) => {
  const { language, activeTab, setActiveTab, issues, invoices, queries, resetDemoData } = useApp();
  const strings = t[language];

  // Live badge counters
  const openIssuesCount = issues.filter(i => i.status !== 'RESOLVED').length;
  const pendingConfirmCount = invoices.filter(i => i.status === 'OWNER_CONFIRMATION_PENDING' || i.status === 'POSSIBLE_DUPLICATE_REVIEW').length;
  const pendingCaCount = queries.filter(q => q.status === 'OPEN').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: strings.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'invoices', label: strings.nav.invoices, icon: <Receipt className="w-4 h-4" />, badge: invoices.length },
    { id: 'upload', label: strings.nav.upload, icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'ledger', label: strings.nav.ledger, icon: <FileSpreadsheet className="w-4 h-4" />, isSpecial: true },
    { id: 'resolution', label: strings.nav.resolution, icon: <Cpu className="w-4 h-4" />, badge: openIssuesCount, badgeColor: 'bg-amber-500 text-white' },
    { id: 'followups', label: strings.nav.followups, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'accountant', label: strings.nav.accountant, icon: <Briefcase className="w-4 h-4" />, badge: pendingCaCount, badgeColor: 'bg-teal-600 text-white' },
    { id: 'evidence_packs', label: strings.nav.evidencePacks, icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'audit_history', label: strings.nav.auditHistory, icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: strings.nav.settings, icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#14263D] text-white flex flex-col justify-between border-r border-[#1C304A] flex-shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#1C304A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#247C78] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              BS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">{strings.app.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#247C78]/40 text-[#2EA09A] px-1.5 py-0.5 rounded border border-[#247C78]/60">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">Tech4Bharat 2026 · PS 3.1</p>
            </div>
          </div>
        </div>

        {/* Demo Guide Launcher Pill */}
        <div className="px-3 pt-3">
          <button
            onClick={onOpenDemoGuide}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-400/50 hover:border-amber-400 rounded-lg text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-all shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>{strings.app.openDemoGuide}</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#247C78] text-white shadow-sm font-semibold'
                    : item.isSpecial
                    ? 'text-teal-300 hover:bg-[#1C304A] hover:text-white font-semibold'
                    : 'text-gray-300 hover:bg-[#1C304A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : item.isSpecial ? 'text-teal-400' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Reset Demo */}
      <div className="p-3 border-t border-[#1C304A] space-y-2">
        <div className="bg-[#1C304A] p-2.5 rounded-lg border border-[#2D4A6A]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300 mb-1">
            <span>Murugan Stores</span>
            <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono">TN-33</span>
          </div>
          <p className="text-[10px] text-gray-400 truncate">33AABCM9876K1Z9 (Synthetic)</p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset application state back to the 5 initial demo invoices and August-October journey?')) {
              resetDemoData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-gray-800/80 hover:bg-gray-800 text-gray-400 hover:text-gray-200 rounded text-[11px] transition-colors"
          title="Restore sample invoices and cross-period audit history"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{strings.app.resetDemo}</span>
        </button>
      </div>
    </aside>
  );
};
