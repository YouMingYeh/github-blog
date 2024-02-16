"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";



export function NewPostButton({ token }: { readonly token: string }) {
  return (
    <Dialog>
      <DialogTrigger aria-label="create-page">
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
import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIssue } from "@/lib/github-issues-api";

function AddForm({ token, className }: { readonly token: string; readonly className: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const router = useRouter();

  async function handleCreateIssue() {
    const issueToCreate: GitHubIssue = {
      title,
      body,
    };

    const newIssue = await createIssueWithForm(issueToCreate, token);
    await fetch("/api/revalidate");
    router.refresh();
    router.push(`/posts/${newIssue.number}`);
  }

  async function createIssueWithForm(issue: GitHubIssue, token: string) {
    if (owner === "" || repo === "") {
      return createIssue(issue, { token });
    }
    return createIssue(issue, { token, owner, repo });
  }

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="title"
          id="title"
          placeholder="Give your post a title."
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
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
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="owner">GitHub Profile Name</Label>
        <Input
          type="owner"
          id="owner"
          placeholder="The owner of the GitHub repo. Leave blank for default."
          name="owner"
          required
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="repo">GitHub Repo Name</Label>
        <Input
          type="repo"
          id="repo"
          placeholder="The owner of the GitHub repo. Leave blank for default."
          name="repo"
          required
          onChange={(e) => setRepo(e.target.value)}
        />
      </div>
      <DialogClose disabled={title.length == 0 || body.length < 30}>
        <Button
          aria-label="create-a-post"
          type="submit"
          onClick={handleCreateIssue}
        >
          Create a Post!
        </Button>
      </DialogClose>
    </form>
  );
}
