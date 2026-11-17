import React, { useState } from 'react';
import { useApp } from '../context';
import { EvidenceEvent } from '../types';
import { t } from '../translations';
import { 
  History, ShieldCheck, Filter, Search, User, 
  Cpu, Briefcase, MessageSquare, Download
} from 'lucide-react';

export const AuditHistoryView: React.FC = () => {
  const { events, showToast, language } = useApp();
  const strings = t[language];
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter(event => {
    const matchesActor = actorFilter === 'all' || event.actor.toLowerCase() === actorFilter.toLowerCase();
    const matchesSearch = (language === 'ta' ? event.descriptionTa : event.descriptionEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.invoiceId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesActor && matchesSearch;
  });

  const getActorBadge = (actor: EvidenceEvent['actor']) => {
    switch (actor) {
      case 'OWNER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <User className="w-3 h-3" /> Micro-Trader Owner
          </span>
        );
      case 'SYSTEM_AGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Cpu className="w-3 h-3" /> Autonomous Agent
          </span>
        );
      case 'ACCOUNTANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            <Briefcase className="w-3 h-3" /> Chartered Accountant
          </span>
        );
      case 'SUPPLIER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <MessageSquare className="w-3 h-3" /> External Supplier
          </span>
        );
      default:
        return null;
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Invoice ID', 'Actor', 'Actor Name', 'Event Type', 'Description'];
    const rows = filteredEvents.map(e => [
      `"${new Date(e.timestamp).toISOString()}"`,
      `"${e.invoiceId || '-'}"`,
      `"${e.actor}"`,
      `"${e.actorName}"`,
      `"${e.eventType}"`,
      `"${(language === 'ta' ? e.descriptionTa : e.descriptionEn).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BillSaathi_AuditLedger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit Log exported to CSV successfully.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white uppercase tracking-wider">
              Immutable Audit Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Non-Repudiation Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700" />
            {strings.nav.auditHistory}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Every extraction, owner confirmation, supplier clarification, and accountant verification logged with timestamp and actor identity.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail by invoice ID, keywords or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            >
              <option value="all">All Actors</option>
              <option value="owner">Trader (Owner)</option>
              <option value="system_agent">Autonomous Agent</option>
              <option value="accountant">Accountant / CA</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Timeline / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Append-Only Evidence Event Stream ({filteredEvents.length} records)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Zero-Delete Storage Engine
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit events match your criteria.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {event.invoiceId && (
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {event.invoiceId}
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      {event.eventType}
                    </span>
                    {getActorBadge(event.actor)}
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {language === 'ta' ? event.descriptionTa : event.descriptionEn}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
