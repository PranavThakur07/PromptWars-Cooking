import React from 'react';
import { Globe, Calendar, CheckCircle2, XCircle, Camera, Shirt, Coins, ShieldAlert, MapPin } from 'lucide-react';

export default function EtiquetteEtc({ culture, events }) {
  const hasCulture = !!culture;
  const hasEvents = events && events.length > 0;

  if (!hasCulture && !hasEvents) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 1. Cultural Etiquette (8 cols) */}
      {hasCulture && (
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
                Cultural Etiquette & Customs
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                Essential guidelines to respect local culture, norms, and ensure safety.
              </p>
            </div>
          </div>

          {/* Core Etiquette Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Greetings & Customs */}
            <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900/60 space-y-2">
              <h4 className="text-xs font-black uppercase text-violet-500 tracking-wider flex items-center gap-1.5">
                👋 Greetings & Customs
              </h4>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-zinc-100">Greetings:</strong> {culture.greetings}
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-zinc-100">Customs:</strong> {culture.customs}
              </p>
            </div>

            {/* Dress Code & Photography */}
            <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900/60 space-y-2">
              <h4 className="text-xs font-black uppercase text-violet-500 tracking-wider flex items-center gap-1.5">
                👗 Dress & Photography
              </h4>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-zinc-100">Dress:</strong> {culture.dress}
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed flex items-start gap-1">
                <Camera className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{culture.photographyRules}</span>
              </p>
            </div>

            {/* Tipping & Safety */}
            <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900/60 space-y-2">
              <h4 className="text-xs font-black uppercase text-violet-500 tracking-wider flex items-center gap-1.5">
                💵 Services & Safety
              </h4>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed flex items-start gap-1">
                <Coins className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-zinc-100">Tipping:</strong> {culture.tipping}</span>
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed flex items-start gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-zinc-100">Safety:</strong> {culture.safety}</span>
              </p>
            </div>

            {/* Do's & Don'ts Checklist */}
            <div className="bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900/60 grid grid-cols-2 gap-3">
              <div>
                <h5 className="text-[10px] font-black uppercase text-emerald-500 tracking-wider flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Do's
                </h5>
                <ul className="space-y-1.5">
                  {culture.dos?.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 leading-normal flex items-start gap-1">
                      <span className="text-emerald-500 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-[10px] font-black uppercase text-rose-500 tracking-wider flex items-center gap-1 mb-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" /> Don'ts
                </h5>
                <ul className="space-y-1.5">
                  {culture.donts?.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 leading-normal flex items-start gap-1">
                      <span className="text-rose-500 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Local Events (4 cols) */}
      {hasEvents && (
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
                Local Events
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                Seasonal festivals, markets, and musical performances.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {events.map((ev, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-4 rounded-2xl hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div className="flex flex-wrap justify-between items-center gap-1.5 mb-1 text-[10px] font-extrabold uppercase">
                  <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                    {ev.type || 'Event'}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-zinc-100 group-hover:text-blue-500 transition-colors mb-1.5">
                  {ev.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed mb-2">
                  {ev.description}
                </p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-zinc-500">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
