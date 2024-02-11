import { auth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Button } from "./ui/button";
import Link from "next/link";
import { LogInIcon, LogOutIcon, PlusCircleIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function AuthButton() {
  const session: SessionWithToken = await auth();

  if (!session) {
    return (
      <div className="flex gap-2">
        <Link href={"/api/auth/signin"}>
          <Button variant="outline" size="icon">
            <LogInIcon />
          </Button>
        </Link>
        <SpecificPageButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href={"/api/auth/signout"}>
        <Button size="icon" variant="outline">
          <LogOutIcon />
        </Button>
      </Link>
      <SpecificPageButton />
      <AddButton token={session.token} />
      <Link href={`/${session.user.name}`}>
        <Avatar>
          <AvatarImage src={session.user.image} alt="avatar" />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}

function AddButton({ token }: { token: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" variant="outline">
          <PlusCircleIcon />
        </Button>
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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

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
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Body</Label>
        <Input
          type="body"
          id="body"
          placeholder="Give your post brief a content."
          name="body"
        />
      </div>
      <DialogClose>
        <Button type="submit">Create a Post!</Button>
      </DialogClose>
    </form>
  );
}

function SpecificPageButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" variant="outline">
          <MagnifyingGlassIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Go to specific page!</DialogTitle>
          <DialogDescription>
            {/* @ts-expect-error Server Component */}
            <SpecificPageForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

async function SpecificPageForm() {
  async function handleCreateIssue(formData: FormData) {
    "use server";
    const owner = formData.get("owner") as string;
    const repo = formData.get("repo") as string;

    redirect(`/${owner}/${repo}`);
  }

  return (
    <form
      className={cn("grid items-start gap-4")}
      action={handleCreateIssue as any}
    >
      <div className="grid gap-2">
        <Label htmlFor="owner">GitHub Profile Name</Label>
        <Input
          type="owner"
          id="owner"
          placeholder="The owner of the GitHub repo."
          name="owner"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="repo">GitHub Repo Name</Label>
        <Input
          type="repo"
          id="repo"
          placeholder="The name of the GitHub repo you blog on."
          name="repo"
        />
      </div>
      <DialogClose>
        <Button type="submit">Go!</Button>
      </DialogClose>
    </form>
  );
}
