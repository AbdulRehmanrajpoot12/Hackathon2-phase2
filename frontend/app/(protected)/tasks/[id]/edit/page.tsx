'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ErrorAlert from '@/components/feedback/ErrorAlert';
import DeleteConfirmDialog from '@/components/task/DeleteConfirmDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/hooks/useAuth';
import { getTask, updateTask, deleteTask } from '@/lib/api';

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskData, setTaskData] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log('[EditTask] useEffect triggered. Auth loading:', authLoading, 'User ID:', user?.id, 'Task ID:', unwrappedParams.id);

    // Wait for auth to complete before checking user
    if (authLoading) {
      console.log('[EditTask] Auth still loading, waiting...');
      return;
    }

    // Load task data from API
    const fetchTask = async () => {
      if (!user?.id) {
        console.log('[EditTask] No user ID after auth check - redirecting to signin');
        setFetchLoading(false);
        router.push('/signin');
        return;
      }

      try {
        console.log('[EditTask] Fetching task:', unwrappedParams.id);
        const task = await getTask(user.id, parseInt(unwrappedParams.id));
        console.log('[EditTask] Task fetched:', task);

        setTaskData(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('[EditTask] Failed to fetch task:', err);

        // Provide user-friendly error messages
        let errorMessage = 'Failed to load task';

        if (err instanceof Error) {
          if (err.message.includes('fetch') || err.message.includes('network')) {
            errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
          } else if (err.message.includes('404')) {
            errorMessage = 'Task not found. It may have been deleted.';
          } else if (err.message.includes('401') || err.message.includes('403')) {
            errorMessage = 'Authentication error. Please sign in again.';
            setTimeout(() => router.push('/signin'), 2000);
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
      } finally {
        console.log('[EditTask] Fetch complete - setting loading to false');
        setFetchLoading(false);
      }
    };

    fetchTask();
  }, [unwrappedParams.id, user?.id, authLoading, router, retryCount]);

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
      console.log('[EditTask] Updating task:', unwrappedParams.id, { title, description });
      await updateTask(user.id, parseInt(unwrappedParams.id), {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      console.log('[EditTask] Task updated successfully');
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push('/tasks');
      }, 1500);
    } catch (err) {
      console.error('[EditTask] Failed to update task:', err);

      // Provide user-friendly error messages
      let errorMessage = 'Failed to update task';

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Network error: Unable to save changes. Please check your internet connection and try again.';
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

  const handleDelete = async () => {
    if (!user?.id) {
      setError('Authentication error. Please sign in again.');
      setTimeout(() => router.push('/signin'), 2000);
      return;
    }

    try {
      console.log('Deleting task:', unwrappedParams.id);
      await deleteTask(user.id, parseInt(unwrappedParams.id));
      console.log('Task deleted successfully');

      // Redirect immediately
      router.push('/tasks');
    } catch (err) {
      console.error('Failed to delete task:', err);

      // Provide user-friendly error messages
      let errorMessage = 'Failed to delete task';

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Network error: Unable to delete task. Please check your internet connection and try again.';
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'Authentication error. Please sign in again.';
          setTimeout(() => router.push('/signin'), 2000);
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setShowDeleteDialog(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setFetchLoading(true);
    setRetryCount(prev => prev + 1);
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading task..." />
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {error ? (
          <>
            <ErrorAlert message={error} onDismiss={() => setError('')} />
            {error.includes('Network error') && (
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  onClick={handleRetry}
                  disabled={fetchLoading}
                  loading={fetchLoading}
                >
                  Retry
                </Button>
              </div>
            )}
          </>
        ) : (
          <ErrorAlert message="Task not found or has been deleted" />
        )}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/tasks')}
          >
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
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
              Edit Task
            </h1>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <SuccessMessage
            title="Task Updated"
            message="Your changes have been saved successfully. Redirecting..."
          />
        )}

        {/* Error message */}
        {error && (
          <div className="space-y-3">
            <ErrorAlert
              message={error}
              onDismiss={() => setError('')}
            />
            {error.includes('Network error') && !loading && (
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  onClick={handleRetry}
                  disabled={fetchLoading}
                  loading={fetchLoading}
                >
                  Retry Loading Task
                </Button>
              </div>
            )}
          </div>
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

            {/* Metadata */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Task Information
              </h3>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <p>Created: {new Date(taskData.created_at).toLocaleDateString()}</p>
                <p>Last updated: {new Date(taskData.updated_at).toLocaleDateString()}</p>
                <p>Status: <span className="capitalize">{taskData.completed ? 'Completed' : 'Active'}</span></p>
              </div>
            </div>

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
                Save Changes
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

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        taskTitle={title}
      />
    </>
  );
}
