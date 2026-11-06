'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../hooks/useLanguage';
import { api } from '../../../lib/api';
import { DashboardStats } from '../../../types';
import {
  Sparkles,
  Calendar,
  Bell,
  HeartHandshake,
  Headphones,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-maroon">
              {t('admin.dashboard')}
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Real-time database records and pilgrimage operations metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/heritage"
              className="rounded-lg bg-primary-maroon px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
            >
              + {language === 'te' ? 'కొత్త క్షేత్రం' : 'New Heritage Location'}
            </Link>
          </div>
        </div>

        {/* Real Stats Cards */}
        {isLoading ? (
          <div className="py-16 text-center text-sm text-secondary-text">
            Calculating database metrics...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Heritage Sites Card */}
            <div className="rounded-xl border border-border-heritage bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
                  {t('admin.stats.totalHeritage')}
                </span>
                <Sparkles className="h-4 w-4 text-primary-maroon" />
              </div>
              <div className="text-3xl font-serif font-extrabold text-primary-maroon">
                {stats?.heritage.total || 0}
              </div>
              <div className="flex items-center justify-between text-[11px] text-secondary-text pt-2 border-t border-border-heritage">
                <span className="text-green-700 font-semibold">
                  {stats?.heritage.published || 0} Published
                </span>
                <span className="text-amber-700 font-semibold">
                  {stats?.heritage.draft || 0} Drafts
                </span>
              </div>
            </div>

            {/* Cultural Events */}
            <div className="rounded-xl border border-border-heritage bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
                  {t('admin.stats.events')}
                </span>
                <Calendar className="h-4 w-4 text-saffron" />
              </div>
              <div className="text-3xl font-serif font-extrabold text-charcoal">
                {stats?.events.total || 0}
              </div>
              <div className="text-[11px] text-secondary-text pt-2 border-t border-border-heritage">
                Scheduled ceremonies & exhibitions
              </div>
            </div>

            {/* Public Announcements */}
            <div className="rounded-xl border border-border-heritage bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
                  {t('admin.stats.announcements')}
                </span>
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-3xl font-serif font-extrabold text-charcoal">
                {stats?.announcements.total || 0}
              </div>
              <div className="text-[11px] text-secondary-text pt-2 border-t border-border-heritage">
                Active alerts and bulletins
              </div>
            </div>

            {/* Pilgrim Facilities */}
            <div className="rounded-xl border border-border-heritage bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
                  {t('admin.stats.facilities')}
                </span>
                <HeartHandshake className="h-4 w-4 text-green-700" />
              </div>
              <div className="text-3xl font-serif font-extrabold text-charcoal">
                {stats?.facilities.total || 0}
              </div>
              <div className="text-[11px] text-secondary-text pt-2 border-t border-border-heritage">
                Verified water, medical, ghats & parking
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Categories Chart Box */}
          <div className="lg:col-span-6 rounded-xl border border-border-heritage bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-primary-maroon">
              Heritage Locations by Category
            </h3>
            {stats?.heritage.byCategory && (
              <div className="space-y-3">
                {Object.entries(stats.heritage.byCategory).map(([cat, count]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-charcoal">
                      <span className="capitalize">{cat.replace('_', ' ')}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-ivory-subtle overflow-hidden">
                      <div
                        className="h-full bg-primary-maroon rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((count / (stats.heritage.total || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Management Shortcuts */}
          <div className="lg:col-span-6 rounded-xl border border-border-heritage bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-primary-maroon">
              Quick Administrative Tasks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/heritage"
                className="flex items-center justify-between rounded-lg border border-border-heritage p-3 hover:border-primary-maroon transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-heritage-gold" />
                  <span className="text-xs font-semibold text-charcoal group-hover:text-primary-maroon">
                    Manage Heritage
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 text-secondary-text group-hover:text-primary-maroon" />
              </Link>

              <Link
                href="/admin/events"
                className="flex items-center justify-between rounded-lg border border-border-heritage p-3 hover:border-primary-maroon transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-saffron" />
                  <span className="text-xs font-semibold text-charcoal group-hover:text-primary-maroon">
                    Manage Events
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 text-secondary-text group-hover:text-primary-maroon" />
              </Link>

              <Link
                href="/admin/announcements"
                className="flex items-center justify-between rounded-lg border border-border-heritage p-3 hover:border-primary-maroon transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-charcoal group-hover:text-primary-maroon">
                    Post Announcement
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 text-secondary-text group-hover:text-primary-maroon" />
              </Link>

              <Link
                href="/admin/facilities"
                className="flex items-center justify-between rounded-lg border border-border-heritage p-3 hover:border-primary-maroon transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-green-700" />
                  <span className="text-xs font-semibold text-charcoal group-hover:text-primary-maroon">
                    Manage Facilities
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 text-secondary-text group-hover:text-primary-maroon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
