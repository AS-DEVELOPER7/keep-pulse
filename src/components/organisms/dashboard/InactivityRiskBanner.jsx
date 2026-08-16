'use client';

import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function InactivityRiskBanner({ riskProjects = [] }) {
  if (!riskProjects || riskProjects.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold text-sm">
            Inactivity Pause Risk Warning ({riskProjects.length} Project{riskProjects.length > 1 ? 's' : ''})
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {riskProjects.map(p => p.name).join(', ')} has not received a ping in &gt;15 days and may be paused by Supabase!
          </p>
        </div>
      </div>
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors flex-shrink-0"
      >
        <span>Ping Risk Projects Now</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
