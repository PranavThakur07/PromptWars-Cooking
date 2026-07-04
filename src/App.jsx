import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Copy, 
  Check, 
  RotateCcw, 
  Heart,
  Sparkles,
  Info,
  Calendar,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

import { useLocalStorage } from './hooks/useLocalStorage';
import { generateTravelPlan, checkBackendHealth } from './services/gemini';
import { formatTravelPlanAsText, copyToClipboard } from './utils/helpers';

import ThemeToggle from './components/Common/ThemeToggle';
import ErrorState from './components/Common/ErrorState';
import FormSection from './components/FormSection';

import InteractiveMap from './components/InteractiveMap';
import ItineraryTimeline from './components/ItineraryTimeline';
import HiddenGemsCard from './components/HiddenGemsCard';
import FoodExplorer from './components/FoodExplorer';
import EtiquetteEtc from './components/EtiquetteEtc';
import BudgetTravelPlanner from './components/BudgetTravelPlanner';
import LanguagePacker from './components/LanguagePacker';
import TravelJournalPostcard from './components/TravelJournalPostcard';

export default function App() {
  // Sync state with localStorage for excellent UX (persistence)
  const [travelPlan, setTravelPlan] = useLocalStorage('current_travel_plan', null);
  const [lastInputs, setLastInputs] = useLocalStorage('last_travel_inputs', null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Animation & Feedback states
  const [copied, setCopied] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [serverHealth, setServerHealth] = useState(null);

  // Monitor backend health on start
  useEffect(() => {
    checkBackendHealth()
      .then(data => {
        setServerHealth(data);
        console.log('FastAPI server connection verified:', data);
      })
      .catch(err => {
        console.warn('Backend server is currently offline or unreachable:', err.message);
      });
  }, []);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setShowSuccessToast(false);
    setLastInputs(formData);

    try {
      const plan = await generateTravelPlan(formData);
      setTravelPlan(plan);
      
      // Trigger success animation/toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to compile travel plan. Please check backend connection.');
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
    setTravelPlan(null);
    setLastInputs(null);
    setError(null);
    setShowSuccessToast(false);
  };

  const handleCopyResults = async () => {
    if (!travelPlan) return;
    try {
      const dest = lastInputs?.destination || 'My Destination';
      const planText = formatTravelPlanAsText(travelPlan, dest);
      await copyToClipboard(planText);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const userBudget = lastInputs?.budget || 1500;
  const destinationName = lastInputs?.destination || '';

  return (
    <div className="min-h-screen pb-16 transition-colors duration-300 font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-zinc-900/60 py-4 px-6 mb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight font-display text-slate-850 dark:text-zinc-50 flex items-center gap-1.5 leading-none">
                Culture Compass AI
              </h1>
              <span className="text-[9px] font-black text-violet-500 tracking-wider uppercase">
                Explore Beyond Maps. Experience Every Story.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {serverHealth && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ● Live API
              </span>
            )}
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
            Travel Guide Created Successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Workspace Panel: Input Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black font-display text-slate-850 dark:text-zinc-50 tracking-tight">
                Discover Cultures
              </h2>
              <p className="text-xs font-semibold text-slate-550 dark:text-zinc-400 leading-normal">
                Define your style, budget, interests, and dates. Culture Compass creates a custom map, storybooks, and schedules.
              </p>
            </div>
            
            <FormSection 
              onSubmit={handleGenerate}
              onReset={handleReset}
              isLoading={isLoading}
              initialValues={lastInputs}
            />
          </div>

          {/* Right Workspace Panel: Travel Plan Outputs (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Loading Panel & Skeleton Loaders */}
            {isLoading && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-zinc-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-4/5" />
                </div>

                <div className="w-full h-[280px] bg-slate-100 dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                  <p className="text-xs font-black text-violet-500 tracking-widest uppercase">
                    Asking Gemini to research heritage, food, & safety...
                  </p>
                </div>
              </div>
            )}

            {/* Error Panel */}
            {error && !isLoading && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {/* Empty State Banner (No generated plan yet) */}
            {!travelPlan && !isLoading && !error && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-150/80 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-6 shadow-sm">
                
                {/* Hero section inside workspace */}
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-gradient-to-tr from-violet-600/90 to-indigo-650/90 flex flex-col justify-center items-center text-white px-6">
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                  
                  <Compass className="w-12 h-12 text-white/40 mb-3 animate-spin-slow" />
                  <h3 className="text-2xl font-black font-display text-white tracking-tight">
                    Explore Beyond Maps
                  </h3>
                  <p className="text-xs font-bold text-violet-200 max-w-sm mt-1 leading-normal italic font-serif">
                    "Experience Every Story. Discover the heart and soul of local culture."
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-zinc-150 font-display">
                    Your Journey Workspace is Ready
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
                    Input your travel choices on the left panel to request Gemini to build dynamic itineraries, plot off-the-beaten-path gems on Leaflet maps, and recommend authentic local dishes.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-slate-450 dark:text-zinc-500">
                  <span className="bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-900">
                    ✓ Single API call (Optimized latency)
                  </span>
                  <span className="bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-900">
                    ✓ Interactive Leaflet OSM Maps
                  </span>
                  <span className="bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-900">
                    ✓ WCAG Keyboard Accessible Controls
                  </span>
                </div>
              </div>
            )}

            {/* Output Panels */}
            {travelPlan && !isLoading && !error && (
              <div className="space-y-8 animate-slide-up">
                
                {/* Result Control Actions bar */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-slate-50 dark:bg-zinc-900/40 p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl">
                  <div className="text-xs font-extrabold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    🧭 Travel Guide: <strong className="text-violet-500">{destinationName}</strong>
                  </div>
                  <div className="flex gap-2">
                    {/* Copy to Clipboard button */}
                    <button
                      onClick={handleCopyResults}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-650 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Guide
                        </>
                      )}
                    </button>

                    {/* Quick Regenerate button */}
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Re-plan
                    </button>
                  </div>
                </div>

                {/* Immersive Storytelling Introduction */}
                {travelPlan.story && (
                  <div className="bg-gradient-to-tr from-violet-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-900 border border-violet-100 dark:border-zinc-900 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-violet-500/10 font-serif text-8xl leading-none select-none">
                      “
                    </div>
                    <h3 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-500" /> Destination Story
                    </h3>
                    <p className="text-sm md:text-base font-semibold leading-relaxed italic font-serif text-slate-800 dark:text-zinc-200">
                      "{travelPlan.story}"
                    </p>
                  </div>
                )}

                {/* Leaflet Interactive Map */}
                <InteractiveMap plan={travelPlan} />

                {/* Budget visualizer */}
                <BudgetTravelPlanner 
                  budget={travelPlan.budget} 
                  userBudget={userBudget}
                />

                {/* Itinerary daily planner timeline */}
                <ItineraryTimeline itinerary={travelPlan.itinerary} />

                {/* Hidden Gems and Heritage Highlights */}
                <HiddenGemsCard 
                  hiddenGems={travelPlan.hiddenGems}
                  heritage={travelPlan.heritage}
                />

                {/* Dining explorer */}
                <FoodExplorer food={travelPlan.food} />

                {/* Etiquette and Events */}
                <EtiquetteEtc 
                  culture={travelPlan.culture}
                  events={travelPlan.events}
                />

                {/* Language phrasebook & Packing */}
                <LanguagePacker 
                  packing={travelPlan.packing}
                  localPhrases={travelPlan.localPhrases}
                />

                {/* Postcard journal & Social captions */}
                <TravelJournalPostcard 
                  travelJournal={travelPlan.travelJournal}
                  instagramCaption={travelPlan.instagramCaption}
                  destination={destinationName}
                />

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 text-center border-t border-slate-200/50 dark:border-zinc-900/60 pt-8 text-xs font-bold text-slate-400 dark:text-zinc-500 space-y-2">
        <p className="flex items-center justify-center gap-1">
          Developed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for PromptWars. Powered by Google Gemini 2.5 Flash.
        </p>
        <p>
          Culture Compass AI — Explore Beyond Maps. Experience Every Story.
        </p>
      </footer>

    </div>
  );
}
