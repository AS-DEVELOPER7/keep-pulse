'use client';

import React from 'react';
import { UI_THEME } from '@/lib/config/ui-theme.js';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const sizeClasses = UI_THEME.sizes.button[size] || UI_THEME.sizes.button.md;
  
  let variantClasses = UI_THEME.colors.primary.light;
  if (variant === 'outline') {
    variantClasses = UI_THEME.colors.primary.outline;
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
  } else if (variant === 'danger') {
    variantClasses = 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
