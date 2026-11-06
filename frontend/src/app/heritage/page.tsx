'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../lib/api';
import { HeritageLocation, HeritageCategory } from '../../types';
import { HeritageCard } from '../../components/heritage/HeritageCard';
import { QRCodeViewer } from '../../components/qr/QRCodeViewer';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function HeritageDirectoryPage() {
  const { t, language } = useLanguage();
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeQRLocation, setActiveQRLocation] = useState<HeritageLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories: { key: string; label: string }[] = [
    { key: '', label: t('heritage.allCategories') },
    { key: 'temple', label: t('heritage.temple') },
    { key: 'ghat', label: t('heritage.ghat') },
    { key: 'spiritual_site', label: t('heritage.spiritual_site') },
    { key: 'historical_monument', label: t('heritage.historical_monument') },
    { key: 'nature_cultural', label: t('heritage.nature_cultural') },
  ];

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const res = await api.getHeritage({
        search,
        category: selectedCategory || undefined,
      });
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error('Failed to load heritage directory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocations();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Description Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-saffron/10 px-3 py-1 text-xs font-bold text-saffron-dark">
          <Sparkles className="h-3.5 w-3.5 text-heritage-gold" />
          <span>{language === 'te' ? 'పుణ్యక్షేత్ర దర్శనం' : 'Sacred Heritage'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-maroon">
          {t('heritage.title')}
        </h1>
        <p className="text-sm sm:text-base text-secondary-text max-w-2xl">
          {t('heritage.subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-text" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('heritage.searchPlaceholder')}
            className="w-full rounded-xl border border-border-heritage bg-white py-3 pl-12 pr-4 text-sm text-charcoal placeholder:text-secondary-text shadow-sm focus:border-primary-maroon focus:outline-none focus:ring-1 focus:ring-primary-maroon"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.key
                  ? 'bg-primary-maroon text-white shadow-sm'
                  : 'bg-white text-charcoal border border-border-heritage hover:bg-ivory-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-secondary-text">
          {t('common.loading')}
        </div>
      ) : locations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-heritage bg-white p-12 text-center space-y-3">
          <p className="text-sm text-secondary-text font-medium">
            {t('heritage.noResults')}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
            }}
            className="text-xs font-bold text-primary-maroon hover:underline"
          >
            {language === 'te' ? 'అన్నింటినీ రీసెట్ చేయండి' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <HeritageCard
              key={loc._id}
              location={loc}
              onOpenQR={(l) => setActiveQRLocation(l)}
            />
          ))}
        </div>
      )}

      {/* QR Viewer Modal */}
      {activeQRLocation && (
        <QRCodeViewer
          location={activeQRLocation}
          onClose={() => setActiveQRLocation(null)}
        />
      )}
    </div>
  );
}
