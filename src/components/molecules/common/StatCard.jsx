'use client';

import React from 'react';
import { Card } from '@/components/atoms/Card.jsx';

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose'
}) {
  const iconColorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
  };

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h4 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </h4>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtext}
          </p>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${iconColorMap[color] || iconColorMap.indigo}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
}
