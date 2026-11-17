import React, { useState } from 'react';
import { useApp } from '../context';
import { t } from '../translations';
import { 
  Settings, Building2, Globe, ShieldAlert, CheckCircle2, 
  RefreshCw, Save, Layers, UserCheck, Phone, MapPin
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { business, updateBusiness, resetDemoData, setLanguage, showToast, language } = useApp();
  const strings = t[language];
  
  const [name, setName] = useState(business.name);
  const [tradeName, setTradeName] = useState(business.tradeName);
  const [gstin, setGstin] = useState(business.gstin);
  const [address, setAddress] = useState(business.address);
  const [contactPhone, setContactPhone] = useState(business.contactPhone);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      name,
      tradeName,
      gstin,
      address,
      contactPhone
    });
    showToast('Business profile and taxpayer records updated in ledger!', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data to initial Tech4Bharat benchmark dataset? This will restore original August-October cases.')) {
      resetDemoData();
      showToast('Demo database restored to default benchmark state!', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 uppercase tracking-wider">
            Configuration & Audit Governance
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">System Profile & Integrity</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          {strings.nav.settings}
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Manage micro-enterprise identity, interface language, and review the technical compliance matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Business Profile Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Taxpayer Business Information
            </h3>

            <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Trade Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State GSTIN (15 Digits)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  maxLength={15}
                  required
                />
                <p className="text-[11px] text-slate-400 mt-0.5">State code 33 corresponds to Tamil Nadu.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Description / Sub-title</label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Principal Place of Business</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Business Profile
                </button>
              </div>
            </form>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Restore Benchmark Demo Dataset</h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Reset the local browser database back to the initial Tech4Bharat benchmark dataset. 
                  This restores the August-October cross-period lifecycle, synthetic invoices, and sample supplier queries.
                </p>
                <button
                  onClick={handleResetData}
                  className="mt-3 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Benchmark State
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Implementation Matrix for Hackathon Jury */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Evaluation Matrix: Actual vs Simulated
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In accordance with Tech4Bharat jury evaluation guidelines, the table below provides transparent disclosure of what is implemented, what is simulated for demonstration, and what is excluded by domain design.
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-2.5 text-left">Capability Area</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-left">Technical Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Cross-Period Ledger</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        IMPLEMENTED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      Immutable origin binding across August ➔ October reporting cycles.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Non-Destructive Overwrite</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        IMPLEMENTED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      Preserves extracted raw OCR alongside owner corrections & CA values.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Vernacular Tamil Interface</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        IMPLEMENTED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      Full dual-language toggle with natural Tamil business translations.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Accountant PDF Pack</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        IMPLEMENTED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      Client-side 10-point dossier generation via jsPDF + autoTable.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Supplier WhatsApp API</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        SIMULATED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      Simulated dispatch sandbox; actual WhatsApp Cloud API ready for token.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Direct GSTN Portal Filing</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        EXCLUDED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      By design. Filing remains the licensed domain of the Chartered Accountant.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-2.5 font-medium text-slate-900">Automatic ITC Final Claim</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        EXCLUDED
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">
                      Section 16 statutory qualification requires CA professional sign-off.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900">
              <strong>Domain Architecture Summary:</strong> Bill Saathi positions itself strictly as an <em>evidence collection and resolution pipeline</em> rather than an ERP or filing bot, ensuring high reliability and zero legal liability for unauthorized tax filing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
