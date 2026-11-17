import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Eye,
  Edit2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { Invoice, ReturnPeriod, FieldConfidence, EvidenceEvent } from '../types';

export const UploadView: React.FC = () => {
  const { language, activePeriod, addInvoice, setActiveTab } = useApp();
  const strings = t[language];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<ReturnPeriod>(activePeriod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [manualEdits, setManualEdits] = useState<Record<string, string>>({});

  const sampleVendors = [
    { name: 'Kaveri Traders (Spices)', gstin: 'SYNTHETIC-GSTIN-01' },
    { name: 'Sri Meenakshi Agro Wholesalers', gstin: '33AAACM1122D1Z4' },
    { name: 'Pandian Oil Mills & Refineries', gstin: '33AAECP4421M1Z6' },
    { name: 'Vasantham Cardamoms Co.', gstin: '33AABCV9910D1ZM' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const fakeUrl = URL.createObjectURL(file);
      setFilePreview(fakeUrl);
      setExtractedData(null);
      setManualEdits({});
    }
  };

  const simulateProcessing = () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      // Generate synthetic high-accuracy simulation
      const randomVendor = sampleVendors[Math.floor(Math.random() * sampleVendors.length)];
      const randomInvNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
      const taxable = Math.round((8000 + Math.random() * 35000) * 100) / 100;
      const cgst = Math.round(taxable * 0.025 * 100) / 100;
      const sgst = Math.round(taxable * 0.025 * 100) / 100;
      const total = Math.round((taxable + cgst + sgst) * 100) / 100;

      setExtractedData({
        supplierName: randomVendor.name,
        supplierGstin: randomVendor.gstin,
        invoiceNumber: randomInvNum,
        invoiceDate: '2026-' + (selectedPeriod.startsWith('AUG') ? '08' : selectedPeriod.startsWith('SEP') ? '09' : '10') + '-14',
        taxableAmount: taxable,
        cgst: cgst,
        sgst: sgst,
        igst: 0,
        totalAmount: total,
      });
    }, 1200);
  };

  const handleSaveToLedger = () => {
    if (!extractedData) return;

    const id = extractedData.invoiceNumber;
    const evidenceId = 'EVD-2026-' + Math.floor(1000 + Math.random() * 9000);

    const invoice: Invoice = {
      id,
      evidenceId,
      originalPeriod: selectedPeriod,
      currentFollowUpPeriod: selectedPeriod,
      uploadTimestamp: new Date().toISOString(),
      documentFileName: selectedFile?.name || 'scanned_bill.pdf',
      documentType: selectedFile?.name.endsWith('.pdf') ? 'PDF' : 'JPEG',
      documentSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : '450 KB',
      documentPreviewUrl: filePreview || '',
      supplierId: 'SUP-' + Math.floor(100 + Math.random() * 900),
      supplierName: manualEdits.supplierName || extractedData.supplierName,
      supplierGstin: manualEdits.supplierGstin || extractedData.supplierGstin,
      invoiceNumber: manualEdits.invoiceNumber || extractedData.invoiceNumber,
      invoiceDate: manualEdits.invoiceDate || extractedData.invoiceDate,
      taxableAmount: Number(manualEdits.taxableAmount) || extractedData.taxableAmount,
      cgst: Number(manualEdits.cgst) || extractedData.cgst,
      sgst: Number(manualEdits.sgst) || extractedData.sgst,
      igst: Number(manualEdits.igst) || extractedData.igst,
      totalAmount: Number(manualEdits.totalAmount) || extractedData.totalAmount,
      fields: {
        supplierName: {
          name: 'supplierName',
          labelEn: 'Supplier Name',
          labelTa: 'விற்பனையாளர் பெயர்',
          extractedValue: extractedData.supplierName,
          ownerValue: manualEdits.supplierName,
          confidence: 'HIGH',
          confidenceScore: 0.95,
          isConfirmedByOwner: true,
        },
        supplierGstin: {
          name: 'supplierGstin',
          labelEn: 'Supplier GSTIN',
          labelTa: 'விற்பனையாளர் ஜிஎஸ்டி',
          extractedValue: extractedData.supplierGstin,
          ownerValue: manualEdits.supplierGstin,
          confidence: 'HIGH',
          confidenceScore: 0.94,
          isConfirmedByOwner: true,
        },
        invoiceNumber: {
          name: 'invoiceNumber',
          labelEn: 'Invoice Number',
          labelTa: 'பில் எண்',
          extractedValue: extractedData.invoiceNumber,
          ownerValue: manualEdits.invoiceNumber,
          confidence: 'HIGH',
          confidenceScore: 0.96,
          isConfirmedByOwner: true,
        },
        invoiceDate: {
          name: 'invoiceDate',
          labelEn: 'Invoice Date',
          labelTa: 'பில் தேதி',
          extractedValue: extractedData.invoiceDate,
          ownerValue: manualEdits.invoiceDate,
          confidence: 'HIGH',
          confidenceScore: 0.92,
          isConfirmedByOwner: true,
        },
        taxableAmount: {
          name: 'taxableAmount',
          labelEn: 'Taxable Amount',
          labelTa: 'வரிக்குரிய மதிப்பு',
          extractedValue: extractedData.taxableAmount,
          ownerValue: manualEdits.taxableAmount ? Number(manualEdits.taxableAmount) : undefined,
          confidence: 'HIGH',
          confidenceScore: 0.95,
          isConfirmedByOwner: true,
        },
        cgst: {
          name: 'cgst',
          labelEn: 'CGST',
          labelTa: 'மத்திய வரி (CGST)',
          extractedValue: extractedData.cgst,
          ownerValue: manualEdits.cgst ? Number(manualEdits.cgst) : undefined,
          confidence: 'HIGH',
          confidenceScore: 0.95,
          isConfirmedByOwner: true,
        },
        sgst: {
          name: 'sgst',
          labelEn: 'SGST',
          labelTa: 'மாநில வரி (SGST)',
          extractedValue: extractedData.sgst,
          ownerValue: manualEdits.sgst ? Number(manualEdits.sgst) : undefined,
          confidence: 'HIGH',
          confidenceScore: 0.95,
          isConfirmedByOwner: true,
        },
        igst: {
          name: 'igst',
          labelEn: 'IGST',
          labelTa: 'ஒருங்கிணைந்த வரி (IGST)',
          extractedValue: 0,
          confidence: 'HIGH',
          confidenceScore: 0.99,
          isConfirmedByOwner: true,
        },
        totalAmount: {
          name: 'totalAmount',
          labelEn: 'Total Amount',
          labelTa: 'மொத்த பில் தொகை',
          extractedValue: extractedData.totalAmount,
          ownerValue: manualEdits.totalAmount ? Number(manualEdits.totalAmount) : undefined,
          confidence: 'HIGH',
          confidenceScore: 0.96,
          isConfirmedByOwner: true,
        },
      },
      status: 'ACCOUNTANT_REVIEW_PENDING',
      isDuplicateFlagged: false,
      extractionNote: 'Processed via simulated OCR demonstration engine. Owner confirmed values.',
    };

    const uploadEvent: EvidenceEvent = {
      id: 'EVT-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
      evidenceId,
      invoiceId: id,
      eventType: 'DOCUMENT_UPLOADED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: `Uploaded purchase invoice ${selectedFile?.name || 'document'} assigned to Return Period ${selectedPeriod}.`,
      descriptionTa: `${selectedPeriod} கணக்கிற்காக புதிய கொள்முதல் பில் பதிவேற்றப்பட்டது.`,
    };

    addInvoice(invoice, [uploadEvent]);
    setActiveTab('ledger');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-[#14263D]">{strings.upload.title}</h2>
        <p className="text-xs text-gray-500 mt-1">{strings.upload.subtitle}</p>
      </div>

      {/* Synthetic Engine Honest Declaration */}
      <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 uppercase tracking-wider">{strings.upload.syntheticWarning}</span>
          <p className="text-amber-800 text-[11px] mt-0.5">{strings.upload.syntheticDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Dropzone */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#247C78] transition-colors text-center">
            <input
              type="file"
              id="fileInput"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#247C78] mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="font-bold text-xs text-[#14263D]">{strings.upload.dragDropText}</span>
              <span className="text-[11px] text-gray-400 mt-1">{strings.upload.supports}</span>
            </label>
          </div>

          {/* Period Selector */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#247C78]" />
              <span>{strings.upload.selectPeriod}:</span>
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['AUG-2026', 'SEP-2026', 'OCT-2026', 'NOV-2026'] as ReturnPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPeriod(p)}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all ${
                    selectedPeriod === p
                      ? 'bg-[#14263D] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Process Extraction Button */}
          {selectedFile && !extractedData && (
            <button
              onClick={simulateProcessing}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-[#247C78] hover:bg-[#1C6360] disabled:bg-gray-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing Document Extraction...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{strings.upload.uploadCTA}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Preview & Extraction Area */}
        <div className="space-y-4">
          {selectedFile ? (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                <span className="font-bold text-gray-700">{strings.upload.previewTitle}</span>
                <span className="text-[10px] text-gray-400 font-mono">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
              </div>

              {filePreview && selectedFile.type.startsWith('image/') ? (
                <div className="h-48 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                  <img src={filePreview} alt="Preview" className="h-full object-contain" />
                </div>
              ) : (
                <div className="h-48 rounded-lg border border-gray-200 flex flex-col items-center justify-center bg-gray-50 text-gray-400 text-xs">
                  <FileText className="w-12 h-12 text-[#247C78] mb-2" />
                  <span>PDF Document Staged for Extraction</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 text-xs">
              <Eye className="w-8 h-8 mb-2 text-gray-300" />
              <span>Document preview will appear here upon file selection</span>
            </div>
          )}

          {/* Extracted Fields Form */}
          {extractedData && (
            <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-[#14263D]">{strings.upload.extractionTitle}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  High Confidence (Simulated)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold">Supplier Name</label>
                  <input
                    type="text"
                    value={manualEdits.supplierName !== undefined ? manualEdits.supplierName : extractedData.supplierName}
                    onChange={(e) => setManualEdits({ ...manualEdits, supplierName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-semibold focus:outline-hidden focus:border-[#247C78]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-semibold">Supplier GSTIN (Synthetic)</label>
                  <input
                    type="text"
                    value={manualEdits.supplierGstin !== undefined ? manualEdits.supplierGstin : extractedData.supplierGstin}
                    onChange={(e) => setManualEdits({ ...manualEdits, supplierGstin: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-mono font-semibold focus:outline-hidden focus:border-[#247C78]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-semibold">Invoice Number</label>
                  <input
                    type="text"
                    value={manualEdits.invoiceNumber !== undefined ? manualEdits.invoiceNumber : extractedData.invoiceNumber}
                    onChange={(e) => setManualEdits({ ...manualEdits, invoiceNumber: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-mono font-semibold focus:outline-hidden focus:border-[#247C78]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-semibold">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={manualEdits.totalAmount !== undefined ? manualEdits.totalAmount : extractedData.totalAmount}
                    onChange={(e) => setManualEdits({ ...manualEdits, totalAmount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-bold text-[#14263D] focus:outline-hidden focus:border-[#247C78]"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveToLedger}
                className="w-full py-2.5 px-4 bg-[#14263D] hover:bg-[#1C304A] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors mt-2"
              >
                <span>{strings.upload.confirmCTA}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
