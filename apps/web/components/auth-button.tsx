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
  const session: any = await auth();

  if (!session) {
    return (
      <Link href={"/api/auth/signin"}>
        <Button variant="outline" size="icon">
          <LogInIcon />
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href={"/api/auth/signout"}>
        <Button size="icon" variant="outline">
          <LogOutIcon />
        </Button>
      </Link>
      <AddButton token={session.token} />
      <Avatar>
        <AvatarImage src={session.user.image} alt="avatar" />
        <AvatarFallback>{session.user.name}</AvatarFallback>
      </Avatar>
    </div>
  );
}

function AddButton({ token }: { token: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircleIcon />
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
    const newIssue = await createIssue(title, body, token);
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
