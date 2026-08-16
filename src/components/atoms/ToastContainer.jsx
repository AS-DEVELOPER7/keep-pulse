'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks.js';
import { removeToast } from '@/store/slices/toastSlice';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

function ToastItem({ toast }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  const styleConfig = {
    success: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400',
      Icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-500/10 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400',
      Icon: Info,
    },
  };

  const config = styleConfig[toast.type] || styleConfig.info;
  const IconComponent = config.Icon;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-200 animate-in slide-in-from-top-3 fade-in ${config.bg}`}
    >
      <div className={`p-1.5 rounded-xl flex-shrink-0 mt-0.5 ${config.iconBg}`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <h5 className="text-xs font-bold tracking-tight">
            {toast.title}
          </h5>
        )}
        <p className="text-xs opacity-90 mt-0.5 leading-relaxed break-words">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useAppSelector((state) => state.toast.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
