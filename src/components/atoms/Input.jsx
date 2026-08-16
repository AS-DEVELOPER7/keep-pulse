'use client';

import React from 'react';
import { UI_THEME } from '@/lib/config/ui-theme.js';

export function Input({
  size = 'md',
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  const sizeClasses = UI_THEME.sizes.input[size] || UI_THEME.sizes.input.md;

  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        className={`w-full transition-colors duration-150 focus:outline-none ${sizeClasses} ${
          Icon ? 'pl-9' : ''
        } ${UI_THEME.colors.neutral.input} ${
          error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
