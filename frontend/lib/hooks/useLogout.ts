'use client';

import { useRouter } from 'next/navigation';

/**
 * Client-side logout handler
 * Clears token and forces server re-check
 */
export function useLogout() {
  const router = useRouter();

  const logout = () => {
    console.log('[Logout] Clearing token and redirecting');

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('better-auth.session_token');
    }

    // Clear cookie
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;';

    console.log('[Logout] Token cleared, redirecting to /signin');

    // Hard redirect to force server re-check
    window.location.href = '/signin';
  };

  return logout;
}
