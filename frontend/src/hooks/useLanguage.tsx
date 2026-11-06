'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, BilingualText } from '../types';
import enTranslations from '../locales/en.json';
import teTranslations from '../locales/te.json';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  getLocalized: (item: BilingualText | string | undefined | null) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  te: teTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check saved user preference from localStorage
    try {
      const saved = localStorage.getItem('dp_lang_pref') as Language;
      if (saved === 'en' || saved === 'te') {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('dp_lang_pref', lang);
    } catch {
      // Ignore
    }
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English translation
        let fallbackVal = translations.en;
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  const getLocalized = (item: BilingualText | string | undefined | null): string => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    if (language === 'te' && item.te && item.te.trim().length > 0) {
      return item.te;
    }
    return item.en || item.te || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
