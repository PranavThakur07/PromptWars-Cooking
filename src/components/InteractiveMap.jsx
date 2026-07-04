import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';

export default function InteractiveMap({ plan }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Compile all locations from the plan
  const locations = [];

  // 1. Itinerary Activities
  if (plan.itinerary) {
    Object.entries(plan.itinerary).forEach(([day, activities]) => {
      activities.forEach((act) => {
        if (typeof act.latitude === 'number' && typeof act.longitude === 'number') {
          locations.push({
            name: act.activityName,
            type: 'Activity',
            day: day,
            description: act.description,
            location: act.location,
            lat: act.latitude,
            lng: act.longitude,
            color: '#f59e0b', // amber
            emoji: '📍'
          });
        }
      });
    });
  }

  // 2. Hidden Gems
  if (plan.hiddenGems) {
    plan.hiddenGems.forEach((gem) => {
      if (typeof gem.latitude === 'number' && typeof gem.longitude === 'number') {
        locations.push({
          name: gem.name,
          type: 'Hidden Gem',
          description: `${gem.description} (Unique: ${gem.whyUnique})`,
          location: gem.location,
          lat: gem.latitude,
          lng: gem.longitude,
          color: '#8b5cf6', // violet
          emoji: '💎'
        });
      }
    });
  }

  // 3. Heritage Spots
  if (plan.heritage) {
    plan.heritage.forEach((item) => {
      if (typeof item.latitude === 'number' && typeof item.longitude === 'number') {
        locations.push({
          name: item.name,
          type: 'Heritage Site',
          description: `${item.description} (Significance: ${item.significance})`,
          location: item.location,
          lat: item.latitude,
          lng: item.longitude,
          color: '#ec4899', // pink
          emoji: '🏛️'
        });
      }
    });
  }

  // 4. Food Recommendations
  if (plan.food) {
    plan.food.forEach((fd) => {
      if (typeof fd.latitude === 'number' && typeof fd.longitude === 'number') {
        locations.push({
          name: `${fd.name} at ${fd.restaurantName}`,
          type: 'Authentic Food',
          description: `${fd.description} (Culture: ${fd.culturalSignificance})`,
          location: fd.restaurantName,
          lat: fd.latitude,
          lng: fd.longitude,
          color: '#10b981', // emerald
          emoji: '🍲'
        });
      }
    });
  }

  // 5. Events
  if (plan.events) {
    plan.events.forEach((ev) => {
      if (typeof ev.latitude === 'number' && typeof ev.longitude === 'number') {
        locations.push({
          name: ev.name,
          type: ev.type || 'Local Event',
          description: ev.description,
          location: ev.location,
          lat: ev.latitude,
          lng: ev.longitude,
          color: '#3b82f6', // blue
          emoji: '🎉'
        });
      }
    });
  }

  useEffect(() => {
    // Return early if no coordinates or Leaflet not loaded
    if (!locations.length || !window.L || !mapContainerRef.current) return;

    // Destroy existing map instance to avoid re-initialization errors
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Set center coordinates based on first location
    const centerLat = locations[0].lat;
    const centerLng = locations[0].lng;

    // Create Leaflet map instance
    const map = window.L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Use a premium Dark theme basemap from CartoDB which looks incredible in dark mode!
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create markers for each location
    const markerGroup = [];

    locations.forEach((loc) => {
      // Define custom HTML marker icon matching glassmorphism and color schemes
      const customIcon = window.L.divIcon({
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-200 hover:scale-125" 
               style="background-color: rgba(15, 23, 42, 0.9); border-color: ${loc.color}; color: ${loc.color}; box-shadow: 0 0 10px ${loc.color}60;">
            <span class="text-sm select-none">${loc.emoji}</span>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      // Construct interactive marker and popup detailing AI story
      const marker = window.L.marker([loc.lat, loc.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 max-w-[280px] bg-zinc-950 text-zinc-100 font-sans leading-relaxed rounded-xl">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-xs px-2 py-0.5 rounded-full font-bold uppercase" style="background-color: ${loc.color}25; color: ${loc.color};">
                ${loc.type}
              </span>
              ${loc.day ? `<span class="text-[10px] font-semibold text-zinc-400">${loc.day}</span>` : ''}
            </div>
            <h4 class="text-sm font-bold text-white mb-1.5 font-display flex items-center gap-1">
              ${loc.name}
            </h4>
            <p class="text-[11px] text-zinc-300 mb-2 leading-relaxed italic border-l-2 border-zinc-700 pl-2">
              "${loc.description}"
            </p>
            <div class="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold border-t border-zinc-800/80 pt-1.5">
              <span class="inline-block">📍</span>
              <span class="truncate">${loc.location}</span>
            </div>
          </div>
        `, {
          closeButton: false,
          className: 'custom-leaflet-popup-wrapper'
        });

      markerGroup.push(marker);
    });

    // Automatically fit bounds to contain all markers cleanly
    if (locations.length > 1) {
      const group = new window.L.featureGroup(markerGroup);
      map.fitBounds(group.getBounds().pad(0.15));
    }

  }, [locations.length]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 font-display">
              Culture Map Explorer
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
              Interactive geographic guide with coordinates generated by Culture Compass.
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
            📍 Activities
          </span>
          <span className="flex items-center gap-1 bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full">
            💎 Gems
          </span>
          <span className="flex items-center gap-1 bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded-full">
            🏛️ Heritage
          </span>
          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
            🍲 Dining
          </span>
          <span className="flex items-center gap-1 bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
            🎉 Events
          </span>
        </div>
      </div>

      {/* Map rendering canvas container */}
      <div 
        id="travel-map" 
        ref={mapContainerRef} 
        className="w-full h-[320px] md:h-[400px] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-inner z-0"
      />

      <div className="flex items-start gap-2 bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-900/60">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-zinc-400">
          <strong className="text-slate-700 dark:text-zinc-300">Pro Tip:</strong> Click any pin on the map to unlock its immersive AI story, local context, and heritage backstory instantly.
        </p>
      </div>
    </div>
  );
}
