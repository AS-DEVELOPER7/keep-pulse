import { supabase } from '@/lib/supabase/client.js';

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return { success: true, user: data.user, session: data.session };
}

export async function registerUser({ email, password, name }) {
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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/`,
    },
  });
  if (error) throw error;
  return { success: true, data };
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
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
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
