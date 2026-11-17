import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  FileText,
  Eye,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { Invoice, EvidenceStatus, ReturnPeriod } from '../types';

export const EvidenceLedgerView: React.FC = () => {
  const { language, invoices, issues, events, setActiveTab } = useApp();
  const strings = t[language];

  const [selectedIssueFilter, setSelectedIssueFilter] = useState<string>('ALL');
  const [inspectedInvoiceId, setInspectedInvoiceId] = useState<string>('INV-2026-0812'); // Default to flagship case study

  const inspectedInvoice = invoices.find((i) => i.id === inspectedInvoiceId) || invoices[0];
  const relatedIssue = issues.find((i) => i.invoiceId === inspectedInvoice?.id);
  const relatedEvents = events.filter((e) => e.invoiceId === inspectedInvoice?.id || e.evidenceId === inspectedInvoice?.evidenceId);

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
      case 'OWNER_CONFIRMATION_PENDING':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded">{strings.statuses.OWNER_CONFIRMATION_PENDING}</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[#14263D]">{strings.ledger.title}</h2>
          <span className="text-xs bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded border border-purple-200">
            ★ Core Differentiator
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{strings.ledger.subtitle}</p>
      </div>

      {/* Flagship Case Study Banner (August -> September -> October) */}
      <div className="bg-gradient-to-r from-[#14263D] via-[#1C304A] to-[#14263D] text-white p-5 rounded-2xl border border-teal-500/40 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-extrabold text-xs tracking-wider text-teal-300 uppercase">
              {strings.ledger.caseStudyBanner}
            </span>
          </div>
          <button
            onClick={() => setInspectedInvoiceId('INV-2026-0812')}
            className="px-3 py-1 bg-[#247C78] hover:bg-[#1C6360] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Load Kaveri Traders Evidence Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">{strings.ledger.caseStudyDesc}</p>

        {/* 3-Month Visual Lifecycle Step Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-[#14263D]/90 border border-amber-500/50 p-3 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 uppercase text-[10.5px]">1. AUGUST 2026 (Intake)</span>
              <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">UNCERTAIN</span>
            </div>
            <p className="text-gray-300 text-[11px]">
              Thermal receipt uploaded. Invoice total ₹14,200 readable, but GSTIN smudged by heat fade. Status: <strong className="text-amber-300">EXTRACTION_UNCERTAIN</strong>. Original period bound to AUG-2026.
            </p>
          </div>

          <div className="bg-[#14263D]/90 border border-teal-500/50 p-3 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-teal-300 uppercase text-[10.5px]">2. SEPTEMBER 2026 (Resolution)</span>
              <span className="bg-teal-500/20 text-teal-300 text-[9px] font-bold px-1.5 py-0.2 rounded">CONFIRMED</span>
            </div>
            <p className="text-gray-300 text-[11px]">
              Supplier clarification drafted & owner-approved. Kaveri Traders sent clear WhatsApp PDF. GSTIN re-extracted as <strong className="text-teal-300 font-mono">SYNTHETIC-GSTIN-01</strong>. Owner confirmed.
            </p>
          </div>

          <div className="bg-[#14263D]/90 border border-emerald-500/50 p-3 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-300 uppercase text-[10.5px]">3. OCTOBER 2026 (Audit Closure)</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded">RESOLVED</span>
            </div>
            <p className="text-gray-300 text-[11px]">
              Visiting tax practitioner opened October review pack. Inspected August thermal scan + September PDF. Confirmed GSTIN and marked evidence as <strong className="text-emerald-300 font-bold">RESOLVED</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Ledger Split Screen: Ledger Registry vs Inspected Evidence Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ledger Records (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#14263D]">Persistent Evidence Ledger Registry</h3>
                <p className="text-[11px] text-gray-500">Every evidence item preserves original period & cross-month status</p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={selectedIssueFilter}
                  onChange={(e) => setSelectedIssueFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#14263D] focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Ledger Records</option>
                  <option value="CROSS_PERIOD">Cross-Period Follow-ups</option>
                  <option value="RESOLVED">Resolved Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">{strings.ledger.evidenceId}</th>
                    <th className="py-2.5 px-3">Invoice & Supplier</th>
                    <th className="py-2.5 px-2 text-center">{strings.ledger.originalPeriod}</th>
                    <th className="py-2.5 px-2 text-center">{strings.ledger.followUpPeriod}</th>
                    <th className="py-2.5 px-3 text-center">{strings.ledger.resolutionStatus}</th>
                    <th className="py-2.5 px-2 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices
                    .filter((inv) => {
                      if (selectedIssueFilter === 'CROSS_PERIOD') return inv.originalPeriod !== inv.currentFollowUpPeriod || inv.id === 'INV-2026-0812';
                      if (selectedIssueFilter === 'RESOLVED') return inv.status === 'RESOLVED';
                      return true;
                    })
                    .map((inv) => {
                      const isSelected = inspectedInvoice?.id === inv.id;
                      const hasCrossedPeriods = inv.originalPeriod !== inv.currentFollowUpPeriod || inv.id === 'INV-2026-0812';

                      return (
                        <tr
                          key={inv.id}
                          onClick={() => setInspectedInvoiceId(inv.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-teal-50/80 border-l-4 border-l-[#247C78]' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-[#14263D]">
                            {inv.evidenceId}
                            <div className="text-[10px] text-gray-400 font-normal">{inv.documentFileName}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-gray-800">{inv.invoiceNumber}</div>
                            <div className="text-[10.5px] text-gray-500 truncate max-w-[140px]">{inv.supplierName}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                              {inv.originalPeriod}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                hasCrossedPeriods ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {inv.currentFollowUpPeriod}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">{getStatusBadge(inv.status)}</td>
                          <td className="py-2.5 px-2 text-center text-gray-400">
                            <ChevronRight className="w-4 h-4 inline" />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Showing {invoices.length} persistent evidence records</span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Zero Silent Overwrite Active
            </span>
          </div>
        </div>

        {/* Right Column: Detailed Timeline & Audit Trail for Selected Evidence (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {inspectedInvoice && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-4 space-y-4">
              {/* Evidence Item Header */}
              <div className="pb-3 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-gray-400 font-mono">{inspectedInvoice.evidenceId}</span>
                    <span className="text-gray-300">·</span>
                    <span className="font-extrabold text-sm text-[#14263D]">{inspectedInvoice.invoiceNumber}</span>
                  </div>
                  <div className="font-semibold text-xs text-gray-700 mt-0.5">{inspectedInvoice.supplierName}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">GSTIN: {inspectedInvoice.supplierGstin || 'Uncertain'}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Original Period</div>
                  <span className="text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {inspectedInvoice.originalPeriod}
                  </span>
                </div>
              </div>

              {/* Status and Summary */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-600">Resolution Status:</span>
                  {getStatusBadge(inspectedInvoice.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-600">Total Invoice Value:</span>
                  <span className="font-bold text-[#14263D]">₹{inspectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                {inspectedInvoice.extractionNote && (
                  <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200 italic">
                    "{inspectedInvoice.extractionNote}"
                  </p>
                )}
              </div>

              {/* Cross-Period Timeline Log */}
              <div>
                <h4 className="text-xs font-bold text-[#14263D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#247C78]" />
                  <span>Cross-Period Event Audit Trail</span>
                </h4>

                <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 text-xs">
                  {relatedEvents.length === 0 ? (
                    <p className="text-gray-400 text-[11px] italic">No event logs recorded yet.</p>
                  ) : (
                    relatedEvents.map((evt) => (
                      <div key={evt.id} className="relative">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#247C78] border-2 border-white"></div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="font-mono font-semibold text-gray-700">{evt.actorName}</span>
                          <span>{new Date(evt.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-gray-700 font-medium mt-0.5">{evt.descriptionEn}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions for this item */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('resolution')}
                  className="text-xs font-bold text-[#247C78] hover:underline flex items-center gap-1"
                >
                  <span>Resolve in Agent Centre</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setActiveTab('accountant')}
                  className="text-xs font-bold text-gray-600 hover:underline flex items-center gap-1"
                >
                  <span>View in CA Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
