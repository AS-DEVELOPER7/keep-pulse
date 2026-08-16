'use client';

import React from 'react';
import { Modal } from '@/components/atoms/Modal.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Monitored Project',
  description = 'Are you sure you want to delete this project? This action cannot be undone and will permanently remove all stored ping history and configuration.',
  confirmText = 'Delete Project',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) {
  const modalFooter = (
    <div className="flex items-center justify-end gap-2.5">
      <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button
        type="button"
        className="bg-rose-600 hover:bg-rose-700 text-white border-none shadow-md shadow-rose-600/20"
        icon={Trash2}
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={modalFooter} maxWidth="max-w-md">
      <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
        <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-rose-900 dark:text-rose-200">
            Confirm Action Required
          </h4>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-300/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}
