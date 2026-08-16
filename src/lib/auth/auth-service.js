import { supabase } from '@/lib/supabase/client.js';

export function isAuthConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
}

export async function loginUser({ email, password }) {
  if (!isAuthConfigured()) {
    throw new Error('Supabase authentication is not configured in environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return { success: true, user: data.user, session: data.session };
}

export async function registerUser({ email, password, name }) {
  if (!isAuthConfigured()) {
    throw new Error('Supabase authentication is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (error) throw error;
  return { success: true, user: data.user, session: data.session };
}

export async function loginWithGoogle() {
  if (!isAuthConfigured()) {
    throw new Error('Supabase project credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const redirectTarget = `${appUrl.replace(/\/$/, '')}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTarget,
      },
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    if (error?.message?.includes('redirect_uri_mismatch')) {
      throw new Error('Google OAuth Redirect URI Mismatch. Please add your redirect URL in Google Cloud Console & Supabase Auth Providers.');
    }
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function resetPasswordRequest({ email }) {
  if (!isAuthConfigured()) {
    throw new Error('Supabase authentication is not configured.');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl.replace(/\/$/, '')}/reset-password`,
  });
  if (error) throw error;
  return { success: true, data };
}

export async function updatePasswordNew({ password }) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return { success: true, data };
}

export async function logoutUser() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // ignore
  }
}
