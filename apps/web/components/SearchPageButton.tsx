import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function SearchPageButton() {
  return (
    <Dialog>
      <DialogTrigger>
        {/* <Button size="icon" variant="outline"> */}
        <MagnifyingGlassIcon />
        {/* </Button> */}
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
  async function handleSearch(formData: FormData) {
    "use server";
    const owner = formData.get("owner") as string;
    const repo = formData.get("repo") as string;

    redirect(`/${owner}/${repo}`);
  }

  return (
    <form className={cn("grid items-start gap-4")} action={handleSearch as any}>
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
        <Button aria-label="go-search" type="submit">
          Go!
        </Button>
      </DialogClose>
    </form>
  );
}
