'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../lib/api';
import { HeritageLocation, HeritageAudio } from '../../types';
import { AudioPlayer } from '../../components/audio/AudioPlayer';
import { getLocalizedText } from '../../lib/utils';
import { Headphones, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface AudioGuideEntry {
  location: HeritageLocation;
  track: HeritageAudio;
}

export default function AudioGuidesPage() {
  const { t, language } = useLanguage();
  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<HeritageLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAudioSites() {
      try {
        const res = await api.getHeritage();
        if (res.success && res.data) {
          const withAudio = res.data.filter(
            (loc: HeritageLocation) => loc.audioGuides && loc.audioGuides.length > 0
          );
          setLocations(withAudio);
          if (withAudio.length > 0) {
            setSelectedLocation(withAudio[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load audio guides:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAudioSites();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-maroon/10 px-3 py-1 text-xs font-bold text-primary-maroon">
          <Headphones className="h-3.5 w-3.5 text-heritage-gold" />
          <span>{language === 'te' ? 'ఆడియో దర్శనం' : 'Audio Pilgrimage'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-maroon">
          {t('audio.title')}
        </h1>
        <p className="text-sm sm:text-base text-secondary-text max-w-2xl">
          {t('audio.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-secondary-text">
          {t('common.loading')}
        </div>
      ) : locations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-heritage bg-white p-12 text-center text-sm text-secondary-text">
          {language === 'te'
            ? 'ప్రస్తుతం ఆడియో గైడ్లు ఏవీ అందుబాటులో లేవు.'
            : 'No audio guides currently available.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Player Column */}
          <div className="lg:col-span-7 space-y-6">
            {selectedLocation && (
              <>
                <AudioPlayer
                  tracks={selectedLocation.audioGuides}
                  heritageName={getLocalizedText(selectedLocation.name, language)}
                />

                {/* Highlighted Destination Card */}
                <div className="rounded-xl border border-border-heritage bg-white p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-saffron">
                      {selectedLocation.category.replace('_', ' ')}
                    </span>
                    <Link
                      href={`/heritage/${selectedLocation.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary-maroon hover:underline"
                    >
                      <span>{t('heritage.viewDetails')}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary-maroon">
                    {getLocalizedText(selectedLocation.name, language)}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    {getLocalizedText(selectedLocation.description, language)}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Catalog of Audio Guide Locations */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-base font-bold text-primary-maroon border-b border-border-heritage pb-2">
              {t('audio.allTracks')} ({locations.length})
            </h3>
            <div className="space-y-3">
              {locations.map((loc) => {
                const isSelected = selectedLocation?._id === loc._id;
                const locName = getLocalizedText(loc.name, language);
                const thumb = loc.images?.[0]?.url;

                return (
                  <button
                    key={loc._id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left rounded-xl p-3 border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-primary-maroon bg-white shadow-md ring-1 ring-primary-maroon'
                        : 'border-border-heritage bg-white hover:bg-ivory-subtle'
                    }`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-ivory-subtle text-primary-maroon">
                        🏛️
                      </div>
                    )}
                    <div className="truncate flex-1">
                      <h4 className="text-xs font-bold text-charcoal truncate mb-0.5">
                        {locName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-secondary-text">
                        <span>🎧 {loc.audioGuides.length} {language === 'te' ? 'ఆడియోలు' : 'Track(s)'}</span>
                        <span>•</span>
                        <span className="capitalize">{loc.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
