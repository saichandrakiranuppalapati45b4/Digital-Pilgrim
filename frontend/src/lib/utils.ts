import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BilingualText, Language } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedText(
  item: BilingualText | { en: string; te?: string } | string | undefined | null,
  lang: Language = 'en'
): string {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (lang === 'te') {
    return item.te && item.te.trim().length > 0 ? item.te : item.en || '';
  }
  return item.en || item.te || '';
}

export function formatDate(dateString: string | Date | undefined, lang: Language = 'en'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const locale = lang === 'te' ? 'te-IN' : 'en-IN';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(seconds: number | undefined): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
