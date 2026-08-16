'use client';

import React from 'react';

export function FormField({
  label,
  description,
  error,
  required,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children}
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
