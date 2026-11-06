'use client';

import React from 'react';
import Link from 'next/link';
import { HeritageLocation } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedText } from '../../lib/utils';
import { MapPin, Headphones, QrCode, ArrowRight } from 'lucide-react';

interface HeritageCardProps {
  location: HeritageLocation;
  onOpenQR?: (location: HeritageLocation) => void;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({ location, onOpenQR }) => {
  const { language, t } = useLanguage();

  const title = getLocalizedText(location.name, language);
  const description = getLocalizedText(location.description, language);
  const primaryImage =
    location.images?.find((img) => img.isPrimary)?.url ||
    location.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';

  const hasAudio = location.audioGuides && location.audioGuides.length > 0;

  const categoryLabels: Record<string, { en: string; te: string }> = {
    temple: { en: 'Temple', te: 'దేవాలయం' },
    ghat: { en: 'River Ghat', te: 'స్నాన ఘాట్' },
    spiritual_site: { en: 'Spiritual Site', te: 'ఆధ్యాత్మిక క్షేత్రం' },
    historical_monument: { en: 'Monument', te: 'చారిత్రక కట్టడం' },
    nature_cultural: { en: 'Nature & Culture', te: 'ప్రకృతి & సంస్కృతి' },
  };

  const categoryName = categoryLabels[location.category]
    ? language === 'te'
      ? categoryLabels[location.category].te
      : categoryLabels[location.category].en
    : location.category;

  return (
    <div className="heritage-card flex flex-col h-full overflow-hidden group">
      {/* Image Thumbnail with Category Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-ivory-subtle">
        <img
          src={primaryImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block rounded-md bg-primary-maroon/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white shadow-sm border border-heritage-gold/30">
            {categoryName}
          </span>
        </div>
        {hasAudio && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-sm px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
              <Headphones className="h-3 w-3 text-heritage-gold" />
              <span>{t('heritage.audioAvailable')}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold text-primary-maroon group-hover:text-primary-hover line-clamp-1 mb-2">
          <Link href={`/heritage/${location.slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-1 text-xs text-secondary-text mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-saffron" />
          <span className="truncate">{location.address}</span>
        </div>

        <p className="text-sm text-secondary-text line-clamp-3 mb-4 flex-1 leading-relaxed">
          {description}
        </p>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-border-heritage mt-auto">
          {onOpenQR && (
            <button
              onClick={() => onOpenQR(location)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-maroon hover:text-primary-hover p-1.5 rounded hover:bg-ivory-subtle transition-colors"
              title="Show QR Code"
            >
              <QrCode className="h-4 w-4 text-heritage-gold" />
              <span className="hidden sm:inline">{t('heritage.qrCode')}</span>
            </button>
          )}

          <Link
            href={`/heritage/${location.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary-maroon hover:text-primary-hover ml-auto transition-transform group-hover:translate-x-1"
          >
            <span>{t('heritage.viewDetails')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
