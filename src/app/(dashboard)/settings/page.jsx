'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/organisms/common/PageHeader.jsx';
import { Card } from '@/components/atoms/Card.jsx';
import { Input } from '@/components/atoms/Input.jsx';
import { Button } from '@/components/atoms/Button.jsx';
import { ThemeToggle } from '@/components/molecules/common/ThemeToggle.jsx';
import { useToast } from '@/hooks/useToast.js';
import { getCurrentUser, updateUserProfile, updatePasswordNew } from '@/lib/auth/auth-service.js';
import { User, Mail, Lock, Eye, EyeOff, KeyRound, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(null);

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        setEmail(user.email || '');
        setName(user.user_metadata?.name || user.email?.split('@')[0] || '');
      }
    });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Please enter a valid full name.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateUserProfile({ name });
      toast.success('Account profile updated successfully!');
      const updated = await getCurrentUser();
      if (updated) setCurrentUser(updated);
    } catch (err) {
      toast.error(err?.message || 'Failed to update account profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.warning('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      toast.warning('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updatePasswordNew({ password: newPassword });
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Account Settings & Appearance"
        description="Manage your account profile details, security credentials, and dashboard theme."
      />

      <div className="space-y-6 max-w-3xl">
        {/* Account Profile Details Card */}
        <Card padding="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Account Details &amp; Profile
              </h3>
              <p className="text-xs text-slate-500">
                View and update your display name and registered email address.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
            <Input
              label="Email Address (Registered)"
              type="email"
              icon={Mail}
              value={email}
              disabled
              className="opacity-75 cursor-not-allowed"
            />

            <Input
              label="Full Display Name"
              type="text"
              placeholder="Your Full Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Button type="submit" icon={Save} isLoading={isUpdatingProfile}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Security Card */}
        <Card padding="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Security &amp; Change Password
              </h3>
              <p className="text-xs text-slate-500">
                Update your account password to maintain security access.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your new password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Button type="submit" icon={Save} isLoading={isUpdatingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* UI Appearance & Theme Selector Card */}
        <Card padding="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Interface Appearance &amp; Theme
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
      </div>
    </div>
  );
}
