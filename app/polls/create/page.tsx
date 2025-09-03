"use client";

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createPoll } from "@/app/lib/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full mt-6" aria-disabled={pending}>
      {pending ? "Creating Poll..." : "Create Poll"}
    </Button>
  );
}

export default function CreatePollPage() {
  const [options, setOptions] = useState(["", ""]);
  const [date, setDate] = useState<Date | undefined>();

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>
            Fill out the details below to create your poll.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPoll}>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="question">Poll Title</Label>
                    <Input id="question" name="question" placeholder="What's your favorite color?" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="A brief description of your poll."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Poll Options</Label>
                    {options.map((option, index) => (
                      <Input
                        key={index}
                        name="option"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required={index < 2} // Require at least two options
                      />
                    ))}
                    <Button
                      variant="outline"
                      onClick={handleAddOption}
                      className="mt-2"
                      type="button"
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="multiple-options" name="allowMultipleOptions" />
                    <Label htmlFor="multiple-options">
                      Allow users to select multiple options
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="require-login" name="requireLogin" />
                    <Label htmlFor="require-login">
                      Require users to be logged in to vote
                    </Label>
                  </div>
                  <div className="grid gap-2">
                    <Label>Poll End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {date && <input type="hidden" name="endDate" value={date.toISOString()} />}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}