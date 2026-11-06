'use client';

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-border-heritage bg-white/95 p-0.5 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-primary-maroon text-white shadow-sm'
            : 'text-charcoal/75 hover:text-primary-maroon hover:bg-black/5'
        }`}
        title="English"
      >
        <span>EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('te')}
        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
          language === 'te'
            ? 'bg-primary-maroon text-white shadow-sm'
            : 'text-charcoal/75 hover:text-primary-maroon hover:bg-black/5'
        }`}
        title="తెలుగు"
      >
        <span>తెలుగు</span>
      </button>
    </div>
  );
};

