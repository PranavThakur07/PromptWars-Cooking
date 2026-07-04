import React, { useState } from 'react';
import { 
  ChefHat, 
  Copy, 
  Check, 
  RotateCcw, 
  Share2, 
  Heart,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateMealPlan } from './services/gemini';
import { formatMealPlanAsText, copyToClipboard } from './utils/helpers';
import ThemeToggle from './components/Common/ThemeToggle';
import LoadingState from './components/Common/LoadingState';
import ErrorState from './components/Common/ErrorState';
import FormSection from './components/FormSection';
import BudgetWidget from './components/BudgetWidget';
import MealPlanDashboard from './components/MealPlanDashboard';
import GroceryShoppingList from './components/GroceryShoppingList';
import SubstitutionPanel from './components/SubstitutionPanel';

export default function App() {
  // Sync state with localStorage for excellent UX (persistence)
  const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', '');
  const [mealPlan, setMealPlan] = useLocalStorage('current_meal_plan', null);
  const [lastInputs, setLastInputs] = useLocalStorage('last_form_inputs', null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Animation & Feedback states
  const [copied, setCopied] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setShowSuccessToast(false);
    setLastInputs(formData);

    try {
      const plan = await generateMealPlan(formData, apiKey);
      setMealPlan(plan);
      
      // Trigger success animation/toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate meal plan. Please verify your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastInputs) {
      handleGenerate(lastInputs);
    }
  };

  const handleReset = () => {
    setMealPlan(null);
    setLastInputs(null);
    setError(null);
    setShowSuccessToast(false);
  };

  const handleCopyResults = async () => {
    if (!mealPlan) return;
    try {
      const planText = formatMealPlanAsText(mealPlan);
      await copyToClipboard(planText);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const userBudget = lastInputs?.budget || 30;

  return (
    <div className="min-h-screen pb-16 transition-colors duration-300">
      
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-100 dark:border-zinc-900 py-4 px-6 mb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold font-display tracking-tight text-slate-800 dark:text-zinc-50 flex items-center gap-1.5 leading-none">
                ChefPlanner AI
              </h1>
              <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">
                Cooking To-Do List Generator
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Toast Notification */}
        {showSuccessToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-scale-in">
            <Check className="w-4 h-4 stroke-[3]" />
            Meal Plan Generated Successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Workspace Panel: Input Form (5 cols on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black font-display text-slate-800 dark:text-zinc-50 tracking-tight">
                Pantry Constraints
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 leading-normal">
                Define your budget, servings, dietary preferences, and allergies to let Gemini generate a curated daily plan.
              </p>
            </div>
            
            <FormSection 
              onSubmit={handleGenerate}
              onReset={handleReset}
              isLoading={isLoading}
              apiKey={apiKey}
              setApiKey={setApiKey}
              initialValues={lastInputs}
            />
          </div>

          {/* Right Workspace Panel: Meal Plan Outputs (7 cols on large screens) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Loading Panel */}
            {isLoading && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                <LoadingState />
              </div>
            )}

            {/* Error Panel */}
            {error && !isLoading && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {/* Empty State Banner (No generated plan yet) */}
            {!mealPlan && !isLoading && !error && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-6 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mx-auto text-amber-500">
                  <ChefHat className="w-10 h-10" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 font-display">
                    Your Cooking Workspace is Ready
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
                    Complete the form on the left side to compile grocery checklists, macro nutritional charts, action schedules, and substitution guides.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-400 dark:text-zinc-500">
                  <span className="bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-900">
                    ✓ Real Google Gemini Call
                  </span>
                  <span className="bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-900">
                    ✓ Local Storage Persistent
                  </span>
                  <span className="bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-900">
                    ✓ WCAG Compliant Keyboard Controls
                  </span>
                </div>
              </div>
            )}

            {/* Output Panels */}
            {mealPlan && !isLoading && !error && (
              <div className="space-y-8 animate-slide-up">
                
                {/* Result Control Actions bar */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-50 dark:bg-zinc-900/40 p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl">
                  <div className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    🎯 Generated Plan
                  </div>
                  <div className="flex gap-2">
                    {/* Copy to Clipboard button */}
                    <button
                      onClick={handleCopyResults}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Results
                        </>
                      )}
                    </button>

                    {/* Quick Regenerate button */}
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* 1. Budget feasible Widget */}
                <BudgetWidget 
                  budgetAnalysis={mealPlan.budgetAnalysis} 
                  userBudget={userBudget}
                />

                {/* 2. Daily Meals planner Dashboard */}
                <MealPlanDashboard plan={mealPlan} />

                {/* 3. Ingredient substitutions */}
                <SubstitutionPanel substitutions={mealPlan.substitutions} />

                {/* 4. Grocery checklist categorized */}
                <GroceryShoppingList groceryList={mealPlan.groceryList} />

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 text-center border-t border-slate-100 dark:border-zinc-900 pt-8 text-xs font-bold text-slate-400 dark:text-zinc-500 space-y-2">
        <p className="flex items-center justify-center gap-1">
          Developed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Hackathon 2026. Powered by Google Gemini.
        </p>
        <p>
          ChefPlanner AI Cooking To-Do List Dashboard — 100% Client-side React 19 App.
        </p>
      </footer>

    </div>
  );
}
