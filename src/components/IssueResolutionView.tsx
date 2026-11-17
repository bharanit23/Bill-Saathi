import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  XCircle,
  Edit3,
  Copy,
  FileText,
  UserCheck,
  Eye,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { EvidenceIssue, SupplierFollowUp } from '../types';

export const IssueResolutionView: React.FC = () => {
  const {
    language,
    issues,
    invoices,
    followUps,
    resolveIssue,
    approveFollowUp,
    rejectFollowUp,
    resolveDuplicate,
    setActiveTab
  } = useApp();
  const strings = t[language];

  const [activeIssueId, setActiveIssueId] = useState<string>(issues[1]?.id || issues[0]?.id);
  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const [draftMessageText, setDraftMessageText] = useState<string>('');

  const activeIssue = issues.find((i) => i.id === activeIssueId) || issues[0];
  const affectedInvoice = invoices.find((inv) => inv.id === activeIssue?.invoiceId);
  const relatedFollowUp = followUps.find((flp) => flp.issueId === activeIssue?.id);

  // For duplicate scenario
  const duplicateInvoice = activeIssue?.issueType === 'POSSIBLE_DUPLICATE' && affectedInvoice?.duplicateOfInvoiceId
    ? invoices.find((inv) => inv.id === affectedInvoice.duplicateOfInvoiceId)
    : null;

  const handleStartEditDraft = (msg: string) => {
    setEditingDraft(activeIssue.id);
    setDraftMessageText(msg);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[#14263D]">{strings.resolution.title}</h2>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
            Agentic Orchestration
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{strings.resolution.subtitle}</p>
      </div>

      {/* 5-Stage Agentic Reasoning Loop Ribbon */}
      <div className="bg-[#14263D] text-white p-3.5 rounded-xl border border-[#2D4A6A] shadow-xs">
        <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2">
          {strings.resolution.agentLoopTitle}
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="bg-[#1C304A] p-2 rounded-lg border border-teal-500/40">
            <div className="font-bold text-white text-[11px]">1. DETECT</div>
            <div className="text-[10px] text-gray-400">Signal / Gap Flag</div>
          </div>
          <div className="bg-[#1C304A] p-2 rounded-lg border border-amber-500/40">
            <div className="font-bold text-white text-[11px]">2. DECIDE</div>
            <div className="text-[10px] text-gray-400">Rule & Heuristic</div>
          </div>
          <div className="bg-[#1C304A] p-2 rounded-lg border border-blue-500/40">
            <div className="font-bold text-white text-[11px]">3. PREPARE</div>
            <div className="text-[10px] text-gray-400">Draft Action / Query</div>
          </div>
          <div className="bg-[#1C304A] p-2 rounded-lg border border-red-500/60 bg-red-950/20">
            <div className="font-bold text-amber-300 text-[11px]">4. APPROVAL</div>
            <div className="text-[10px] text-amber-200">Owner Tap-to-Send Gate</div>
          </div>
          <div className="bg-[#1C304A] p-2 rounded-lg border border-emerald-500/40">
            <div className="font-bold text-white text-[11px]">5. RECORD</div>
            <div className="text-[10px] text-gray-400">Audit Ledger Update</div>
          </div>
        </div>
      </div>

      {/* Split Screen Workspace: Issues List vs Agent Decision & Action Centre */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Open Issues List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[#14263D]">{strings.resolution.detectedIssues}</h3>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
              {issues.filter(i => i.status !== 'RESOLVED').length} Active
            </span>
          </div>

          <div className="space-y-2">
            {issues.map((iss) => {
              const isSelected = activeIssue?.id === iss.id;
              const isResolved = iss.status === 'RESOLVED';

              return (
                <div
                  key={iss.id}
                  onClick={() => setActiveIssueId(iss.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#247C78] bg-teal-50/60 shadow-2xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#14263D] truncate max-w-[170px]">{iss.titleEn}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : iss.severity === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {iss.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono">
                    {iss.invoiceNumber} · {iss.originalPeriod}
                  </div>
                  <div className="text-[10.5px] text-gray-600 line-clamp-2 mt-1">
                    {iss.descriptionEn}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Inspection & Action Execution (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeIssue && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-5 space-y-5">
              {/* Issue Detail Header */}
              <div className="pb-3 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-[#14263D]">{activeIssue.titleEn}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {activeIssue.issueType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{activeIssue.descriptionEn}</p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Invoice Ref</div>
                  <div className="font-bold text-xs text-[#14263D]">{activeIssue.invoiceNumber}</div>
                  <div className="text-[10px] text-gray-400">Period: {activeIssue.originalPeriod}</div>
                </div>
              </div>

              {/* Agent Decision Transparency Box */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#14263D]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Agent Decision & Recommendation Transparency</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                      {strings.resolution.reasoning}
                    </span>
                    <p className="text-gray-700 text-[11px] leading-relaxed">{activeIssue.agentReasoningEn}</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-teal-200">
                    <span className="text-[10px] text-teal-700 font-bold uppercase block mb-1">
                      {strings.resolution.recommendation}
                    </span>
                    <p className="text-teal-900 font-semibold text-[11px] leading-relaxed">{activeIssue.recommendedActionEn}</p>
                  </div>
                </div>

                {/* Owner Boundary Alert Notice */}
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 text-[11px] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{strings.resolution.ownerBoundaryAlert}</span>
                </div>
              </div>

              {/* Action Handlers based on Issue Type */}

              {/* Scenario 3: Possible Duplicate Side-by-Side Review */}
              {activeIssue.issueType === 'POSSIBLE_DUPLICATE' && duplicateInvoice && affectedInvoice && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs text-[#14263D] uppercase tracking-wider flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                    <span>{strings.resolution.duplicateComparison}</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {/* Existing record */}
                    <div className="border border-gray-200 p-3 rounded-xl bg-gray-50 space-y-1.5">
                      <div className="font-bold text-gray-700">{strings.resolution.originalRecord}</div>
                      <div className="font-mono text-gray-600">{duplicateInvoice.id}</div>
                      <div className="text-gray-800 font-medium">Inv#: {duplicateInvoice.invoiceNumber}</div>
                      <div>Date: {duplicateInvoice.invoiceDate}</div>
                      <div className="font-bold text-[#14263D]">Amount: ₹{duplicateInvoice.totalAmount.toLocaleString('en-IN')}</div>
                    </div>

                    {/* Flagged upload */}
                    <div className="border border-red-200 p-3 rounded-xl bg-red-50/40 space-y-1.5">
                      <div className="font-bold text-red-800">{strings.resolution.duplicateRecord}</div>
                      <div className="font-mono text-gray-600">{affectedInvoice.id}</div>
                      <div className="text-gray-800 font-medium">Inv#: {affectedInvoice.invoiceNumber}</div>
                      <div>Date: {affectedInvoice.invoiceDate}</div>
                      <div className="font-bold text-[#14263D]">Amount: ₹{affectedInvoice.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => resolveDuplicate(affectedInvoice.id, 'SEPARATE_LEGITIMATE')}
                      className="flex-1 py-2 px-3 bg-white border border-[#247C78] text-[#247C78] hover:bg-[#247C78] hover:text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      {strings.resolution.markSeparate}
                    </button>
                    <button
                      onClick={() => resolveDuplicate(affectedInvoice.id, 'CONFIRMED_DUPLICATE')}
                      className="flex-1 py-2 px-3 bg-[#14263D] hover:bg-[#1C304A] text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      {strings.resolution.markDuplicate}
                    </button>
                  </div>
                </div>
              )}

              {/* Scenario 2: Missing Supplier Info / Supplier Clarification Draft */}
              {relatedFollowUp && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#14263D] uppercase tracking-wider">
                      {strings.resolution.actionDraft}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                      Target: {relatedFollowUp.supplierPhone}
                    </span>
                  </div>

                  {editingDraft === activeIssue.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={draftMessageText}
                        onChange={(e) => setDraftMessageText(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 border border-[#247C78] rounded-xl text-xs font-mono focus:outline-hidden"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingDraft(null)}
                          className="px-3 py-1 text-xs text-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            relatedFollowUp.draftMessageTa = draftMessageText;
                            relatedFollowUp.finalMessage = draftMessageText;
                            setEditingDraft(null);
                          }}
                          className="px-3 py-1 bg-[#247C78] text-white rounded-lg text-xs font-bold"
                        >
                          Save Draft Edits
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-mono text-gray-800 whitespace-pre-wrap">
                      {relatedFollowUp.draftMessageTa || relatedFollowUp.draftMessageEn}
                    </div>
                  )}

                  {relatedFollowUp.approvalStatus === 'DRAFT_PENDING_APPROVAL' ? (
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => handleStartEditDraft(relatedFollowUp.draftMessageTa || relatedFollowUp.draftMessageEn)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{strings.resolution.editBtn}</span>
                      </button>
                      <button
                        onClick={() => rejectFollowUp(relatedFollowUp.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{strings.resolution.rejectBtn}</span>
                      </button>
                      <button
                        onClick={() => approveFollowUp(relatedFollowUp.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#247C78] hover:bg-[#1C6360] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{strings.resolution.approveBtn}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Draft Approved by Owner. Stored in supplier follow-up tracking ledger.</span>
                    </div>
                  )}
                </div>
              )}

              {/* General Resolution Action Button if unapproved */}
              {activeIssue.status !== 'RESOLVED' && (
                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => resolveIssue(activeIssue.id, 'Manually inspected and verified by owner')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#14263D] hover:bg-[#1C304A] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm Discrepancy Resolved</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
