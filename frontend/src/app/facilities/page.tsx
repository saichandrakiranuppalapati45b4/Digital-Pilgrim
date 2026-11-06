'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../lib/api';
import { FacilityItem, FacilityType } from '../../types';
import { getLocalizedText } from '../../lib/utils';
import {
  HeartHandshake,
  Droplet,
  Building2,
  Phone,
  Clock,
  ShieldCheck,
  MapPin,
  Car,
  Utensils,
  Home,
  HelpCircle,
  Shield,
  Hospital,
} from 'lucide-react';

export default function FacilitiesPage() {
  const { t, language } = useLanguage();
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFacilities() {
      setIsLoading(true);
      try {
        const res = await api.getFacilities(selectedType || undefined);
        if (res.success && res.data) {
          setFacilities(res.data);
        }
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacilities();
  }, [selectedType]);

  const facilityTypes: { key: string; label: string; icon: any }[] = [
    { key: '', label: t('facilities.all'), icon: HeartHandshake },
    { key: 'drinking_water', label: t('facilities.drinking_water'), icon: Droplet },
    { key: 'restroom', label: t('facilities.restroom'), icon: Building2 },
    { key: 'hospital', label: t('facilities.hospital'), icon: Hospital },
    { key: 'food_prasadam', label: t('facilities.food_prasadam'), icon: Utensils },
    { key: 'parking', label: t('facilities.parking'), icon: Car },
    { key: 'accommodation', label: t('facilities.accommodation'), icon: Home },
    { key: 'ghat', label: t('facilities.ghat'), icon: MapPin },
    { key: 'information_center', label: t('facilities.information_center'), icon: HelpCircle },
    { key: 'police_assistance', label: t('facilities.police_assistance'), icon: Shield },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-saffron/10 px-3 py-1 text-xs font-bold text-saffron-dark">
          <HeartHandshake className="h-3.5 w-3.5 text-heritage-gold" />
          <span>{language === 'te' ? 'యాత్రికుల సేవలు' : 'Pilgrim Amenities'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary-maroon">
          {t('facilities.title')}
        </h1>
        <p className="text-sm sm:text-base text-secondary-text max-w-2xl">
          {t('facilities.subtitle')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {facilityTypes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setSelectedType(item.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary-maroon text-white shadow-sm'
                  : 'bg-white text-charcoal border border-border-heritage hover:bg-ivory-subtle'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Facilities Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-secondary-text">
          {t('common.loading')}
        </div>
      ) : facilities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-heritage bg-white p-12 text-center text-sm text-secondary-text">
          {language === 'te'
            ? 'ఈ విభాగంలో సౌకర్యాలు ఏవీ అందుబాటులో లేవు.'
            : 'No facilities currently found for this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => {
            const name = getLocalizedText(fac.name, language);
            const desc = fac.description ? getLocalizedText(fac.description, language) : '';

            return (
              <div
                key={fac._id}
                className="rounded-xl border border-border-heritage bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary-maroon transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-saffron/10 px-2 py-0.5 text-[11px] font-bold text-saffron-dark uppercase border border-saffron/20">
                      {fac.type.replace('_', ' ')}
                    </span>
                    {fac.isVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{t('facilities.verified')}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-charcoal">
                    {name}
                  </h3>

                  {desc && (
                    <p className="text-xs text-secondary-text leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-border-heritage text-xs text-secondary-text">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-saffron shrink-0 mt-0.5" />
                    <span>{fac.address}</span>
                  </div>

                  {fac.operatingHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-secondary-text shrink-0" />
                      <span>{fac.operatingHours}</span>
                    </div>
                  )}

                  {fac.phone && (
                    <div className="flex items-center gap-2 font-medium text-primary-maroon">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <a href={`tel:${fac.phone}`} className="hover:underline">
                        {fac.phone}
                      </a>
                    </div>
                  )}

                  {fac.location?.latitude && fac.location?.longitude && (
                    <div className="pt-2">
                      <a
                        href={`/map?lat=${fac.location.latitude}&lng=${fac.location.longitude}&zoom=15`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary-maroon hover:underline"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>{language === 'te' ? 'మ్యాప్‌లో చూడండి' : 'Locate on Map'} &rarr;</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
