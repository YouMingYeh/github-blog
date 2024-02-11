"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Oops! Something went wrong...</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      <h1 className="4xl"></h1>
      <Button className="w-full" onClick={() => reset()}>
        Go Back
      </Button>
    </div>
  );
}
