'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ErrorAlert from '@/components/feedback/ErrorAlert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/hooks/useAuth';
import { createTask } from '@/lib/api';

export default function NewTaskPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (!user?.id) {
      setError('Authentication error. Please sign in again.');
      setTimeout(() => router.push('/signin'), 2000);
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('[NewTask] Creating task:', { title, description });
      await createTask(user.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      console.log('[NewTask] Task created successfully');
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push('/tasks');
      }, 1500);
    } catch (err) {
      console.error('[NewTask] Failed to create task:', err);

      // Provide user-friendly error messages
      let errorMessage = 'Failed to create task';

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Network error: Unable to create task. Please check your internet connection and try again.';
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'Authentication error. Please sign in again.';
          setTimeout(() => router.push('/signin'), 2000);
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Create New Task
        </h1>
      </div>

      {/* Success message */}
      {success && (
        <SuccessMessage
          title="Task Created"
          message="Your task has been created successfully. Redirecting..."
        />
      )}

      {/* Error message */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Form card */}
      <div className="glass-card rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-glass">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Task Title"
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={setTitle}
            required
            autoFocus
            maxLength={200}
          />

          <Textarea
            label="Description"
            placeholder="Enter task description..."
            value={description}
            onChange={setDescription}
            autoResize
            maxLength={1000}
            showCount
            rows={6}
          />

          {/* Preview card */}
          {title && (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Preview
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {title}
                </p>
                {description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={<Save className="h-4 w-4" />}
              className="flex-1"
            >
              Create Task
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Press <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Cmd+Enter</kbd> to save
      </p>
    </div>
  );
}
