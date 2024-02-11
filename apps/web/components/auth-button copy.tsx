import { auth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Button } from "./ui/button";
import Link from "next/link";
import { LogInIcon, LogOutIcon } from "lucide-react";

export default async function AuthButton() {
  const session: any = await auth();

  if (!session) {
    return (
      <Link href={"/api/auth/signin"}>
        <Button variant="outline" asChild size="icon">
          <LogInIcon />
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href={"/api/auth/signout"}>
        <Button asChild size="icon" variant="outline">
          <LogOutIcon />
        </Button>
      </Link>
      <Avatar>
        <AvatarImage src={session.user.image} alt="avatar" />
        <AvatarFallback>{session.user.name}</AvatarFallback>
      </Avatar>
    </div>
  );
}
