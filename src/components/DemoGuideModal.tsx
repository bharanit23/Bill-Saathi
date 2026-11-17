import React, { useState } from 'react';
import { useApp } from '../context';
import { ActiveTab } from '../types';
import { 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, X, 
  ExternalLink, Layers, Compass, BookOpen, ShieldCheck 
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: {
    title: string;
    subtitle: string;
    targetTab: ActiveTab;
    tabLabel: string;
    content: string;
    talkingPoint: string;
    badge: string;
  }[] = [
    {
      title: '1. The Problem Space (PS 3.1)',
      subtitle: 'Micro-Enterprises Lose Time & Profit to Paperwork',
      targetTab: 'dashboard',
      tabLabel: 'Open Dashboard',
      content: 'Small traders receive bills via crumpled paper receipts, WhatsApp photos, and messages. Over 15-20 hours/month are spent chasing invoices, costing ₹1,500-₹3,000 per filing in accountant fees. Bill Saathi addresses the chaos before filing begins.',
      talkingPoint: 'Notice how the dashboard computes live health metrics, pending actions, and active cross-period cases without any hardcoded values.',
      badge: 'Theme 3: MSME Finance'
    },
    {
      title: '2. Intake & Confidence-Scored Extraction',
      subtitle: 'Simulated Computer Vision with Field Integrity',
      targetTab: 'upload',
      tabLabel: 'Open Bill Upload',
      content: 'Owners can drop physical receipt photos or PDFs. The system simulates OCR extraction with explicit field-by-field confidence scores (Green 95%+, Amber 70-94%, Red <70%), clearly badged as Synthetic Data for hackathon honesty.',
      talkingPoint: 'Demonstrate dragging or clicking sample receipts to see immediate bounding boxes and extracted fields ready for review.',
      badge: 'Intake Engine'
    },
    {
      title: '3. Non-Destructive Overwrites & Confirmation',
      subtitle: 'Raw OCR is Preserved Alongside Owner & CA Edits',
      targetTab: 'invoices',
      tabLabel: 'Open Invoices Ledger',
      content: 'Unlike typical apps that overwrite database fields, Bill Saathi stores raw extracted values permanently. If the owner corrects a typo or the CA overrides a tax classification, all three values remain visible and audited.',
      talkingPoint: 'Click on any invoice (e.g. INV-2026-0922) to inspect the 3-column value comparison (Raw Extracted vs Owner vs Accountant).',
      badge: 'Core Data Contract'
    },
    {
      title: '4. The Moat: Persistent Cross-Period Ledger',
      subtitle: 'August ➔ September ➔ October Issue Resolution',
      targetTab: 'ledger',
      tabLabel: 'Open Cross-Period Ledger',
      content: 'Small businesses discover August bills in October. Bill Saathi binds the original transaction period immutably while tracking follow-ups in the current period. Review the live Kaveri Traders interactive lifecycle.',
      talkingPoint: 'This is the fundamental differentiator. It stops accountants from having to re-audit 3 months of historical files.',
      badge: 'Architectural Moat'
    },
    {
      title: '5. Agentic Vernacular Clarification',
      subtitle: 'Tamil WhatsApp & English Auditor Drafts',
      targetTab: 'followups',
      tabLabel: 'Open Clarification Hub',
      content: 'When an issue is flagged (e.g. unreadable bill or missing GSTIN), the autonomous agent loop drafts dual-language messages: colloquial, respectful Tamil for the supplier and structured English for the accountant file.',
      talkingPoint: 'Show the Tamil WhatsApp draft for Kaveri Traders asking for the clear credit note.',
      badge: 'Autonomous Agent'
    },
    {
      title: '6. Accountant Handoff Pack Generator',
      subtitle: '10-Point Evidence Dossier with PDF Export',
      targetTab: 'evidence_packs',
      tabLabel: 'Open Evidence Pack',
      content: 'Bill Saathi generates a complete 10-point audit-ready dossier and real client-side PDF complete with statutory watermark: "PREPARED FOR ACCOUNTANT REVIEW — NOT A FILED GST RETURN".',
      talkingPoint: 'Click "Download Official PDF Pack" to see a live compiled PDF document generated in real-time.',
      badge: 'Deliverable Output'
    }
  ];

  const current = steps[currentStep];

  const handleJumpToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {current.badge}
                </span>
                <span className="text-xs text-slate-400">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{current.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
            {current.content}
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Demo Talking Point for Hackathon Jury
            </h4>
            <p className="text-xs text-emerald-900 mt-1.5 leading-relaxed">
              {current.talkingPoint}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleJumpToTab(current.targetTab)}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-lg transition-colors border border-indigo-200"
            >
              <ExternalLink className="w-4 h-4" />
              Jump to Screen: {current.tabLabel}
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentStep === i ? 'w-6 bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-30 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Start Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
