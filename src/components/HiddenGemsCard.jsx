import React from 'react';
import { EyeOff, Landmark, MapPin, Compass } from 'lucide-react';

export default function HiddenGemsCard({ hiddenGems, heritage }) {
  const hasGems = hiddenGems && hiddenGems.length > 0;
  const hasHeritage = heritage && heritage.length > 0;

  if (!hasGems && !hasHeritage) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Hidden Gems Section */}
      {hasGems && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
                Hidden Gems
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                Off-the-beaten-path experiences tourists rarely discover.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {hiddenGems.map((gem, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-4 rounded-2xl hover:border-violet-500/40 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 group-hover:text-violet-500 transition-colors">
                    {gem.name}
                  </h4>
                  <span className="bg-violet-500/10 text-violet-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
                    Secret Spot
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed mb-2.5">
                  {gem.description}
                </p>

                <div className="border-t border-slate-200/40 dark:border-zinc-800/40 pt-2.5 flex flex-col gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span><strong className="text-slate-600 dark:text-zinc-400">Why Unique:</strong> {gem.whyUnique}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{gem.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heritage Section */}
      {hasHeritage && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
                Heritage Highlights
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                Immerse yourself in history and preserve cultural heritage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {heritage.map((site, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-4 rounded-2xl hover:border-pink-500/40 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 group-hover:text-pink-500 transition-colors">
                    {site.name}
                  </h4>
                  <span className="bg-pink-500/10 text-pink-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
                    Cultural Site
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed mb-2.5">
                  {site.description}
                </p>

                <div className="border-t border-slate-200/40 dark:border-zinc-800/40 pt-2.5 flex flex-col gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Landmark className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span><strong className="text-slate-600 dark:text-zinc-400">Significance:</strong> {site.significance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{site.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
