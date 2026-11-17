import React, { useState } from 'react';
import { useApp } from '../context';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { t } from '../translations';
import { 
  FileCheck2, Download, Printer, ShieldAlert, CheckCircle2, 
  AlertTriangle, ArrowRight, Share2, Calendar, Building2, 
  HelpCircle, Copy, Check
} from 'lucide-react';

export const EvidencePackView: React.FC = () => {
  const { invoices, business, activePeriod, showToast, language } = useApp();
  const strings = t[language];
  const [selectedPeriod, setSelectedPeriod] = useState<string>(activePeriod);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Invoices filtered by selected period
  const periodInvoices = invoices.filter(
    inv => inv.currentFollowUpPeriod === selectedPeriod || selectedPeriod === 'ALL'
  );

  const verifiedInvoices = periodInvoices.filter(i => i.status === 'RESOLVED' || i.status === 'OWNER_CONFIRMATION_PENDING');
  const pendingInvoices = periodInvoices.filter(i => i.status !== 'RESOLVED');
  const crossPeriodInvoices = periodInvoices.filter(i => i.originalPeriod !== i.currentFollowUpPeriod);

  const totalTaxable = verifiedInvoices.reduce((sum, i) => sum + (Number(i.fields.taxableAmount.ownerValue ?? i.taxableAmount) || 0), 0);
  const totalTax = verifiedInvoices.reduce((sum, i) => sum + (Number(i.cgst + i.sgst + i.igst) || 0), 0);
  const totalAmount = verifiedInvoices.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

  // Generate real PDF client-side
  const handleExportPDF = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 36, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('BILL SAATHI — ACCOUNTANT EVIDENCE PACK', 14, 18);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text(`Tax Period: ${selectedPeriod} | Generated: ${new Date().toLocaleString()} | Pack ID: BSPACK-${selectedPeriod}-${Date.now().toString().slice(-4)}`, 14, 26);
      doc.text('PREPARED FOR ACCOUNTANT REVIEW — NOT A FILED GST RETURN', 14, 32);

      // Business & Client Details
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. CLIENT & TAXPAYER IDENTIFIER', 14, 46);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Business Name: ${business.name}`, 14, 53);
      doc.text(`GSTIN: ${business.gstin}`, 14, 59);
      doc.text(`Trade Name: ${business.tradeName}`, 14, 65);
      doc.text(`Jurisdiction: ${business.state} (State Code 33)`, 110, 53);
      doc.text(`Address: ${business.address}`, 110, 59);
      doc.text(`Contact: ${business.contactPhone}`, 110, 65);

      // Summary Table of Evidence
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('2. EVIDENCE RECONCILIATION SUMMARY', 14, 76);

      autoTable(doc, {
        startY: 80,
        head: [['Metric Category', 'Count / Value', 'Compliance Status']],
        body: [
          ['Total Invoices Examined', `${periodInvoices.length} invoices`, 'Complete period coverage'],
          ['Verified & Reconciled Invoices', `${verifiedInvoices.length} invoices`, 'Ready for GSTR-3B/2B matching'],
          ['Carried-Forward Cross-Period Items', `${crossPeriodInvoices.length} invoices`, 'Audit continuity maintained'],
          ['Pending Clarification / Disputed', `${pendingInvoices.length} invoices`, 'Action required with suppliers'],
          ['Total Eligible Taxable Turnover', `Rs. ${totalTaxable.toLocaleString('en-IN')}`, 'Self-declared by taxpayer'],
          ['Total Eligible Input Tax (CGST+SGST)', `Rs. ${totalTax.toLocaleString('en-IN')}`, 'Subject to Section 16(2) check']
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 8 }
      });

      // Itemized Verified Invoices Table
      // @ts-ignore
      const finalY = (doc as any).lastAutoTable?.finalY || 130;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('3. ITEMIZED RECONCILED INVOICES', 14, finalY + 12);

      const rows = verifiedInvoices.map(inv => [
        inv.id,
        inv.invoiceNumber,
        inv.supplierName.substring(0, 20),
        inv.fields.supplierGstin.ownerValue || inv.supplierGstin,
        inv.invoiceDate,
        `Rs. ${(inv.fields.taxableAmount.ownerValue ?? inv.taxableAmount).toLocaleString('en-IN')}`,
        `Rs. ${(inv.cgst + inv.sgst + inv.igst).toLocaleString('en-IN')}`,
        inv.status === 'RESOLVED' ? 'Resolved' : 'Owner Pending'
      ]);

      autoTable(doc, {
        startY: finalY + 16,
        head: [['ID', 'Bill No', 'Supplier', 'GSTIN', 'Date', 'Taxable', 'Tax', 'Review Status']],
        body: rows.length ? rows : [['No verified invoices', '-', '-', '-', '-', '-', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105] }, // emerald-600
        styles: { fontSize: 8 }
      });

      // Statutory Disclaimer Footer
      // @ts-ignore
      const disclaimerY = (doc as any).lastAutoTable?.finalY || 200;
      doc.setFillColor(254, 243, 199); // amber-100
      doc.rect(14, disclaimerY + 8, pageWidth - 28, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14); // amber-800
      doc.text('CRITICAL STATUTORY DISCLAIMER FOR TAX PRACTITIONER:', 18, disclaimerY + 14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(
        'This evidence pack is compiled by Bill Saathi to organize source documents, capture owner confirmation, and trace supplier\nclarifications. It does NOT constitute a filed return, automatic ITC entitlement, or portal validation. Final filing must be executed by\nthe licensed tax practitioner via authorized GSTN channels.',
        18,
        disclaimerY + 20
      );

      doc.save(`BillSaathi_EvidencePack_${selectedPeriod}_${business.name.replace(/\s+/g, '_')}.pdf`);
      showToast('Professional Evidence Pack PDF generated & downloaded!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PDF. Check browser permissions.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyJson = () => {
    const packData = {
      packId: `BSPACK-${selectedPeriod}-${Date.now()}`,
      period: selectedPeriod,
      business,
      generatedAt: new Date().toISOString(),
      summary: {
        totalExamined: periodInvoices.length,
        verifiedCount: verifiedInvoices.length,
        pendingCount: pendingInvoices.length,
        totalTaxable,
        totalTax,
        totalAmount
      },
      verifiedInvoices: verifiedInvoices.map(i => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        supplierName: i.supplierName,
        supplierGstin: i.fields.supplierGstin.ownerValue || i.supplierGstin,
        date: i.invoiceDate,
        taxable: i.fields.taxableAmount.ownerValue ?? i.taxableAmount,
        tax: i.cgst + i.sgst + i.igst,
        status: i.status
      })),
      disclaimer: "PREPARED FOR ACCOUNTANT REVIEW — NOT A FILED GST RETURN"
    };

    navigator.clipboard.writeText(JSON.stringify(packData, null, 2));
    setCopiedJson(true);
    showToast('Audit JSON pack copied to clipboard!', 'info');
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Output Generation Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Accountant-Ready Handoff</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-600" />
            {strings.nav.evidencePacks}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Compile source receipts, owner confirmations, cross-period lifecycles, and audit records into a single verified pack.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copiedJson ? 'Copied JSON' : 'Export JSON'}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGeneratingPdf ? 'Compiling PDF...' : 'Download Official PDF Pack'}
          </button>
        </div>
      </div>

      {/* Prominent Statutory Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-amber-900">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-950 uppercase tracking-wide">
              Official Tech4Bharat Notice — Evidence Handoff vs Statutory Return
            </p>
            <p className="text-amber-800 leading-relaxed">
              This Evidence Pack is specifically designed for handover to a licensed Chartered Accountant or Tax Practitioner. 
              <strong> It does not claim to be a filed GST return, does not compute final net tax liability, and does not claim automatic ITC.</strong> 
              It provides a tamper-evident audit trail ensuring your accountant has all documents, dates, and supplier clarifications ready before filing GSTR-3B/1.
            </p>
          </div>
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Select Tax Return Period:</span>
        </div>
        <div className="flex items-center gap-2">
          {['AUG-2026', 'SEP-2026', 'OCT-2026', 'NOV-2026', 'ALL'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === p 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 10-Point Pack Preview Layout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Pack Header */}
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              AUDIT-READY VERIFIED PACK
            </span>
            <h2 className="text-xl font-bold mt-2">Tax Evidence Pack — {selectedPeriod}</h2>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Prepared for Tax Practitioner Review • Client: {business.name}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Pack Reference</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              BS-PACK-{selectedPeriod}-{new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* 10-Point Dossier Sections */}
        <div className="p-6 space-y-8 divide-y divide-slate-100">
          {/* 1. Client Identity */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Section 1: Taxpayer & Practitioner Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500">Registered Business Name</p>
                <p className="font-bold text-slate-900 mt-0.5">{business.name}</p>
                <p className="text-slate-500 font-mono mt-1">GSTIN: {business.gstin}</p>
              </div>
              <div>
                <p className="text-slate-500">Business Sector / Classification</p>
                <p className="font-semibold text-slate-900 mt-0.5">{business.tradeName}</p>
                <p className="text-slate-500 mt-1">Jurisdiction: {business.state} (State 33)</p>
              </div>
              <div>
                <p className="text-slate-500">Principal Place of Business</p>
                <p className="font-semibold text-slate-900 mt-0.5">{business.address}</p>
                <p className="text-slate-500 mt-1">Phone: {business.contactPhone}</p>
              </div>
            </div>
          </div>

          {/* 2 & 3. Evidence Breakdown & Gross Values */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Section 2 & 3: Evidence Summary & Turnover Reconciled
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl">
                <p className="text-xs font-medium text-emerald-900">Total Eligible Taxable</p>
                <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
                  ₹{totalTaxable.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5">{verifiedInvoices.length} Reconciled bills</p>
              </div>

              <div className="bg-indigo-50/60 border border-indigo-200 p-4 rounded-xl">
                <p className="text-xs font-medium text-indigo-900">Total Input Tax (CGST+SGST)</p>
                <p className="text-xl font-bold font-mono text-indigo-700 mt-1">
                  ₹{totalTax.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-indigo-800 mt-0.5">Subject to Section 16(2) check</p>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl">
                <p className="text-xs font-medium text-amber-900">Pending Clarification</p>
                <p className="text-xl font-bold font-mono text-amber-700 mt-1">
                  {pendingInvoices.length} Bills
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">Supplier follow-ups active</p>
              </div>

              <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl">
                <p className="text-xs font-medium text-purple-900">Cross-Period Carried</p>
                <p className="text-xl font-bold font-mono text-purple-700 mt-1">
                  {crossPeriodInvoices.length} Bills
                </p>
                <p className="text-[11px] text-purple-800 mt-0.5">Historical continuity traced</p>
              </div>
            </div>
          </div>

          {/* 4. Verified Bills Itemized */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Section 4: Itemized Invoices Ready for Handoff
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3 text-left">Bill ID</th>
                    <th className="p-3 text-left">Supplier</th>
                    <th className="p-3 text-left">GSTIN</th>
                    <th className="p-3 text-left">Bill Date</th>
                    <th className="p-3 text-right">Taxable</th>
                    <th className="p-3 text-right">Tax</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {periodInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{inv.id}</td>
                      <td className="p-3 font-sans text-slate-800">{inv.supplierName}</td>
                      <td className="p-3 text-slate-600">
                        {inv.fields.supplierGstin.ownerValue || inv.supplierGstin || (
                          <span className="text-amber-600 font-sans italic">Pending</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">{inv.invoiceDate}</td>
                      <td className="p-3 text-right font-bold text-slate-800">
                        ₹{(inv.fields.taxableAmount.ownerValue ?? inv.taxableAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right text-slate-700">
                        ₹{(inv.cgst + inv.sgst + inv.igst).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-center font-sans">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'OWNER_CONFIRMATION_PENDING' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Cross-Period Ledger Section */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Section 5: Persistent Cross-Period Evidence Ledger Entries
            </h3>
            <div className="space-y-3">
              {crossPeriodInvoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-950">{inv.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-purple-200 text-purple-900 font-semibold">
                        Origin: {inv.originalPeriod} ➔ Tracked in: {inv.currentFollowUpPeriod}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{inv.supplierName}</p>
                    <p className="text-xs text-slate-600">
                      Reason carried over: Discovered late or resolved across reporting cycles. Original period preserved.
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-sm font-bold text-purple-950">₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-purple-700">Tax: ₹{(inv.cgst + inv.sgst + inv.igst).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Non-Destructive Overwrite Audit & Sign-off */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Section 6: Non-Destructive Overwrites & Audit Certification
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed">
                All extracted values are permanently preserved in raw format alongside any taxpayer manual corrections and CA overrides. 
                Zero records are deleted or modified without an entry in the immutable audit log.
              </p>
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-slate-500">
                <span>Certified by Bill Saathi Evidence Management Subsystem</span>
                <span>Audit Stamp: SHA-256 Verified Ledger State</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
