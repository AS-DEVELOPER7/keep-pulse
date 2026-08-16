'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/organisms/common/Sidebar.jsx';
import { Navbar } from '@/components/organisms/common/Navbar.jsx';
import { ToastContainer } from '@/components/atoms/ToastContainer.jsx';
import { supabase } from '@/lib/supabase/client.js';
import { Activity, Loader2 } from 'lucide-react';

export function AppShell({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuthStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && mounted) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          router.replace('/login');
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
        }
      } catch {
        if (mounted) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          router.replace('/login');
        }
      }
    }

    checkAuthStatus();

    // Listen for real-time auth changes (signed out, session expired)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_OUT' || !session) && mounted) {
        setIsAuthenticated(false);
        router.replace('/login');
      } else if (session && mounted) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Verifying Access Guard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
