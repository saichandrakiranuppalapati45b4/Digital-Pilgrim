'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../hooks/useLanguage';
import { api } from '../../../lib/api';
import { HeritageLocation } from '../../../types';
import { getLocalizedText } from '../../../lib/utils';
import { AudioPlayer } from '../../../components/audio/AudioPlayer';
import { QRCodeViewer } from '../../../components/qr/QRCodeViewer';
import {
  MapPin,
  ArrowLeft,
  Sparkles,
  BookOpen,
  QrCode,
  Download,
  Share2,
  Check,
  Compass,
} from 'lucide-react';

export default function HeritageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const { language, t } = useLanguage();

  const [location, setLocation] = useState<HeritageLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.getHeritageBySlug(slug as string);
        if (res.success && res.data) {
          setLocation(res.data);
        } else {
          setLocation(null);
        }
      } catch (err) {
        console.error('Failed to load heritage site:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-secondary-text">
        {t('common.loading')}
      </div>
    );
  }

  if (!location) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-primary-maroon">
          {language === 'te' ? 'పుణ్యక్షేత్రం కనుగొనబడలేదు' : 'Destination Not Found'}
        </h2>
        <p className="text-xs text-secondary-text">
          {language === 'te'
            ? 'మీరు అభ్యర్థించిన పేజీ అందుబాటులో లేదు లేదా చిరునామా తప్పుగా ఉంది.'
            : 'The requested heritage destination could not be located.'}
        </p>
        <Link
          href="/heritage"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-maroon hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{language === 'te' ? 'తిరిగి పుణ్యక్షేత్రాల జాబితాకు' : 'Back to Heritage Directory'}</span>
        </Link>
      </div>
    );
  }

  const title = getLocalizedText(location.name, language);
  const description = getLocalizedText(location.description, language);
  const history = getLocalizedText(location.history, language);
  const significance = getLocalizedText(location.significance, language);

  const images = location.images && location.images.length > 0
    ? location.images
    : [
        {
          url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
          caption: { en: 'Heritage destination', te: 'పుణ్యక్షేత్రం' },
          isPrimary: true,
        },
      ];

  const currentImage = images[selectedPhotoIndex] || images[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/heritage"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-maroon hover:text-primary-hover transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{language === 'te' ? 'పుణ్యక్షేత్రాల జాబితా' : 'Back to Heritage Directory'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-heritage bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-ivory-subtle shadow-sm transition-colors"
            title="Share destination link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Share2 className="h-3.5 w-3.5 text-primary-maroon" />}
            <span>{copied ? (language === 'te' ? 'కాపీ చేయబడింది' : 'Copied') : (language === 'te' ? 'షేర్ చేయండి' : 'Share')}</span>
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-maroon px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm transition-colors"
            title="View & Download QR Code"
          >
            <QrCode className="h-3.5 w-3.5 text-heritage-gold" />
            <span>{t('heritage.qrCode')}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary-maroon/10 px-2.5 py-1 text-xs font-bold text-primary-maroon uppercase border border-primary-maroon/20">
            {location.category.replace('_', ' ')}
          </span>
          {location.isFeatured && (
            <span className="rounded-md bg-saffron/15 px-2.5 py-1 text-xs font-bold text-saffron-dark border border-saffron/30">
              {language === 'te' ? 'ప్రముఖ క్షేత్రం' : 'Featured Site'}
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-maroon tracking-tight">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-text">
          <MapPin className="h-4 w-4 text-saffron shrink-0" />
          <span>{location.address}</span>
        </div>
      </div>

      {/* Media & Audio Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Photo Gallery (Main + Thumbnails) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ivory-subtle border border-border-heritage shadow-heritage">
            <img
              src={currentImage.url}
              alt={title}
              className="h-full w-full object-cover transition-all duration-300"
            />
            {currentImage.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-xs text-white/90">
                {getLocalizedText(currentImage.caption, language)}
              </div>
            )}
          </div>

          {/* Thumbnails row if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-primary-maroon ring-2 ring-primary-maroon/30 scale-105'
                      : 'border-border-heritage opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Audio Guide & Map Directions Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Audio Guide Component */}
          {location.audioGuides && location.audioGuides.length > 0 && (
            <AudioPlayer
              tracks={location.audioGuides}
              heritageName={title}
            />
          )}

          {/* Quick Map Coordinates Card */}
          <div className="rounded-xl border border-border-heritage bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary-maroon font-serif font-bold text-base">
              <Compass className="h-5 w-5 text-heritage-gold" />
              <span>{t('heritage.location')}</span>
            </div>
            <p className="text-xs text-secondary-text leading-relaxed">
              {location.address}
            </p>
            <div className="rounded-lg bg-ivory-subtle p-3 text-xs font-mono text-secondary-text border border-border-heritage">
              Lat: {location.location.latitude}, Long: {location.location.longitude}
            </div>
            <Link
              href={`/map?lat=${location.location.latitude}&lng=${location.location.longitude}&zoom=15`}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary-maroon py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
            >
              <MapPin className="h-4 w-4 text-heritage-gold" />
              <span>{t('heritage.getDirections')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Narrative Section: History & Spiritual Significance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* History */}
        <div className="rounded-2xl border border-border-heritage bg-white p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-primary-maroon font-serif text-xl font-bold border-b border-border-heritage pb-3">
            <BookOpen className="h-5 w-5 text-saffron" />
            <h2>{t('heritage.history')}</h2>
          </div>
          <div className="text-sm text-secondary-text leading-relaxed whitespace-pre-line">
            {history}
          </div>
        </div>

        {/* Significance */}
        <div className="rounded-2xl border border-border-heritage bg-white p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-primary-maroon font-serif text-xl font-bold border-b border-border-heritage pb-3">
            <Sparkles className="h-5 w-5 text-heritage-gold" />
            <h2>{t('heritage.significance')}</h2>
          </div>
          <div className="text-sm text-secondary-text leading-relaxed whitespace-pre-line">
            {significance}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeViewer
          location={location}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
