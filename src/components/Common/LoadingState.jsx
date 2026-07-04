import React, { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';

const LOADING_TIPS = [
  "Preheating the digital skillet...",
  "Consulting our AI nutritionists...",
  "Chopping virtual fresh vegetables...",
  "Optimizing ingredients for your budget...",
  "Balancing macro-nutrients and calories...",
  "Simmering spices for maximum flavor...",
  "Checking the pantry for smart substitutions...",
  "Calculating the exact grocery costs..."
];

export default function LoadingState() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-sm mx-auto animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-6">
        {/* Animated spin ring */}
        <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 dark:border-amber-500/10 dark:border-t-amber-400 animate-spin"></div>
        {/* Pulsing centered chef hat */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="w-9 h-9 text-amber-500 dark:text-amber-400 animate-bounce" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2 tracking-tight">
        Designing Meal Plan...
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-zinc-400 italic min-h-[40px] px-2 leading-relaxed transition-all duration-300">
        "{LOADING_TIPS[tipIndex]}"
      </p>

      <div className="w-48 bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-6">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full animate-pulse w-full"></div>
      </div>
    </div>
  );
}
