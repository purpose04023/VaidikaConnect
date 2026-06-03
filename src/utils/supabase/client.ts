import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window === 'undefined') {
      console.warn("Supabase credentials missing during build. Using placeholder client.");
    }
    return createBrowserClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder-key'
    );
  }

  return createBrowserClient(url, key);
}

