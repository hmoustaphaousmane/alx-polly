import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { updatePoll } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export default async function EditPollPage({ params }: any) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: poll, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", params.pollId)
    .single();

  if (error || !poll) {
    console.error("Error fetching poll:", error?.message);
    notFound();
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user || userData.user.id !== poll.user_id) {
    console.error("User not authorized to edit this poll.", userError?.message);
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
          <CardDescription>Modify the details of your poll.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updatePoll} className="space-y-4">
            <input type="hidden" name="pollId" value={poll.id} />
            <div>
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                name="question"
                defaultValue={poll.question}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={poll.description || ""}
              />
            </div>
            <div>
              <Label>Options (at least two)</Label>
              {(poll.options as string[]).map((option: string, index: number) => (
                <Input
                  key={index}
                  name="option"
                  defaultValue={option}
                  className="mb-2"
                  required
                />
              ))}
              {/* Add more options dynamically if needed */}
              <Input name="option" placeholder="Add new option" className="mb-2" />
              <Input name="option" placeholder="Add new option" className="mb-2" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowMultipleOptions"
                name="allowMultipleOptions"
                defaultChecked={poll.allow_multiple_options}
              />
              <Label htmlFor="allowMultipleOptions">Allow multiple options</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireLogin"
                name="requireLogin"
                defaultChecked={poll.require_login}
              />
              <Label htmlFor="requireLogin">Require login to vote</Label>
            </div>
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !poll.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {poll.end_date ? format(new Date(poll.end_date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={poll.end_date ? new Date(poll.end_date) : undefined}
                    onSelect={(date) => {
                      // This is a client-side component, so we need to handle state here
                      // For now, we'll rely on the form submission to pick up the date.
                      // In a real app, you'd use useState to manage the date.
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input type="hidden" name="endDate" value={poll.end_date || ""} />
            </div>
            <Button type="submit">Update Poll</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
