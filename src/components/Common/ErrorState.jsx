import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-3xl animate-scale-in"
      role="alert"
    >
      <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
        Generation Failed
      </h3>
      
      <p className="text-sm text-red-600 dark:text-red-400/90 mb-6 leading-relaxed">
        {message || 'An unexpected error occurred. Please verify your connection or your Google Gemini API Key and try again.'}
      </p>
      
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
