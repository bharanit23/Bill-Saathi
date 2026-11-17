import React from 'react';
import {
  Receipt,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Copy,
  Briefcase,
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { EvidenceStatus } from '../types';

export const DashboardView: React.FC = () => {
  const { language, invoices, issues, queries, activePeriod, setActiveTab } = useApp();
  const strings = t[language];

  // Dynamic calculations directly from prototype records
  const totalInvoices = invoices.length;
  const awaitingConfirmationCount = invoices.filter(
    (i) => i.status === 'OWNER_CONFIRMATION_PENDING' || i.status === 'EXTRACTION_UNCERTAIN'
  ).length;
  const unresolvedIssuesCount = issues.filter((i) => i.status !== 'RESOLVED').length;
  const duplicateAlertsCount = invoices.filter((i) => i.isDuplicateFlagged).length;
  const accountantPendingCount = invoices.filter((i) => i.status === 'ACCOUNTANT_REVIEW_PENDING').length;
  const resolvedCount = invoices.filter((i) => i.status === 'RESOLVED').length;

  // Active Cross-Period Cases: Original period earlier than current follow-up period
  const crossPeriodInvoices = invoices.filter((i) => i.originalPeriod !== i.currentFollowUpPeriod || i.id === 'INV-2026-0812');

  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">{strings.statuses.RESOLVED}</span>;
      case 'ACCOUNTANT_REVIEW_PENDING':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">{strings.statuses.ACCOUNTANT_REVIEW_PENDING}</span>;
      case 'EXTRACTION_UNCERTAIN':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">{strings.statuses.EXTRACTION_UNCERTAIN}</span>;
      case 'POSSIBLE_DUPLICATE_REVIEW':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded">{strings.statuses.POSSIBLE_DUPLICATE_REVIEW}</span>;
      case 'SUPPLIER_CLARIFICATION_PENDING':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">{strings.statuses.SUPPLIER_CLARIFICATION_PENDING}</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#14263D]">{strings.dashboard.title}</h2>
            <span className="text-xs bg-[#247C78]/10 text-[#247C78] font-semibold px-2 py-0.5 rounded">
              Period: {activePeriod}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{strings.dashboard.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('ledger')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:border-[#247C78] text-[#14263D] font-semibold rounded-lg text-xs shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#247C78]" />
            <span>{strings.dashboard.viewLedger}</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#247C78] hover:bg-[#1C6360] text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{strings.app.quickUpload}</span>
          </button>
        </div>
      </div>

      {/* 6 Core KPI Cards (100% computed from real records) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Invoices */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-[#247C78] transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{strings.dashboard.totalInvoices}</span>
            <Receipt className="w-4 h-4 text-[#14263D]" />
          </div>
          <div className="text-2xl font-black text-[#14263D]">{totalInvoices}</div>
          <div className="text-[10px] text-gray-400 mt-1">Uploaded evidence files</div>
        </div>

        {/* Awaiting Confirmation */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{strings.dashboard.awaitingConfirmation}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{awaitingConfirmationCount}</div>
          <div className="text-[10px] text-amber-600/70 mt-1">Owner review required</div>
        </div>

        {/* Unresolved Issues */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-red-400 transition-all">
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{strings.dashboard.unresolvedIssues}</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600">{unresolvedIssuesCount}</div>
          <div className="text-[10px] text-red-600/70 mt-1">Gaps or discrepancies</div>
        </div>

        {/* Possible Duplicates */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{strings.dashboard.duplicates}</span>
            <Copy className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600">{duplicateAlertsCount}</div>
          <div className="text-[10px] text-purple-600/70 mt-1">Side-by-side inspect</div>
        </div>

        {/* Accountant Review Pending */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{strings.dashboard.accountantPending}</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">{accountantPendingCount}</div>
          <div className="text-[10px] text-blue-600/70 mt-1">Awaiting CA verification</div>
        </div>

        {/* Resolved Invoices */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{strings.dashboard.resolved}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-600/70 mt-1">Handoff ready</div>
        </div>
      </div>

      {/* High-Impact Differentiator Banner: Active Cross-Period Cases */}
      <div className="bg-gradient-to-r from-[#14263D] to-[#1C304A] text-white p-4 rounded-xl border border-[#2D4A6A] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <h3 className="font-bold text-sm tracking-tight text-white">{strings.dashboard.crossPeriodAlert}</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                Core Differentiator
              </span>
            </div>
            <p className="text-xs text-gray-300">{strings.dashboard.crossPeriodDesc}</p>
          </div>

          <button
            onClick={() => setActiveTab('ledger')}
            className="flex items-center gap-1.5 bg-[#247C78] hover:bg-[#1C6360] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start lg:self-auto flex-shrink-0"
          >
            <span>Explore Case Study (Aug ➔ Oct)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Cross-Period Item Strip */}
        <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#14263D]/80 border border-[#247C78]/50 p-2.5 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">INV-2026-0812 · Kaveri Traders</div>
              <div className="text-[11px] text-gray-400">Original: <span className="text-amber-300 font-bold">AUG-2026</span> ➔ Followed up in <span className="text-teal-300 font-bold">SEP</span> ➔ Reviewed in <span className="text-emerald-300 font-bold">OCT</span></div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
              RESOLVED
            </span>
          </div>

          <div className="bg-[#14263D]/80 border border-amber-500/40 p-2.5 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">INV-2026-0719 · Annapoorna Grain Wholesale</div>
              <div className="text-[11px] text-gray-400">Original: <span className="text-amber-300 font-bold">AUG-2026</span> (July bill) ➔ Carried into <span className="text-teal-300 font-bold">OCT-2026</span></div>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
              CA REVIEW
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Documents & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-2xs p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-[#14263D]">{strings.dashboard.recentUploads}</h3>
              <p className="text-[11px] text-gray-500">Chronological purchase bill evidence entries</p>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-[#247C78] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-2 px-3">Invoice #</th>
                  <th className="py-2 px-3">Supplier & GSTIN</th>
                  <th className="py-2 px-3">Period</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#14263D]">
                      {inv.invoiceNumber}
                      <div className="text-[10px] text-gray-400 font-normal">{inv.id}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-800">{inv.supplierName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{inv.supplierGstin || 'Missing GSTIN'}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10.5px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                        {inv.originalPeriod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#14263D]">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immediate Agent Action Items (1 col) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-[#14263D]">{strings.dashboard.pendingActions}</h3>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                {issues.filter(i => i.status !== 'RESOLVED').length} Open
              </span>
            </div>

            <div className="space-y-2.5">
              {issues.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setActiveTab('resolution')}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-[#247C78] bg-gray-50/50 cursor-pointer transition-all hover:bg-white"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#14263D] mb-1">
                    <span className="truncate max-w-[180px]">{issue.titleEn}</span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-2">{issue.recommendedActionEn}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => setActiveTab('resolution')}
              className="w-full py-2 px-3 bg-[#14263D] hover:bg-[#1C304A] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <span>Launch Agent Resolution Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
