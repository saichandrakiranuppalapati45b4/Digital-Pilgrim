'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../hooks/useLanguage';
import { Compass, Sparkles, MapPin, Waves, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="mt-20 border-t border-border-heritage bg-white text-charcoal">
      {/* Decorative Golden Band */}
      <div className="h-1 bg-gradient-to-r from-heritage-gold via-saffron to-primary-maroon" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-maroon text-heritage-gold font-serif font-bold text-lg">
                DP
              </div>
              <span className="font-serif text-xl font-bold text-primary-maroon">
                DIGITAL PILGRIM 1.0
              </span>
            </div>
            <p className="text-sm text-secondary-text max-w-md leading-relaxed">
              {language === 'te'
                ? 'గోదావరి పుష్కరాలు మరియు ఆంధ్రప్రదేశ్ పవిత్ర పుణ్యక్షేత్రాల చారిత్రక, ఆధ్యాత్మిక వైభవాన్ని భక్తులకు అందించే డిజిటల్ వేదిక.'
                : 'A modern cultural technology platform bridging timeless Godavari heritage, spiritual rituals, and visitor assistance for pilgrims worldwide.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-maroon bg-ivory-subtle px-3 py-1.5 rounded-md border border-border-heritage inline-flex">
              <ShieldCheck className="h-4 w-4 text-heritage-gold" />
              <span>
                {language === 'te'
                  ? 'ధృవీకరించబడిన సాంస్కృతిక సమాచార వేదిక'
                  : 'Verified Cultural Information Platform'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-primary-maroon mb-3 border-b border-border-heritage pb-1">
              {language === 'te' ? 'ముఖ్య విభాగాలు' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-secondary-text">
              <li>
                <Link href="/pushkaralu" className="hover:text-primary-maroon transition-colors">
                  {t('nav.pushkaralu')}
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-primary-maroon transition-colors">
                  {t('nav.heritage')}
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-primary-maroon transition-colors">
                  {t('nav.map')}
                </Link>
              </li>
              <li>
                <Link href="/audio-guides" className="hover:text-primary-maroon transition-colors">
                  {t('nav.audio')}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-primary-maroon transition-colors">
                  {t('nav.facilities')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Demonstration Notice & Compliance */}
          <div>
            <h4 className="font-serif text-base font-bold text-primary-maroon mb-3 border-b border-border-heritage pb-1">
              {language === 'te' ? 'గమనిక & సమాచారం' : 'Compliance & Purpose'}
            </h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              {language === 'te'
                ? 'ఈ ప్రాజెక్ట్ హాకథాన్ మరియు సాంస్కృతిక సాంకేతిక ప్రదర్శన కోసం రూపొందించబడింది. ఇది అధికారిక ప్రభుత్వ ప్రకటనలకు ప్రత్యామ్నాయం కాదు.'
                : 'Built as an educational and cultural demonstration project for hackathons and public showcase. Demonstrates real-world civic and pilgrimage digital infrastructure.'}
            </p>
            <div className="mt-4">
              <Link
                href="/admin/login"
                className="text-xs text-primary-maroon hover:underline font-semibold"
              >
                {t('nav.admin')} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-border-heritage flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-text gap-4">
          <p>© 2026 Digital Pilgrim 1.0. Explore Heritage. Experience Culture. Discover the Godavari.</p>
          <p className="font-medium">
            {language === 'te' ? 'ఆంధ్రప్రదేశ్ సాంస్కృతిక వారసత్వం' : 'Andhra Pradesh Cultural Heritage Initiative'}
          </p>
        </div>
      </div>
    </footer>
  );
};
