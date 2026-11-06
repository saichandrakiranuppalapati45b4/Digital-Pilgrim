'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { HeritageLocation, FacilityItem } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedText } from '../../lib/utils';

interface LeafletMapProps {
  locations: HeritageLocation[];
  facilities?: FacilityItem[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  locations,
  facilities = [],
  center = [17.0005, 81.7778], // Rajahmundry Godavari river coordinates
  zoom = 11,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet in browser only
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon assets for Leaflet in Next.js bundler
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Cleanup existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView(center, zoom);

      mapInstanceRef.current = map;

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Custom Heritage Shrine Icon
      const heritageIcon = L.divIcon({
        className: 'custom-heritage-pin',
        html: `<div style="background-color: #7B263A; color: #FAF7F0; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid #C49A45; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 14px;">🏛️</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      });

      // Custom Facility Pin
      const facilityIcon = L.divIcon({
        className: 'custom-facility-pin',
        html: `<div style="background-color: #D97724; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.25); font-size: 12px;">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -26],
      });

      // Add Heritage Markers
      locations.forEach((loc) => {
        if (!loc.location?.latitude || !loc.location?.longitude) return;

        const name = getLocalizedText(loc.name, language);
        const desc = getLocalizedText(loc.description, language);
        const imageUrl = loc.images?.[0]?.url || '';

        const popupContent = `
          <div style="min-width: 220px; max-width: 260px; font-family: inherit;">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />`
                : ''
            }
            <span style="font-size: 10px; text-transform: uppercase; background: #FAF7F0; color: #7B263A; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #E9DFD0;">${loc.category}</span>
            <h4 style="margin: 6px 0 4px 0; font-size: 14px; font-weight: bold; color: #7B263A;">${name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #766B60; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${desc}</p>
            <a href="/heritage/${loc.slug}" style="display: inline-block; background: #7B263A; color: #FAF7F0; padding: 4px 10px; font-size: 11px; font-weight: bold; border-radius: 4px; text-decoration: none;">
              ${language === 'te' ? 'వివరాలు చూడండి &rarr;' : 'Explore Destination &rarr;'}
            </a>
          </div>
        `;

        L.marker([loc.location.latitude, loc.location.longitude], {
          icon: heritageIcon,
        })
          .addTo(map)
          .bindPopup(popupContent);
      });

      // Add Facility Markers
      facilities.forEach((fac) => {
        if (!fac.location?.latitude || !fac.location?.longitude) return;

        const name = getLocalizedText(fac.name, language);
        const desc = fac.description ? getLocalizedText(fac.description, language) : '';

        const popupContent = `
          <div style="min-width: 180px; font-family: inherit;">
            <span style="font-size: 10px; text-transform: uppercase; background: #D97724; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${fac.type.replace('_', ' ')}</span>
            <h4 style="margin: 6px 0 2px 0; font-size: 13px; font-weight: bold; color: #302A27;">${name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 11px; color: #766B60;">${fac.address}</p>
            ${fac.phone ? `<p style="margin: 0; font-size: 11px; font-weight: bold; color: #7B263A;">📞 ${fac.phone}</p>` : ''}
          </div>
        `;

        L.marker([fac.location.latitude, fac.location.longitude], {
          icon: facilityIcon,
        })
          .addTo(map)
          .bindPopup(popupContent);
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, facilities, language, center, zoom]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border-heritage shadow-heritage">
      <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 10 }} />
      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-border-heritage shadow-sm text-xs flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-medium text-charcoal">
          <span className="inline-block w-3 h-3 rounded-full bg-primary-maroon border border-heritage-gold"></span>
          <span>{language === 'te' ? 'పుణ్యక్షేత్రాలు' : 'Heritage Sites'}</span>
        </div>
        {facilities.length > 0 && (
          <div className="flex items-center gap-1.5 font-medium text-charcoal">
            <span className="inline-block w-3 h-3 rounded-full bg-saffron border border-white"></span>
            <span>{language === 'te' ? 'సౌకర్యాలు' : 'Facilities'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
