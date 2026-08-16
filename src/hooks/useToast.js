'use client';

import { useAppDispatch } from '@/lib/redux/hooks.js';
import { addToast, removeToast, clearToasts } from '@/store/slices/toastSlice';

export function useToast() {
  const dispatch = useAppDispatch();

  return {
    success: (message, title = 'Success') => {
      dispatch(addToast({ type: 'success', title, message }));
    },
    error: (message, title = 'Error') => {
      dispatch(addToast({ type: 'error', title, message }));
    },
    warning: (message, title = 'Validation Warning') => {
      dispatch(addToast({ type: 'warning', title, message }));
    },
    info: (message, title = 'Notification') => {
      dispatch(addToast({ type: 'info', title, message }));
    },
    remove: (id) => {
      dispatch(removeToast(id));
    },
    clear: () => {
      dispatch(clearToasts());
    },
  };
}
