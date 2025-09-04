import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import { logout } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";

export default async function Header() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Polly
      </Link>
      <nav className="flex gap-4 items-center">
        <Link href="/polls">View Polls</Link>
        {user ? (
          <>
            <Link href="/polls/create">Create Poll</Link>
            <form action={logout}>
              <Button variant="ghost" className="text-white hover:bg-gray-700">Logout</Button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
