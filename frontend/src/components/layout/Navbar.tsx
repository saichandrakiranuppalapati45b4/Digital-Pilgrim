'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from './LanguageSelector';
import {
  Compass,
  MapPin,
  Waves,
  Headphones,
  Bell,
  HeartHandshake,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Calendar,
  LogOut,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  const visitorNavItems = [
    { href: '/', label: t('nav.home'), icon: Compass },
    { href: '/pushkaralu', label: t('nav.pushkaralu'), icon: Waves },
    { href: '/heritage', label: t('nav.heritage'), icon: Sparkles },
    { href: '/map', label: t('nav.map'), icon: MapPin },
    { href: '/audio-guides', label: t('nav.audio'), icon: Headphones },
    { href: '/facilities', label: t('nav.facilities'), icon: HeartHandshake },
    { href: '/announcements', label: t('nav.announcements'), icon: Bell },
  ];

  const adminNavItems = [
    {
      href: '/admin/dashboard',
      shortLabel: language === 'te' ? 'డ్యాష్‌బోర్డ్' : 'Dashboard',
      fullLabel: t('admin.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/admin/heritage',
      shortLabel: language === 'te' ? 'పుణ్యక్షేత్రాలు' : 'Heritage',
      fullLabel: t('admin.heritageTab'),
      icon: Sparkles,
    },
    {
      href: '/admin/events',
      shortLabel: language === 'te' ? 'ఉత్సవాలు' : 'Events',
      fullLabel: t('admin.eventsTab'),
      icon: Calendar,
    },
    {
      href: '/admin/announcements',
      shortLabel: language === 'te' ? 'ప్రకటనలు' : 'Announcements',
      fullLabel: t('admin.announcementsTab'),
      icon: Bell,
    },
    {
      href: '/admin/facilities',
      shortLabel: language === 'te' ? 'సౌకర్యాలు' : 'Facilities',
      fullLabel: t('admin.facilitiesTab'),
      icon: HeartHandshake,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/' || href === '/admin/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E9DFD0] shadow-sm">
      {/* Top ornamental cultural ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-maroon via-saffron to-heritage-gold" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Tagline / Badge */}
          <Link
            href={isAdminRoute ? '/admin/dashboard' : '/'}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 group"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary-maroon text-heritage-gold shadow-md border border-heritage-gold/30 transition-transform group-hover:scale-105">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">DP</span>
            </div>
            <div>
              <div className="font-serif text-base sm:text-xl font-bold tracking-wide text-primary-maroon flex items-center gap-1.5 leading-none">
                DIGITAL PILGRIM
                {isAdminRoute ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary-maroon/10 text-primary-maroon font-sans font-bold border border-primary-maroon/20 tracking-wider uppercase">
                    Admin
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-saffron/10 text-saffron-dark font-sans font-semibold border border-saffron/30">
                    1.0
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-secondary-text hidden 2xl:block tracking-wide font-medium mt-1">
                {isAdminRoute
                  ? 'Administration & Operations Console'
                  : language === 'te'
                  ? 'గోదావరి దర్శనం • వారసత్వ అన్వేషణ'
                  : 'Explore Heritage • Experience Culture • Discover the Godavari'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAdminRoute ? (
            !isLoginPage && (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
                {adminNavItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                        active
                          ? 'bg-primary-maroon text-white shadow-sm'
                          : 'text-charcoal/80 hover:text-primary-maroon hover:bg-black/5'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden 2xl:inline">{item.fullLabel}</span>
                      <span className="2xl:hidden">{item.shortLabel}</span>
                    </Link>
                  );
                })}
              </nav>
            )
          ) : (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {visitorNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                      active
                        ? 'bg-primary-maroon text-white shadow-sm'
                        : 'text-charcoal/80 hover:text-primary-maroon hover:bg-black/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right actions: Compact Switcher, User/Public links & Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {isAdminRoute && !isLoginPage && (
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border-heritage bg-white/80 px-2.5 py-1 text-xs font-semibold text-charcoal/70 hover:text-primary-maroon hover:border-primary-maroon/30 transition-all shadow-sm"
                title="View Public Visitor Site"
              >
                <ExternalLink className="h-3 w-3 text-saffron" />
                <span className="hidden md:inline">Live Site</span>
              </Link>
            )}

            <LanguageSelector />

            {isAdminRoute ? (
              isLoginPage ? (
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary-maroon/25 px-3 py-1.5 text-xs font-semibold text-primary-maroon hover:bg-primary-maroon hover:text-white transition-all shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Public Site</span>
                </Link>
              ) : (
                <>
                  {user && (
                    <div className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-border-heritage bg-white/80 px-2.5 py-1 text-xs text-charcoal/80 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-medium truncate max-w-[140px]">{user.email}</span>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-100 transition-all shadow-sm"
                    title="Log Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t('admin.logout')}</span>
                  </button>
                </>
              )
            ) : (
              <Link
                href="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary-maroon/25 px-3 py-1.5 text-xs font-semibold text-primary-maroon hover:bg-primary-maroon hover:text-white transition-all shadow-sm"
                title="Admin Portal"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-saffron shrink-0" />
                <span className="hidden 2xl:inline">{t('nav.admin')}</span>
                <span className="2xl:hidden">Admin</span>
              </Link>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-ivory-subtle border border-border-heritage"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-heritage bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {isAdminRoute && !isLoginPage ? (
            <>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary-maroon text-white font-semibold'
                        : 'text-charcoal hover:bg-ivory-subtle'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.fullLabel}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border-heritage space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-charcoal hover:bg-ivory-subtle"
                >
                  <ExternalLink className="h-4 w-4 text-saffron" />
                  <span>View Public Visitor Site</span>
                </Link>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('admin.logout')}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {visitorNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary-maroon text-white'
                        : 'text-charcoal hover:bg-ivory-subtle'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border-heritage">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-primary-maroon hover:bg-ivory-subtle"
                >
                  <ShieldAlert className="h-4 w-4 text-saffron" />
                  <span>{t('nav.admin')}</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
