import React, { useState } from 'react';
import { useApp } from '../context';
import { Invoice, AccountantQuery } from '../types';
import { t } from '../translations';
import { 
  Briefcase, CheckCircle, AlertCircle, Clock, Search, 
  HelpCircle, ShieldCheck, Eye, Save, ArrowRight, Filter
} from 'lucide-react';

export const AccountantWorkspaceView: React.FC = () => {
  const { 
    invoices, 
    business, 
    queries, 
    resolveAccountantQuery, 
    updateInvoiceField, 
    showToast, 
    language 
  } = useApp();
  
  const strings = t[language];
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activePeriod, setActivePeriod] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // CA review form state
  const [reviewNote, setReviewNote] = useState('');
  const [overrideGstin, setOverrideGstin] = useState('');
  const [overrideTaxable, setOverrideTaxable] = useState('');
  const [overrideTax, setOverrideTax] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesPeriod = activePeriod === 'all' || inv.currentFollowUpPeriod === activePeriod || inv.originalPeriod === activePeriod;
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch = inv.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesStatus && matchesSearch;
  });

  const handleSelectInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setReviewNote(inv.fields.supplierGstin.notes || '');
    setOverrideGstin(inv.fields.supplierGstin.accountantValue || inv.fields.supplierGstin.ownerValue || inv.supplierGstin);
    setOverrideTaxable(String(inv.fields.taxableAmount.accountantValue ?? inv.fields.taxableAmount.ownerValue ?? inv.taxableAmount));
    const totalTaxVal = (inv.cgst + inv.sgst + inv.igst);
    setOverrideTax(String(totalTaxVal));
  };

  const handleSaveCAReview = (action: 'CONFIRMED' | 'ADJUSTED' | 'FLAGGED_FOR_FOLLOWUP' | 'INELIGIBLE_ITC') => {
    if (!selectedInvoice) return;

    if (overrideGstin && overrideGstin !== selectedInvoice.supplierGstin) {
      updateInvoiceField(selectedInvoice.id, 'supplierGstin', overrideGstin);
    }
    if (overrideTaxable && Number(overrideTaxable) !== selectedInvoice.taxableAmount) {
      updateInvoiceField(selectedInvoice.id, 'taxableAmount', Number(overrideTaxable));
    }

    showToast(`Accountant action '${action}' recorded for invoice ${selectedInvoice.id}`, 'success');
  };

  const handleRespondToQuery = (queryId: string, response: string) => {
    resolveAccountantQuery(queryId, response, 'CONFIRMED');
    showToast('Accountant guidance recorded in query ledger!', 'success');
  };

  const verifiedCount = invoices.filter(i => i.status === 'RESOLVED').length;
  const pendingCount = invoices.filter(i => i.status !== 'RESOLVED').length;
  const openQueriesCount = queries.filter(q => q.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
              Professional CA Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Auditor & Tax Practitioner Handoff</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            {strings.nav.accountant}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Structured evidence ledger, side-by-side extracted values, non-destructive overrides, and direct client query management.
          </p>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 text-xs max-w-md">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            <strong>Statutory Boundary:</strong> Bill Saathi organizes and validates source evidence. Final GSTR-3B/1 returns and ITC claims remain your professional judgment.
          </span>
        </div>
      </div>

      {/* Metrics Row for Accountant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Client Being Audited</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{business.name}</p>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{business.gstin}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Invoices in Queue</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{invoices.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {verifiedCount} already resolved
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {pendingCount}
          </p>
          <p className="text-xs text-amber-600 mt-0.5">Requires audit or supplier follow-up</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Open CA Queries</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {openQueriesCount}
          </p>
          <p className="text-xs text-purple-600 mt-0.5">Direct client inquiries</p>
        </div>
      </div>

      {/* Two Column Layout: Invoices Review + CA Query Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Invoice Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search supplier, bill number, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={activePeriod}
                onChange={(e) => setActivePeriod(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Tax Periods</option>
                <option value="AUG-2026">AUG-2026</option>
                <option value="SEP-2026">SEP-2026</option>
                <option value="OCT-2026">OCT-2026</option>
                <option value="NOV-2026">NOV-2026</option>
              </select>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'OWNER_CONFIRMATION_PENDING', 'ACCOUNTANT_REVIEW_PENDING', 'RESOLVED', 'POSSIBLE_DUPLICATE_REVIEW'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                    statusFilter === s 
                      ? 'bg-indigo-900 text-white font-medium' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Invoice Cards */}
          <div className="space-y-3">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              const totalTax = inv.cgst + inv.sgst + inv.igst;

              return (
                <div
                  key={inv.id}
                  onClick={() => handleSelectInvoice(inv)}
                  className={`bg-white p-4 rounded-xl border transition-all cursor-pointer shadow-sm hover:border-indigo-300 ${
                    isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-800">{inv.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-700">
                          Period: {inv.currentFollowUpPeriod}
                        </span>
                        {inv.originalPeriod !== inv.currentFollowUpPeriod && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            Origin: {inv.originalPeriod}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm mt-1">{inv.supplierName}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        GSTIN: {inv.supplierGstin || 'MISSING'} | Bill #: {inv.invoiceNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Tax: ₹{totalTax.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          inv.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'OWNER_CONFIRMATION_PENDING' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Auditor Inspector & CA Query Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Invoice Review Panel */}
          {selectedInvoice ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">Auditor Field Inspector</p>
                  <h3 className="font-bold text-base mt-0.5">{selectedInvoice.supplierName}</h3>
                </div>
                <span className="text-xs font-mono bg-indigo-800 px-2 py-1 rounded">
                  {selectedInvoice.id}
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Cross-period Alert if applicable */}
                {selectedInvoice.originalPeriod !== selectedInvoice.currentFollowUpPeriod && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    <strong>Cross-Period Carried Forward:</strong> This invoice originated in{' '}
                    <strong>{selectedInvoice.originalPeriod}</strong> and is currently being tracked in{' '}
                    <strong>{selectedInvoice.currentFollowUpPeriod}</strong>. Ledger preserves original date immutably.
                  </div>
                )}

                {/* Audit Comparison Table (Extracted vs Owner vs Auditor) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Multi-Tier Value Verification
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="p-2 text-left">Field</th>
                          <th className="p-2 text-left">Extracted</th>
                          <th className="p-2 text-left">Current Verified</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        <tr>
                          <td className="p-2 text-slate-600 font-sans">GSTIN</td>
                          <td className="p-2 text-slate-700">{selectedInvoice.fields.supplierGstin.extractedValue || '(blank)'}</td>
                          <td className="p-2 text-indigo-700 font-semibold">
                            {selectedInvoice.fields.supplierGstin.accountantValue || selectedInvoice.fields.supplierGstin.ownerValue || selectedInvoice.supplierGstin}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-600 font-sans">Taxable</td>
                          <td className="p-2 text-slate-700">₹{selectedInvoice.fields.taxableAmount.extractedValue}</td>
                          <td className="p-2 text-indigo-700 font-semibold">
                            ₹{selectedInvoice.fields.taxableAmount.accountantValue ?? selectedInvoice.fields.taxableAmount.ownerValue ?? selectedInvoice.taxableAmount}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-600 font-sans">Tax Amount</td>
                          <td className="p-2 text-slate-700">₹{selectedInvoice.cgst + selectedInvoice.sgst + selectedInvoice.igst}</td>
                          <td className="p-2 text-indigo-700 font-semibold">
                            ₹{selectedInvoice.cgst + selectedInvoice.sgst + selectedInvoice.igst}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-600 font-sans">Total</td>
                          <td className="p-2 text-slate-700">₹{selectedInvoice.totalAmount}</td>
                          <td className="p-2 text-indigo-700 font-semibold">₹{selectedInvoice.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Auditor Notes Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Accountant Review Notes / Qualifications</label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="E.g., Verified against physical rubber stamp; eligible for 18% CGST/SGST ITC under Section 16(2)..."
                    rows={3}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleSaveCAReview('CONFIRMED')}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verify
                  </button>

                  <button
                    onClick={() => handleSaveCAReview('FLAGGED_FOR_FOLLOWUP')}
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Flag
                  </button>

                  <button
                    onClick={() => handleSaveCAReview('INELIGIBLE_ITC')}
                    className="p-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    Ineligible
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 space-y-2">
              <Eye className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">Click any invoice to inspect multi-tier values & apply review notes.</p>
            </div>
          )}

          {/* CA Query Hub */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Auditor-Client Clarification Queries
              </h3>
              <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                {queries.length} Threads
              </span>
            </div>

            <div className="space-y-3">
              {queries.map((query) => (
                <div key={query.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-900">Query re: {query.invoiceId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      query.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {query.status}
                    </span>
                  </div>

                  <p className="text-slate-700 bg-white p-2 rounded border border-slate-100">
                    <strong>CA Query:</strong> {language === 'ta' ? query.questionTa : query.questionEn}
                  </p>

                  {query.accountantResponse ? (
                    <p className="text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">
                      <strong>Client Reply:</strong> {query.accountantResponse}
                    </p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Simulate client answer or add CA follow-up..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            handleRespondToQuery(query.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="w-full text-xs p-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-slate-400">Press Enter to record reply into ledger.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
