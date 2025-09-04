
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
        async get(name: string) {
          return awaitedCookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            awaitedCookieStore.set(name, value, options);
          } catch (error) {
            console.error("Error setting cookie:", error);
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            awaitedCookieStore.delete({ name, ...options });
          } catch (error) {
            console.error("Error deleting cookie:", error);
          }
        },
      },
    },
  );
};
