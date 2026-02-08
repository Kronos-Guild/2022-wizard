interface WizardLayoutProps {
  sidebar: React.ReactNode;
  preview: React.ReactNode;
}

export function WizardLayout({ sidebar, preview }: WizardLayoutProps) {
  return (
    <div>
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:pb-5">
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <div className="sticky top-10 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-neutral-50 dark:bg-neutral-900 shadow-sm">
            {sidebar}
          </div>
        </aside>
        <section className="min-w-0 flex-1" aria-label="Code preview">
          <div className="rounded-2xl border border-foreground/10 bg-neutral-50 dark:bg-neutral-900 p-4 shadow-sm sm:p-6">
            {preview}
          </div>
        </section>
      </div>
    </div>
  );
}
