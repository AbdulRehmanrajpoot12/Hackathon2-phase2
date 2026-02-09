'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md w-full glass-card rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-glass text-center space-y-6 animate-scale-in">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-danger shadow-lg">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <button
          onClick={reset}
          className="w-full h-11 px-5 rounded-lg bg-gradient-primary text-white font-medium shadow-soft hover:shadow-glow-primary hover:scale-105 active:scale-100 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
