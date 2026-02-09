import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Root page - SERVER COMPONENT
 * Checks auth cookie on server and redirects BEFORE sending HTML to client
 * NO loader, NO client-side flash
 */
export default async function HomePage() {
  // Read cookies on server
  const cookieStore = await cookies();
  const token = cookieStore.get('better-auth.session_token');

  console.log('[HomePage Server] Token present:', !!token);

  // Server-side redirect - happens BEFORE HTML is sent
  if (token) {
    console.log('[HomePage Server] Redirecting to /tasks');
    redirect('/tasks');
  } else {
    console.log('[HomePage Server] Redirecting to /signin');
    redirect('/signin');
  }

  // This code never executes - redirect throws
  return null;
}
