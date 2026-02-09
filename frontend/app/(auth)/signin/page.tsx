'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import ErrorAlert from '@/components/feedback/ErrorAlert';

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const hasSubmitted = useRef(false);
  const hasCheckedAuth = useRef(false);

  // Check if already authenticated - redirect to tasks
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkExistingAuth = () => {
      // Check for existing token
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'better-auth.session_token' && value) {
          console.log('[SignIn] Already authenticated - redirecting to /tasks');
          router.replace('/tasks');
          return;
        }
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSubmitted.current) {
      if (DEBUG) console.log('[SignIn] Already submitted, ignoring');
      return;
    }

    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    hasSubmitted.current = true;

    console.log('[SignIn] Starting sign in for:', email);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('[SignIn] Creating properly signed JWT token');

      // Import JWT utilities dynamically
      const { createSignedToken, storeToken } = await import('@/lib/jwt');

      // Create properly signed JWT token
      const token = await createSignedToken(email, email.split('@')[0]);

      if (DEBUG) console.log('[SignIn] Token created:', token.substring(0, 50) + '...');

      // Store token in localStorage and cookie
      storeToken(token);

      console.log('[SignIn] ✓ Redirecting to /tasks');

      // Use window.location for hard redirect (forces server re-check)
      window.location.href = '/tasks';
    } catch (err) {
      console.error('[SignIn] ❌ Error:', err);

      // Provide user-friendly error messages
      let errorMessage = 'Sign in failed. Please try again.';

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to sign in. Please check your internet connection and try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timeout: The server took too long to respond. Please try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setLoading(false);
      hasSubmitted.current = false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow-primary mb-2">
          <CheckSquare className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Sign in to continue to your tasks
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          icon={<Mail className="h-4 w-4" />}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          icon={<Lock className="h-4 w-4" />}
          required
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
