'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  LayoutDashboard, 
  Layers, 
  ScrollText, 
  Code2, 
  Settings,
  Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: Layers },
  { label: 'Audit Logs', href: '/logs', icon: ScrollText },
  { label: 'Target SQL Setup', href: '/target-sql', icon: Code2 },
  { label: 'Settings & Cron', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-none">
            KeepPulse
          </h1>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Keep-Alive Engine
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors duration-150 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 m-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Zap className="w-4 h-4 fill-emerald-500" />
          <span>Engine Status: Active</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Supabase Auto-Ping Ready
        </p>
      </div>
    </aside>
  );
}
