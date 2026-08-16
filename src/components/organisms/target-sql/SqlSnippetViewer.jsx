'use client';

import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { Check, Copy, Terminal, Info } from 'lucide-react';

const TARGET_SQL_SCRIPT = `-- ====================================================================
-- KEEP-PULSE TARGET PROJECT KEEP-ALIVE SETUP
-- Run this query in any target Supabase project SQL Editor
-- ====================================================================

-- 1. Create a lightweight keep-alive ping table in target project
CREATE TABLE IF NOT EXISTS public._keep_alive_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pinged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT DEFAULT 'KeepPulse Auto-Ping',
  notes TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public._keep_alive_pings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies allowing Read & Write access for KeepPulse
CREATE POLICY "Allow public select for keep_alive_pings" 
ON public._keep_alive_pings FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert for keep_alive_pings" 
ON public._keep_alive_pings FOR INSERT 
WITH CHECK (true);

-- 4. Create an automatic Cleanup Function (Keeps only last 50 pings to prevent database bloat)
CREATE OR REPLACE FUNCTION public.clean_old_keep_alive_pings()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public._keep_alive_pings
  WHERE id NOT IN (
    SELECT id FROM public._keep_alive_pings
    ORDER BY pinged_at DESC
    LIMIT 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger cleanup on every ping insert
DROP TRIGGER IF EXISTS trg_clean_old_pings ON public._keep_alive_pings;
CREATE TRIGGER trg_clean_old_pings
AFTER INSERT ON public._keep_alive_pings
FOR EACH STATEMENT
EXECUTE FUNCTION public.clean_old_keep_alive_pings();

-- 6. Insert initial test row
INSERT INTO public._keep_alive_pings (notes) VALUES ('Table created successfully by KeepPulse setup script');`;

export function SqlSnippetViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TARGET_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card padding="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Target Project SQL Setup Query
            </h3>
            <p className="text-xs text-slate-500">
              Copy and execute this script in your target Supabase project&apos;s SQL Editor to set up dedicated keep-alive pinging.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span>✨ 100% Zero-Setup Automatic Fallback Active</span>
            </p>
            <p>
              Running this SQL script is <strong>100% optional</strong>. KeepPulse automatically detects whether this table exists — if not, it seamlessly falls back to pinging the target project&apos;s REST API root (<code className="font-mono text-emerald-700 dark:text-emerald-300">/rest/v1/</code>) and Auth Health check (<code className="font-mono text-emerald-700 dark:text-emerald-300">/auth/v1/health</code>) to keep your project active without forcing you to run any SQL!
            </p>
          </div>
        </div>

        {/* Code Snippet Container */}
        <div className="mt-6 relative">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-400 text-xs font-mono rounded-t-xl border-b border-slate-800">
            <span>supabase_target_ping_setup.sql</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              icon={copied ? Check : Copy}
              className="py-1 text-xs"
            >
              {copied ? 'Copied!' : 'Copy SQL Script'}
            </Button>
          </div>
          <pre className="p-5 bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto rounded-b-xl max-h-96 leading-relaxed border border-slate-800">
            {TARGET_SQL_SCRIPT}
          </pre>
        </div>
      </Card>
    </div>
  );
}
