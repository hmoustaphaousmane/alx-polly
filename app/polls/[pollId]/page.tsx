import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { vote } from "@/app/lib/actions";
import React from "react";

export default async function PollPage({ params }: any) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: poll, error } = await supabase
    .from("polls")
    .select("*, votes(count)")
    .eq("id", params.pollId)
    .single();

  if (error || !poll) {
    console.error("Error fetching poll:", error?.message);
    notFound();
  }

  const totalVotes = poll.votes[0]?.count || 0;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={vote}>
            <input type="hidden" name="pollId" value={poll.id} />
            <RadioGroup name="selectedOption">
              {(poll.options as string[]).map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button type="submit" className="mt-4">
              Vote
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-500">
            Total Votes: {totalVotes.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}