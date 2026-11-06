'use client';

import React, { useState } from 'react';
import { HeritageLocation } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedText } from '../../lib/utils';
import { Download, X, Copy, Check, ExternalLink } from 'lucide-react';

interface QRCodeViewerProps {
  location: HeritageLocation;
  onClose?: () => void;
}

export const QRCodeViewer: React.FC<QRCodeViewerProps> = ({ location, onClose }) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const title = getLocalizedText(location.name, language);
  const destinationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/heritage/${location.slug}`
    : `/heritage/${location.slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(destinationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!location.qrCode) return;
    const a = document.createElement('a');
    a.href = location.qrCode;
    a.download = `digital-pilgrim-qr-${location.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-heritage-gold/40 text-center">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-secondary-text hover:bg-ivory-subtle hover:text-charcoal transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Traditional Temple Motif Header */}
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-maroon text-heritage-gold shadow-md">
          🏛️
        </div>

        <h3 className="font-serif text-lg font-bold text-primary-maroon mb-1">
          {title}
        </h3>
        <p className="text-xs text-secondary-text mb-4">
          {t('heritage.scanPrompt')}
        </p>

        {/* QR Code Frame */}
        <div className="mx-auto mb-4 w-60 h-60 p-3 bg-[#FAF7F0] rounded-xl border-2 border-dashed border-heritage-gold flex items-center justify-center shadow-inner">
          {location.qrCode ? (
            <img
              src={location.qrCode}
              alt={`QR Code for ${title}`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-xs text-secondary-text font-mono">
              Generating QR Code...
            </div>
          )}
        </div>

        {/* URL Pill */}
        <div className="flex items-center justify-between rounded-lg bg-ivory-subtle px-3 py-1.5 text-xs text-secondary-text mb-5 border border-border-heritage">
          <span className="truncate max-w-[200px]">{destinationUrl}</span>
          <button
            onClick={handleCopyLink}
            className="p-1 text-primary-maroon hover:text-primary-hover transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            disabled={!location.qrCode}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-maroon px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            <Download className="h-4 w-4 text-heritage-gold" />
            <span>{t('heritage.downloadQr')}</span>
          </button>

          <a
            href={`/heritage/${location.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-primary-maroon px-4 py-2.5 text-xs font-bold text-primary-maroon hover:bg-ivory-subtle transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{t('heritage.viewDetails')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
