'use client';

import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRelativeTime } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt: Date;
}

export interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'group relative rounded-xl glass-card p-6',
        'border border-slate-200 dark:border-slate-700',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-glow-primary hover:border-primary-300 dark:hover:border-primary-700',
        'animate-slide-up'
      )}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Checkbox */}
            <button
              onClick={() => onToggleComplete?.(task.id)}
              className={cn(
                'mt-1 flex-shrink-0 h-6 w-6 rounded-full border-2 transition-all duration-200',
                'flex items-center justify-center',
                task.status === 'completed'
                  ? 'bg-gradient-primary border-transparent'
                  : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
              )}
              aria-label={task.status === 'completed' ? 'Mark as active' : 'Mark as completed'}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-white" />
              ) : (
                <Circle className="h-4 w-4 text-transparent" />
              )}
            </button>

            {/* Title and description */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'text-lg font-semibold mb-1 transition-colors duration-200',
                  'group-hover:bg-gradient-primary group-hover:bg-clip-text group-hover:text-transparent',
                  task.status === 'completed'
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-50'
                )}
              >
                {task.title}
              </h3>
              <p
                className={cn(
                  'text-sm line-clamp-2',
                  task.status === 'completed'
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-600 dark:text-slate-400'
                )}
              >
                {task.description}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <StatusBadge status={task.status} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatRelativeTime(task.createdAt)}
          </span>

          {/* Actions (visible on hover) */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => router.push(`/tasks/${task.id}/edit`)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Edit task"
            >
              <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
