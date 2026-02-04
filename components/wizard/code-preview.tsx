"use client";

import { useMemo, useState } from "react";
import type { WizardState } from "@/lib/wizard/types";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FILES = [
  "lib.rs",
  "instructions/mod.rs",
  "instructions/create_mint.rs",
  "instructions/add_metadata.rs",
  "state/mod.rs",
];

interface CodePreviewProps {
  state: WizardState;
}

export function CodePreview({ state }: CodePreviewProps) {
  const [activeFile, setActiveFile] = useState(FILES[0]);

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
      <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-3">
        <ToggleGroup
          type="single"
          value={activeFile}
          onValueChange={(value) => value && setActiveFile(value)}
          spacing={1}
          className="flex flex-wrap gap-2"
        >
          {FILES.map((file) => (
            <ToggleGroupItem
              key={file}
              value={file}
              className="h-auto rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium transition-all data-[state=on]:border-transparent data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
            >
              {file}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

      </div>

      <div className="mt-4 flex-1 overflow-auto rounded-xl border border-foreground/10 bg-background/70 p-4">
        <pre className="text-xs leading-relaxed text-foreground/80">
          <code>{previewText}</code>
        </pre>
      </div>

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
