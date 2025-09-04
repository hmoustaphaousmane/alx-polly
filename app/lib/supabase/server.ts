
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
  const awaitedCookieStore = await cookieStore;
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        get(name: string) {
          return awaitedCookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            awaitedCookieStore.set(name, value, options);
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Route Handler.
            // If you're using a Client Component, you'll need to pass the cookie set method from a Server Component,
            // or use the browser's `document.cookie` API instead.
            console.error("Error setting cookie:", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            awaitedCookieStore.delete({ name, ...options });
          } catch (error) {
            // The `cookies().delete()` method can only be called from a Server Component or Route Handler.
            // If you're using a Client Component, you'll need to pass the cookie set method from a Server Component,
            // or use the browser's `document.cookie` API instead.
            console.error("Error deleting cookie:", error);
          }
        },
      },
    },
  );
};
