"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { HTMLMotionProps } from "framer-motion";
import type { WizardState } from "@/lib/wizard/types";
import { generateCode, type GeneratedFile } from "@/lib/codegen";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dynamic import framer-motion to reduce initial bundle size
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
) as React.ComponentType<HTMLMotionProps<"div">>;

const MotionSpan = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.span),
  { ssr: false }
) as React.ComponentType<HTMLMotionProps<"span">>;

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
) as React.ComponentType<React.ComponentProps<typeof import("framer-motion").AnimatePresence>>;

// Regex patterns for syntax highlighting (extracted to avoid recreation on each render)
const REGEX_WHITESPACE = /^(\s+)/;
const REGEX_COMMENT = /^\/\/.*/;
const REGEX_STRING = /^"[^"]*"/;
const REGEX_MACRO = /^[a-z_]+!/;
const REGEX_ATTRIBUTE = /^#\[[^\]]+\]/;
const REGEX_KEYWORD = /^(use|pub|mod|fn|struct|let|mut|const|impl|for|if|else|return|self|super|vec)\b/;
const REGEX_TYPE = /^(Context|Result|String|Signer|Program|System|Token2022|UncheckedAccount|Accounts|Pubkey|TokenMetadata|ExtensionType|Ok|Default)\b/;
const REGEX_PRIMITIVE = /^(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|bool|str)\b/;
const REGEX_LIFETIME = /^'[a-z_]+/;

interface CodePreviewProps {
  state: WizardState;
}

type ChangeType = "added" | "removed";

interface LineChange {
  lineIndex: number;
  type: ChangeType;
  content: string;
}

interface FileChanges {
  type: ChangeType; // Overall change type for the file (for pulse color)
  lines: Map<number, ChangeType>; // Line index -> change type
}

// Track pulse animations with unique keys to handle rapid changes
interface PulseAnimation {
  key: number;
  type: ChangeType;
}

export function CodePreview({ state }: CodePreviewProps) {
  const files = useMemo(() => generateCode(state), [state]);
  const [activeFileId, setActiveFileId] = useState(files[0]?.id ?? "lib.rs");
  
  // Track previous file contents to detect changes
  const prevFilesRef = useRef<Map<string, string>>(new Map());
  // Use array of animations per file to allow overlapping pulses
  const [filePulses, setFilePulses] = useState<Map<string, PulseAnimation[]>>(new Map());
  const [changedLines, setChangedLines] = useState<Map<string, Map<number, ChangeType>>>(new Map());
  const pulseKeyRef = useRef(0);

  // Detect file changes and track which lines changed (added vs removed)
  useEffect(() => {
    const newPulses = new Map<string, PulseAnimation>();
    const newChangedLines = new Map<string, Map<number, ChangeType>>();

    files.forEach((file) => {
      const prevContent = prevFilesRef.current.get(file.id);
      if (prevContent !== undefined && prevContent !== file.content) {
        const prevLines = prevContent.split("\n");
        const newLines = file.content.split("\n");
        const lineChanges = new Map<number, ChangeType>();
        
        // Find lines that exist in new but not in prev (added)
        const prevLinesSet = new Set(prevLines);
        const newLinesSet = new Set(newLines);
        
        // Mark added lines (in new, not in prev)
        newLines.forEach((line, idx) => {
          if (line.trim() && !prevLinesSet.has(line)) {
            lineChanges.set(idx, "added");
          }
        });
        
        // For removed lines, we need to show them temporarily
        // but since they're removed, we track the file as having removals
        const hasRemovals = prevLines.some(line => line.trim() && !newLinesSet.has(line));
        const hasAdditions = lineChanges.size > 0;
        
        if (lineChanges.size > 0 || hasRemovals) {
          // Determine primary change type for pulse color
          const changeType: ChangeType = hasAdditions ? "added" : "removed";
          pulseKeyRef.current += 1;
          newPulses.set(file.id, { key: pulseKeyRef.current, type: changeType });
          newChangedLines.set(file.id, lineChanges);
        }
      }
      prevFilesRef.current.set(file.id, file.content);
    });

    if (newPulses.size > 0) {
      // Add new pulses to existing ones (allows overlapping animations)
      setFilePulses(prev => {
        const updated = new Map(prev);
        newPulses.forEach((pulse, fileId) => {
          const existing = updated.get(fileId) || [];
          updated.set(fileId, [...existing, pulse]);
        });
        return updated;
      });
      
      setChangedLines(prev => {
        const updated = new Map(prev);
        newChangedLines.forEach((lines, fileId) => {
          updated.set(fileId, lines);
        });
        return updated;
      });
      
      // Remove pulses after animation completes
      const currentKeys = Array.from(newPulses.values()).map(p => p.key);
      const timeout = setTimeout(() => {
        setFilePulses(prev => {
          const updated = new Map(prev);
          updated.forEach((pulses, fileId) => {
            const filtered = pulses.filter(p => !currentKeys.includes(p.key));
            if (filtered.length === 0) {
              updated.delete(fileId);
            } else {
              updated.set(fileId, filtered);
            }
          });
          return updated;
        });
      }, 1500);
      
      // Clear line highlights after shorter duration
      const lineTimeout = setTimeout(() => {
        setChangedLines(prev => {
          const updated = new Map(prev);
          newChangedLines.forEach((_, fileId) => {
            updated.delete(fileId);
          });
          return updated;
        });
      }, 1800);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(lineTimeout);
      };
    }
  }, [files]);

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];
  const activeChangedLines = changedLines.get(activeFileId) ?? new Map();

  const handleCopyCurrent = async () => {
    if (activeFile) {
      await navigator.clipboard.writeText(activeFile.content);
    }
  };

  const handleCopyAll = async () => {
    const allContent = files
      .map((f) => `// === ${f.path} ===\n\n${f.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(allContent);
  };

  return (
    <div className="flex h-full flex-col">
      {/* File tabs */}
      <div className="-mx-4 border-b border-foreground/10 pb-3 sm:-mx-6">
        <div className="relative">
          {/* Fade edges for mobile scroll */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-8 bg-gradient-to-r from-background to-transparent z-10 lg:hidden" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent z-10 lg:hidden" />

          <div className="flex gap-2 overflow-x-auto scrollbar-subtle px-4 pb-1 sm:px-6">
            {files.map((file) => {
              const isActive = activeFileId === file.id;
              const pulses = filePulses.get(file.id) || [];
              const visiblePulses = isActive ? [] : pulses; // Don't show pulses on active tab
              
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={cn(
                    "relative shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    isActive
                      ? "border-transparent bg-brand text-brand-foreground"
                      : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
                  )}
                >
                  {/* Pulse animations for changed files - each has unique key for overlapping */}
                  {visiblePulses.map((pulse) => (
                    <MotionSpan
                      key={pulse.key}
                      className={cn(
                        "absolute inset-0 rounded-full",
                        pulse.type === "added" 
                          ? "bg-emerald-500/30" 
                          : "bg-red-500/30"
                      )}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: [0, 0.6, 0],
                        scale: [0.8, 1.1, 1.2],
                      }}
                      transition={{ 
                        duration: 1.2,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <span className="relative">{file.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Code block with syntax highlighting */}
      <div className="mt-4 flex-1 overflow-auto rounded-xl border border-foreground/10 bg-background p-4">
        <pre className="text-[11px] leading-relaxed sm:text-xs">
          <code className="block w-max min-w-full">
            {activeFile && (
              <HighlightedCode 
                code={activeFile.content} 
                changedLines={activeChangedLines}
              />
            )}
          </code>
        </pre>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={handleCopyCurrent}
        >
          Copy Current
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={handleCopyAll}
        >
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

interface HighlightedCodeProps {
  code: string;
  changedLines: Map<number, ChangeType>;
}

function HighlightedCode({ code, changedLines }: HighlightedCodeProps) {
  const lines = code.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        const changeType = changedLines.get(i);
        
        return (
          <div 
            key={i} 
            className="relative leading-relaxed"
          >
            {/* Animated highlight for changed lines - green for added, red for removed */}
            <AnimatePresence>
              {changeType && (
                <MotionDiv
                  className={cn(
                    "absolute inset-0 -mx-2",
                    changeType === "added"
                      ? "bg-emerald-500/20 dark:bg-emerald-400/15"
                      : "bg-red-500/20 dark:bg-red-400/15"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            <span className="relative">{highlightLine(line)}</span>
          </div>
        );
      })}
    </>
  );
}

function highlightLine(line: string): React.ReactNode {
  if (!line) return "\u00A0";

  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    // Leading whitespace
    const wsMatch = remaining.match(REGEX_WHITESPACE);
    if (wsMatch) {
      tokens.push(<span key={key++}>{wsMatch[0]}</span>);
      remaining = remaining.slice(wsMatch[0].length);
      continue;
    }

    // Comments
    const commentMatch = remaining.match(REGEX_COMMENT);
    if (commentMatch) {
      tokens.push(
        <span key={key++} className="text-foreground/40 italic">
          {commentMatch[0]}
        </span>
      );
      remaining = remaining.slice(commentMatch[0].length);
      continue;
    }

    // Strings
    const stringMatch = remaining.match(REGEX_STRING);
    if (stringMatch) {
      tokens.push(
        <span key={key++} className="text-emerald-600 dark:text-emerald-400">
          {stringMatch[0]}
        </span>
      );
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Macros
    const macroMatch = remaining.match(REGEX_MACRO);
    if (macroMatch) {
      tokens.push(
        <span key={key++} className="text-purple-600 dark:text-purple-400">
          {macroMatch[0]}
        </span>
      );
      remaining = remaining.slice(macroMatch[0].length);
      continue;
    }

    // Attributes
    const attrMatch = remaining.match(REGEX_ATTRIBUTE);
    if (attrMatch) {
      tokens.push(
        <span key={key++} className="text-amber-600 dark:text-amber-400">
          {attrMatch[0]}
        </span>
      );
      remaining = remaining.slice(attrMatch[0].length);
      continue;
    }

    // Keywords
    const kwMatch = remaining.match(REGEX_KEYWORD);
    if (kwMatch) {
      tokens.push(
        <span key={key++} className="text-rose-600 dark:text-rose-400">
          {kwMatch[0]}
        </span>
      );
      remaining = remaining.slice(kwMatch[0].length);
      continue;
    }

    // Types
    const typeMatch = remaining.match(REGEX_TYPE);
    if (typeMatch) {
      tokens.push(
        <span key={key++} className="text-sky-600 dark:text-sky-400">
          {typeMatch[0]}
        </span>
      );
      remaining = remaining.slice(typeMatch[0].length);
      continue;
    }

    // Primitives
    const primMatch = remaining.match(REGEX_PRIMITIVE);
    if (primMatch) {
      tokens.push(
        <span key={key++} className="text-orange-600 dark:text-orange-400">
          {primMatch[0]}
        </span>
      );
      remaining = remaining.slice(primMatch[0].length);
      continue;
    }

    // Lifetimes
    const lifeMatch = remaining.match(REGEX_LIFETIME);
    if (lifeMatch) {
      tokens.push(
        <span key={key++} className="text-teal-600 dark:text-teal-400">
          {lifeMatch[0]}
        </span>
      );
      remaining = remaining.slice(lifeMatch[0].length);
      continue;
    }

    // Default: single character
    tokens.push(
      <span key={key++} className="text-foreground/80">
        {remaining[0]}
      </span>
    );
    remaining = remaining.slice(1);
  }

  return tokens;
}
