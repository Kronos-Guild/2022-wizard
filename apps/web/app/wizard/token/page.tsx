import type { Metadata } from "next";
import { Suspense } from "react";
import { WizardContent } from "./wizard-content";

export const metadata: Metadata = {
  title: "Token Wizard | 2022 Wizard",
  description:
    "Configure and generate a production-ready Token-2022 Anchor program with extensions like metadata, transfer fees, and close mint.",
};

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-foreground/[0.08] ${className ?? ""}`}
    />
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-6 px-3">
      {/* Token Basics */}
      <div>
        <Bone className="h-3 w-24" />
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Bone className="h-3 w-10" />
            <Bone className="h-9 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Bone className="h-3 w-12" />
              <Bone className="h-9 w-full rounded-lg" />
            </div>
            <div className="grid gap-2">
              <Bone className="h-3 w-16" />
              <Bone className="h-9 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Mint Authority */}
      <div>
        <Bone className="h-3 w-28" />
        <div className="mt-3 grid gap-2">
          <Bone className="h-10 w-full rounded-lg" />
          <Bone className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Cluster */}
      <div>
        <Bone className="h-3 w-16" />
        <div className="mt-3 grid gap-2">
          <Bone className="h-10 w-full rounded-lg" />
          <Bone className="h-10 w-full rounded-lg" />
          <Bone className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Extensions */}
      <div>
        <Bone className="h-3 w-20" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Bone className="h-8 w-24 rounded-full" />
          <Bone className="h-8 w-24 rounded-full" />
          <Bone className="h-8 w-32 rounded-full" />
          <Bone className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* File tabs */}
      <div className="-mx-4 border-b border-foreground/10 pb-3 sm:-mx-6">
        <div className="flex gap-2 px-4 pb-2 sm:px-6">
          <Bone className="h-7 w-16 rounded-full" />
          <Bone className="h-7 w-24 rounded-full" />
          <Bone className="h-7 w-28 rounded-full" />
          <Bone className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Code block */}
      <div className="mt-4 flex-1 rounded-xl border border-foreground/10 bg-background p-4">
        <div className="space-y-2.5">
          <Bone className="h-3 w-3/5" />
          <Bone className="h-3 w-4/5" />
          <Bone className="h-3 w-0" />
          <Bone className="h-3 w-2/5" />
          <Bone className="h-3 w-0" />
          <Bone className="h-3 w-1/4" />
          <Bone className="h-3 w-3/5" />
          <Bone className="h-3 w-2/5" />
          <Bone className="h-3 w-0" />
          <Bone className="h-3 w-3/4" />
          <Bone className="h-3 w-2/3" />
          <Bone className="h-3 w-1/2" />
          <Bone className="h-3 w-0" />
          <Bone className="h-3 w-3/5" />
          <Bone className="h-3 w-1/3" />
          <Bone className="h-3 w-4/5" />
          <Bone className="h-3 w-1/4" />
          <Bone className="h-3 w-0" />
          <Bone className="h-3 w-2/3" />
          <Bone className="h-3 w-1/2" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        <Bone className="h-8 w-28 rounded-full" />
        <Bone className="h-8 w-24 rounded-full" />
        <Bone className="h-8 w-32 rounded-full" />
      </div>
    </div>
  );
}

function WizardLoading() {
  return (
    <div>
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:pb-5">
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <div className="sticky top-10 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-neutral-50 dark:bg-neutral-900 shadow-sm">
            <SidebarSkeleton />
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <div className="rounded-2xl border border-foreground/10 bg-neutral-50 dark:bg-neutral-900 p-4 shadow-sm sm:p-6">
            <PreviewSkeleton />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={<WizardLoading />}>
      <WizardContent />
    </Suspense>
  );
}
