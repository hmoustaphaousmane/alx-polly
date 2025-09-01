import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Polly
      </Link>
      <nav className="flex gap-4">
        <Link href="/polls">View Polls</Link>
        <Link href="/polls/create">Create Poll</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>
    </header>
  );
}
