import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function isValidSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
}

let supabaseClient = null;

if (isValidSupabaseConfig()) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.error('Supabase client init failed:', error);
    supabaseClient = null;
  }
}

export const supabase = supabaseClient;

function getAuth() {
  if (supabase?.auth) {
    return supabase.auth;
  }

  return {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signUp: async () => ({ data: null, error: { message: 'Supabase client is not available.' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase client is not available.' } }),
    signOut: async () => ({ error: null }),
  };
}

export function getSession() {
  return getAuth().getSession();
}

export function subscribeToAuth(callback) {
  return getAuth().onAuthStateChange(callback);
}

export async function signUpWithEmail({ email, password }) {
  return getAuth().signUp({ email, password });
}

export async function signInWithEmail({ email, password }) {
  return getAuth().signInWithPassword({ email, password });
}

export async function signOut() {
  return getAuth().signOut();
}

export function clearSession() {
  if (!supabaseUrl) return;
  localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
}

