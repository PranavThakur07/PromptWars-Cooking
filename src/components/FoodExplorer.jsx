import React from 'react';
import { Utensils, Leaf, DollarSign, Bookmark, Store } from 'lucide-react';

export default function FoodExplorer({ food }) {
  if (!food || !food.length) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <Utensils className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
            Authentic Food Explorer
          </h3>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
            Discover local culinary heritage, street foods, and recommended dining stalls.
          </p>
        </div>
      </div>

      {/* Grid of Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {food.map((dish, idx) => (
          <div 
            key={idx} 
            className="flex flex-col justify-between bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900/60 p-5 rounded-2xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="space-y-3">
              {/* Header Badge Row */}
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-bold">
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5 shrink-0" />
                  ~{dish.priceEstimate} USD
                </span>

                {dish.vegetarianOptions ? (
                  <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full flex items-center gap-1 font-extrabold text-[10px]">
                    <Leaf className="w-3 h-3 fill-green-500" />
                    Veg Option
                  </span>
                ) : (
                  <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full text-[10px]">
                    Non-Veg
                  </span>
                )}
              </div>

              {/* Dish details */}
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight group-hover:text-emerald-500 transition-colors">
                  {dish.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed">
                  {dish.description}
                </p>
              </div>
            </div>

            {/* Cultural Significance & Restaurant Details */}
            <div className="border-t border-slate-200/40 dark:border-zinc-800/40 pt-3 mt-4 space-y-2 text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
              <div className="flex items-start gap-1">
                <Bookmark className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-600 dark:text-zinc-400">Cultural significance:</strong> {dish.culturalSignificance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong className="text-slate-600 dark:text-zinc-400">Where to try:</strong> {dish.restaurantName}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
