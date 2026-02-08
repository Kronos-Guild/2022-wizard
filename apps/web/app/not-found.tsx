import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2
        className="text-6xl font-semibold tracking-tighter"
        style={{ fontFamily: "var(--font-clash)" }}
      >
        404
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        This page doesn&apos;t exist. You may have followed a broken link or
        typed the URL incorrectly.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-foreground/10 px-5 py-2 text-xs font-medium transition-colors hover:bg-foreground/5"
      >
        Back to home
      </Link>
    </div>
  );
}
