'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../lib/api';
import { HeritageLocation, FacilityItem } from '../../types';
import { getLocalizedText } from '../../lib/utils';
import { MapPin, Sparkles, HeartHandshake, Layers } from 'lucide-react';

// Dynamically import Leaflet map with SSR disabled to prevent window is not defined errors
const DynamicLeafletMap = dynamic(
  () => import('../../components/maps/LeafletMap').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-border-heritage bg-ivory-subtle text-secondary-text text-sm">
        Loading Godavari Pilgrimage Map...
      </div>
    ),
  }
);

export default function MapPage() {
  const { t, language } = useLanguage();
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [showFacilities, setShowFacilities] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      try {
        const [locRes, facRes] = await Promise.all([
          api.getHeritage(),
          api.getFacilities(),
        ]);
        if (locRes.success && locRes.data) {
          setLocations(locRes.data);
        }
        if (facRes.success && facRes.data) {
          setFacilities(facRes.data);
        }
      } catch (err) {
        console.error('Failed to load map data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMapData();
  }, []);

  const filteredLocations = selectedCategory
    ? locations.filter((l) => l.category === selectedCategory)
    : locations;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-maroon/10 px-3 py-1 text-xs font-bold text-primary-maroon mb-2">
            <MapPin className="h-3.5 w-3.5 text-heritage-gold" />
            <span>{language === 'te' ? 'భౌగోళిక నక్షా' : 'Geographic Map'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-maroon">
            {t('map.title')}
          </h1>
          <p className="text-sm text-secondary-text max-w-2xl mt-1">
            {t('map.subtitle')}
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
              showFacilities
                ? 'bg-saffron text-white border-saffron shadow-sm'
                : 'bg-white text-charcoal border-border-heritage hover:bg-ivory-subtle'
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            <span>{language === 'te' ? 'యాత్రికుల సౌకర్యాలు' : 'Show Facilities'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
            selectedCategory === ''
              ? 'bg-primary-maroon text-white font-bold'
              : 'bg-white text-charcoal border border-border-heritage hover:bg-ivory-subtle'
          }`}
        >
          {t('heritage.allCategories')}
        </button>
        {['temple', 'ghat', 'spiritual_site', 'historical_monument', 'nature_cultural'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-maroon text-white font-bold'
                  : 'bg-white text-charcoal border border-border-heritage hover:bg-ivory-subtle'
              }`}
            >
              {t(`heritage.${cat}`)}
            </button>
          )
        )}
      </div>

      {/* Interactive Leaflet Map */}
      <DynamicLeafletMap
        locations={filteredLocations}
        facilities={showFacilities ? facilities : []}
        height="600px"
      />

      {/* Location Directory Snippet below map */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-primary-maroon">
          {language === 'te' ? 'నక్షాలోని క్షేత్రాల జాబితా' : 'Mapped Heritage Locations'} ({filteredLocations.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredLocations.map((loc) => (
            <a
              key={loc._id}
              href={`/heritage/${loc.slug}`}
              className="flex items-center gap-3 rounded-lg border border-border-heritage bg-white p-3 hover:border-primary-maroon transition-all group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ivory-subtle text-primary-maroon font-bold text-xs group-hover:bg-primary-maroon group-hover:text-white transition-colors">
                🏛️
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-charcoal group-hover:text-primary-maroon truncate">
                  {getLocalizedText(loc.name, language)}
                </h4>
                <p className="text-[11px] text-secondary-text truncate">{loc.address}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
