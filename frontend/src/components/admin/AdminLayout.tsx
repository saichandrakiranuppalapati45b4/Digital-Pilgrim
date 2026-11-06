'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-secondary-text">
        Verifying administrative session...
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-ivory-subtle/50 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
};
