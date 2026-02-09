'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SuccessMessageProps {
  message: string;
  title?: string;
  className?: string;
}

export default function SuccessMessage({
  message,
  title = 'Success',
  className,
}: SuccessMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
        'border-green-200 dark:border-green-800',
        'animate-slide-down',
        className
      )}
      role="status"
    >
      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
