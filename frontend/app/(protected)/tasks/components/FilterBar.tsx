'use client';

import { cn } from '@/lib/utils';

export interface FilterBarProps {
  activeFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function FilterBar({ activeFilter, onFilterChange, taskCounts }: FilterBarProps) {
  const filters = [
    { value: 'all' as const, label: 'All', count: taskCounts.all },
    { value: 'active' as const, label: 'Active', count: taskCounts.active },
    { value: 'completed' as const, label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="inline-flex items-center gap-2 p-1 rounded-lg glass-card">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            activeFilter === filter.value
              ? 'bg-gradient-primary text-white shadow-soft'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          {filter.label}
          <span
            className={cn(
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              activeFilter === filter.value
                ? 'bg-white/20'
                : 'bg-slate-200 dark:bg-slate-700'
            )}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}
