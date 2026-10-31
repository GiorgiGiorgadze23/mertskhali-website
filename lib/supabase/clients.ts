import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anon);

/** Read-only client for public pages (no cookies, so pages can be cached). */
export function publicClient() {
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

/** Client bound to the signed-in admin's session (cookies). Use in admin pages and server actions. */
export async function sessionClient() {
  if (!url || !anon) throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  const store = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are read-only there; the session refreshes on the next action.
        }
      },
    },
  });
}

/** Full-access client for the scheduled GFF sync only. Never import into client components. */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
