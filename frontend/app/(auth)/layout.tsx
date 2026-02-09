'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center space-y-4">
          <div className="inline-block rounded-full border-solid border-transparent border-t-white border-r-white/50 animate-spin h-12 w-12 border-4" />
          <p className="text-slate-300 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // IMMEDIATE REDIRECT if authenticated
  if (user) {
    console.log('[AuthLayout] User authenticated - redirecting to /tasks');
    if (typeof window !== 'undefined') {
      window.location.href = '/tasks';
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center space-y-4">
          <div className="inline-block rounded-full border-solid border-transparent border-t-white border-r-white/50 animate-spin h-12 w-12 border-4" />
          <p className="text-slate-300 animate-pulse">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show auth pages
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl animate-pulse-glow animation-delay-1000" />
      </div>

      {/* Auth card */}
      <div className="relative w-full max-w-md">
        <div className="glass-frosted rounded-2xl shadow-glass border border-slate-200/20 dark:border-slate-700/20 p-8 animate-scale-in">
          {children}
        </div>
      </div>
    </div>
  );
}
