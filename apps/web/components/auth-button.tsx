import { auth } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Button } from "./ui/button";
import Link from "next/link";
import { LogInIcon, LogOutIcon } from "lucide-react";

export default async function AuthButton() {
  const session: any = await auth();

  if (!session) {
    return (
      <Button variant="outline" asChild size="icon">
        <Link href={"/api/auth/signin"}>
          <LogInIcon />
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="icon" variant="outline">
        <Link href={"/api/auth/signout"}>
          <LogOutIcon />
        </Link>
      </Button>
      <Avatar>
        <AvatarImage src={session.user.image} alt="avatar" />
        <AvatarFallback>{session.user.name}</AvatarFallback>
      </Avatar>
    </div>
  );
}
