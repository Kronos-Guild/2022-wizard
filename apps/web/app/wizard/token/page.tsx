import type { Metadata } from "next";
import { Suspense } from "react";
import { WizardContent } from "./wizard-content";

export const metadata: Metadata = {
  title: "Token Wizard | 2022 Wizard",
  description:
    "Configure and generate a production-ready Token-2022 Anchor program with extensions like metadata, transfer fees, and close mint.",
};

function WizardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-sm text-foreground/60">Loading wizard...</div>
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
