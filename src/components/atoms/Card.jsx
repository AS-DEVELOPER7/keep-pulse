'use client';

import React from 'react';
import { UI_THEME } from '@/lib/config/ui-theme.js';

export function Card({
  children,
  className = '',
  padding = 'p-5',
  ...props
}) {
  return (
    <div
      className={`${UI_THEME.colors.neutral.card} ${UI_THEME.radii.card} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
