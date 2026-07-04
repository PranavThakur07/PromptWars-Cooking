import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Compass, Quote } from 'lucide-react';

export default function ItineraryTimeline({ itinerary }) {
  const days = Object.keys(itinerary || {}).sort();
  const [activeDay, setActiveDay] = useState(days[0] || '');

  if (!days.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 text-center text-slate-400 dark:text-zinc-500 font-bold">
        No itinerary available.
      </div>
    );
  }

  // Ensure active day is updated if the itinerary changes
  const currentDay = itinerary[activeDay] || itinerary[days[0]] || [];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header and Day Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
              Intelligent Itinerary
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
              Immersive, storytelling-focused scheduled daily journeys.
            </p>
          </div>
        </div>

        {/* Day Selectors */}
        <div className="flex flex-wrap gap-1.5">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer focus:outline-none ${
                activeDay === day
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
                  : 'bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative border-l-2 border-slate-100 dark:border-zinc-800/80 ml-4 pl-6 space-y-8 py-2">
        {currentDay.map((activity, idx) => (
          <div key={idx} className="relative group transition-all duration-300">
            
            {/* Timeline Dot */}
            <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-4 border-amber-500 flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform" />

            <div className="space-y-2">
              {/* Timing & Cost Header */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
                <span className="flex items-center gap-1 text-amber-500">
                  <Clock className="w-3.5 h-3.5" />
                  {activity.time}
                </span>
                
                {activity.cost > 0 ? (
                  <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" />
                    {activity.cost} USD
                  </span>
                ) : (
                  <span className="bg-slate-100 dark:bg-zinc-950 text-slate-500 px-2 py-0.5 rounded-md uppercase text-[9px] tracking-wider font-extrabold">
                    Free Entry
                  </span>
                )}
              </div>

              {/* Title & Experience description */}
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight flex items-center gap-1.5 group-hover:text-amber-500 transition-colors">
                  {activity.activityName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed border-l-2 border-slate-200 dark:border-zinc-800 pl-3 italic">
                  "{activity.description}"
                </p>
              </div>

              {/* Address / Location Tag */}
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-950 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
                <span className="truncate max-w-[240px]">{activity.location}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
