'use client';

import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import TaskCard, { Task } from './TaskCard';
import EmptyState from '@/components/feedback/EmptyState';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  const router = useRouter();

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title="No tasks found"
        description="Create your first task to get started with your premium task manager"
        action={
          <Button
            variant="primary"
            onClick={() => router.push('/tasks/new')}
          >
            Create Task
          </Button>
        }
      />
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <TaskCard
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
