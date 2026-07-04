import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  DollarSign, 
  Users, 
  Globe, 
  Accessibility, 
  AlertTriangle, 
  RefreshCw,
  Info,
  Check
} from 'lucide-react';
import { TRAVEL_STYLES, INTERESTS, ACCESSIBILITY_OPTIONS, LANGUAGE_OPTIONS } from '../constants/options';

export default function FormSection({ 
  onSubmit, 
  onReset, 
  isLoading, 
  initialValues 
}) {
  const [formData, setFormData] = useState(initialValues || {
    destination: '',
    startDate: '',
    endDate: '',
    budget: 1500,
    travelers: 2,
    travelStyle: 'Solo',
    interests: ['Food', 'History'],
    accessibilityNeeds: 'None',
    languages: 'English'
  });
  
  const [errors, setErrors] = useState({});

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

  const handleStyleSelect = (styleValue) => {
    setFormData(prev => ({ ...prev, travelStyle: styleValue }));
  };

  const handleInterestToggle = (interestValue) => {
    setFormData(prev => {
      const current = prev.interests;
      const updated = current.includes(interestValue)
        ? current.filter(i => i !== interestValue)
        : [...current, interestValue];
      
      return { ...prev, interests: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required.';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (formData.startDate && newErrors.startDate === undefined) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be earlier than start date.';
      }
    }
    if (Number(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0.';
    }
    if (Number(formData.travelers) <= 0) {
      newErrors.travelers = 'Travelers count must be at least 1.';
    }
    if (!formData.interests.length) {
      newErrors.interests = 'Please select at least one interest.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }
    onSubmit(formData);
  };

  const handleClear = () => {
    const defaults = {
      destination: '',
      startDate: '',
      endDate: '',
      budget: 1500,
      travelers: 2,
      travelStyle: 'Solo',
      interests: ['Food', 'History'],
      accessibilityNeeds: 'None',
      languages: 'English'
    };
    setFormData(defaults);
    setErrors({});
    onReset();
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
            <Compass className="w-4 h-4 text-violet-500" />
            Where would you like to explore?
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            required
            placeholder="e.g. Kyoto, Japan or Rome, Italy"
            value={formData.destination}
            onChange={handleInputChange}
            className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.destination ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-violet-500'} rounded-2xl px-4 py-3 text-slate-850 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
          />
          {errors.destination && (
            <p className="text-xs text-rose-550 mt-1.5 flex items-center gap-1" role="alert">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.destination}
            </p>
          )}
        </div>

        {/* Start and End Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="startDate" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-500" />
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.startDate ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-violet-500'} rounded-2xl px-4 py-3 text-slate-805 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
            />
            {errors.startDate && (
              <p className="text-xs text-rose-550 mt-1.5 flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-500" />
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.endDate ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-violet-500'} rounded-2xl px-4 py-3 text-slate-805 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
            />
            {errors.endDate && (
              <p className="text-xs text-rose-550 mt-1.5 flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Travelers & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="travelers" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-500" />
              Travelers
            </label>
            <input
              id="travelers"
              name="travelers"
              type="number"
              min="1"
              max="50"
              required
              value={formData.travelers}
              onChange={handleInputChange}
              className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.travelers ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-violet-500'} rounded-2xl px-4 py-3 text-slate-850 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
            />
            {errors.travelers && (
              <p className="text-xs text-rose-550 mt-1.5 flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.travelers}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-violet-500" />
              Allocated Budget (USD)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="10"
              max="100000"
              required
              value={formData.budget}
              onChange={handleInputChange}
              className={`w-full bg-slate-50 dark:bg-zinc-950 border ${errors.budget ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-violet-500'} rounded-2xl px-4 py-3 text-slate-850 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold`}
            />
            {errors.budget && (
              <p className="text-xs text-rose-550 mt-1.5 flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.budget}
              </p>
            )}
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2.5">
            Travel Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {TRAVEL_STYLES.map((style) => (
              <button
                type="button"
                key={style.value}
                onClick={() => handleStyleSelect(style.value)}
                className={`text-center p-3 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 flex flex-col justify-center items-center ${
                  formData.travelStyle === style.value
                    ? 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500 text-violet-600 dark:text-violet-400 font-extrabold shadow-sm'
                    : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-black">{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interests (Multi-select) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2.5">
            Interests (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const isSelected = formData.interests.includes(interest.value);
              return (
                <button
                  type="button"
                  key={interest.value}
                  onClick={() => handleInterestToggle(interest.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/20'
                      : 'bg-slate-50 dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800/80 text-slate-655 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {interest.label}
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="text-xs text-rose-550 mt-1.5 flex items-center gap-1" role="alert">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.interests}
            </p>
          )}
        </div>

        {/* Languages & Accessibility Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Languages */}
          <div>
            <label htmlFor="languages" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-500" />
              Preferred Language
            </label>
            <select
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-violet-500 rounded-2xl px-4 py-3 text-slate-805 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility */}
          <div>
            <label htmlFor="accessibilityNeeds" className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-violet-500" />
              Accessibility Needs
            </label>
            <select
              id="accessibilityNeeds"
              name="accessibilityNeeds"
              value={formData.accessibilityNeeds}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:ring-violet-500 rounded-2xl px-4 py-3 text-slate-850 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all font-semibold"
            >
              {ACCESSIBILITY_OPTIONS.map((acc) => (
                <option key={acc.value} value={acc.value}>
                  {acc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-slate-350 disabled:opacity-50 cursor-pointer"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-750 hover:to-indigo-750 text-white rounded-2xl font-bold shadow-md hover:shadow-lg hover:shadow-violet-500/10 transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Planning Journey...
              </>
            ) : (
              'Discover Culture'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
