import { auth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Button } from "./ui/button";
import Link from "next/link";
import { LogInIcon, LogOutIcon, PlusCircleIcon } from "lucide-react";

import { NewPostButton } from "./NewPostButton";

import { SearchPageButton } from "./SearchPageButton";

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
        <SearchPageButton />
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
      <div className="flex flex-col gap-1">
        <Link href={`/${session.user.name}`}>
          <Avatar>
            <AvatarImage src={session.user.image} alt="avatar" />
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex h-8 w-8 justify-center">
          <NewPostButton token={session.token} />
        </div>
        <div className="flex h-8 w-8 justify-center">
          <SearchPageButton />
        </div>
      </div>
    </div>
  );
}
