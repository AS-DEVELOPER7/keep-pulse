'use client';

import React from 'react';
import { UI_THEME } from '@/lib/config/ui-theme.js';

export function Badge({
  status = 'ACTIVE',
  children,
  className = '',
}) {
  const preset = UI_THEME.colors.status[status] || UI_THEME.colors.status.ACTIVE;
  const labelText = children || preset.label;

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${preset.bg} ${preset.text} ${preset.border} ${className}`}
    >
      {labelText}
    </span>
  );
}
