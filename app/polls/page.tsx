import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const placeholderPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "What's your go-to language for new projects?",
    options: ["TypeScript", "Python", "Rust", "Go"],
    totalVotes: 1256,
    createdAt: "2025-08-15",
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    description: "Which framework do you prefer for building user interfaces?",
    options: ["React", "Vue", "Svelte", "Solid"],
    totalVotes: 894,
    createdAt: "2025-08-10",
  },
  {
    id: "3",
    title: "Tabs vs. Spaces",
    description: "The eternal debate. What is your choice?",
    options: ["Tabs", "Spaces"],
    totalVotes: 10321,
    createdAt: "2025-08-01",
  },
];

export default function PollsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Polls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderPolls.map((poll) => (
          <Link href={`/polls/${poll.id}`} key={poll.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {poll.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <span>{poll.totalVotes.toLocaleString()} votes</span>
                <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
