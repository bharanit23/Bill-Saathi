export type Language = 'en' | 'ta';

export type ReturnPeriod = 'AUG-2026' | 'SEP-2026' | 'OCT-2026' | 'NOV-2026';

export type FieldConfidence = 'HIGH' | 'NEEDS_CONFIRMATION' | 'MISSING' | 'UNREADABLE';

export type EvidenceStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'EXTRACTION_UNCERTAIN'
  | 'OWNER_CONFIRMATION_PENDING'
  | 'EVIDENCE_INCOMPLETE'
  | 'SUPPLIER_CLARIFICATION_PENDING'
  | 'ACCOUNTANT_REVIEW_PENDING'
  | 'RESOLVED'
  | 'POSSIBLE_DUPLICATE_REVIEW';

export interface Business {
  id: string;
  name: string;
  tradeName: string;
  gstin: string; // Synthetic
  state: string;
  address: string;
  contactPhone: string;
}

export interface Supplier {
  id: string;
  name: string;
  gstin?: string; // Synthetic
  phone: string;
  address: string;
  state: string;
  isRegularVendor: boolean;
}

export interface InvoiceField<T = string | number> {
  name: string;
  labelEn: string;
  labelTa: string;
  extractedValue: T;
  ownerValue?: T;
  accountantValue?: T;
  confidence: FieldConfidence;
  confidenceScore: number; // 0.0 to 1.0
  isConfirmedByOwner: boolean;
  notes?: string;
}

export interface Invoice {
  id: string; // e.g., 'INV-2026-0812'
  evidenceId: string; // e.g., 'EVD-2026-0042'
  originalPeriod: ReturnPeriod; // Immutable original transaction period
  currentFollowUpPeriod: ReturnPeriod;
  uploadTimestamp: string;
  documentFileName: string;
  documentType: 'PDF' | 'JPEG' | 'PNG';
  documentSize: string;
  documentPreviewUrl: string; // Base64 or synthetic mock visual
  supplierId: string;
  supplierName: string;
  supplierGstin: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  fields: {
    supplierName: InvoiceField<string>;
    supplierGstin: InvoiceField<string>;
    invoiceNumber: InvoiceField<string>;
    invoiceDate: InvoiceField<string>;
    taxableAmount: InvoiceField<number>;
    cgst: InvoiceField<number>;
    sgst: InvoiceField<number>;
    igst: InvoiceField<number>;
    totalAmount: InvoiceField<number>;
  };
  status: EvidenceStatus;
  isDuplicateFlagged: boolean;
  duplicateOfInvoiceId?: string;
  duplicateMatchReasons?: string[];
  extractionNote?: string;
}

export interface EvidenceIssue {
  id: string;
  evidenceId: string;
  invoiceId: string;
  invoiceNumber: string;
  supplierName: string;
  originalPeriod: ReturnPeriod;
  currentPeriod: ReturnPeriod;
  issueType: 'UNREADABLE_FIELD' | 'MISSING_SUPPLIER_INFO' | 'POSSIBLE_DUPLICATE' | 'CROSS_PERIOD_DISCREPANCY';
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  fieldAffected?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'AWAITING_OWNER' | 'AWAITING_SUPPLIER' | 'AWAITING_ACCOUNTANT' | 'RESOLVED';
  detectedAt: string;
  resolvedAt?: string;
  recommendedActionEn: string;
  recommendedActionTa: string;
  agentReasoningEn: string;
  agentReasoningTa: string;
  crossPeriodHistory?: {
    month: ReturnPeriod;
    status: EvidenceStatus;
    actionTaken: string;
    timestamp: string;
  }[];
}

export interface SupplierFollowUp {
  id: string;
  issueId: string;
  invoiceId: string;
  supplierName: string;
  supplierPhone: string;
  draftMessageEn: string;
  draftMessageTa: string;
  finalMessage?: string;
  languageUsed: Language;
  approvalStatus: 'DRAFT_PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  dispatchStatus: 'SIMULATED_DISPATCHED' | 'NOT_SENT';
  responseReceived?: string;
  responseTimestamp?: string;
  createdAt: string;
}

export interface AccountantQuery {
  id: string;
  invoiceId: string;
  evidenceId: string;
  originalPeriod: ReturnPeriod;
  currentPeriod: ReturnPeriod;
  subjectEn: string;
  subjectTa: string;
  questionEn: string;
  questionTa: string;
  accountantResponse?: string;
  accountantAction?: 'CONFIRMED' | 'ADJUSTED' | 'FLAGGED_FOR_FOLLOWUP' | 'INELIGIBLE_ITC';
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
}

export interface EvidenceEvent {
  id: string;
  timestamp: string;
  evidenceId: string;
  invoiceId?: string;
  eventType:
    | 'DOCUMENT_UPLOADED'
    | 'EXTRACTION_COMPLETED'
    | 'FIELD_FLAGGED_UNCERTAIN'
    | 'OWNER_FIELD_CORRECTED'
    | 'OWNER_CONFIRMED'
    | 'DUPLICATE_FLAGGED'
    | 'SUPPLIER_MESSAGE_DRAFTED'
    | 'SUPPLIER_MESSAGE_APPROVED'
    | 'REPLACEMENT_DOC_UPLOADED'
    | 'ACCOUNTANT_QUERY_CREATED'
    | 'ACCOUNTANT_REVIEW_COMPLETED'
    | 'ISSUE_RESOLVED'
    | 'EVIDENCE_PACK_GENERATED';
  actor: 'OWNER' | 'SYSTEM_AGENT' | 'SUPPLIER' | 'ACCOUNTANT';
  actorName: string;
  descriptionEn: string;
  descriptionTa: string;
  metadata?: Record<string, any>;
}

export type ActiveTab =
  | 'dashboard'
  | 'invoices'
  | 'upload'
  | 'ledger'
  | 'resolution'
  | 'followups'
  | 'accountant'
  | 'evidence_packs'
  | 'audit_history'
  | 'settings';
