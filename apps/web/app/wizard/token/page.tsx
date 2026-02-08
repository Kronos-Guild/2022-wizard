import { Suspense } from "react";
import { WizardContent } from "./wizard-content";

function WizardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-sm text-foreground/50">Loading wizard...</div>
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
