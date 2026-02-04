interface WizardLayoutProps {
  sidebar: React.ReactNode;
  preview: React.ReactNode;
}

export function WizardLayout({ sidebar, preview }: WizardLayoutProps) {
  return (
    <div>
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-6 py-5 lg:px-10">
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <div className="sticky top-10 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] shadow-sm">
            {sidebar}
          </div>
        </aside>
        <main className="flex-1">
          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 shadow-sm">
            {preview}
          </div>
        </main>
      </div>
    </div>
  );
}
