"use client";

import { Button } from "@/components/ui/button";
import { deletePoll } from "@/app/lib/actions";
import { useTransition } from "react";

interface DeletePollButtonProps {
  pollId: string;
}

export function DeletePollButton({ pollId }: DeletePollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      startTransition(async () => {
        await deletePoll(new FormData(event.currentTarget));
      });
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <input type="hidden" name="pollId" value={pollId} />
      <Button variant="destructive" size="sm" type="submit" disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
}
