'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border-heritage bg-white p-8 shadow-heritage">
        {/* Header Icon */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-maroon text-heritage-gold shadow-md">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary-maroon">
            {t('admin.login')}
          </h1>
          <p className="text-xs text-secondary-text">
            {language === 'te'
              ? 'డిజిటల్ పిల్‌గ్రిమ్ నిర్వాహక పోర్టల్'
              : 'Digital Pilgrim Administration Console'}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">
              {t('admin.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@digitalpilgrim.org"
                className="w-full rounded-lg border border-border-heritage bg-white py-2.5 pl-10 pr-3 text-xs text-charcoal placeholder:text-secondary-text/60 focus:border-primary-maroon focus:outline-none focus:ring-1 focus:ring-primary-maroon"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">
              {t('admin.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border-heritage bg-white py-2.5 pl-10 pr-3 text-xs text-charcoal placeholder:text-secondary-text/60 focus:border-primary-maroon focus:outline-none focus:ring-1 focus:ring-primary-maroon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-maroon py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-heritage-gold" />
                <span>{t('admin.submit')}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border-heritage text-center text-[11px] text-secondary-text">
          Authorized personnel only. Sessions are encrypted using HttpOnly secure tokens.
        </div>
      </div>
    </div>
  );
}
