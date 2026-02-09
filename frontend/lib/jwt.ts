/**
 * JWT Token Utilities
 * Creates properly signed JWT tokens for authentication
 *
 * NOTE: In production, token signing should happen on the server, not client-side.
 * This is for development/testing only.
 */

import { SignJWT } from 'jose';

const SECRET_KEY = process.env.BETTER_AUTH_SECRET || 'Q9TfixbrudNqlZjAKGGrMEBnPIkvwqBB';

/**
 * Create a properly signed JWT token
 */
export async function createSignedToken(email: string, name?: string): Promise<string> {
  const userId = `user-${Date.now()}`;

  // Convert secret to Uint8Array for jose library
  const secret = new TextEncoder().encode(SECRET_KEY);

  // Create JWT with proper signing
  const token = await new SignJWT({
    sub: userId,
    user_id: userId,
    email: email,
    name: name || email.split('@')[0],
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  console.log('[JWT] Created signed token for:', email);
  return token;
}

/**
 * Store token in both localStorage and cookie
 */
export function storeToken(token: string): void {
  if (typeof window === 'undefined') return;

  try {
    console.log('[JWT] Storing token...');

    // Store in localStorage
    localStorage.setItem('better-auth.session_token', token);

    // Store in cookie
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const secureFlag = isLocalhost ? '' : 'Secure;';

    document.cookie = `better-auth.session_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax; ${secureFlag}`;

    console.log('[JWT] ✓ Token stored successfully');

    // Verify storage
    const stored = localStorage.getItem('better-auth.session_token');
    const cookieStored = document.cookie.includes('better-auth.session_token');

    console.log('[JWT] Verification - localStorage:', stored ? 'YES' : 'NO');
    console.log('[JWT] Verification - cookie:', cookieStored ? 'YES' : 'NO');
  } catch (error) {
    console.error('[JWT] Error storing token:', error);
    throw error;
  }
}

/**
 * Clear token from all storage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('better-auth.session_token');
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;';
    console.log('[JWT] Token cleared from all storage');
  } catch (error) {
    console.error('[JWT] Error clearing token:', error);
  }
}
