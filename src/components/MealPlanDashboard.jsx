import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  ChevronRight, 
  Check, 
  Utensils, 
  BookOpen, 
  ListChecks,
  Activity,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function MealPlanDashboard({ plan }) {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [completedSteps, setCompletedSteps] = useState({});

  if (!plan) return null;

  const meals = {
    breakfast: {
      ...plan.breakfast,
      icon: <Coffee className="w-5 h-5" />,
      label: 'Breakfast',
      timeIcon: '🌅'
    },
    lunch: {
      ...plan.lunch,
      icon: <Sun className="w-5 h-5" />,
      label: 'Lunch',
      timeIcon: '☀️'
    },
    dinner: {
      ...plan.dinner,
      icon: <Moon className="w-5 h-5" />,
      label: 'Dinner',
      timeIcon: '🌙'
    }
  };

  const activeMeal = meals[activeTab];

  const toggleStep = (mealKey, stepIdx) => {
    const key = `${mealKey}-${stepIdx}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      
      {/* Dashboard Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-zinc-100">Daily Meal Plans</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Step-by-step recipes and cooking schedules</p>
        </div>
      </div>

      {/* Tabs list (Material M3 pill tabs) */}
      <div className="flex bg-slate-100 dark:bg-zinc-950 p-1.5 rounded-2xl gap-1 mb-8" role="tablist">
        {Object.keys(meals).map((mealKey) => {
          const isActive = activeTab === mealKey;
          return (
            <button
              key={mealKey}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${mealKey}`}
              id={`tab-${mealKey}`}
              onClick={() => setActiveTab(mealKey)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isActive
                  ? 'bg-white dark:bg-zinc-800 text-amber-500 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              {meals[mealKey].icon}
              <span>{meals[mealKey].label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div 
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="animate-fade-in space-y-8"
      >
        {/* Meal Title and Prep time header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
          <div>
            <span className="text-3xl mr-1.5 align-middle">{activeMeal.timeIcon}</span>
            <h4 className="inline-block text-xl md:text-2xl font-black text-slate-800 dark:text-zinc-100 align-middle">
              {activeMeal.name}
            </h4>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400 font-bold text-sm bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 rounded-2xl border border-slate-100 dark:border-zinc-900 w-fit">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Prep & Cook: {activeMeal.prepTime} mins</span>
          </div>
        </div>

        {/* Nutrition Highlights */}
        {activeMeal.nutrition && (
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              Nutrition Estimates (Per Serving)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Calories */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Calories</div>
                  <div className="text-sm font-black text-slate-800 dark:text-zinc-100">{activeMeal.nutrition.calories} kcal</div>
                </div>
              </div>
              {/* Protein */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Protein</div>
                  <div className="text-sm font-black text-slate-800 dark:text-zinc-100">{activeMeal.nutrition.protein}g</div>
                </div>
              </div>
              {/* Carbs */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Carbs</div>
                  <div className="text-sm font-black text-slate-800 dark:text-zinc-100">{activeMeal.nutrition.carbs}g</div>
                </div>
              </div>
              {/* Fat */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Fat</div>
                  <div className="text-sm font-black text-slate-800 dark:text-zinc-100">{activeMeal.nutrition.fat}g</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Grid: Ingredients + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ingredients Needed (1/3 width on desktop) */}
          <div className="bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-900 p-5 rounded-3xl space-y-4">
            <h5 className="font-bold text-slate-800 dark:text-zinc-200 text-sm flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-amber-500" />
              Ingredients Needed
            </h5>
            <ul className="space-y-2">
              {activeMeal.ingredientsNeeded?.map((ing, idx) => (
                <li 
                  key={idx} 
                  className="bg-white dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-900 p-3 rounded-2xl flex items-center justify-between text-xs shadow-xs"
                >
                  <div>
                    <span className="font-bold text-slate-700 dark:text-zinc-200">{ing.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block mt-0.5 font-semibold">
                      Category: {ing.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-800 dark:text-zinc-300 block">{ing.amount}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold block mt-0.5">
                      Est: {formatCurrency(ing.estimatedCost)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions checklist + Timeline (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step-by-Step Instructions */}
            <div className="space-y-4">
              <h5 className="font-bold text-slate-800 dark:text-zinc-200 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                Step-by-Step Cooking Steps
              </h5>
              <div className="space-y-3">
                {activeMeal.instructions?.map((step, idx) => {
                  const isDone = completedSteps[`${activeTab}-${idx}`];
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleStep(activeTab, idx)}
                      className={`w-full text-left p-4 rounded-2xl border flex items-start gap-3.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        isDone
                          ? 'bg-slate-50/70 dark:bg-zinc-950/20 border-slate-200 dark:border-zinc-800/60 opacity-60'
                          : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-900 shadow-xs'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isDone 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="text-sm font-semibold leading-relaxed">
                        <span className={`text-xs mr-1 font-bold ${isDone ? 'text-slate-400 dark:text-zinc-500' : 'text-amber-500'}`}>
                          Step {idx + 1}:
                        </span>
                        <span className={isDone ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-700 dark:text-zinc-200'}>
                          {step}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Scheduler */}
            {activeMeal.timeline && activeMeal.timeline.length > 0 && (
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-5 space-y-4">
                <h5 className="font-bold text-slate-800 dark:text-zinc-200 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Cooking Timeline Scheduler
                </h5>
                <div className="relative border-l-2 border-slate-200 dark:border-zinc-800 ml-3 pl-5 space-y-5 py-1">
                  {activeMeal.timeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-amber-500 bg-white dark:bg-zinc-900 group-hover:scale-125 transition-transform duration-200" />
                      <div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-md">
                          {item.time}
                        </span>
                        <p className="text-sm text-slate-600 dark:text-zinc-300 font-semibold mt-1.5 leading-relaxed">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
