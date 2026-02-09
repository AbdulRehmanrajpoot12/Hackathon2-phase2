'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, CheckSquare, Check, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorAlert from '@/components/feedback/ErrorAlert';
import { cn } from '@/lib/utils';

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
          console.log('[SignUp] Already authenticated - redirecting to /tasks');
          router.replace('/tasks');
          return;
        }
      }
    };

    checkExistingAuth();
  }, [router]);

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains special character', met: /[^a-zA-Z\d]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSubmitted.current) {
      if (DEBUG) console.log('[SignUp] Already submitted, ignoring');
      return;
    }

    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);
    hasSubmitted.current = true;

    console.log('[SignUp] Starting sign up for:', email);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('[SignUp] Creating properly signed JWT token');

      // Import JWT utilities dynamically
      const { createSignedToken, storeToken } = await import('@/lib/jwt');

      // Create properly signed JWT token
      const token = await createSignedToken(email, name);

      if (DEBUG) console.log('[SignUp] Token created:', token.substring(0, 50) + '...');

      // Store token in localStorage and cookie
      storeToken(token);

      console.log('[SignUp] ✓ Redirecting to /tasks');

      window.location.href = '/tasks';
    } catch (err) {
      console.error('[SignUp] ❌ Error:', err);

      // Provide user-friendly error messages
      let errorMessage = 'Sign up failed. Please try again.';

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to create account. Please check your internet connection and try again.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timeout: The server took too long to respond. Please try again.';
        } else if (err.message.includes('exists') || err.message.includes('duplicate')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
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
          Create Account
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Get started with your premium task manager
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
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={setName}
          icon={<User className="h-4 w-4" />}
          required
          disabled={loading}
        />

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

        <div>
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

          {password && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      i < passwordStrength
                        ? strengthColors[passwordStrength - 1]
                        : 'bg-slate-200 dark:bg-slate-700'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Password strength: {strengthLabels[passwordStrength - 1] || 'Too weak'}
              </p>

              <div className="space-y-1">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-slate-400" />
                    )}
                    <span
                      className={cn(
                        req.met
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          icon={<Lock className="h-4 w-4" />}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          href="/signin"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
