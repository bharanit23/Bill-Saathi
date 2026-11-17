import React, { useState } from 'react';
import { useApp } from '../context';
import { SupplierFollowUp } from '../types';
import { t } from '../translations';
import { 
  MessageSquare, Send, CheckCircle2, Clock, AlertTriangle, 
  Search, ShieldAlert, Sparkles, UserCheck, X, FileText, Ban
} from 'lucide-react';

export const SupplierFollowUpsView: React.FC = () => {
  const { 
    followUps, 
    issues, 
    approveFollowUp, 
    rejectFollowUp, 
    recordSupplierResponse, 
    showToast, 
    language 
  } = useApp();
  
  const strings = t[language];
  const [selectedFollowUp, setSelectedFollowUp] = useState<SupplierFollowUp | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [editedDraftTa, setEditedDraftTa] = useState('');
  const [editedDraftEn, setEditedDraftEn] = useState('');
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  const filteredFollowUps = followUps.filter(fu => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'draft' && fu.approvalStatus === 'DRAFT_PENDING_APPROVAL') ||
      (filterStatus === 'approved' && fu.approvalStatus === 'APPROVED') ||
      (filterStatus === 'responded' && Boolean(fu.responseReceived));

    const matchesSearch = fu.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fu.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelect = (fu: SupplierFollowUp) => {
    setSelectedFollowUp(fu);
    setResponseText(fu.responseReceived || '');
    setEditedDraftTa(fu.draftMessageTa);
    setEditedDraftEn(fu.draftMessageEn);
    setIsEditingDraft(false);
  };

  const handleApprove = (id: string) => {
    approveFollowUp(id);
    showToast('Follow-up message approved & simulated dispatched via WhatsApp!', 'success');
    if (selectedFollowUp && selectedFollowUp.id === id) {
      setSelectedFollowUp({ 
        ...selectedFollowUp, 
        approvalStatus: 'APPROVED', 
        dispatchStatus: 'SIMULATED_DISPATCHED',
        approvedAt: new Date().toISOString() 
      });
    }
  };

  const handleReject = (id: string) => {
    rejectFollowUp(id);
    showToast('Follow-up message dismissed / rejected.', 'info');
    if (selectedFollowUp && selectedFollowUp.id === id) {
      setSelectedFollowUp({ ...selectedFollowUp, approvalStatus: 'REJECTED' });
    }
  };

  const handleRecordResponse = (id: string) => {
    if (!responseText.trim()) {
      showToast('Please enter supplier response notes before recording.', 'warning');
      return;
    }
    recordSupplierResponse(id, responseText);
    showToast('Supplier response recorded into ledger!', 'success');
    if (selectedFollowUp && selectedFollowUp.id === id) {
      setSelectedFollowUp({ 
        ...selectedFollowUp, 
        responseReceived: responseText, 
        responseTimestamp: new Date().toISOString() 
      });
    }
  };

  const getStatusBadge = (fu: SupplierFollowUp) => {
    if (fu.responseReceived) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3" /> Response Received
        </span>
      );
    }
    if (fu.approvalStatus === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          <Send className="w-3 h-3" /> Dispatched (Simulated)
        </span>
      );
    }
    if (fu.approvalStatus === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          <Ban className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <Clock className="w-3 h-3" /> Draft Pending Approval
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Autonomous Agent Module
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Tamil & English Dual Drafts</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            {strings.nav.followups}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            AI-prepared vernacular clarification messages for missing details, unreadable stamps, and tax discrepancies.
          </p>
        </div>

        {/* Demo Mode Disclaimer Pill */}
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Mode:</strong> External messaging (WhatsApp/SMS) is simulated. No live messages are sent to real phone numbers.
          </span>
        </div>
      </div>

      {/* Main Grid: List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Follow-up List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            {/* Search and Filters */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search supplier or invoice ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Follow-ups' },
                { id: 'draft', label: 'Pending Approval' },
                { id: 'approved', label: 'Dispatched' },
                { id: 'responded', label: 'Response Received' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize whitespace-nowrap transition-colors ${
                    filterStatus === tab.id 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredFollowUps.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
                No supplier follow-ups found matching criteria.
              </div>
            ) : (
              filteredFollowUps.map((fu) => {
                const isSelected = selectedFollowUp?.id === fu.id;
                const associatedIssue = issues.find(i => i.id === fu.issueId);

                return (
                  <div
                    key={fu.id}
                    onClick={() => handleSelect(fu)}
                    className={`bg-white p-4 rounded-xl border transition-all cursor-pointer shadow-sm hover:border-emerald-300 ${
                      isSelected 
                        ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{fu.supplierName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3 text-slate-400" />
                          Invoice: <span className="font-mono font-medium text-slate-700">{fu.invoiceId}</span>
                        </p>
                      </div>
                      <div>{getStatusBadge(fu)}</div>
                    </div>

                    {associatedIssue && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                        <strong>Issue:</strong> {language === 'ta' ? associatedIssue.titleTa : associatedIssue.titleEn}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                      <span>Phone: {fu.supplierPhone}</span>
                      <span>Created: {new Date(fu.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detail & Action Panel */}
        <div className="lg:col-span-7">
          {selectedFollowUp ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
              {/* Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {selectedFollowUp.id}
                    </span>
                    {getStatusBadge(selectedFollowUp)}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedFollowUp.supplierName}
                  </h2>
                  <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                    <span>Contact: {selectedFollowUp.supplierPhone}</span>
                    <span>•</span>
                    <span>Ref Invoice: {selectedFollowUp.invoiceId}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFollowUp(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Dual-Language Message Drafts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Prepared Clarification Drafts
                    </h3>
                    <button
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className="text-xs text-emerald-700 font-medium hover:underline"
                    >
                      {isEditingDraft ? 'Cancel Editing' : 'Customize Draft'}
                    </button>
                  </div>

                  {/* Tamil Draft */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        தமிழ் செய்தி (Tamil WhatsApp Draft)
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Vernacular Tone</span>
                    </div>
                    {isEditingDraft ? (
                      <textarea
                        value={editedDraftTa}
                        onChange={(e) => setEditedDraftTa(e.target.value)}
                        rows={4}
                        className="w-full text-xs text-slate-800 font-sans p-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    ) : (
                      <p className="text-xs text-slate-800 font-sans whitespace-pre-line leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                        {editedDraftTa}
                      </p>
                    )}
                  </div>

                  {/* English Draft */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">
                        English Copy (Accountant Reference)
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Formal Business English</span>
                    </div>
                    {isEditingDraft ? (
                      <textarea
                        value={editedDraftEn}
                        onChange={(e) => setEditedDraftEn(e.target.value)}
                        rows={4}
                        className="w-full text-xs text-slate-800 font-sans p-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    ) : (
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                        {editedDraftEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Supplier Response Section */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    Supplier Response & Resolution Record
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter what supplier replied (e.g. Sent corrected bill on WhatsApp, or confirmed GSTIN: 33AABCT9988H1Z5)..."
                    rows={3}
                    className="w-full text-xs text-slate-800 p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Recorded responses automatically append to the persistent evidence ledger audit trail.
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    {selectedFollowUp.approvedAt && (
                      <span>Dispatched: {new Date(selectedFollowUp.approvedAt).toLocaleString()}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedFollowUp.approvalStatus === 'DRAFT_PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={() => handleReject(selectedFollowUp.id)}
                          className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleApprove(selectedFollowUp.id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Approve & Send (Simulated)
                        </button>
                      </>
                    )}

                    {selectedFollowUp.approvalStatus === 'APPROVED' && (
                      <button
                        onClick={() => handleRecordResponse(selectedFollowUp.id)}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Record Supplier Response
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-base font-semibold text-slate-700">No Follow-up Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select an issue from the list on the left to review the automated Tamil WhatsApp draft, customize text, or record supplier resolution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
