import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Sparkles, 
  TrendingDown, 
  Dumbbell, 
  AlertTriangle, 
  Key, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { DIETARY_PREFERENCES, GOALS, COOKING_TIMES } from '../constants/options';
import { validateForm, sanitizeInput } from '../utils/validation';

export default function FormSection({ 
  onSubmit, 
  onReset, 
  isLoading, 
  apiKey, 
  setApiKey,
  initialValues 
}) {
  const [formData, setFormData] = useState(initialValues || {
    people: 2,
    budget: 30,
    dietaryPreference: 'Vegetarian',
    cookingTime: 45,
    goal: 'Healthy',
    availableIngredients: '',
    avoidIngredients: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showApiPanel, setShowApiPanel] = useState(!apiKey && !import.meta.env.VITE_GEMINI_API_KEY);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error on change
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleGoalSelect = (goalValue) => {
    setFormData(prev => ({ ...prev, goal: goalValue }));
    if (errors.goal) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.goal;
        return copy;
      });
    }
  };

  const handleDietSelect = (dietValue) => {
    setFormData(prev => ({ ...prev, dietaryPreference: dietValue }));
    if (errors.dietaryPreference) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.dietaryPreference;
        return copy;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sanitize the text fields to prevent prompt injections
    const sanitizedData = {
      ...formData,
      people: Number(formData.people),
      budget: Number(formData.budget),
      cookingTime: Number(formData.cookingTime),
      availableIngredients: sanitizeInput(formData.availableIngredients),
      avoidIngredients: sanitizeInput(formData.avoidIngredients)
    };

    const validationResult = validateForm(sanitizedData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      // Focus the first error element
      const firstErrorKey = Object.keys(validationResult.errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    onSubmit(sanitizedData);
  };

  const handleClear = () => {
    const defaults = {
      people: 2,
      budget: 30,
      dietaryPreference: 'Vegetarian',
      cookingTime: 45,
      goal: 'Healthy',
      availableIngredients: '',
      avoidIngredients: ''
    };
    setFormData(defaults);
    setErrors({});
    onReset();
  };

  const getGoalIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'TrendingDown': return <TrendingDown className="w-5 h-5" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      
      {/* API Key Panel */}
      <div className="mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => setShowApiPanel(!showApiPanel)}
          className="flex items-center justify-between w-full text-left font-semibold text-slate-700 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          aria-expanded={showApiPanel}
        >
          <span className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" />
            Gemini API Key Configuration
            {import.meta.env.VITE_GEMINI_API_KEY ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-normal">
                Loaded via .env
              </span>
            ) : apiKey ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-normal">
                Custom Key Saved
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-normal animate-pulse">
                Key Required
              </span>
            )}
          </span>
          {showApiPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showApiPanel && (
          <div className="mt-3 p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-2xl animate-slide-up">
            <label htmlFor="apiKey" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
              Google Gemini API Key
            </label>
            <div className="flex gap-2">
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste AI key here (AIzaSy...)"
                className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-offset-zinc-950"
              />
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setApiKey('')}
                  className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer"
                  title="Clear custom API key"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
              If <code>VITE_GEMINI_API_KEY</code> environment variable is set, you do not need to paste it here. Your custom key is stored safely only in your browser storage.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: People & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Servings */}
          <div>
            <label htmlFor="people" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              Number of People
            </label>
            <input
              id="people"
              name="people"
              type="number"
              min="1"
              max="20"
              step="1"
              required
              value={formData.people}
              onChange={handleInputChange}
              className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.people ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'} rounded-2xl px-4 py-3 text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
            />
            {errors.people && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.people}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              Daily Budget (USD)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0.01"
              max="10000"
              step="0.01"
              required
              value={formData.budget}
              onChange={handleInputChange}
              className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.budget ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'} rounded-2xl px-4 py-3 text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
            />
            {errors.budget && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.budget}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Dietary Preferences */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">
            Dietary Preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIETARY_PREFERENCES.map((diet) => (
              <button
                type="button"
                key={diet.value}
                onClick={() => handleDietSelect(diet.value)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  formData.dietaryPreference === diet.value
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 text-slate-900 dark:text-white font-semibold'
                    : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="text-sm font-bold block">{diet.label}</div>
                <div className="text-xs mt-1 opacity-70 font-normal leading-normal">{diet.description}</div>
              </button>
            ))}
          </div>
          {errors.dietaryPreference && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1" role="alert">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.dietaryPreference}
            </p>
          )}
        </div>

        {/* Row 3: Cooking Goal Grid */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">
            Cooking Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {GOALS.map((g) => (
              <button
                type="button"
                key={g.value}
                onClick={() => handleGoalSelect(g.value)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  formData.goal === g.value
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 text-amber-700 dark:text-amber-400 font-bold scale-[1.02]'
                    : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="mb-1.5">{getGoalIcon(g.icon)}</div>
                <div className="text-xs font-bold">{g.label}</div>
              </button>
            ))}
          </div>
          {errors.goal && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1" role="alert">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.goal}
            </p>
          )}
        </div>

        {/* Row 4: Cooking Time */}
        <div>
          <label htmlFor="cookingTime" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Total Daily Preparation & Cooking Time
          </label>
          <select
            id="cookingTime"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleInputChange}
            className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.cookingTime ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-amber-500'} rounded-2xl px-4 py-3 text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
          >
            {COOKING_TIMES.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
          {errors.cookingTime && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1" role="alert">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.cookingTime}
            </p>
          )}
        </div>

        {/* Row 5: Available Ingredients & Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Available ingredients */}
          <div>
            <label htmlFor="availableIngredients" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              Available Ingredients (Optional)
            </label>
            <textarea
              id="availableIngredients"
              name="availableIngredients"
              rows="3"
              value={formData.availableIngredients}
              onChange={handleInputChange}
              placeholder="e.g., tomatoes, pasta, garlic, eggs, olive oil"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 resize-y"
            />
          </div>

          {/* Allergies / Avoid */}
          <div>
            <label htmlFor="avoidIngredients" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              Allergies or Ingredients to Avoid (Optional)
            </label>
            <textarea
              id="avoidIngredients"
              name="avoidIngredients"
              rows="3"
              value={formData.avoidIngredients}
              onChange={handleInputChange}
              placeholder="e.g., nuts, gluten, lactose, peanut butter"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 resize-y"
            />
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex gap-4 pt-2">
          {/* Reset button */}
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 cursor-pointer"
          >
            Reset Form
          </button>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg hover:shadow-amber-500/10 transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Meal Plan'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
