import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  FileText,
  Edit2,
  X,
  FileCheck2,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { Invoice, EvidenceStatus, ReturnPeriod, FieldConfidence } from '../types';

export const InvoicesView: React.FC = () => {
  const { language, invoices, updateInvoiceField, confirmInvoiceFields, setActiveTab } = useApp();
  const strings = t[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValueDraft, setFieldValueDraft] = useState<string>('');

  const periods: ReturnPeriod[] = ['AUG-2026', 'SEP-2026', 'OCT-2026', 'NOV-2026'];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.supplierGstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPeriod = selectedPeriod === 'ALL' || inv.originalPeriod === selectedPeriod;
    const matchesStatus = selectedStatus === 'ALL' || inv.status === selectedStatus;

    return matchesSearch && matchesPeriod && matchesStatus;
  });

  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{strings.statuses.RESOLVED}</span>;
      case 'ACCOUNTANT_REVIEW_PENDING':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{strings.statuses.ACCOUNTANT_REVIEW_PENDING}</span>;
      case 'EXTRACTION_UNCERTAIN':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{strings.statuses.EXTRACTION_UNCERTAIN}</span>;
      case 'POSSIBLE_DUPLICATE_REVIEW':
        return <span className="bg-red-50 text-red-700 border border-red-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{strings.statuses.POSSIBLE_DUPLICATE_REVIEW}</span>;
      case 'SUPPLIER_CLARIFICATION_PENDING':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{strings.statuses.SUPPLIER_CLARIFICATION_PENDING}</span>;
      case 'OWNER_CONFIRMATION_PENDING':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{strings.statuses.OWNER_CONFIRMATION_PENDING}</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 text-[10.5px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  const getConfidenceBadge = (confidence: FieldConfidence) => {
    switch (confidence) {
      case 'HIGH':
        return <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">High (90%+)</span>;
      case 'NEEDS_CONFIRMATION':
        return <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Check (70-90%)</span>;
      case 'MISSING':
        return <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Missing</span>;
      case 'UNREADABLE':
        return <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Unreadable</span>;
    }
  };

  const handleStartEdit = (fieldKey: string, currentValue: any) => {
    setEditingField(fieldKey);
    setFieldValueDraft(String(currentValue || ''));
  };

  const handleSaveEdit = (invoiceId: string) => {
    if (!editingField) return;
    updateInvoiceField(invoiceId, editingField, fieldValueDraft);
    setEditingField(null);
    // Refresh active invoice view
    const updated = invoices.find((i) => i.id === invoiceId);
    if (updated) setActiveInvoice(updated);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-[#14263D]">{strings.invoices.title}</h2>
        <p className="text-xs text-gray-500 mt-1">{strings.invoices.subtitle}</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={strings.invoices.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-hidden focus:bg-white focus:border-[#247C78] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Period filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#14263D] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">{strings.invoices.allPeriods}</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#14263D] focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">{strings.invoices.allStatuses}</option>
              <option value="RESOLVED">{strings.statuses.RESOLVED}</option>
              <option value="ACCOUNTANT_REVIEW_PENDING">{strings.statuses.ACCOUNTANT_REVIEW_PENDING}</option>
              <option value="OWNER_CONFIRMATION_PENDING">{strings.statuses.OWNER_CONFIRMATION_PENDING}</option>
              <option value="EXTRACTION_UNCERTAIN">{strings.statuses.EXTRACTION_UNCERTAIN}</option>
              <option value="POSSIBLE_DUPLICATE_REVIEW">{strings.statuses.POSSIBLE_DUPLICATE_REVIEW}</option>
              <option value="SUPPLIER_CLARIFICATION_PENDING">{strings.statuses.SUPPLIER_CLARIFICATION_PENDING}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">{strings.invoices.invoiceNumber}</th>
                <th className="py-2.5 px-4">{strings.invoices.supplier}</th>
                <th className="py-2.5 px-3">{strings.invoices.date}</th>
                <th className="py-2.5 px-3">{strings.invoices.period}</th>
                <th className="py-2.5 px-4 text-right">{strings.invoices.amount}</th>
                <th className="py-2.5 px-3 text-center">{strings.invoices.status}</th>
                <th className="py-2.5 px-4 text-center">{strings.invoices.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No matching purchase invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#14263D]">
                      {inv.invoiceNumber}
                      <div className="text-[10px] text-gray-400 font-mono font-normal">{inv.evidenceId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{inv.supplierName}</div>
                      <div className="text-[10.5px] text-gray-500 font-mono">
                        {inv.supplierGstin ? (
                          <span>{inv.supplierGstin}</span>
                        ) : (
                          <span className="text-red-600 font-bold bg-red-50 px-1 py-0.2 rounded">MISSING GSTIN</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 font-medium">{inv.invoiceDate}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {inv.originalPeriod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-[#14263D]">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setActiveInvoice(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#247C78] bg-[#247C78]/10 hover:bg-[#247C78] hover:text-white rounded transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{strings.invoices.viewDetail}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal with Extracted Field Comparison & Manual Corrections */}
      {activeInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-[#14263D]">
                    {activeInvoice.invoiceNumber} · {activeInvoice.supplierName}
                  </h3>
                  {getStatusBadge(activeInvoice.status)}
                </div>
                <p className="text-[11px] text-gray-500 font-mono">
                  Evidence ID: {activeInvoice.evidenceId} · Original Period: <strong className="text-gray-700">{activeInvoice.originalPeriod}</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveInvoice(null);
                  setEditingField(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Zero Silent Overwrite Guarantee Box */}
              <div className="bg-[#14263D] text-white p-3.5 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-teal-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Audit Trail Guarantee</span>
                </div>
                <p className="text-gray-300 text-[11px]">
                  Manual corrections recorded by the owner or accountant preserve the original extracted OCR reading permanently. Extracted values are never silently overwritten.
                </p>
              </div>

              {/* Extraction vs Owner Confirmation Table */}
              <div>
                <h4 className="font-bold text-xs text-[#14263D] uppercase tracking-wider mb-2">
                  Extracted Fields vs Owner Confirmation
                </h4>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-3">Field</th>
                        <th className="py-2 px-3">Extracted (Original)</th>
                        <th className="py-2 px-3">Owner Confirmed</th>
                        <th className="py-2 px-2 text-center">Confidence</th>
                        <th className="py-2 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.keys(activeInvoice.fields).map((k) => {
                        const f = (activeInvoice.fields as any)[k];
                        const isEditingThis = editingField === k;

                        return (
                          <tr key={k} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-semibold text-gray-700">
                              {f.labelEn}
                              <div className="text-[10px] text-gray-400 font-normal">{f.labelTa}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-gray-800">
                              {f.extractedValue !== undefined && f.extractedValue !== '' ? (
                                String(f.extractedValue)
                              ) : (
                                <span className="text-red-500 font-semibold italic">Missing / Blank</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono">
                              {isEditingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={fieldValueDraft}
                                    onChange={(e) => setFieldValueDraft(e.target.value)}
                                    className="border border-[#247C78] rounded px-2 py-0.5 text-xs font-mono w-40 focus:outline-hidden"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(activeInvoice.id)}
                                    className="px-2 py-0.5 bg-[#247C78] text-white text-[11px] font-bold rounded"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingField(null)}
                                    className="px-1.5 py-0.5 text-gray-500 text-[11px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : f.ownerValue !== undefined ? (
                                <span className="font-bold text-[#14263D] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                                  {String(f.ownerValue)}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">Matches extracted</span>
                              )}
                            </td>
                            <td className="py-2.5 px-2 text-center">{getConfidenceBadge(f.confidence)}</td>
                            <td className="py-2.5 px-3 text-center">
                              {!isEditingThis && (
                                <button
                                  onClick={() => handleStartEdit(k, f.ownerValue !== undefined ? f.ownerValue : f.extractedValue)}
                                  className="text-gray-500 hover:text-[#247C78] p-1 rounded hover:bg-gray-100"
                                  title="Edit field manually"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Document Reference Info */}
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-semibold text-gray-800">Source: {activeInvoice.documentFileName}</div>
                    <div className="text-[10px] text-gray-500">
                      Uploaded on {new Date(activeInvoice.uploadTimestamp).toLocaleString()} · {activeInvoice.documentType} ({activeInvoice.documentSize})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveInvoice(null);
                    setActiveTab('ledger');
                  }}
                  className="text-xs font-semibold text-[#247C78] hover:underline"
                >
                  View in Persistent Ledger →
                </button>
              </div>

              {/* Confirm All Fields Button */}
              {activeInvoice.status !== 'RESOLVED' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      confirmInvoiceFields(activeInvoice.id);
                      setActiveInvoice(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#247C78] hover:bg-[#1C6360] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm All Fields & Mark Ready for Accountant</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
