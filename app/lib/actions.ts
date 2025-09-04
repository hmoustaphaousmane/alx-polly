"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export async function createPoll(formData: FormData) {
  const supabase = await createClient(cookies());
  const question = formData.get("question")?.toString() || "";
  const description = formData.get("description")?.toString() || null;
  const options = formData.getAll("option").map(opt => opt.toString());
  const allowMultipleOptions = formData.get("allowMultipleOptions") === "on";
  const requireLogin = formData.get("requireLogin") === "on";
  const endDate = formData.get("endDate") as string | null;

  // Filter out empty options
  const filteredOptions = options.filter((option) => option.trim() !== "");

  if (!question || filteredOptions.length < 2) {
    // In a real app, you'd handle this with more user-friendly error messages
    console.error("Poll question and at least two options are required.");
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("User not authenticated:", userError?.message);
    redirect("/login"); // Redirect to login if not authenticated
  }

  const userId = userData.user.id;

  try {
    const { data, error } = await supabase.from("polls").insert([
      {
        user_id: userId,
        question: question,
        description: description,
        options: filteredOptions,
        allow_multiple_options: allowMultipleOptions,
        require_login: requireLogin,
        end_date: endDate,
      },
    ]);

    if (error) {
      console.error("Error creating poll:", error.message);
      return;
    }

    // Moved outside of try/catch to ensure Next.js handles the redirect properly
  } catch (error) {
    console.error("Unexpected error creating poll:", error);
    return;
  }

  (await cookies()).set("poll_creation_success", "Poll created successfully.", { path: "/" });
  revalidatePath("/polls");
  redirect("/polls"); // Redirect to the polls list or the new poll's page
}

export async function updatePoll(formData: FormData) {
  const supabase = await createClient(cookies());
  const pollId = formData.get("pollId")?.toString();
  const question = formData.get("question")?.toString() || "";
  const description = formData.get("description")?.toString() || null;
  const options = formData.getAll("option").map(opt => opt.toString());
  const allowMultipleOptions = formData.get("allowMultipleOptions") === "on";
  const requireLogin = formData.get("requireLogin") === "on";
  let endDate: string | null = formData.get("endDate") as string | null;

  // If endDate is an empty string, set it to null
  if (endDate === "") {
    endDate = null;
  }

  // Filter out empty options
  const filteredOptions = options.filter((option) => option.trim() !== "");

  if (!pollId) {
    console.error("Poll ID is required for updating.");
    return;
  }

  if (!question || filteredOptions.length < 2) {
    console.error("Poll question and at least two options are required.");
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("User not authenticated:", userError?.message);
    redirect("/login");
  }

  const userId = userData.user.id;

  try {
    const { error } = await supabase.from("polls").update({
      question: question,
      description: description,
      options: filteredOptions,
      allow_multiple_options: allowMultipleOptions,
      require_login: requireLogin,
      end_date: endDate,
    })
    .eq("id", pollId)
    .eq("user_id", userId); // Ensure only the creator can update

    if (error) {
      console.error("Error updating poll:", error.message);
      return;
    }
  } catch (error) {
    console.error("Unexpected error updating poll:", error);
    return;
  }

  (await cookies()).set("poll_update_success", "Poll updated successfully.", { path: "/" });
  revalidatePath("/polls");
  revalidatePath(`/polls/${pollId}`);
  redirect(`/polls/${pollId}`);
}

export async function clearPollUpdateSuccessCookie() {
  "use server";
  const cookieStore = cookies();
  await (cookieStore as any).delete("poll_update_success");
  revalidatePath("/polls");
}

export async function clearPollCreationSuccessCookie() {
  "use server";
  const cookieStore = cookies();
  await (cookieStore as any).delete("poll_creation_success");
  revalidatePath("/polls");
}

export async function vote(formData: FormData) {
  const supabase = await createClient(cookies());
  const pollId = formData.get("pollId")?.toString();
  const selectedOption = formData.get("selectedOption")?.toString();

  if (!pollId || !selectedOption) {
    console.error("Poll ID and selected option are required.");
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("User not authenticated:", userError?.message);
    redirect("/login"); // Redirect to login if not authenticated
  }

  const userId = userData.user.id;

  try {
    const { error } = await supabase.from("votes").insert([
      {
        poll_id: pollId,
        user_id: userId,
        option_chosen: selectedOption,
      },
    ]);

    if (error) {
      console.error("Error recording vote:", error.message);
      return;
    }
  } catch (error) {
    console.error("Unexpected error recording vote:", error);
    return;
  }

  (await cookies()).set("poll_vote_success", "Poll voted successfully!", { path: "/" });
  revalidatePath("/polls/");
  redirect("/polls/");
}

export async function deletePoll(formData: FormData) {
  const supabase = await createClient(cookies());
  const pollId = formData.get("pollId")?.toString();

  if (!pollId) {
    console.error("Poll ID is required for deletion.");
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("User not authenticated:", userError?.message);
    redirect("/login");
  }

  const userId = userData.user.id;

  try {
    const { error } = await supabase
      .from("polls")
      .delete()
      .eq("id", pollId)
      .eq("user_id", userId); // Ensure only the creator can delete

    if (error) {
      console.error("Error deleting poll:", error.message);
      return;
    }
  } catch (error) {
    console.error("Unexpected error deleting poll:", error);
    return;
  }

  revalidatePath("/polls");
  redirect("/polls");
}

export async function logout() {
  const supabase = await createClient(cookies());
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/login");
}
