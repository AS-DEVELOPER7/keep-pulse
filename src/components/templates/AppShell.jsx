'use client';

import React from 'react';
import { Sidebar } from '@/components/organisms/common/Sidebar.jsx';
import { Navbar } from '@/components/organisms/common/Navbar.jsx';
import { ToastContainer } from '@/components/atoms/ToastContainer.jsx';

export function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
