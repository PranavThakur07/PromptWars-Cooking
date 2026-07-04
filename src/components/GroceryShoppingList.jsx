import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckSquare, Square, Check, ClipboardList } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function GroceryShoppingList({ groceryList }) {
  const [checkedItems, setCheckedItems] = useState({});

  if (!groceryList || groceryList.length === 0) return null;

  // Group items by category
  const categories = ['Vegetables', 'Dairy', 'Protein', 'Spices', 'Others'];
  const groupedList = {};
  
  // Initialize grouped structure
  categories.forEach(cat => {
    groupedList[cat] = [];
  });

  groceryList.forEach(item => {
    const cat = item.category || 'Others';
    // Fallback if AI output doesn't match one of our standard categories
    if (!groupedList[cat]) {
      groupedList[cat] = [];
    }
    groupedList[cat].push(item);
  });

  const toggleCheck = (ingredientName) => {
    setCheckedItems(prev => ({
      ...prev,
      [ingredientName]: !prev[ingredientName]
    }));
  };

  // Calculate totals and percentages
  const totalItemsCount = groceryList.length;
  const checkedItemsCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItemsCount > 0 ? (checkedItemsCount / totalItemsCount) * 100 : 0;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all animate-fade-in">
      
      {/* List Header and Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6 pb-5 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-zinc-100">Grocery To-Do List</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Shop or check off items in your pantry</p>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="flex flex-col gap-1 w-full md:w-48 text-xs font-bold text-slate-500 dark:text-zinc-400">
          <div className="flex justify-between">
            <span>Progress Tracker</span>
            <span>{checkedItemsCount}/{totalItemsCount} Done</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grouped Lists */}
      <div className="space-y-6">
        {categories.map((category) => {
          const items = groupedList[category] || [];
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              {/* Category Header */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-l-2 border-amber-500 pl-2.5">
                {category} ({items.length})
              </h4>
              
              {/* Category Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {items.map((item, idx) => {
                  const isChecked = !!checkedItems[item.ingredient];
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleCheck(item.ingredient)}
                      className={`w-full text-left p-3.5 rounded-2xl border flex items-center justify-between gap-3.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        isChecked
                          ? 'bg-slate-50/70 dark:bg-zinc-950/20 border-slate-200 dark:border-zinc-900/60 opacity-60'
                          : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-900 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Custom checkbox */}
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div>
                          <span className={`text-sm font-bold block ${
                            isChecked ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-700 dark:text-zinc-200'
                          }`}>
                            {item.ingredient}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 mt-0.5 block">
                            Purpose: {item.estimatedPurpose}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-xs font-black block ${
                          isChecked ? 'text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-300'
                        }`}>
                          {item.quantity}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold block mt-0.5">
                          {formatCurrency(item.estimatedCost)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
