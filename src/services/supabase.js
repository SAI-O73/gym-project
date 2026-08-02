import { createClient } from '@supabase/supabase-js';

const BUILT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const BUILT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function getRuntimeEnv(varName) {
  if (typeof window !== 'undefined' && window.__env__ && window.__env__[varName]) {
    return window.__env__[varName];
  }
  return '';
}

function getSupabaseUrl() {
  return getRuntimeEnv('VITE_SUPABASE_URL') || BUILT_SUPABASE_URL;
}

function getSupabaseAnonKey() {
  return getRuntimeEnv('VITE_SUPABASE_ANON_KEY') || BUILT_SUPABASE_ANON_KEY;
}

function isValidSupabaseConfig() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  if (!supabaseUrl || !supabaseAnonKey) return false;
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
}

let MEMORY_STORAGE = {};

function getStorage() {
  if (typeof window === 'undefined') return undefined;

  try {
    const testKey = '__supabase_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    console.warn('Supabase localStorage unavailable on this browser:', error?.message || error);
    return {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(MEMORY_STORAGE, key) ? MEMORY_STORAGE[key] : null;
      },
      setItem(key, value) {
        MEMORY_STORAGE[key] = String(value);
      },
      removeItem(key) {
        delete MEMORY_STORAGE[key];
      },
      clear() {
        MEMORY_STORAGE = {};
      },
    };
  }
}

function createSupabaseClientInstance() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!isValidSupabaseConfig()) {
    console.error(
      '❌ Supabase config invalid or missing. URL present:',
      !!supabaseUrl,
      '| Key present:',
      !!supabaseAnonKey
    );
    return null;
  }

  console.log('✅ Supabase config found, connecting to:', supabaseUrl);

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: getStorage(),
      },
    });
    console.log('✅ Supabase client created successfully.');
    return client;
  } catch (error) {
    console.error('❌ Supabase client init failed:', error);
    return null;
  }
}

let supabaseClient = null;
export let supabase = null;

function ensureSupabaseClient() {
  if (!supabase) {
    supabase = createSupabaseClientInstance();
  }
  return supabase;
}

function getAuth() {
  const client = ensureSupabaseClient();
  if (client?.auth) {
    return client.auth;
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

export function getSupabaseClient() {
  return ensureSupabaseClient();
}

export async function sendPasswordReset(email, redirectTo) {
  const client = ensureSupabaseClient();
  if (!client) return { data: null, error: { message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } };
  try {
    // Preferred v2 API
    const resp = await client.auth.resetPasswordForEmail(email, { redirectTo });
    console.log('sendPasswordReset response:', resp);
    return resp;
  } catch (error) {
    console.error('sendPasswordReset error:', error);
    return { data: null, error };
  }
}

export async function signOut() {
  return getAuth().signOut();
}

export function clearSession() {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl || typeof window === 'undefined') return;
  localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
}
