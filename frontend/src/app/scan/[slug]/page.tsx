'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useLanguage } from '../../../hooks/useLanguage';
import { Sparkles, QrCode } from 'lucide-react';

export default function ScanLandingPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const { language, t } = useLanguage();
  const [error, setError] = useState(false);

  useEffect(() => {
    async function resolveQRDestination() {
      if (!slug) return;
      try {
        const res = await api.getHeritageBySlug(slug as string);
        if (res.success && res.data) {
          // Instantly redirect to the full heritage page
          router.replace(`/heritage/${res.data.slug}`);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    }

    resolveQRDestination();
  }, [slug, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-md py-24 text-center px-4 space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
          <QrCode className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-primary-maroon">
          {language === 'te' ? 'క్యూఆర్ కోడ్ చెల్లదు' : 'Invalid Heritage QR Code'}
        </h2>
        <p className="text-xs text-secondary-text">
          {language === 'te'
            ? 'ఈ క్యూఆర్ కోడ్‌కు సంబంధించిన పుణ్యక్షేత్రం గుర్తించబడలేదు లేదా ప్రచురించబడలేదు.'
            : 'The heritage location associated with this QR code could not be verified.'}
        </p>
        <a
          href="/heritage"
          className="inline-block rounded-lg bg-primary-maroon px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
        >
          {language === 'te' ? 'పుణ్యక్షేత్రాల డైరెక్టరీ' : 'Browse Heritage Directory'}
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-32 text-center px-4 space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-maroon text-heritage-gold animate-bounce shadow-md">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="font-serif text-xl font-bold text-primary-maroon">
        {language === 'te' ? 'గోదావరి దర్శనం లోడ్ అవుతోంది...' : 'Connecting to Digital Pilgrim...'}
      </h2>
      <p className="text-xs text-secondary-text font-medium">
        {language === 'te'
          ? 'మీరు స్కాన్ చేసిన క్షేత్ర వివరాలకు దారితీస్తున్నాము.'
          : 'Opening verified heritage destination and audio guide...'}
      </p>
    </div>
  );
}
