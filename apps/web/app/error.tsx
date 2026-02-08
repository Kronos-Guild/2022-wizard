"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-clash)" }}
      >
        Something went wrong
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full border border-foreground/10 px-5 py-2 text-xs font-medium transition-colors hover:bg-foreground/5"
      >
        Try again
      </button>
    </div>
  );
}
