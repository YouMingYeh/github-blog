"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Oops! Something went wrong...</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      <Button aria-label="go-back" className="w-full" onClick={() => reset()}>
        Go Back
      </Button>
    </div>
  );
}
