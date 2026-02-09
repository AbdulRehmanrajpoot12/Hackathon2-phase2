'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import SortDropdown from './components/SortDropdown';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorAlert from '@/components/feedback/ErrorAlert';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import { useAuth } from '@/lib/hooks/useAuth';
import { getTasks, deleteTask, toggleTaskComplete, Task as ApiTask } from '@/lib/api';

export default function TasksPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch tasks from API
  useEffect(() => {
    console.log('[TasksPage] useEffect triggered. Auth loading:', authLoading, 'User ID:', user?.id);

    // Wait for auth to complete
    if (authLoading) {
      console.log('[TasksPage] Auth still loading, waiting...');
      return;
    }

    // Protected layout ensures user exists, but double-check
    if (!user?.id) {
      console.log('[TasksPage] No user ID after auth check - redirecting to signin');
      router.push('/signin');
      return;
    }

    const fetchTasks = async () => {
      try {
        console.log('[TasksPage] Fetching tasks for user:', user.id);
        setLoading(true);
        setError(null);
        const apiFilter = filter === 'active' ? 'pending' : filter === 'completed' ? 'completed' : 'all';
        const apiSort = sortBy === 'newest' || sortBy === 'oldest' ? 'created_at' : 'title';
        const data = await getTasks(user.id, apiFilter, apiSort);
        console.log('[TasksPage] Tasks fetched successfully:', data.length, 'tasks');
        setTasks(data);
      } catch (err) {
        console.error('[TasksPage] Failed to fetch tasks:', err);

        // Provide user-friendly error messages
        let errorMessage = 'Failed to load tasks';

        if (err instanceof Error) {
          if (err.message.includes('fetch') || err.message.includes('network')) {
            errorMessage = 'Network error: Unable to load tasks. Please check your internet connection and try again.';
          } else if (err.message.includes('401') || err.message.includes('403')) {
            errorMessage = 'Authentication error. Please sign in again.';
            setTimeout(() => router.push('/signin'), 2000);
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
      } finally {
        console.log('[TasksPage] Fetch complete - setting loading to false');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id, filter, sortBy, authLoading, router, retryCount]);

  // Handle task deletion
  const handleDelete = async (taskId: string) => {
    if (!user?.id) {
      setError('Authentication error. Please sign in again.');
      setTimeout(() => router.push('/signin'), 2000);
      return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      console.log('Deleting task:', taskId);
      await deleteTask(user.id, parseInt(taskId));
      console.log('Task deleted successfully');

      // Remove from local state
      setTasks(tasks.filter(t => t.id.toString() !== taskId));

      // Show success message
      setSuccessMessage('Task deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
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
        } else if (err.message.includes('404')) {
          errorMessage = 'Task not found. It may have already been deleted.';
          // Remove from local state anyway
          setTasks(tasks.filter(t => t.id.toString() !== taskId));
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    }
  };

  // Handle toggle complete
  const handleToggleComplete = async (taskId: string) => {
    if (!user?.id) {
      setError('Authentication error. Please sign in again.');
      setTimeout(() => router.push('/signin'), 2000);
      return;
    }

    try {
      console.log('Toggling task completion:', taskId);
      const updatedTask = await toggleTaskComplete(user.id, parseInt(taskId));
      console.log('Task toggled successfully:', updatedTask);

      // Update local state
      setTasks(tasks.map(t => t.id.toString() === taskId ? updatedTask : t));

      // Show success message
      setSuccessMessage(updatedTask.completed ? 'Task marked as completed' : 'Task marked as active');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to toggle task:', err);

      // Provide user-friendly error messages
      let errorMessage = 'Failed to update task';

      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = 'Network error: Unable to update task. Please check your internet connection and try again.';
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'Authentication error. Please sign in again.';
          setTimeout(() => router.push('/signin'), 2000);
        } else if (err.message.includes('404')) {
          errorMessage = 'Task not found. It may have been deleted.';
          // Remove from local state
          setTasks(tasks.filter(t => t.id.toString() !== taskId));
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // Convert API tasks to component format
  const convertedTasks = tasks.map(task => ({
    id: task.id.toString(),
    title: task.title,
    description: task.description || '',
    status: task.completed ? 'completed' as const : 'active' as const,
    createdAt: new Date(task.created_at),
  }));

  // Calculate task counts for all filters
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 shadow-glass">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Tasks
          </h1>
          <p className="text-slate-300 mb-6">
            Manage your tasks with style and efficiency
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => router.push('/tasks/new')}
            className="shadow-glow-primary-lg"
          >
            New Task
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
      </div>

      {/* Success message */}
      {successMessage && (
        <SuccessMessage
          title="Success"
          message={successMessage}
        />
      )}

      {/* Error message */}
      {error && (
        <div className="space-y-3">
          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
          />
          {error.includes('Network error') && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                onClick={handleRetry}
                disabled={loading}
                loading={loading}
              >
                Retry Loading Tasks
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Filters and sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <FilterBar
          activeFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Task list */}
      <TaskList
        tasks={convertedTasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />
    </div>
  );
}
