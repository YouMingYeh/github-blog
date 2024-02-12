import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewPostButton({ token }: { token: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        {/* <Button size="icon" variant="outline"> */}
        <PlusCircleIcon />
        {/* </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            {/* @ts-expect-error Server Component */}
            <AddForm token={token} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { cn } from "@/lib/utils";
import { createIssue } from "@/lib/github-issues-api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

async function AddForm({
  token,
  className,
}: {
  token: string;
  className: string;
}) {
  async function handleCreateIssue(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const issueToCreate: GitHubIssue = {
      title,
      body,
    };
    const newIssue = await createIssue(issueToCreate, token);
    revalidatePath(`/`, "layout");
    redirect(`/posts/${newIssue.number}`);
  }

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      action={handleCreateIssue as any}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="title"
          id="title"
          placeholder="Give your post a title."
          name="title"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Body</Label>
        <Input
          type="body"
          id="body"
          placeholder="Give your post brief a content."
          name="body"
          required
          minLength={30}
        />
      </div>
      <DialogClose>
        <Button type="submit">Create a Post!</Button>
      </DialogClose>
    </form>
  );
}
