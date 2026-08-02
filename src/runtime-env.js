if (typeof window !== 'undefined' && !window.__env__) {
  window.__env__ = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    VITE_GEMINI_PROXY_URL: import.meta.env.VITE_GEMINI_PROXY_URL || '',
    VITE_RESET_REDIRECT: import.meta.env.VITE_RESET_REDIRECT || '',
    VITE_CONTACT_URL: import.meta.env.VITE_CONTACT_URL || '',
  };
}

export {};