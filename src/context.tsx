import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Invoice,
  EvidenceIssue,
  SupplierFollowUp,
  AccountantQuery,
  EvidenceEvent,
  Business,
  ReturnPeriod,
  Language,
  ActiveTab,
  EvidenceStatus
} from './types';
import { storage } from './storage';
import { t } from './translations';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activePeriod: ReturnPeriod;
  setActivePeriod: (period: ReturnPeriod) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  business: Business;
  invoices: Invoice[];
  issues: EvidenceIssue[];
  followUps: SupplierFollowUp[];
  queries: AccountantQuery[];
  events: EvidenceEvent[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Actions
  addInvoice: (invoice: Invoice, newEvents?: EvidenceEvent[]) => void;
  updateInvoiceField: (invoiceId: string, fieldName: string, newValue: any) => void;
  confirmInvoiceFields: (invoiceId: string) => void;
  resolveIssue: (issueId: string, resolutionNote: string) => void;
  approveFollowUp: (followUpId: string) => void;
  rejectFollowUp: (followUpId: string) => void;
  recordSupplierResponse: (followUpId: string, responseNote: string, replacementDocName?: string) => void;
  resolveAccountantQuery: (queryId: string, response: string, action: 'CONFIRMED' | 'ADJUSTED' | 'FLAGGED_FOR_FOLLOWUP' | 'INELIGIBLE_ITC') => void;
  addAccountantQuery: (query: Omit<AccountantQuery, 'id' | 'createdAt' | 'status'>) => void;
  resolveDuplicate: (duplicateInvoiceId: string, decision: 'SEPARATE_LEGITIMATE' | 'CONFIRMED_DUPLICATE') => void;
  logEvent: (event: Omit<EvidenceEvent, 'id' | 'timestamp'>) => void;
  resetDemoData: () => void;
  updateBusiness: (updates: Partial<Business>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(storage.getLanguage());
  const [activePeriod, setActivePeriodState] = useState<ReturnPeriod>(storage.getActivePeriod());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [business, setBusiness] = useState<Business>(storage.getBusiness());
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());
  const [issues, setIssues] = useState<EvidenceIssue[]>(storage.getIssues());
  const [followUps, setFollowUps] = useState<SupplierFollowUp[]>(storage.getFollowUps());
  const [queries, setQueries] = useState<AccountantQuery[]>(storage.getQueries());
  const [events, setEvents] = useState<EvidenceEvent[]>(storage.getEvents());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setLanguage = (lang: Language) => {
    storage.setLanguage(lang);
    setLanguageState(lang);
  };

  const setActivePeriod = (period: ReturnPeriod) => {
    storage.setActivePeriod(period);
    setActivePeriodState(period);
    showToast(`Active return period switched to ${period}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logEvent = (eventData: Omit<EvidenceEvent, 'id' | 'timestamp'>) => {
    const newEvent: EvidenceEvent = {
      ...eventData,
      id: 'EVT-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
    };
    const updated = [newEvent, ...events];
    setEvents(updated);
    storage.saveEvents(updated);
  };

  const addInvoice = (invoice: Invoice, newEvents?: EvidenceEvent[]) => {
    const updated = [invoice, ...invoices];
    setInvoices(updated);
    storage.saveInvoices(updated);

    if (newEvents && newEvents.length > 0) {
      const updatedEvents = [...newEvents, ...events];
      setEvents(updatedEvents);
      storage.saveEvents(updatedEvents);
    }

    // Auto-create issue if duplicate or unreadable
    if (invoice.isDuplicateFlagged) {
      const dupIssue: EvidenceIssue = {
        id: 'ISS-' + Date.now().toString().slice(-6),
        evidenceId: invoice.evidenceId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        supplierName: invoice.supplierName,
        originalPeriod: invoice.originalPeriod,
        currentPeriod: invoice.currentFollowUpPeriod,
        issueType: 'POSSIBLE_DUPLICATE',
        titleEn: `Possible Duplicate: ${invoice.invoiceNumber}`,
        titleTa: `இரட்டைப் பதிவு சந்தேகம்: ${invoice.invoiceNumber}`,
        descriptionEn: `Uploaded document matches existing invoice ${invoice.duplicateOfInvoiceId} on supplier, date, and amount.`,
        descriptionTa: `பதிவேற்றப்பட்ட ஆவணம் ஏற்கனவே உள்ள ${invoice.duplicateOfInvoiceId} பில்லுடன் ஒத்துப்போகிறது.`,
        severity: 'HIGH',
        status: 'AWAITING_OWNER',
        detectedAt: new Date().toISOString(),
        recommendedActionEn: 'Review side-by-side comparison. Confirm if duplicate copy or separate delivery.',
        recommendedActionTa: 'ஒப்பீட்டுத் திரையைப் பார்த்து இரட்டைப் பதிவா அல்லது தனி பில்லா எனத் தீர்மானிக்கவும்.',
        agentReasoningEn: 'Multi-attribute matching indicates potential double entry. Requires explicit owner confirmation.',
        agentReasoningTa: 'ஒரே விற்பனையாளர் மற்றும் தொகை உள்ளதால் இரட்டைப் பதிவு சந்தேகம் உள்ளது.',
      };
      const updatedIssues = [dupIssue, ...issues];
      setIssues(updatedIssues);
      storage.saveIssues(updatedIssues);
    }

    showToast(`Invoice ${invoice.id} saved to Evidence Ledger (${invoice.originalPeriod})`, 'success');
  };

  const updateInvoiceField = (invoiceId: string, fieldName: string, newValue: any) => {
    const updated = invoices.map((inv) => {
      if (inv.id !== invoiceId) return inv;
      const field = (inv.fields as any)[fieldName];
      if (!field) return inv;

      const updatedField = {
        ...field,
        ownerValue: newValue,
        isConfirmedByOwner: true,
      };

      // Recalculate totals if taxable or taxes edited
      let newTaxable = inv.taxableAmount;
      let newCgst = inv.cgst;
      let newSgst = inv.sgst;
      let newIgst = inv.igst;

      if (fieldName === 'taxableAmount') newTaxable = Number(newValue) || 0;
      if (fieldName === 'cgst') newCgst = Number(newValue) || 0;
      if (fieldName === 'sgst') newSgst = Number(newValue) || 0;
      if (fieldName === 'igst') newIgst = Number(newValue) || 0;
      const newTotal = newTaxable + newCgst + newSgst + newIgst;

      return {
        ...inv,
        taxableAmount: newTaxable,
        cgst: newCgst,
        sgst: newSgst,
        igst: newIgst,
        totalAmount: fieldName === 'totalAmount' ? (Number(newValue) || newTotal) : newTotal,
        fields: {
          ...inv.fields,
          [fieldName]: updatedField,
        },
      };
    });

    setInvoices(updated);
    storage.saveInvoices(updated);

    logEvent({
      evidenceId: invoices.find((i) => i.id === invoiceId)?.evidenceId || invoiceId,
      invoiceId,
      eventType: 'OWNER_FIELD_CORRECTED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: `Owner manually edited field ${fieldName} to "${newValue}". Original extracted value preserved in ledger.`,
      descriptionTa: `வணிகர் ${fieldName} மதிப்பை "${newValue}" என மாற்றினார். அசல் மதிப்பு பாதுகாக்கப்பட்டுள்ளது.`,
    });

    showToast(`Field ${fieldName} updated. Original extraction preserved.`, 'info');
  };

  const confirmInvoiceFields = (invoiceId: string) => {
    const updated = invoices.map((inv) => {
      if (inv.id !== invoiceId) return inv;
      return {
        ...inv,
        status: 'ACCOUNTANT_REVIEW_PENDING' as EvidenceStatus,
        fields: Object.keys(inv.fields).reduce((acc, k) => {
          const f = (inv.fields as any)[k];
          acc[k] = { ...f, isConfirmedByOwner: true };
          return acc;
        }, {} as any),
      };
    });

    setInvoices(updated);
    storage.saveInvoices(updated);

    logEvent({
      evidenceId: invoices.find((i) => i.id === invoiceId)?.evidenceId || invoiceId,
      invoiceId,
      eventType: 'OWNER_CONFIRMED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: `Owner confirmed all extracted fields for invoice ${invoiceId}. Status set to ACCOUNTANT_REVIEW_PENDING.`,
      descriptionTa: `வணிகர் ${invoiceId} பில்லின் விவரங்களை உறுதி செய்தார். ஆடிட்டர் பார்வைக்கு அனுப்பப்பட்டது.`,
    });

    showToast(`Invoice ${invoiceId} confirmed by owner! Ready for CA review.`, 'success');
  };

  const resolveIssue = (issueId: string, resolutionNote: string) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) return;

    const updatedIssues = issues.map((iss) => {
      if (iss.id !== issueId) return iss;
      return {
        ...iss,
        status: 'RESOLVED' as const,
        resolvedAt: new Date().toISOString(),
        recommendedActionEn: `Resolved: ${resolutionNote}`,
        recommendedActionTa: `தீர்வு: ${resolutionNote}`,
      };
    });
    setIssues(updatedIssues);
    storage.saveIssues(updatedIssues);

    // Update corresponding invoice status
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id !== targetIssue.invoiceId) return inv;
      return {
        ...inv,
        status: 'RESOLVED' as EvidenceStatus,
      };
    });
    setInvoices(updatedInvoices);
    storage.saveInvoices(updatedInvoices);

    logEvent({
      evidenceId: targetIssue.evidenceId,
      invoiceId: targetIssue.invoiceId,
      eventType: 'ISSUE_RESOLVED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: `Evidence issue ${issueId} resolved: ${resolutionNote}`,
      descriptionTa: `சான்று சிக்கல் ${issueId} தீர்க்கப்பட்டது: ${resolutionNote}`,
    });

    showToast(`Issue ${issueId} marked as RESOLVED`, 'success');
  };

  const approveFollowUp = (followUpId: string) => {
    const updatedFollowUps = followUps.map((flp) => {
      if (flp.id !== followUpId) return flp;
      return {
        ...flp,
        approvalStatus: 'APPROVED' as const,
        approvedAt: new Date().toISOString(),
        dispatchStatus: 'SIMULATED_DISPATCHED' as const,
      };
    });
    setFollowUps(updatedFollowUps);
    storage.saveFollowUps(updatedFollowUps);

    const flp = followUps.find((f) => f.id === followUpId);
    if (flp) {
      logEvent({
        evidenceId: flp.invoiceId,
        invoiceId: flp.invoiceId,
        eventType: 'SUPPLIER_MESSAGE_APPROVED',
        actor: 'OWNER',
        actorName: 'Murugan (Owner)',
        descriptionEn: `Owner approved dispatch of clarification message to ${flp.supplierName} (Simulated Dispatch).`,
        descriptionTa: `${flp.supplierName} விற்பனையாளருக்கு வாட்ஸ்அப் செய்தி அனுப்ப வணிகர் ஒப்புதல் அளித்தார்.`,
      });
    }

    showToast('Supplier clarification message approved! (Simulated dispatch recorded)', 'success');
  };

  const rejectFollowUp = (followUpId: string) => {
    const updated = followUps.map((flp) => (flp.id === followUpId ? { ...flp, approvalStatus: 'REJECTED' as const } : flp));
    setFollowUps(updated);
    storage.saveFollowUps(updated);
    showToast('Supplier draft message rejected', 'info');
  };

  const recordSupplierResponse = (followUpId: string, responseNote: string, replacementDocName?: string) => {
    const targetFlp = followUps.find((f) => f.id === followUpId);
    if (!targetFlp) return;

    const updated = followUps.map((flp) => {
      if (flp.id !== followUpId) return flp;
      return {
        ...flp,
        responseReceived: responseNote,
        responseTimestamp: new Date().toISOString(),
      };
    });
    setFollowUps(updated);
    storage.saveFollowUps(updated);

    // Update target invoice if replacement or clearer info received
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id !== targetFlp.invoiceId) return inv;
      return {
        ...inv,
        status: 'OWNER_CONFIRMATION_PENDING' as EvidenceStatus,
        documentFileName: replacementDocName || inv.documentFileName,
      };
    });
    setInvoices(updatedInvoices);
    storage.saveInvoices(updatedInvoices);

    logEvent({
      evidenceId: targetFlp.invoiceId,
      invoiceId: targetFlp.invoiceId,
      eventType: 'REPLACEMENT_DOC_UPLOADED',
      actor: 'SUPPLIER',
      actorName: targetFlp.supplierName,
      descriptionEn: `Supplier response recorded: "${responseNote}". Clearer document reference attached.`,
      descriptionTa: `விற்பனையாளர் அளித்த பதில் பதியப்பட்டது: "${responseNote}".`,
    });

    showToast('Supplier response recorded into persistent audit trail', 'success');
  };

  const resolveAccountantQuery = (
    queryId: string,
    response: string,
    action: 'CONFIRMED' | 'ADJUSTED' | 'FLAGGED_FOR_FOLLOWUP' | 'INELIGIBLE_ITC'
  ) => {
    const targetQuery = queries.find((q) => q.id === queryId);
    if (!targetQuery) return;

    const updatedQueries = queries.map((q) => {
      if (q.id !== queryId) return q;
      return {
        ...q,
        accountantResponse: response,
        accountantAction: action,
        status: 'RESOLVED' as const,
        resolvedAt: new Date().toISOString(),
      };
    });
    setQueries(updatedQueries);
    storage.saveQueries(updatedQueries);

    // Update invoice status accordingly
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id !== targetQuery.invoiceId) return inv;
      return {
        ...inv,
        status: action === 'CONFIRMED' ? ('RESOLVED' as EvidenceStatus) : ('ACCOUNTANT_REVIEW_PENDING' as EvidenceStatus),
      };
    });
    setInvoices(updatedInvoices);
    storage.saveInvoices(updatedInvoices);

    logEvent({
      evidenceId: targetQuery.evidenceId,
      invoiceId: targetQuery.invoiceId,
      eventType: 'ACCOUNTANT_REVIEW_COMPLETED',
      actor: 'ACCOUNTANT',
      actorName: 'Sundaram & Co. (Tax Practitioner)',
      descriptionEn: `Accountant recorded professional action [${action}]: "${response}".`,
      descriptionTa: `ஆடிட்டர் தணிக்கை முடிவு பதிவு செய்தார் [${action}]: "${response}".`,
    });

    showToast(`Accountant review decision recorded: ${action}`, 'success');
  };

  const addAccountantQuery = (queryData: Omit<AccountantQuery, 'id' | 'createdAt' | 'status'>) => {
    const newQuery: AccountantQuery = {
      ...queryData,
      id: 'QRY-' + Date.now().toString().slice(-6),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    const updated = [newQuery, ...queries];
    setQueries(updated);
    storage.saveQueries(updated);

    logEvent({
      evidenceId: queryData.evidenceId,
      invoiceId: queryData.invoiceId,
      eventType: 'ACCOUNTANT_QUERY_CREATED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: `Created accountant query: "${queryData.subjectEn}".`,
      descriptionTa: `ஆடிட்டருக்கு கேள்வி அனுப்பப்பட்டது: "${queryData.subjectTa}".`,
    });

    showToast('Query submitted to Accountant Workspace', 'success');
  };

  const resolveDuplicate = (duplicateInvoiceId: string, decision: 'SEPARATE_LEGITIMATE' | 'CONFIRMED_DUPLICATE') => {
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id !== duplicateInvoiceId) return inv;
      return {
        ...inv,
        status: decision === 'SEPARATE_LEGITIMATE' ? ('OWNER_CONFIRMATION_PENDING' as EvidenceStatus) : ('RESOLVED' as EvidenceStatus),
        isDuplicateFlagged: decision === 'CONFIRMED_DUPLICATE',
        extractionNote: decision === 'SEPARATE_LEGITIMATE'
          ? 'Confirmed by owner as separate legitimate delivery batch.'
          : 'Confirmed by owner as duplicate invoice copy. Both documents retained in audit history.',
      };
    });
    setInvoices(updatedInvoices);
    storage.saveInvoices(updatedInvoices);

    // Resolve issue
    const targetIssue = issues.find((i) => i.invoiceId === duplicateInvoiceId && i.issueType === 'POSSIBLE_DUPLICATE');
    if (targetIssue) {
      resolveIssue(targetIssue.id, decision === 'SEPARATE_LEGITIMATE' ? 'Owner confirmed separate legitimate batch' : 'Owner confirmed duplicate copy');
    }

    logEvent({
      evidenceId: duplicateInvoiceId,
      invoiceId: duplicateInvoiceId,
      eventType: 'OWNER_CONFIRMED',
      actor: 'OWNER',
      actorName: 'Murugan (Owner)',
      descriptionEn: `Owner reviewed possible duplicate alert: Marked as ${decision}. Both document references preserved.`,
      descriptionTa: `இரட்டைப் பதிவு சந்தேகம் வணிகரால் தீர்க்கப்பட்டது: ${decision}.`,
    });

    showToast(`Duplicate review saved: ${decision === 'SEPARATE_LEGITIMATE' ? 'Separate Invoices' : 'Confirmed Duplicate'}`, 'success');
  };

  const resetDemoData = () => {
    storage.resetAllDemoData();
    setInvoices(storage.getInvoices());
    setIssues(storage.getIssues());
    setFollowUps(storage.getFollowUps());
    setQueries(storage.getQueries());
    setEvents(storage.getEvents());
    setBusiness(storage.getBusiness());
    setActivePeriodState('OCT-2026');
    showToast('Application reset to initial demo state (5 seeded invoices + Aug-Oct journey)', 'info');
  };

  const updateBusiness = (updates: Partial<Business>) => {
    const updated = { ...business, ...updates };
    setBusiness(updated);
    storage.saveBusiness(updated);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activePeriod,
        setActivePeriod,
        activeTab,
        setActiveTab,
        business,
        invoices,
        issues,
        followUps,
        queries,
        events,
        toasts,
        showToast,
        dismissToast,
        addInvoice,
        updateInvoiceField,
        confirmInvoiceFields,
        resolveIssue,
        approveFollowUp,
        rejectFollowUp,
        recordSupplierResponse,
        resolveAccountantQuery,
        addAccountantQuery,
        resolveDuplicate,
        logEvent,
        resetDemoData,
        updateBusiness,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
