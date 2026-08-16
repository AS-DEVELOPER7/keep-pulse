'use client';

import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card.jsx';
import { FormField } from '@/components/molecules/common/FormField.jsx';
import { Input } from '@/components/atoms/Input.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { ShieldCheck, Database, Key, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SetupStepWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async (e) => {
    e.preventDefault();
    if (adminPassword.length < 6) {
      setError('Master Admin password must be at least 6 characters');
      return;
    }
    if (adminPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onComplete({
        admin_password: adminPassword,
      });
      router.push('/');
    } catch (err) {
      setError(err.message || 'Setup failed. Please check your Supabase credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-3">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome to KeepPulse
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Initial Application Setup & Configuration Wizard
        </p>
      </div>

      <Card padding="p-6 md:p-8" className="shadow-xl">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <Database className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Step 1: Database Setup Verification
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ensure you have executed the <code className="font-mono text-indigo-600">supabase/schema.sql</code> script in your Supabase SQL Editor.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-200">Required Supabase Tables:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><code className="font-mono">public.projects</code></li>
                <li><code className="font-mono">public.ping_logs</code></li>
                <li><code className="font-mono">public.system_config</code></li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>
              Continue to Admin Security &rarr;
            </Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <Key className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Step 2: Admin Security Setup
              </h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200">
                {error}
              </div>
            )}

            <FormField label="Master Admin Password" required description="Used to secure settings & project actions">
              <Input
                type="password"
                placeholder="Enter strong admin passcode"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Confirm Admin Password" required>
              <Input
                type="password"
                placeholder="Confirm admin passcode"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormField>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                &larr; Back
              </Button>
              <Button type="submit" isLoading={isLoading} icon={CheckCircle}>
                Complete Setup
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
