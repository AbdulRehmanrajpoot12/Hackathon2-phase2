'use client';

import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorAlertProps {
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorAlert({
  message,
  title = 'Error',
  dismissible = true,
  onDismiss,
  className,
}: ErrorAlertProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
        'border-red-200 dark:border-red-800',
        'animate-slide-down',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
