'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { FormField } from '@/components/molecules/common/FormField.jsx';
import { Input } from '@/components/atoms/Input.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { Server, Copy, Check, Palette } from 'lucide-react';
import { ThemeToggle } from '@/components/molecules/common/ThemeToggle.jsx';

import { useToast } from '@/hooks/useToast.js';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopyWebhookSecret = () => {
    const cronUrl = `${window.location.origin}/api/cron/trigger?secret=YOUR_CRON_SECRET`;
    navigator.clipboard.writeText(cronUrl);
    setCopied(true);
    toast.success('Cron trigger URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Settings & System Configuration"
        description="Configure automated background cron triggers and UI appearance settings."
      />

      <div className="space-y-6 max-w-3xl">
        {/* UI Appearance & Theme Selector Card */}
        <Card padding="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Interface Appearance & Theme
              </h3>
              <p className="text-xs text-slate-500">
                Customize your dashboard theme preference (Light, Dark, or sync with System OS settings).
              </p>
            </div>
          </div>

          <div className="mt-5">
            <ThemeToggle variant="cards" />
          </div>
        </Card>

        {/* Background Cron Execution Card */}
        <Card padding="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Automated Background Cron Endpoint
              </h3>
              <p className="text-xs text-slate-500">
                Configure your background worker, Supabase pg_cron, or Vercel Cron to invoke this URL automatically.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <FormField label="Cron Trigger Endpoint URL">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/api/cron/trigger` : '/api/cron/trigger'}
                />
                <Button
                  variant="outline"
                  icon={copied ? Check : Copy}
                  onClick={handleCopyWebhookSecret}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </FormField>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-200">Execution Options:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Supabase pg_cron</strong>: Run <code className="font-mono text-indigo-600">supabase/pg_cron_setup.sql</code> in your KeepPulse Supabase database.</li>
                <li><strong>Vercel Cron / GitHub Actions</strong>: Ping <code className="font-mono text-indigo-600">/api/cron/trigger?secret=...</code> hourly.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
