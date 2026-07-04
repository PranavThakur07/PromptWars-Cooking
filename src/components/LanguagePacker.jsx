import React, { useState } from 'react';
import { Languages, Briefcase, Volume2, Cloud, CheckSquare, Square, RefreshCw } from 'lucide-react';

export default function LanguagePacker({ packing, localPhrases }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  const hasPacking = packing && packing.length > 0;
  const hasPhrases = localPhrases && localPhrases.length > 0;

  if (!hasPacking && !hasPhrases) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 1. Smart Packing Checklist (6 cols) */}
      {hasPacking && (
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
                  Smart Packing Checklist
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                  Weather-responsive checklists generated for your trip.
                </p>
              </div>
            </div>

            <button 
              onClick={resetChecklist}
              className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 hover:text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Checked
            </button>
          </div>

          {/* Interactive Checkable items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {packing.map((item, idx) => {
              const isChecked = !!checkedItems[item];
              return (
                <button
                  key={idx}
                  onClick={() => toggleCheck(item)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-slate-50 dark:bg-zinc-950/20 border-slate-200/50 dark:border-zinc-900 text-slate-450 dark:text-zinc-500 line-through decoration-slate-400/50'
                      : 'bg-white dark:bg-zinc-950/60 border-slate-100 dark:border-zinc-900/60 text-slate-700 dark:text-zinc-350 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 hover:border-amber-500/30'
                  }`}
                >
                  <span className="shrink-0 mt-0.5 text-amber-500">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 fill-amber-500/10" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </span>
                  <span className="text-xs font-semibold leading-tight">{item}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* 2. Local Language Assistant (6 cols) */}
      {hasPhrases && (
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
                Local Language Assistant
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                Key phrases, pronunciations, meanings, and practical examples.
              </p>
            </div>
          </div>

          {/* List of Phrases */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {localPhrases.map((phrase, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-4 rounded-2xl hover:border-indigo-500/40 transition-all duration-300 group"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200/40 dark:border-zinc-800/40 pb-2 mb-2">
                  {/* Local Phrase & English Meaning */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                      Phrase
                    </span>
                    <h4 className="text-sm font-black text-slate-850 dark:text-zinc-100 font-display group-hover:text-indigo-500 transition-colors">
                      {phrase.phrase}
                    </h4>
                  </div>
                  
                  {/* Meaning translation */}
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase">
                      Meaning
                    </span>
                    <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      "{phrase.meaning}"
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-semibold text-slate-450 dark:text-zinc-500 leading-normal">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>🗣️ Pronounce: <code className="bg-zinc-200/50 dark:bg-zinc-900 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-bold">{phrase.pronunciation}</code></span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-zinc-400 font-bold">Usage:</span> {phrase.usageExample}
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
