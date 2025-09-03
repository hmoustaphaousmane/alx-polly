import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { createClient } from '../lib/supabase/server'
import { cookies } from 'next/headers'
import { Database } from '../lib/supabase/database.types'
import { deletePoll } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { clearPollCreationSuccessCookie } from '../lib/actions'

type Poll = Database['public']['Tables']['polls']['Row']
type PollWithVoteCount = Poll & { votes: [{ count: number }] }

export default async function PollsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: polls, error } = await supabase
    .from("polls")
    .select(
      "*,"
       + "votes(count)"
    ) as { data: PollWithVoteCount[] | null; error: Error | null };

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  const successMessage = (cookieStore as any).get("poll_creation_success")?.value;
  if (successMessage) {
    clearPollCreationSuccessCookie();
  }

  return (
    <div className="container mx-auto p-4">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Available Polls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(polls ?? []).map((poll) => (
          <Card key={poll.id} className="h-full hover:shadow-lg transition-shadow flex flex-col">
            <Link href={`/polls/${poll.id}`} className="flex-grow">
              <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {(poll.options as string[]).map((option: string, i: number) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              </CardContent>
            </Link>
            <CardFooter className="flex justify-between items-center text-sm text-gray-500 p-6 pt-0">
              <span>{poll.votes[0].count.toLocaleString()} votes</span>
              <span>{new Date(poll.created_at).toLocaleDateString()}</span>
              {userId === poll.user_id && (
                <div className="flex gap-2 ml-auto">
                  <Link href={`/polls/edit/${poll.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <form action={deletePoll}>
                    <input type="hidden" name="pollId" value={poll.id} />
                    <Button variant="destructive" size="sm" type="submit">Delete</Button>
                  </form>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
