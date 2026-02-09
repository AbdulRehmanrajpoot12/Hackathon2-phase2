/**
 * Authentication hook - Single source of truth for auth state
 * RESET VERSION - Fixed loops and token handling
 */

import { useEffect, useState, useRef } from 'react';

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // CRITICAL: Only run once per mount
    if (hasChecked.current) {
      if (DEBUG) console.log('[useAuth] Already checked, skipping');
      return;
    }

    const checkAuth = () => {
      if (DEBUG) console.log('[useAuth] Starting auth check...');

      try {
        // Get token from storage (cookie first, then localStorage)
        const token = getToken();

        if (!token) {
          if (DEBUG) console.log('[useAuth] ❌ No token found');
          setUser(null);
          setIsLoading(false);
          hasChecked.current = true;
          return;
        }

        if (DEBUG) console.log('[useAuth] ✓ Token found:', token.substring(0, 30) + '...');

        // Decode and validate token
        const userData = decodeToken(token);

        if (!userData) {
          console.error('[useAuth] ❌ Invalid token - clearing storage');
          clearToken();
          setUser(null);
          setIsLoading(false);
          hasChecked.current = true;
          return;
        }

        if (DEBUG) console.log('[useAuth] ✓ User authenticated:', userData.id, userData.email);
        setUser(userData);
        setIsLoading(false);
        hasChecked.current = true;
      } catch (error) {
        console.error('[useAuth] ❌ Error checking auth:', error);
        clearToken();
        setUser(null);
        setIsLoading(false);
        hasChecked.current = true;
      }
    };

    checkAuth();
  }, []); // Empty deps - only run once

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}

// Helper: Get token from storage (cookie first, then localStorage)
function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // Check cookies first (more secure)
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'better-auth.session_token') {
        if (DEBUG) console.log('[getToken] Found token in cookie');
        return decodeURIComponent(value);
      }
    }

    // Fallback to localStorage
    const token = localStorage.getItem('better-auth.session_token');
    if (token) {
      if (DEBUG) console.log('[getToken] Found token in localStorage');
      return token;
    }

    if (DEBUG) console.log('[getToken] No token in cookie or localStorage');
    return null;
  } catch (error) {
    console.error('[getToken] Error reading token:', error);
    return null;
  }
}

// Helper: Decode JWT token
function decodeToken(token: string): User | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('[decodeToken] Invalid token structure - expected 3 parts, got', parts.length);
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    if (!payload) {
      console.error('[decodeToken] Empty payload');
      return null;
    }

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.error('[decodeToken] Token expired');
      return null;
    }

    // Extract user ID (try multiple fields)
    const userId = payload.sub || payload.user_id || payload.id;
    if (!userId) {
      console.error('[decodeToken] No user ID in token payload:', payload);
      return null;
    }

    const user: User = {
      id: userId,
      email: payload.email || 'user@example.com',
      name: payload.name || payload.email?.split('@')[0] || 'User',
    };

    if (DEBUG) console.log('[decodeToken] Decoded user:', user);
    return user;
  } catch (error) {
    console.error('[decodeToken] Token decode error:', error);
    return null;
  }
}

// Helper: Clear token from all storage
function clearToken() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('better-auth.session_token');
    // Clear cookie with all possible paths
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;';
    if (DEBUG) console.log('[clearToken] Token cleared from all storage');
  } catch (error) {
    console.error('[clearToken] Error clearing token:', error);
  }
}

// Export: Logout function
export function logout() {
  console.log('[logout] Logging out user');
  clearToken();

  // Use window.location for logout to ensure clean state
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
}

// Export: Store token after login/signup
export function storeToken(token: string) {
  if (typeof window === 'undefined') return;

  try {
    console.log('[storeToken] Storing token...');

    // Store in localStorage
    localStorage.setItem('better-auth.session_token', token);

    // Store in cookie (HttpOnly can't be set from JS, but we set secure flags)
    // For localhost, secure: false; for production, secure: true
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const secureFlag = isLocalhost ? '' : 'Secure;';

    document.cookie = `better-auth.session_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax; ${secureFlag}`;

    console.log('[storeToken] ✓ Token stored in localStorage and cookie');

    // Verify storage
    const stored = localStorage.getItem('better-auth.session_token');
    if (DEBUG) console.log('[storeToken] Verification - localStorage:', stored ? 'YES' : 'NO');

    const cookieStored = document.cookie.includes('better-auth.session_token');
    if (DEBUG) console.log('[storeToken] Verification - cookie:', cookieStored ? 'YES' : 'NO');
  } catch (error) {
    console.error('[storeToken] Error storing token:', error);
    throw error;
  }
}

// Export: Create mock JWT for testing
export function createMockToken(email: string, name?: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: `user-${Date.now()}`,
    user_id: `user-${Date.now()}`,
    email: email,
    name: name || email.split('@')[0],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  }));
  const signature = btoa('mock-signature-' + Date.now());
  return `${header}.${payload}.${signature}`;
}
