"use client";

import { useMemo, useState } from "react";
import type { WizardState } from "@/lib/wizard/types";
import { Button } from "@/components/ui/button";

const FILES = [
  { id: "lib.rs", label: "lib.rs" },
  { id: "instructions/mod.rs", label: "mod.rs" },
  { id: "instructions/create_mint.rs", label: "create_mint.rs" },
  { id: "instructions/add_metadata.rs", label: "add_metadata.rs" },
  { id: "state/mod.rs", label: "state/mod.rs" },
];

interface CodePreviewProps {
  state: WizardState;
}

export function CodePreview({ state }: CodePreviewProps) {
  const [activeFile, setActiveFile] = useState(FILES[0].id);

  const previewText = useMemo(() => {
    return [
      "// 2022 Wizard preview",
      "// Code generation will appear here as you configure settings.",
      "",
      `// Name: ${state.name}`,
      `// Symbol: ${state.symbol}`,
      `// Decimals: ${state.decimals}`,
      `// Authority: ${state.authority}`,
      `// Cluster: ${state.cluster}`,
      "",
      `// Extensions: ${Object.entries(state.extensions)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)
        .join(", ")}`,
    ].join("\n");
  }, [state]);

  return (
    <div className="flex h-full flex-col">
      {/* File tabs - horizontal scroll on mobile with fade edges */}
      <div className="-mx-4 border-b border-foreground/10 pb-3 sm:-mx-6">
        <div className="relative">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-8 bg-gradient-to-r from-background to-transparent z-10 lg:hidden" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent z-10 lg:hidden" />
          
          <div className="flex gap-2 overflow-x-auto scrollbar-subtle px-4 pb-1 sm:px-6">
            {FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  activeFile === file.id
                    ? "border-transparent bg-brand text-brand-foreground"
                    : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
                }`}
              >
                {file.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code block */}
      <div className="mt-4 flex-1 overflow-auto rounded-xl border border-foreground/10 bg-background/70 p-4">
        <pre className="text-[11px] leading-relaxed text-foreground/80 sm:text-xs">
          <code className="block w-max min-w-full">{previewText}</code>
        </pre>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="rounded-full text-xs">
          Copy Current
        </Button>
        <Button variant="outline" size="sm" className="rounded-full text-xs">
          Copy All
        </Button>
        <Button 
          size="sm" 
          className="rounded-full text-xs bg-brand text-brand-foreground hover:bg-brand/90"
        >
          Download .zip
        </Button>
      </div>
    </div>
  );
}
