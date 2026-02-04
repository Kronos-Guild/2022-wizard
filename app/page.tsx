import { CodeEditorMock } from "@/components/code-editor-mock";
import { WizardButton } from "@/components/wizard-button";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-120px)] flex-1 items-center justify-center px-6 py-16 lg:px-12">
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
        {/* Left: Title + CTA */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1">
          <h1 
            className="text-7xl font-semibold tracking-tighter sm:text-8xl lg:text-9xl leading-[0.85]"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            <span className="text-foreground">
              2022
            </span>
            <br />
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.5 0.2 25), oklch(0.6 0.22 30))' }}
            >
              Wizard
            </span>
          </h1>
          <p 
            className="mt-6 text-base text-foreground/40 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Anchor Program Generator
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-foreground/50">
            Generate secure, production-ready Token-2022 programs from audited building blocks.
          </p>
          <WizardButton />
        </div>

        {/* Right: Code editor mock */}
        <div className="w-full lg:flex-1 lg:max-w-2xl">
          <CodeEditorMock />
        </div>
      </div>
    </div>
  );
}
