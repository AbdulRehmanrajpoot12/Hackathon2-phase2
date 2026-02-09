import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

/**
 * Protected Layout - SERVER COMPONENT
 * Checks auth on server, redirects BEFORE rendering
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read cookies on server
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token');

  console.log('[ProtectedLayout Server] Token present:', !!token);

  // Server-side redirect if no token
  if (!token) {
    console.log('[ProtectedLayout Server] No token - redirecting to /signin');
    redirect('/signin');
  }

  // Decode token to get user info
  let user = null;
  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]));
    user = {
      id: payload.sub || payload.user_id,
      email: payload.email || 'user@example.com',
      name: payload.name || payload.email?.split('@')[0] || 'User',
    };
    console.log('[ProtectedLayout Server] User authenticated:', user.email);
  } catch (error) {
    console.error('[ProtectedLayout Server] Invalid token - redirecting to /signin');
    redirect('/signin');
  }

  // Only render if authenticated
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar
        userName={user.name}
        userEmail={user.email}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
