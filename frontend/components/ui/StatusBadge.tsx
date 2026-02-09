'use client';

import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    active: 'bg-gradient-accent text-white',
    completed: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    pending: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
    cancelled: 'bg-gradient-to-r from-red-500 to-rose-500 text-white',
  };

  const labels = {
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        'shadow-soft',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
