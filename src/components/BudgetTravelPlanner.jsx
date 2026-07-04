import React from 'react';
import { PiggyBank, AlertTriangle, ChevronRight, DollarSign, Wallet } from 'lucide-react';

export default function BudgetTravelPlanner({ budget, userBudget }) {
  if (!budget) return null;

  const totalCost = budget.estimatedTotalCost || 0;
  const remaining = budget.remainingBudget ?? (userBudget - totalCost);
  const isFeasible = budget.isFeasible ?? (remaining >= 0);

  // Percentages for cost distribution graph
  const transportPct = totalCost ? Math.round((budget.transport / totalCost) * 100) : 0;
  const foodPct = totalCost ? Math.round((budget.food / totalCost) * 100) : 0;
  const ticketsPct = totalCost ? Math.round((budget.tickets / totalCost) * 100) : 0;
  const shoppingPct = totalCost ? Math.round((budget.shopping / totalCost) * 100) : 0;
  const miscPct = totalCost ? Math.round((budget.miscellaneous / totalCost) * 100) : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <PiggyBank className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
            Smart Budget Planner
          </h3>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
            Real-time estimation matching your allocated travel fund limits.
          </p>
        </div>
      </div>

      {/* Financial Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Allocated Budget */}
        <div className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 font-bold text-lg">
            $
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Allocated Budget
            </div>
            <div className="text-lg font-black text-slate-850 dark:text-zinc-100 font-display">
              ${userBudget} USD
            </div>
          </div>
        </div>

        {/* Estimated Costs */}
        <div className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-lg">
            $
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Estimated Total
            </div>
            <div className="text-lg font-black text-slate-850 dark:text-zinc-100 font-display">
              ${totalCost} USD
            </div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className={`border p-4 rounded-2xl flex items-center gap-3 ${
          isFeasible
            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
            isFeasible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              {isFeasible ? 'Remaining Balance' : 'Budget Deficit'}
            </div>
            <div className="text-lg font-black font-display">
              ${Math.abs(remaining)} USD
            </div>
          </div>
        </div>

      </div>

      {/* CSS Visual Distribution Bar */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-650 dark:text-zinc-300">
          Cost Breakdown Distribution
        </div>
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-zinc-950 overflow-hidden flex">
          {budget.transport > 0 && <div className="h-full bg-amber-500 transition-all" style={{ width: `${transportPct}%` }} title={`Transport: ${transportPct}%`} />}
          {budget.food > 0 && <div className="h-full bg-emerald-500 transition-all" style={{ width: `${foodPct}%` }} title={`Food: ${foodPct}%`} />}
          {budget.tickets > 0 && <div className="h-full bg-indigo-500 transition-all" style={{ width: `${ticketsPct}%` }} title={`Tickets: ${ticketsPct}%`} />}
          {budget.shopping > 0 && <div className="h-full bg-pink-500 transition-all" style={{ width: `${shoppingPct}%` }} title={`Shopping: ${shoppingPct}%`} />}
          {budget.miscellaneous > 0 && <div className="h-full bg-blue-400 transition-all" style={{ width: `${miscPct}%` }} title={`Misc: ${miscPct}%`} />}
        </div>

        {/* Legend labels */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 dark:text-zinc-500 justify-center">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Transport ({transportPct}%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Dining ({foodPct}%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Sightseeing ({ticketsPct}%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-pink-500" /> Shopping ({shoppingPct}%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-400" /> Misc ({miscPct}%)</span>
        </div>
      </div>

      {/* Warnings & Saving Alternatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Warnings list */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Budget Alerts
          </div>
          <ul className="space-y-2">
            {budget.warnings && budget.warnings.length > 0 ? (
              budget.warnings.map((warn, idx) => (
                <li 
                  key={idx} 
                  className="text-xs font-semibold leading-relaxed bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10 p-3 rounded-xl flex gap-2"
                >
                  <span className="shrink-0">•</span>
                  <span>{warn}</span>
                </li>
              ))
            ) : (
              <li className="text-xs font-semibold text-slate-400 dark:text-zinc-500 italic">
                No financial warnings. Your itinerary fits beautifully.
              </li>
            )}
          </ul>
        </div>

        {/* Alternatives list */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-indigo-500 tracking-wider flex items-center gap-1">
            <PiggyBank className="w-4 h-4 text-indigo-500" /> Cheaper Alternatives
          </div>
          <ul className="space-y-2">
            {budget.cheaperAlternatives && budget.cheaperAlternatives.length > 0 ? (
              budget.cheaperAlternatives.map((alt, idx) => (
                <li 
                  key={idx} 
                  className="text-xs font-semibold leading-relaxed bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-3 rounded-xl flex items-start gap-1.5 hover:-translate-x-0.5 transition-transform"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <span>{alt}</span>
                </li>
              ))
            ) : (
              <li className="text-xs font-semibold text-slate-400 dark:text-zinc-500 italic">
                All estimations match standard budget rates. No saving swaps suggested.
              </li>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
}
