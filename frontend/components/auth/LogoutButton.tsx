'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    console.log('[Logout] Clearing token and redirecting');

    // Clear localStorage
    localStorage.removeItem('better-auth.session_token');

    // Clear cookie
    document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to signin
    router.push('/signin');
    router.refresh(); // Force server to re-check auth
  };

  return null; // This is just a utility component, no UI
}
