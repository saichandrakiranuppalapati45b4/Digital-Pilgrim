'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../hooks/useLanguage';
import { api } from '../lib/api';
import { HeritageLocation, AnnouncementItem } from '../types';
import { HeritageCard } from '../components/heritage/HeritageCard';
import { QRCodeViewer } from '../components/qr/QRCodeViewer';
import { getLocalizedText } from '../lib/utils';
import {
  Compass,
  Waves,
  MapPin,
  Headphones,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  QrCode,
  Calendar,
  Landmark,
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [featuredSites, setFeaturedSites] = useState<HeritageLocation[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [activeQRLocation, setActiveQRLocation] = useState<HeritageLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [heritageRes, annRes] = await Promise.all([
          api.getFeaturedHeritage(),
          api.getAnnouncements(),
        ]);
        if (heritageRes.success && heritageRes.data) {
          setFeaturedSites(heritageRes.data);
        }
        if (annRes.success && annRes.data) {
          setAnnouncements(annRes.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load homepage content:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Immersive Cultural Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2B0912] via-[#481220] to-[#1F070E] text-white pt-16 sm:pt-20 pb-20 sm:pb-24 border-b border-heritage-gold/30 shadow-heritage-lg">
        {/* Ambient Ghats & Golden Aarti Lighting Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85"
            alt="Sacred River Ghats"
            className="h-full w-full object-cover opacity-20 mix-blend-screen filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F070E] via-transparent to-[#2B0912]/80" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-saffron/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Cultural Ribbon Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-saffron/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-heritage-gold-light border border-heritage-gold/40 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-heritage-gold animate-pulse" />
              <span>{t('hero.tagline')}</span>
            </div>

            {/* Main Majestic Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFDF8] drop-shadow-md leading-[1.15]">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto font-normal">
              {t('hero.subtitle')}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/heritage"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron to-saffron-dark px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all hover:scale-105 border border-heritage-gold/30"
              >
                <Compass className="h-4 w-4 text-heritage-gold-light" />
                <span>{t('hero.exploreHeritage')}</span>
              </Link>

              <Link
                href="/map"
                className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all hover:scale-105"
              >
                <MapPin className="h-4 w-4 text-heritage-gold" />
                <span>{t('hero.interactiveMap')}</span>
              </Link>
            </div>
          </div>

          {/* 4 Cultural Highlights Pillars */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/15 hover:border-heritage-gold/50 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Calendar className="h-4 w-4 text-heritage-gold shrink-0" />
                <span className="text-xs font-bold text-heritage-gold-light uppercase tracking-wider">
                  {language === 'te' ? '12 ఏళ్ల చక్రం' : '12-Year Cycle'}
                </span>
              </div>
              <p className="text-xs text-white/80 line-clamp-2">
                {language === 'te'
                  ? 'బృహస్పతి సింహరాశి ప్రవేశ వేళ పవిత్ర ఉత్సవం'
                  : 'Sacred Jupiter transit across Leo (Simha Rasi)'}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/15 hover:border-heritage-gold/50 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Landmark className="h-4 w-4 text-heritage-gold shrink-0" />
                <span className="text-xs font-bold text-heritage-gold-light uppercase tracking-wider">
                  {language === 'te' ? 'పవిత్ర క్షేత్రాలు' : 'Sacred Shrines'}
                </span>
              </div>
              <p className="text-xs text-white/80 line-clamp-2">
                {language === 'te'
                  ? 'రాజమండ్రి, కొవ్వూరు & ద్రాక్షారామం ఘాట్లు'
                  : 'Rajahmundry, Kovvur & Godavari ghats'}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/15 hover:border-heritage-gold/50 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Headphones className="h-4 w-4 text-heritage-gold shrink-0" />
                <span className="text-xs font-bold text-heritage-gold-light uppercase tracking-wider">
                  {language === 'te' ? 'ఆడియో గైడ్లు' : 'Audio Guides'}
                </span>
              </div>
              <p className="text-xs text-white/80 line-clamp-2">
                {language === 'te'
                  ? 'తెలుగు మరియు ఇంగ్లీష్ ద్విభాషా కథనాలు'
                  : 'Bilingual temple history & traditions'}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/15 hover:border-heritage-gold/50 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <QrCode className="h-4 w-4 text-heritage-gold shrink-0" />
                <span className="text-xs font-bold text-heritage-gold-light uppercase tracking-wider">
                  {language === 'te' ? 'క్యూఆర్ దర్శనం' : 'QR Wayfinding'}
                </span>
              </div>
              <p className="text-xs text-white/80 line-clamp-2">
                {language === 'te'
                  ? 'ఆలయాల వద్ద మొబైల్ స్కాన్ సదుపాయం'
                  : 'Scan on-site for instant cultural history'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Ribbon if present */}
      {announcements.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-saffron/40 bg-saffron/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-saffron text-white shadow">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark">
                  {language === 'te' ? 'తాజా ప్రకటన' : 'Latest Advisory'}
                </span>
                <p className="text-sm font-semibold text-charcoal">
                  {getLocalizedText(announcements[0].title, language)}
                </p>
              </div>
            </div>
            <Link
              href="/announcements"
              className="text-xs font-bold text-primary-maroon hover:underline shrink-0 flex items-center gap-1"
            >
              <span>{language === 'te' ? 'అన్ని ప్రకటనలు' : 'View All Notices'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Pushkaralu Spotlight Feature Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-maroon to-[#541524] text-white p-6 sm:p-10 shadow-heritage-lg border border-heritage-gold/30">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-heritage-gold border border-heritage-gold/40">
                <Waves className="h-4 w-4" />
                <span>{t('pushkaralu.badge')}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                {t('pushkaralu.title')}
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
                {t('pushkaralu.subtitle')}
              </p>
              <div className="pt-2">
                <Link
                  href="/pushkaralu"
                  className="inline-flex items-center gap-2 rounded-lg bg-heritage-gold px-5 py-2.5 text-xs font-bold text-charcoal hover:bg-heritage-gold-light transition-colors shadow"
                >
                  <span>{language === 'te' ? 'పుష్కరాల పూర్తి వివరాలు' : 'Read Pushkaralu Guide'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center space-y-3">
              <div className="text-3xl font-serif font-bold text-heritage-gold">
                12 {language === 'te' ? 'సంవత్సరాలు' : 'Years'}
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {language === 'te'
                  ? 'బృహస్పతి రాశి చక్రం ఆధారంగా జరిగే పవిత్ర పుష్కర వేడుకలు'
                  : 'Celestial cycle governed by Jupiter transit across Leo (Simha Rasi)'}
              </p>
              <div className="pt-2 border-t border-white/20 text-[11px] text-white/70">
                {language === 'te' ? 'రాజమండ్రి • కొవ్వూరు • ద్రాక్షారామం' : 'Rajahmundry • Kovvur • Draksharamam'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Heritage Locations */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-heritage pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron">
              {language === 'te' ? 'పుణ్య క్షేత్రాలు' : 'Sacred Destinations'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-maroon">
              {t('heritage.featured')}
            </h2>
          </div>
          <Link
            href="/heritage"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-maroon hover:text-primary-hover"
          >
            <span>{language === 'te' ? 'అన్ని పుణ్యక్షేత్రాలు చూడండి' : 'Browse All Locations'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-secondary-text">
            {t('common.loading')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSites.map((site) => (
              <HeritageCard
                key={site._id}
                location={site}
                onOpenQR={(loc) => setActiveQRLocation(loc)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Audio Guides & QR Callouts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audio Feature */}
          <div className="rounded-2xl border border-border-heritage bg-white p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-maroon text-heritage-gold shadow">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-maroon">
                {t('audio.title')}
              </h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                {t('audio.subtitle')}
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/audio-guides"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-maroon px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
              >
                <span>{language === 'te' ? 'ఆడియోలు వినండి' : 'Listen to Audio Guides'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Map Callout */}
          <div className="rounded-2xl border border-border-heritage bg-white p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron text-white shadow">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal">
                {t('map.title')}
              </h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                {t('map.subtitle')}
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-maroon px-5 py-2.5 text-xs font-bold text-primary-maroon hover:bg-ivory-subtle transition-colors"
              >
                <span>{language === 'te' ? 'మ్యాప్ తెరవండి' : 'Explore Interactive Map'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QR Modal if triggered */}
      {activeQRLocation && (
        <QRCodeViewer
          location={activeQRLocation}
          onClose={() => setActiveQRLocation(null)}
        />
      )}
    </div>
  );
}
