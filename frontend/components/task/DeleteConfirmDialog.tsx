'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-4">
        {/* Warning icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-danger shadow-lg">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>

        {/* Title and message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Delete Task?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              "{taskTitle}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={handleConfirm}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
