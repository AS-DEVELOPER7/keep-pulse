'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Activity, 
  LayoutDashboard, 
  Layers, 
  ScrollText, 
  Code2, 
  Settings 
} from 'lucide-react';
import { ThemeToggle } from '@/components/molecules/common/ThemeToggle.jsx';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: Layers },
  { label: 'Audit Logs', href: '/logs', icon: ScrollText },
  { label: 'Target SQL Setup', href: '/target-sql', icon: Code2 },
  { label: 'Settings & Cron', href: '/settings', icon: Settings },
];

export function MobileNavDrawer({ isOpen, onClose }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-72 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                KeepPulse
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <ThemeToggle variant="compact" />
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            KeepPulse Keep-Alive Engine
          </div>
        </div>
      </div>
    </div>
  );
}
