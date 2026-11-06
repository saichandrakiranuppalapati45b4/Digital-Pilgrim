'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../lib/api';
import { AnnouncementItem, AnnouncementPriority } from '../../types';
import { getLocalizedText, formatDate } from '../../lib/utils';
import { Bell, AlertTriangle, Info, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function AnnouncementsPage() {
  const { t, language } = useLanguage();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      setIsLoading(true);
      try {
        const res = await api.getAnnouncements(undefined, filterPriority || undefined);
        if (res.success && res.data) {
          setAnnouncements(res.data);
        }
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, [filterPriority]);

  const priorityStyles: Record<AnnouncementPriority, { bg: string; text: string; icon: any }> = {
    critical: { bg: 'bg-red-50 border-red-300', text: 'text-red-800', icon: AlertTriangle },
    high: { bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800', icon: AlertCircle },
    medium: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: Info },
    low: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-800', icon: Bell },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-saffron/10 px-3 py-1 text-xs font-bold text-saffron-dark">
          <Bell className="h-3.5 w-3.5 text-heritage-gold" />
          <span>{language === 'te' ? 'యాత్రికుల సమాచార విభాగం' : 'Visitor Bulletin'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-maroon">
          {t('announcements.title')}
        </h1>
        <p className="text-sm sm:text-base text-secondary-text max-w-2xl">
          {t('announcements.subtitle')}
        </p>
      </div>

      {/* Filter by priority */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterPriority('')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filterPriority === ''
              ? 'bg-primary-maroon text-white shadow-sm'
              : 'bg-white text-charcoal border border-border-heritage hover:bg-ivory-subtle'
          }`}
        >
          {language === 'te' ? 'అన్ని ప్రకటనలు' : 'All Announcements'}
        </button>
        {['critical', 'high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
              filterPriority === p
                ? 'bg-primary-maroon text-white shadow-sm'
                : 'bg-white text-charcoal border border-border-heritage hover:bg-ivory-subtle'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-secondary-text">
          {t('common.loading')}
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-heritage bg-white p-12 text-center text-sm text-secondary-text">
          {language === 'te'
            ? 'ప్రస్తుతం ఎటువంటి ప్రకటనలు లేవు.'
            : 'No announcements matching this filter.'}
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => {
            const style = priorityStyles[ann.priority] || priorityStyles.medium;
            const IconComponent = style.icon;

            return (
              <div
                key={ann._id}
                className={`rounded-xl border p-6 transition-all shadow-sm ${style.bg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-5 w-5 shrink-0 ${style.text}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                      {ann.type} • {ann.priority}
                    </span>
                  </div>
                  <span className="text-xs text-secondary-text font-medium">
                    {t('announcements.publishedOn')} {formatDate(ann.publishedAt, language)}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">
                  {getLocalizedText(ann.title, language)}
                </h3>

                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed whitespace-pre-line">
                  {getLocalizedText(ann.content, language)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
