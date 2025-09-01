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

const placeholderPoll = {
  title: "Favorite Programming Language",
  description: "What's your go-to language for new projects?",
  options: ["TypeScript", "Python", "Rust", "Go"],
};

export default function PollPage({ params }: { params: { pollId: string } }) {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{placeholderPoll.title}</CardTitle>
          <CardDescription>{placeholderPoll.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <RadioGroup defaultValue={placeholderPoll.options[0]}>
              {placeholderPoll.options.map((option, index) => (
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
        </CardContent>
      </Card>
    </div>
  );
}