'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/atoms/Card.jsx';
import { Input } from '@/components/atoms/Input.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { useToast } from '@/hooks/useToast.js';
import { resetPasswordRequest } from '@/lib/auth/auth-service.js';
import { Activity, Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordRequest({ email });
      setIsSubmitted(true);
      toast.success('Password reset link sent to your email.');
    } catch (err) {
      toast.error(err?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your email and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {/* Form / Success Card */}
        <Card padding="p-6 sm:p-8" className="shadow-xl border-slate-200 dark:border-slate-800">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Check Your Email
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We sent a password reset link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. Please follow the instructions in the email to restore access.
              </p>
              <Button
                variant="outline"
                className="w-full justify-center mt-2"
                onClick={() => setIsSubmitted(false)}
              >
                Resend Link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full justify-center py-2.5"
                icon={KeyRound}
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
