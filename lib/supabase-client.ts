import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

/**
 * Browser Supabase client — use only in Client Components ('use client').
 * Do not import lib/supabase.ts in client components (it uses next/headers).
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
