import { Invoice, EvidenceIssue, SupplierFollowUp, AccountantQuery, EvidenceEvent, Business, ReturnPeriod } from './types';

const STORAGE_KEYS = {
  INVOICES: 'bill_saathi_invoices_v1',
  ISSUES: 'bill_saathi_issues_v1',
  FOLLOWUPS: 'bill_saathi_followups_v1',
  QUERIES: 'bill_saathi_queries_v1',
  EVENTS: 'bill_saathi_events_v1',
  BUSINESS: 'bill_saathi_business_v1',
  PERIOD: 'bill_saathi_active_period_v1',
  LANGUAGE: 'bill_saathi_active_lang_v1',
};

export const INITIAL_BUSINESS: Business = {
  id: 'BIZ-2026-TN-001',
  name: 'Murugan Stores',
  tradeName: 'Sri Murugan Spices & Provision Mart',
  gstin: '33AABCM9876K1Z9', // Clearly labeled synthetic
  state: 'Tamil Nadu (33)',
  address: 'No. 42, West Tower Street, Madurai, Tamil Nadu - 625001',
  contactPhone: '+91 98421 54321',
};

// Seed synthetic data highlighting all required evaluation workflows
export function getInitialInvoices(): Invoice[] {
  return [
    // 1. Complete High-Confidence Invoice
    {
      id: 'INV-2026-0801',
      evidenceId: 'EVD-2026-0001',
      originalPeriod: 'AUG-2026',
      currentFollowUpPeriod: 'AUG-2026',
      uploadTimestamp: '2026-08-04T10:15:00Z',
      documentFileName: 'meenakshi_agro_aug26.pdf',
      documentType: 'PDF',
      documentSize: '1.2 MB',
      documentPreviewUrl: '',
      supplierId: 'SUP-001',
      supplierName: 'Sri Meenakshi Agro Traders',
      supplierGstin: '33AAACM1122D1Z4',
      invoiceNumber: 'SMA/26/0412',
      invoiceDate: '2026-08-03',
      taxableAmount: 40000,
      cgst: 2000,
      sgst: 2000,
      igst: 0,
      totalAmount: 44000,
      fields: {
        supplierName: { name: 'supplierName', labelEn: 'Supplier Name', labelTa: 'விற்பனையாளர் பெயர்', extractedValue: 'Sri Meenakshi Agro Traders', confidence: 'HIGH', confidenceScore: 0.98, isConfirmedByOwner: true },
        supplierGstin: { name: 'supplierGstin', labelEn: 'Supplier GSTIN', labelTa: 'விற்பனையாளர் ஜிஎஸ்டி', extractedValue: '33AAACM1122D1Z4', confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        invoiceNumber: { name: 'invoiceNumber', labelEn: 'Invoice Number', labelTa: 'பில் எண்', extractedValue: 'SMA/26/0412', confidence: 'HIGH', confidenceScore: 0.97, isConfirmedByOwner: true },
        invoiceDate: { name: 'invoiceDate', labelEn: 'Invoice Date', labelTa: 'பில் தேதி', extractedValue: '2026-08-03', confidence: 'HIGH', confidenceScore: 0.96, isConfirmedByOwner: true },
        taxableAmount: { name: 'taxableAmount', labelEn: 'Taxable Value', labelTa: 'வரிக்குரிய மதிப்பு', extractedValue: 40000, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        cgst: { name: 'cgst', labelEn: 'CGST (5%)', labelTa: 'மத்திய வரி (CGST)', extractedValue: 2000, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        sgst: { name: 'sgst', labelEn: 'SGST (5%)', labelTa: 'மாநில வரி (SGST)', extractedValue: 2000, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        igst: { name: 'igst', labelEn: 'IGST', labelTa: 'ஒருங்கிணைந்த வரி (IGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        totalAmount: { name: 'totalAmount', labelEn: 'Total Invoice Value', labelTa: 'மொத்த பில் தொகை', extractedValue: 44000, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
      },
      status: 'RESOLVED',
      isDuplicateFlagged: false,
      extractionNote: 'Clean digital invoice copy. High confidence across all statutory fields.',
    },

    // 2. The Core Flagship Cross-Period Lifecycle (August -> September -> October)
    {
      id: 'INV-2026-0812',
      evidenceId: 'EVD-2026-0042',
      originalPeriod: 'AUG-2026', // STRICT IMMUTABILITY
      currentFollowUpPeriod: 'OCT-2026',
      uploadTimestamp: '2026-08-12T14:30:00Z',
      documentFileName: 'kaveri_traders_thermal_receipt.jpg',
      documentType: 'JPEG',
      documentSize: '640 KB',
      documentPreviewUrl: '',
      supplierId: 'SUP-002',
      supplierName: 'Kaveri Traders',
      supplierGstin: 'SYNTHETIC-GSTIN-01', // Synthetic demonstration identifier
      invoiceNumber: 'KT-8821',
      invoiceDate: '2026-08-10',
      taxableAmount: 13523.81,
      cgst: 338.10,
      sgst: 338.09,
      igst: 0,
      totalAmount: 14200,
      fields: {
        supplierName: { name: 'supplierName', labelEn: 'Supplier Name', labelTa: 'விற்பனையாளர் பெயர்', extractedValue: 'Kaveri Traders', confidence: 'HIGH', confidenceScore: 0.94, isConfirmedByOwner: true },
        supplierGstin: {
          name: 'supplierGstin',
          labelEn: 'Supplier GSTIN',
          labelTa: 'விற்பனையாளர் ஜிஎஸ்டி',
          extractedValue: '33AABCK????K1Z?', // August blur
          ownerValue: 'SYNTHETIC-GSTIN-01', // Confirmed from September WhatsApp copy
          accountantValue: 'SYNTHETIC-GSTIN-01', // Reviewed in October
          confidence: 'UNREADABLE',
          confidenceScore: 0.32,
          isConfirmedByOwner: true,
          notes: 'August thermal slip had heavy heat fade. September PDF copy provided clear text SYNTHETIC-GSTIN-01. Confirmed by owner; verified format syntax by system.'
        },
        invoiceNumber: { name: 'invoiceNumber', labelEn: 'Invoice Number', labelTa: 'பில் எண்', extractedValue: 'KT-8821', confidence: 'HIGH', confidenceScore: 0.91, isConfirmedByOwner: true },
        invoiceDate: { name: 'invoiceDate', labelEn: 'Invoice Date', labelTa: 'பில் தேதி', extractedValue: '2026-08-10', confidence: 'HIGH', confidenceScore: 0.88, isConfirmedByOwner: true },
        taxableAmount: { name: 'taxableAmount', labelEn: 'Taxable Value', labelTa: 'வரிக்குரிய மதிப்பு', extractedValue: 13523.81, confidence: 'HIGH', confidenceScore: 0.92, isConfirmedByOwner: true },
        cgst: { name: 'cgst', labelEn: 'CGST (2.5%)', labelTa: 'மத்திய வரி (CGST)', extractedValue: 338.10, confidence: 'HIGH', confidenceScore: 0.92, isConfirmedByOwner: true },
        sgst: { name: 'sgst', labelEn: 'SGST (2.5%)', labelTa: 'மாநில வரி (SGST)', extractedValue: 338.09, confidence: 'HIGH', confidenceScore: 0.92, isConfirmedByOwner: true },
        igst: { name: 'igst', labelEn: 'IGST', labelTa: 'ஒருங்கிணைந்த வரி (IGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        totalAmount: { name: 'totalAmount', labelEn: 'Total Invoice Value', labelTa: 'மொத்த பில் தொகை', extractedValue: 14200, confidence: 'HIGH', confidenceScore: 0.95, isConfirmedByOwner: true },
      },
      status: 'RESOLVED',
      isDuplicateFlagged: false,
      extractionNote: 'Cross-period resolution complete: August blur ➔ September supplier WhatsApp PDF ➔ October CA confirmation.',
    },

    // 3. Possible Duplicate Pair (A: Original)
    {
      id: 'INV-2026-0904',
      evidenceId: 'EVD-2026-0089',
      originalPeriod: 'SEP-2026',
      currentFollowUpPeriod: 'SEP-2026',
      uploadTimestamp: '2026-09-04T09:20:00Z',
      documentFileName: 'pandian_oil_inv_441.jpg',
      documentType: 'JPEG',
      documentSize: '820 KB',
      documentPreviewUrl: '',
      supplierId: 'SUP-003',
      supplierName: 'Pandian Oil Mills & Refineries',
      supplierGstin: '33AAECP4421M1Z6',
      invoiceNumber: 'POM-2026-0441',
      invoiceDate: '2026-09-03',
      taxableAmount: 17523.81,
      cgst: 438.10,
      sgst: 438.09,
      igst: 0,
      totalAmount: 18400,
      fields: {
        supplierName: { name: 'supplierName', labelEn: 'Supplier Name', labelTa: 'விற்பனையாளர் பெயர்', extractedValue: 'Pandian Oil Mills & Refineries', confidence: 'HIGH', confidenceScore: 0.96, isConfirmedByOwner: true },
        supplierGstin: { name: 'supplierGstin', labelEn: 'Supplier GSTIN', labelTa: 'விற்பனையாளர் ஜிஎஸ்டி', extractedValue: '33AAECP4421M1Z6', confidence: 'HIGH', confidenceScore: 0.97, isConfirmedByOwner: true },
        invoiceNumber: { name: 'invoiceNumber', labelEn: 'Invoice Number', labelTa: 'பில் எண்', extractedValue: 'POM-2026-0441', confidence: 'HIGH', confidenceScore: 0.95, isConfirmedByOwner: true },
        invoiceDate: { name: 'invoiceDate', labelEn: 'Invoice Date', labelTa: 'பில் தேதி', extractedValue: '2026-09-03', confidence: 'HIGH', confidenceScore: 0.94, isConfirmedByOwner: true },
        taxableAmount: { name: 'taxableAmount', labelEn: 'Taxable Value', labelTa: 'வரிக்குரிய மதிப்பு', extractedValue: 17523.81, confidence: 'HIGH', confidenceScore: 0.95, isConfirmedByOwner: true },
        cgst: { name: 'cgst', labelEn: 'CGST', labelTa: 'மத்திய வரி (CGST)', extractedValue: 438.10, confidence: 'HIGH', confidenceScore: 0.95, isConfirmedByOwner: true },
        sgst: { name: 'sgst', labelEn: 'SGST', labelTa: 'மாநில வரி (SGST)', extractedValue: 438.09, confidence: 'HIGH', confidenceScore: 0.95, isConfirmedByOwner: true },
        igst: { name: 'igst', labelEn: 'IGST', labelTa: 'ஒருங்கிணைந்த வரி (IGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        totalAmount: { name: 'totalAmount', labelEn: 'Total Invoice Value', labelTa: 'மொத்த பில் தொகை', extractedValue: 18400, confidence: 'HIGH', confidenceScore: 0.96, isConfirmedByOwner: true },
      },
      status: 'ACCOUNTANT_REVIEW_PENDING',
      isDuplicateFlagged: false,
    },

    // 4. Possible Duplicate Pair (B: Flagged for Review)
    {
      id: 'INV-2026-0915',
      evidenceId: 'EVD-2026-0104',
      originalPeriod: 'SEP-2026',
      currentFollowUpPeriod: 'SEP-2026',
      uploadTimestamp: '2026-09-15T16:45:00Z',
      documentFileName: 'whatsapp_photo_bill_oil.png',
      documentType: 'PNG',
      documentSize: '950 KB',
      documentPreviewUrl: '',
      supplierId: 'SUP-003',
      supplierName: 'Pandian Oil Mills & Refineries',
      supplierGstin: '33AAECP4421M1Z6',
      invoiceNumber: 'POM-2026-0441',
      invoiceDate: '2026-09-03',
      taxableAmount: 17523.81,
      cgst: 438.10,
      sgst: 438.09,
      igst: 0,
      totalAmount: 18400,
      fields: {
        supplierName: { name: 'supplierName', labelEn: 'Supplier Name', labelTa: 'விற்பனையாளர் பெயர்', extractedValue: 'Pandian Oil Mills & Refineries', confidence: 'HIGH', confidenceScore: 0.93, isConfirmedByOwner: false },
        supplierGstin: { name: 'supplierGstin', labelEn: 'Supplier GSTIN', labelTa: 'விற்பனையாளர் ஜிஎஸ்டி', extractedValue: '33AAECP4421M1Z6', confidence: 'HIGH', confidenceScore: 0.94, isConfirmedByOwner: false },
        invoiceNumber: { name: 'invoiceNumber', labelEn: 'Invoice Number', labelTa: 'பில் எண்', extractedValue: 'POM-2026-0441', confidence: 'HIGH', confidenceScore: 0.92, isConfirmedByOwner: false },
        invoiceDate: { name: 'invoiceDate', labelEn: 'Invoice Date', labelTa: 'பில் தேதி', extractedValue: '2026-09-03', confidence: 'HIGH', confidenceScore: 0.90, isConfirmedByOwner: false },
        taxableAmount: { name: 'taxableAmount', labelEn: 'Taxable Value', labelTa: 'வரிக்குரிய மதிப்பு', extractedValue: 17523.81, confidence: 'HIGH', confidenceScore: 0.91, isConfirmedByOwner: false },
        cgst: { name: 'cgst', labelEn: 'CGST', labelTa: 'மத்திய வரி (CGST)', extractedValue: 438.10, confidence: 'HIGH', confidenceScore: 0.91, isConfirmedByOwner: false },
        sgst: { name: 'sgst', labelEn: 'SGST', labelTa: 'மாநில வரி (SGST)', extractedValue: 438.09, confidence: 'HIGH', confidenceScore: 0.91, isConfirmedByOwner: false },
        igst: { name: 'igst', labelEn: 'IGST', labelTa: 'ஒருங்கிணைந்த வரி (IGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: false },
        totalAmount: { name: 'totalAmount', labelEn: 'Total Invoice Value', labelTa: 'மொத்த பில் தொகை', extractedValue: 18400, confidence: 'HIGH', confidenceScore: 0.92, isConfirmedByOwner: false },
      },
      status: 'POSSIBLE_DUPLICATE_REVIEW',
      isDuplicateFlagged: true,
      duplicateOfInvoiceId: 'INV-2026-0904',
      duplicateMatchReasons: ['Exact supplier GSTIN match', 'Matching Invoice# POM-2026-0441', 'Identical total amount ₹18,400', 'Identical invoice date 2026-09-03'],
      extractionNote: 'Potential duplicate detected! Different photo of previously registered delivery slip.',
    },

    // 5. Missing Supplier Information Requiring Clarification
    {
      id: 'INV-2026-0922',
      evidenceId: 'EVD-2026-0128',
      originalPeriod: 'SEP-2026',
      currentFollowUpPeriod: 'SEP-2026',
      uploadTimestamp: '2026-09-22T11:10:00Z',
      documentFileName: 'vasantham_cardamom_voucher.jpg',
      documentType: 'JPEG',
      documentSize: '510 KB',
      documentPreviewUrl: '',
      supplierId: 'SUP-004',
      supplierName: 'Vasantham Cardamoms',
      supplierGstin: '', // Missing field!
      invoiceNumber: 'VC-09-118',
      invoiceDate: '2026-09-20',
      taxableAmount: 22000,
      cgst: 550,
      sgst: 550,
      igst: 0,
      totalAmount: 23100,
      fields: {
        supplierName: { name: 'supplierName', labelEn: 'Supplier Name', labelTa: 'விற்பனையாளர் பெயர்', extractedValue: 'Vasantham Cardamoms', confidence: 'HIGH', confidenceScore: 0.91, isConfirmedByOwner: true },
        supplierGstin: { name: 'supplierGstin', labelEn: 'Supplier GSTIN', labelTa: 'விற்பனையாளர் ஜிஎஸ்டி', extractedValue: '', confidence: 'MISSING', confidenceScore: 0.0, isConfirmedByOwner: false, notes: 'Vendor cash memo omitted 15-digit GSTIN.' },
        invoiceNumber: { name: 'invoiceNumber', labelEn: 'Invoice Number', labelTa: 'பில் எண்', extractedValue: 'VC-09-118', confidence: 'HIGH', confidenceScore: 0.89, isConfirmedByOwner: true },
        invoiceDate: { name: 'invoiceDate', labelEn: 'Invoice Date', labelTa: 'பில் தேதி', extractedValue: '2026-09-20', confidence: 'HIGH', confidenceScore: 0.86, isConfirmedByOwner: true },
        taxableAmount: { name: 'taxableAmount', labelEn: 'Taxable Value', labelTa: 'வரிக்குரிய மதிப்பு', extractedValue: 22000, confidence: 'HIGH', confidenceScore: 0.93, isConfirmedByOwner: true },
        cgst: { name: 'cgst', labelEn: 'CGST', labelTa: 'மத்திய வரி (CGST)', extractedValue: 550, confidence: 'HIGH', confidenceScore: 0.93, isConfirmedByOwner: true },
        sgst: { name: 'sgst', labelEn: 'SGST', labelTa: 'மாநில வரி (SGST)', extractedValue: 550, confidence: 'HIGH', confidenceScore: 0.93, isConfirmedByOwner: true },
        igst: { name: 'igst', labelEn: 'IGST', labelTa: 'ஒருங்கிணைந்த வரி (IGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        totalAmount: { name: 'totalAmount', labelEn: 'Total Invoice Value', labelTa: 'மொத்த பில் தொகை', extractedValue: 23100, confidence: 'HIGH', confidenceScore: 0.94, isConfirmedByOwner: true },
      },
      status: 'SUPPLIER_CLARIFICATION_PENDING',
      isDuplicateFlagged: false,
      extractionNote: 'Supplier GSTIN missing from handwritten invoice header.',
    },

    // 6. Cross-Period Aging Discrepancy Requiring CA Attention
    {
      id: 'INV-2026-0719',
      evidenceId: 'EVD-2026-0019',
      originalPeriod: 'AUG-2026',
      currentFollowUpPeriod: 'OCT-2026',
      uploadTimestamp: '2026-08-28T18:00:00Z',
      documentFileName: 'annapoorna_grain_late_bill.pdf',
      documentType: 'PDF',
      documentSize: '1.4 MB',
      documentPreviewUrl: '',
      supplierId: 'SUP-005',
      supplierName: 'Annapoorna Grain Wholesale',
      supplierGstin: '33AABFA9912L1ZK',
      invoiceNumber: 'AGW/07/921',
      invoiceDate: '2026-07-15',
      taxableAmount: 31200,
      cgst: 0,
      sgst: 0,
      igst: 1560,
      totalAmount: 32760,
      fields: {
        supplierName: { name: 'supplierName', labelEn: 'Supplier Name', labelTa: 'விற்பனையாளர் பெயர்', extractedValue: 'Annapoorna Grain Wholesale', confidence: 'HIGH', confidenceScore: 0.95, isConfirmedByOwner: true },
        supplierGstin: { name: 'supplierGstin', labelEn: 'Supplier GSTIN', labelTa: 'விற்பனையாளர் ஜிஎஸ்டி', extractedValue: '33AABFA9912L1ZK', confidence: 'HIGH', confidenceScore: 0.97, isConfirmedByOwner: true },
        invoiceNumber: { name: 'invoiceNumber', labelEn: 'Invoice Number', labelTa: 'பில் எண்', extractedValue: 'AGW/07/921', confidence: 'HIGH', confidenceScore: 0.94, isConfirmedByOwner: true },
        invoiceDate: { name: 'invoiceDate', labelEn: 'Invoice Date', labelTa: 'பில் தேதி', extractedValue: '2026-07-15', confidence: 'NEEDS_CONFIRMATION', confidenceScore: 0.81, isConfirmedByOwner: true, notes: 'Invoice dated in July 2026, discovered and uploaded late in late August.' },
        taxableAmount: { name: 'taxableAmount', labelEn: 'Taxable Value', labelTa: 'வரிக்குரிய மதிப்பு', extractedValue: 31200, confidence: 'HIGH', confidenceScore: 0.96, isConfirmedByOwner: true },
        cgst: { name: 'cgst', labelEn: 'CGST', labelTa: 'மத்திய வரி (CGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        sgst: { name: 'sgst', labelEn: 'SGST', labelTa: 'மாநில வரி (SGST)', extractedValue: 0, confidence: 'HIGH', confidenceScore: 0.99, isConfirmedByOwner: true },
        igst: { name: 'igst', labelEn: 'IGST (5%)', labelTa: 'ஒருங்கிணைந்த வரி (IGST)', extractedValue: 1560, confidence: 'HIGH', confidenceScore: 0.96, isConfirmedByOwner: true },
        totalAmount: { name: 'totalAmount', labelEn: 'Total Invoice Value', labelTa: 'மொத்த பில் தொகை', extractedValue: 32760, confidence: 'HIGH', confidenceScore: 0.96, isConfirmedByOwner: true },
      },
      status: 'ACCOUNTANT_REVIEW_PENDING',
      isDuplicateFlagged: false,
      extractionNote: 'Time lag between transaction date (July) and filing period (August/October). Flagged for CA review.',
    }
  ];
}

export function getInitialIssues(): EvidenceIssue[] {
  return [
    {
      id: 'ISS-2026-0042',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      invoiceNumber: 'KT-8821',
      supplierName: 'Kaveri Traders',
      originalPeriod: 'AUG-2026',
      currentPeriod: 'OCT-2026',
      issueType: 'UNREADABLE_FIELD',
      titleEn: 'Faded & Smudged GSTIN on Thermal Paper Receipt',
      titleTa: 'காகித பில்லில் மங்கலான மற்றும் தெளிவற்ற ஜிஎஸ்டி எண்',
      descriptionEn: 'Thermal slip had optical heat degradation. GSTIN field confidence was 0.32. Followed up across months with clearer digital copy from supplier.',
      descriptionTa: 'வெப்ப அச்சு காகிதம் மங்கியதால் ஜிஎஸ்டி எண் படிக்க முடியவில்லை. விற்பனையாளரிடம் வாட்ஸ்அப்பில் தெளிவான நகல் பெறப்பட்டு தொடரப்பட்டது.',
      severity: 'HIGH',
      fieldAffected: 'supplierGstin',
      status: 'RESOLVED',
      detectedAt: '2026-08-12T14:35:00Z',
      resolvedAt: '2026-10-09T16:20:00Z',
      recommendedActionEn: 'Cross-period resolution complete. Accountant confirmed SYNTHETIC-GSTIN-01 in October review.',
      recommendedActionTa: 'மாதங்கள் கடந்த தீர்வு முடிந்தது. அக்டோபர் தணிக்கையில் ஆடிட்டரால் உறுதிசெய்யப்பட்டது.',
      agentReasoningEn: 'Maintained persistent issue state across Aug, Sep and Oct. Never fabricated GSTIN or guessed missing digits.',
      agentReasoningTa: 'ஆகஸ்ட், செப்டம்பர், அக்டோபர் என 3 மாதங்கள் சான்றின் நிலையைத் தக்கவைத்தது. தானாக எந்த எண்ணையும் ஊகிக்கவில்லை.',
      crossPeriodHistory: [
        { month: 'AUG-2026', status: 'EXTRACTION_UNCERTAIN', actionTaken: 'August faded invoice archived; flagged unreadable GSTIN; carried forward.', timestamp: '2026-08-12T14:35:00Z' },
        { month: 'SEP-2026', status: 'OWNER_CONFIRMATION_PENDING', actionTaken: 'Supplier clarification draft approved; clearer copy uploaded; owner confirmed SYNTHETIC-GSTIN-01.', timestamp: '2026-09-08T11:15:00Z' },
        { month: 'OCT-2026', status: 'RESOLVED', actionTaken: 'Accountant reviewed August blur & September clear PDF; confirmed value in audit pack.', timestamp: '2026-10-09T16:20:00Z' }
      ]
    },
    {
      id: 'ISS-2026-0104',
      evidenceId: 'EVD-2026-0104',
      invoiceId: 'INV-2026-0915',
      invoiceNumber: 'POM-2026-0441',
      supplierName: 'Pandian Oil Mills & Refineries',
      originalPeriod: 'SEP-2026',
      currentPeriod: 'SEP-2026',
      issueType: 'POSSIBLE_DUPLICATE',
      titleEn: 'Possible Duplicate: Matching Invoice# POM-2026-0441',
      titleTa: 'இரட்டைப் பதிவு சந்தேகம்: ஒரே பில் எண் POM-2026-0441',
      descriptionEn: 'Uploaded WhatsApp photo matches existing invoice INV-2026-0904 on Supplier, Date, Amount (₹18,400) and Invoice Number.',
      descriptionTa: 'பதிவேற்றப்பட்ட வாட்ஸ்அப் புகைப்படம் ஏற்கனவே உள்ள INV-2026-0904 பில்லுடன் விற்பனையாளர், தேதி, தொகை (₹18,400) ஒத்துப்போகிறது.',
      severity: 'HIGH',
      status: 'AWAITING_OWNER',
      detectedAt: '2026-09-15T16:46:00Z',
      recommendedActionEn: 'Open side-by-side comparison screen. Confirm whether it is a duplicate delivery copy or separate legitimate invoice.',
      recommendedActionTa: 'பக்கவாட்டு ஒப்பீட்டுத் திரையைப் பார்க்கவும். இது நகல் பில்லா அல்லது தனி பில்லா என முடிவு செய்யவும்.',
      agentReasoningEn: 'Never auto-delete or exclude records. File hash detects exact files; distinct photographs of the same bill require human verification.',
      agentReasoningTa: 'எந்த பில்லையும் தானாக அழிக்கக்கூடாது. ஒரே பில்லின் இரு வேறு புகைப்படங்களை மனிதரே ஒப்பிட்டுப் பார்த்து உறுதிசெய்ய வேண்டும்.'
    },
    {
      id: 'ISS-2026-0128',
      evidenceId: 'EVD-2026-0128',
      invoiceId: 'INV-2026-0922',
      invoiceNumber: 'VC-09-118',
      supplierName: 'Vasantham Cardamoms',
      originalPeriod: 'SEP-2026',
      currentPeriod: 'SEP-2026',
      issueType: 'MISSING_SUPPLIER_INFO',
      titleEn: 'Missing Supplier GSTIN on Handwritten Slip',
      titleTa: 'கையால் எழுதப்பட்ட பில்லில் விற்பனையாளர் ஜிஎஸ்டி விடுபட்டுள்ளது',
      descriptionEn: 'Invoice VC-09-118 is missing the 15-character GSTIN. Tax of ₹1,100 is charged without vendor tax registration credentials.',
      descriptionTa: 'VC-09-118 பில்லில் 15 இலக்க ஜிஎஸ்டி எண் இல்லை. வரி வசூலிக்கப்பட்ட போதிலும் ஜிஎஸ்டி குறிப்பிடப்படவில்லை.',
      severity: 'MEDIUM',
      fieldAffected: 'supplierGstin',
      status: 'AWAITING_OWNER',
      detectedAt: '2026-09-22T11:12:00Z',
      recommendedActionEn: 'Approve agent-drafted Tamil WhatsApp clarification text to request vendor GSTIN or updated tax invoice copy.',
      recommendedActionTa: 'விற்பனையாளரிடம் ஜிஎஸ்டி எண்ணைக் கேட்டு தானியங்கி தயாரித்த வாட்ஸ்அப் செய்திக்கு ஒப்புதல் அளிக்கவும்.',
      agentReasoningEn: 'Agent drafts context-rich message specifying invoice VC-09-118 and total ₹23,100. Awaits owner tap-to-send confirmation.',
      agentReasoningTa: 'பில் விவரங்கள் மற்றும் தொகையைக் குறிப்பிட்டு முகவர் வரைவு தயார் செய்துள்ளது. வணிகரின் ஒப்புதலுக்கு காத்திருக்கிறது.'
    },
    {
      id: 'ISS-2026-0019',
      evidenceId: 'EVD-2026-0019',
      invoiceId: 'INV-2026-0719',
      invoiceNumber: 'AGW/07/921',
      supplierName: 'Annapoorna Grain Wholesale',
      originalPeriod: 'AUG-2026',
      currentPeriod: 'OCT-2026',
      issueType: 'CROSS_PERIOD_DISCREPANCY',
      titleEn: 'Aging Purchase Evidence: July 2026 Invoice Carried Forward',
      titleTa: 'பழைய பில் சிக்கல்: ஜூலை 2026 பில் காலதாமதமாக வந்துள்ளது',
      descriptionEn: 'Invoice dated 2026-07-15 uploaded late in August; carried forward into October accountant review. Requires practitioner time-limit review.',
      descriptionTa: 'ஜூலை 2026 பில் ஆகஸ்டில் பெறப்பட்டு, தற்போது அக்டோபர் ஆடிட்டர் பார்வைக்கு வைக்கப்பட்டுள்ளது. சட்ட வரம்பிற்கு ஆடிட்டர் ஆய்வு தேவை.',
      severity: 'MEDIUM',
      fieldAffected: 'invoiceDate',
      status: 'AWAITING_ACCOUNTANT',
      detectedAt: '2026-08-28T18:05:00Z',
      recommendedActionEn: 'Accountant to review transaction timing and determine statutory ITC admissibility during October GSTR return preparation.',
      recommendedActionTa: 'அக்டோபர் வரித் தாக்கலின் போது ஆடிட்டர் இதன் கால அளவை ஆய்வு செய்து உள்ளீட்டு வரி தகுதியைத் தீர்மானிக்க வேண்டும்.',
      agentReasoningEn: 'System flags potential time-sensitive evidence for professional review. Does NOT calculate automated Section 16(4) legal conclusions.',
      agentReasoningTa: 'கால அவகாசம் தேவைப்படும் சான்றை ஆடிட்டர் பார்வைக்குக் குறிக்கிறது. தானாக எந்த சட்ட முடிவையும் எடுப்பதில்லை.'
    }
  ];
}

export function getInitialFollowUps(): SupplierFollowUp[] {
  return [
    {
      id: 'FLP-2026-001',
      issueId: 'ISS-2026-0042',
      invoiceId: 'INV-2026-0812',
      supplierName: 'Kaveri Traders',
      supplierPhone: '+91 94432 11223',
      draftMessageEn: 'Dear Kaveri Traders, Invoice KT-8821 dated 10-Aug-2026 (₹14,200) has an unreadable GSTIN on our thermal slip copy. Could you please send a clear photo or PDF copy for our GST records? Regards, Murugan Stores, Madurai.',
      draftMessageTa: 'வணக்கம் காவேரி டிரேடர்ஸ், உங்கள் 10-ஆக-2026 தேதியிட்ட KT-8821 பில்லில் (தொகை ₹14,200) ஜிஎஸ்டி எண் தெளிவாகப் படிக்க முடியவில்லை. ஜிஎஸ்டி கணக்கிற்காக இதன் தெளிவான புகைப்படம் அல்லது பிடிஎஃப் நகலை அனுப்ப முடியுமா? நன்றி, முருகன் ஸ்டோர்ஸ், மதுரை.',
      finalMessage: 'வணக்கம் காவேரி டிரேடர்ஸ், உங்கள் 10-ஆக-2026 தேதியிட்ட KT-8821 பில்லில் (தொகை ₹14,200) ஜிஎஸ்டி எண் தெளிவாகப் படிக்க முடியவில்லை. ஜிஎஸ்டி கணக்கிற்காக இதன் தெளிவான புகைப்படம் அல்லது பிடிஎஃப் நகலை அனுப்ப முடியுமா? நன்றி, முருகன் ஸ்டோர்ஸ், மதுரை.',
      languageUsed: 'ta',
      approvalStatus: 'APPROVED',
      approvedAt: '2026-09-07T10:30:00Z',
      dispatchStatus: 'SIMULATED_DISPATCHED',
      responseReceived: 'Sent clear computer bill via WhatsApp. GSTIN is SYNTHETIC-GSTIN-01.',
      responseTimestamp: '2026-09-08T09:15:00Z',
      createdAt: '2026-09-06T15:00:00Z',
    },
    {
      id: 'FLP-2026-002',
      issueId: 'ISS-2026-0128',
      invoiceId: 'INV-2026-0922',
      supplierName: 'Vasantham Cardamoms',
      supplierPhone: '+91 98410 77889',
      draftMessageEn: 'Dear Vasantham Cardamoms, regarding invoice VC-09-118 dated 20-Sep-2026 for ₹23,100, the 15-digit GSTIN is missing on the slip. Please share your registered GSTIN so our accountant can include it in the monthly review pack. Regards, Murugan Stores.',
      draftMessageTa: 'வணக்கம் வசந்தம் ஏலக்காய், 20-செப்-2026 தேதியிட்ட VC-09-118 பில்லுக்கு (தொகை ₹23,100) உங்கள் 15 இலக்க ஜிஎஸ்டி எண் ரசீதில் விடுபட்டுள்ளது. எங்கள் ஆடிட்டர் கணக்கில் சேர்க்க உங்கள் பதிவுபெற்ற ஜிஎஸ்டி எண்ணை அனுப்பவும். நன்றி, முருகன் ஸ்டோர்ஸ்.',
      languageUsed: 'ta',
      approvalStatus: 'DRAFT_PENDING_APPROVAL',
      dispatchStatus: 'NOT_SENT',
      createdAt: '2026-09-22T11:15:00Z',
    }
  ];
}

export function getInitialQueries(): AccountantQuery[] {
  return [
    {
      id: 'QRY-2026-001',
      invoiceId: 'INV-2026-0812',
      evidenceId: 'EVD-2026-0042',
      originalPeriod: 'AUG-2026',
      currentPeriod: 'OCT-2026',
      subjectEn: 'Confirm Re-extracted GSTIN for August Faded Bill KT-8821',
      subjectTa: 'ஆகஸ்ட் மங்கலான KT-8821 பில்லுக்கு செப்டம்பரில் பெறப்பட்ட ஜிஎஸ்டி எண்ணை உறுதிசெய்தல்',
      questionEn: 'Kaveri Traders bill from August had unreadable thermal GSTIN. In September, supplier shared clear PDF showing SYNTHETIC-GSTIN-01. Owner confirmed. Please inspect both attachments and record final review confirmation.',
      questionTa: 'ஆகஸ்ட் பில்லில் மங்கியிருந்த ஜிஎஸ்டி எண்ணிற்கு செப்டம்பரில் SYNTHETIC-GSTIN-01 என நகல் வந்தது. வணிகர் சரிபார்த்துள்ளார். இரு ஆவணங்களையும் பார்த்து ஆடிட்டர் உறுதிசெய்யவும்.',
      accountantResponse: 'Inspected original August thermal slip and September WhatsApp clear bill. Confirmed SYNTHETIC-GSTIN-01. Invoice total ₹14,200 is verified and added to external GSTR-2B reconciliation sheet.',
      accountantAction: 'CONFIRMED',
      status: 'RESOLVED',
      createdAt: '2026-09-09T14:00:00Z',
      resolvedAt: '2026-10-09T16:15:00Z',
    },
    {
      id: 'QRY-2026-002',
      invoiceId: 'INV-2026-0719',
      evidenceId: 'EVD-2026-0019',
      originalPeriod: 'AUG-2026',
      currentPeriod: 'OCT-2026',
      subjectEn: 'Statutory Timing Review: Annapoorna Grain July Invoice (AGW/07/921)',
      subjectTa: 'அன்னபூர்ணா கிரைன்ஸ் ஜூலை பில்லின் கால அவகாசம் குறித்த தணிக்கை கேள்வி',
      questionEn: 'Purchase occurred in mid-July 2026, but physical bill reached store in late August. Does this invoice remain eligible for current period claim?',
      questionTa: 'ஜூலை மாத பில் ஆகஸ்ட் கடைசியில் தான் கைக்கு வந்தது. இதை தற்போதைய மாதத்தில் உள்ளீட்டு வரியாகக் கோரலாமா?',
      status: 'OPEN',
      createdAt: '2026-09-28T10:00:00Z',
    }
  ];
}

export function getInitialEvents(): EvidenceEvent[] {
  return [
    {
      id: 'EVT-001',
      timestamp: '2026-08-04T10:15:00Z',
      evidenceId: 'EVD-2026-0001',
      invoiceId: 'INV-2026-0801',
      eventType: 'DOCUMENT_UPLOADED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: 'Uploaded digital invoice meenakshi_agro_aug26.pdf for Return Period AUG-2026.',
      descriptionTa: 'ஆகஸ்ட் 2026 கணக்கிற்காக meenakshi_agro_aug26.pdf பில் பதிவேற்றப்பட்டது.',
    },
    {
      id: 'EVT-002',
      timestamp: '2026-08-12T14:30:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'DOCUMENT_UPLOADED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: 'Uploaded paper receipt photo kaveri_traders_thermal_receipt.jpg for Return Period AUG-2026.',
      descriptionTa: 'ஆகஸ்ட் 2026 கணக்கிற்காக காவேரி டிரேடர்ஸ் காகித பில் புகைப்படம் பதிவேற்றப்பட்டது.',
    },
    {
      id: 'EVT-003',
      timestamp: '2026-08-12T14:35:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'FIELD_FLAGGED_UNCERTAIN',
      actor: 'SYSTEM_AGENT',
      actorName: 'Bill Saathi Agent',
      descriptionEn: 'OCR detected thermal fade. GSTIN field marked UNREADABLE (Confidence: 0.32). State set to EXTRACTION_UNCERTAIN.',
      descriptionTa: 'ஜிஎஸ்டி எண் மங்கலாக உள்ளதால் படிக்க இயலவில்லை (Confidence: 0.32). சான்று நிலை EXTRACTION_UNCERTAIN எனக் குறிக்கப்பட்டது.',
    },
    {
      id: 'EVT-004',
      timestamp: '2026-09-06T15:00:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'SUPPLIER_MESSAGE_DRAFTED',
      actor: 'SYSTEM_AGENT',
      actorName: 'Bill Saathi Agent',
      descriptionEn: 'Agent drafted Tamil WhatsApp clarification request for Kaveri Traders seeking clear invoice copy.',
      descriptionTa: 'காவேரி டிரேடர்ஸுக்கு தெளிவான பில் நகல் கேட்டு தமிழ் வாட்ஸ்அப் செய்தி வரைவு தயாரிக்கப்பட்டது.',
    },
    {
      id: 'EVT-005',
      timestamp: '2026-09-07T10:30:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'SUPPLIER_MESSAGE_APPROVED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: 'Owner reviewed and approved supplier message dispatch in simulated workflow.',
      descriptionTa: 'விற்பனையாளர் செய்தி வரைவுக்கு வணிகர் சரிபார்த்து ஒப்புதல் அளித்தார்.',
    },
    {
      id: 'EVT-006',
      timestamp: '2026-09-08T11:10:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'REPLACEMENT_DOC_UPLOADED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: 'Received clearer WhatsApp PDF from supplier; uploaded as secondary evidence linked to original August record.',
      descriptionTa: 'விற்பனையாளரிடமிருந்து வந்த தெளிவான பிடிஎஃப் நகல் அசல் ஆகஸ்ட் பில்லுடன் இணைத்து பதிவேற்றப்பட்டது.',
    },
    {
      id: 'EVT-007',
      timestamp: '2026-09-08T11:15:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'OWNER_CONFIRMED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: 'Owner confirmed extracted GSTIN SYNTHETIC-GSTIN-01 matching the clearer copy. Status ➔ ACCOUNTANT_REVIEW_PENDING.',
      descriptionTa: 'தெளிவான நகலில் உள்ள SYNTHETIC-GSTIN-01 எண்ணை வணிகர் உறுதி செய்தார்.',
    },
    {
      id: 'EVT-008',
      timestamp: '2026-09-15T16:46:00Z',
      evidenceId: 'EVD-2026-0104',
      invoiceId: 'INV-2026-0915',
      eventType: 'DUPLICATE_FLAGGED',
      actor: 'SYSTEM_AGENT',
      actorName: 'Bill Saathi Agent',
      descriptionEn: 'Possible duplicate flagged: Inv# POM-2026-0441 matches existing record EVD-2026-0089. Status set to POSSIBLE_DUPLICATE_REVIEW.',
      descriptionTa: 'இரட்டைப் பதிவு எச்சரிக்கை: POM-2026-0441 பில் ஏற்கனவே EVD-2026-0089 பதிவேட்டில் உள்ளது.',
    },
    {
      id: 'EVT-009',
      timestamp: '2026-10-09T16:20:00Z',
      evidenceId: 'EVD-2026-0042',
      invoiceId: 'INV-2026-0812',
      eventType: 'ACCOUNTANT_REVIEW_COMPLETED',
      actor: 'ACCOUNTANT',
      actorName: 'Sundaram & Co. (Tax Practitioner)',
      descriptionEn: 'Accountant reviewed August blur receipt and September clear copy. Recorded professional confirmation. Status ➔ RESOLVED.',
      descriptionTa: 'ஆடிட்டர் ஆகஸ்ட் மங்கலான பில் மற்றும் செப்டம்பர் தெளிவான நகலை ஆய்வு செய்து உறுதிப்படுத்தினார். சான்று முழுமை பெற்றது (RESOLVED).',
    }
  ];
}

// Local Storage helpers with auto-seeding
export const storage = {
  getInvoices(): Invoice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) {
      const init = getInitialInvoices();
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(init));
      return init;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialInvoices();
    }
  },

  saveInvoices(invoices: Invoice[]) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  getIssues(): EvidenceIssue[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ISSUES);
    if (!raw) {
      const init = getInitialIssues();
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(init));
      return init;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialIssues();
    }
  },

  saveIssues(issues: EvidenceIssue[]) {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  },

  getFollowUps(): SupplierFollowUp[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLLOWUPS);
    if (!raw) {
      const init = getInitialFollowUps();
      localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(init));
      return init;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialFollowUps();
    }
  },

  saveFollowUps(followUps: SupplierFollowUp[]) {
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(followUps));
  },

  getQueries(): AccountantQuery[] {
    const raw = localStorage.getItem(STORAGE_KEYS.QUERIES);
    if (!raw) {
      const init = getInitialQueries();
      localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(init));
      return init;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialQueries();
    }
  },

  saveQueries(queries: AccountantQuery[]) {
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries));
  },

  getEvents(): EvidenceEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      const init = getInitialEvents();
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(init));
      return init;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialEvents();
    }
  },

  saveEvents(events: EvidenceEvent[]) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getBusiness(): Business {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    if (!raw) return INITIAL_BUSINESS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BUSINESS;
    }
  },

  saveBusiness(biz: Business) {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(biz));
  },

  getActivePeriod(): ReturnPeriod {
    return (localStorage.getItem(STORAGE_KEYS.PERIOD) as ReturnPeriod) || 'OCT-2026';
  },

  setActivePeriod(period: ReturnPeriod) {
    localStorage.setItem(STORAGE_KEYS.PERIOD, period);
  },

  getLanguage(): 'en' | 'ta' {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'en' | 'ta') || 'en';
  },

  setLanguage(lang: 'en' | 'ta') {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  resetAllDemoData() {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(getInitialInvoices()));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(getInitialIssues()));
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(getInitialFollowUps()));
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(getInitialQueries()));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(getInitialEvents()));
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(INITIAL_BUSINESS));
    localStorage.setItem(STORAGE_KEYS.PERIOD, 'OCT-2026');
  }
};
