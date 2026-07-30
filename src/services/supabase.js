import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function getSession() {
  return supabase.auth.getSession();
}

export async function signUpWithEmail({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { data, error };

  if (data?.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, full_name: name, email });
  }

  return { data, error };
}

export async function signInWithEmail({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function clearSession() {
  localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
}

export async function saveProfile(profile) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return supabase.from('profiles').upsert({ id: session.user.id, ...profile }).select().single();
}

export async function fetchProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return supabase.from('profiles').select('*').eq('id', session.user.id).single();
}

export async function saveContactMessage(message) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return supabase.from('messages').insert([{ user_id: session.user.id, ...message }]);
}
