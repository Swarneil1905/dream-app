import { createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

export type { Database } from './database.types';

// Server client - for use in server components and API routes (read-only cookies)
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// Route handler client - use in API routes and auth callback (Next.js 15: cookies must be awaited, supports get/set)
export async function createRouteHandlerClient() {
  const cookieStore = await cookies();
  return createSSRClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, (options as { path?: string; maxAge?: number; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean }) ?? {});
            } catch {
              // ignore
            }
          });
        },
      },
    }
  );
}
