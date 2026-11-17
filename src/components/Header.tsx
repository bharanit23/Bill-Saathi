import React from 'react';
import { Languages, Calendar, PlusCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context';
import { t } from '../translations';
import { ReturnPeriod } from '../types';

export const Header: React.FC = () => {
  const { language, setLanguage, activePeriod, setActivePeriod, setActiveTab } = useApp();
  const strings = t[language];

  const periods: ReturnPeriod[] = ['AUG-2026', 'SEP-2026', 'OCT-2026', 'NOV-2026'];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
      {/* Top Hackathon & Disclaimer Banner */}
      <div className="bg-[#14263D] text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-medium border-b border-[#247C78]/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-teal-300">{strings.app.demoBanner}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-gray-300 text-[10.5px]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>{strings.app.notFilingApp}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Product Title & Active Period indicator */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-[#14263D] tracking-tight">{strings.app.name}</h1>
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">| {strings.app.subtitle}</span>
            </div>
            <p className="text-[11px] text-gray-500 italic hidden lg:block">{strings.app.tagline}</p>
          </div>
        </div>

        {/* Right Controls: Period Selector, Language Toggle, Quick Action */}
        <div className="flex items-center gap-3">
          {/* Return Period Picker */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-500 ml-1" />
            <span className="text-[11px] font-medium text-gray-500 hidden sm:inline">{strings.app.currentPeriod}:</span>
            <select
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value as ReturnPeriod)}
              className="bg-white border border-gray-300 rounded px-2 py-0.5 font-bold text-[#14263D] focus:outline-hidden focus:border-[#247C78] cursor-pointer"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-[#14263D] transition-colors shadow-2xs"
            title="Switch Language / மொழியை மாற்றவும்"
          >
            <Languages className="w-3.5 h-3.5 text-[#247C78]" />
            <span>{strings.app.switchLanguage}</span>
          </button>

          {/* Quick Upload CTA */}
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-1.5 bg-[#247C78] hover:bg-[#1C6360] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{strings.app.quickUpload}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
