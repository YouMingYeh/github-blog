"use client";

// @ts-expect-error
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export function SubmitButton({ label }: { label: string }) {
  const { pending, data, method, action } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <ReloadIcon className=" h-4 w-4 animate-spin" /> : label}
    </Button>
  );
}
