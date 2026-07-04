import React from 'react';
import { ArrowRightLeft, Info, HelpCircle } from 'lucide-react';

export default function SubstitutionPanel({ substitutions }) {
  if (!substitutions || substitutions.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all animate-fade-in">
      
      {/* Panel Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
          <ArrowRightLeft className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-zinc-100">Ingredient Substitutions</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Dietary, allergy, and budget-friendly alternatives</p>
        </div>
      </div>

      {/* Substitutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {substitutions.map((sub, idx) => (
          <div 
            key={idx} 
            className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 p-5 rounded-2xl flex flex-col justify-between space-y-3"
          >
            {/* Swap visualizer */}
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-900 px-4 py-3 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Instead of</span>
                <span className="text-sm font-black text-rose-500 dark:text-rose-400">{sub.original}</span>
              </div>
              <ArrowRightLeft className="w-4 h-4 text-amber-500 mx-2 shrink-0" />
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Use swap</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{sub.substitution}</span>
              </div>
            </div>

            {/* Explanation notes */}
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400 font-semibold bg-white/40 dark:bg-zinc-900/40 p-3 rounded-xl">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {sub.reason}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
