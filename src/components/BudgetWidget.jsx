import React from 'react';
import { CheckCircle2, AlertTriangle, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function BudgetWidget({ budgetAnalysis, userBudget }) {
  if (!budgetAnalysis) return null;

  const {
    isFeasible,
    estimatedTotalCost,
    remainingBudget,
    notes,
    cheaperAlternatives = []
  } = budgetAnalysis;

  // Calculate percentage of budget used
  const limitBudget = Math.max(userBudget, 1);
  const costPercentage = Math.min((estimatedTotalCost / limitBudget) * 100, 100);

  // Status-dependent classes
  const isOverBudget = estimatedTotalCost > userBudget || !isFeasible;
  const statusColor = isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400';
  const progressColor = isOverBudget ? 'bg-rose-500' : 'bg-emerald-500';
  const bgColor = isOverBudget ? 'bg-rose-50/50 dark:bg-rose-950/10' : 'bg-emerald-50/50 dark:bg-emerald-950/10';
  const borderColor = isOverBudget ? 'border-rose-100 dark:border-rose-900/30' : 'border-emerald-100 dark:border-emerald-900/30';

  return (
    <div className={`w-full border rounded-3xl p-6 transition-all ${bgColor} ${borderColor}`}>
      
      {/* Header and status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${isOverBudget ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
            <Wallet className={`w-6 h-6 ${statusColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-zinc-100">Budget Analysis</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Comparing ingredient cost against your budget</p>
          </div>
        </div>

        {/* Feasibility Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
          isOverBudget 
            ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300' 
            : 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
        }`}>
          {isOverBudget ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              Budget Limit Exceeded
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Budget Feasible
            </>
          )}
        </div>
      </div>

      {/* Figures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Cost */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Estimated Grocery Cost
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-zinc-100">
            {formatCurrency(estimatedTotalCost)}
          </div>
        </div>

        {/* Total Budget */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Your Budget Limit
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-zinc-100">
            {formatCurrency(userBudget)}
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            {isOverBudget ? 'Over Budget By' : 'Budget Remaining'}
          </div>
          <div className={`text-2xl font-black ${statusColor}`}>
            {formatCurrency(Math.abs(remainingBudget))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 mb-1.5">
          <span>Usage Meter</span>
          <span>{costPercentage.toFixed(0)}% Used</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
          <div 
            className={`${progressColor} h-full rounded-full transition-all duration-700`}
            style={{ width: `${costPercentage}%` }}
          />
        </div>
      </div>

      {/* Notes explanation */}
      {notes && (
        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 font-medium bg-white dark:bg-zinc-900/60 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
          {notes}
        </p>
      )}

      {/* Cheaper Alternatives */}
      {cheaperAlternatives && cheaperAlternatives.length > 0 && (
        <div className="mt-6 border-t border-slate-200 dark:border-zinc-800 pt-6">
          <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm flex items-center gap-2 mb-3.5">
            <TrendingDown className="w-4 h-4 text-amber-500" />
            Suggested Cheaper Alternatives
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cheaperAlternatives.map((alt, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                    Swap out "{alt.original}"
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-zinc-200 mt-0.5">
                    Use <span className="text-amber-500 font-black">{alt.alternative}</span> instead
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">
                    Save Approx
                  </div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(alt.potentialSavings)}
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
