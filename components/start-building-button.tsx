"use client";

import Link from "next/link";
import { useRef } from "react";
import { SparklesIcon, type SparklesIconHandle } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";

export function StartBuildingButton() {
  const iconRef = useRef<SparklesIconHandle>(null);

  return (
    <Button
      asChild
      size="lg"
      className="mt-8 h-12 gap-2.5 rounded-xl px-7 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        backgroundColor: "oklch(0.5 0.2 25)",
        boxShadow: "0 4px 14px oklch(0.5 0.2 25 / 0.35)",
      }}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <Link href="/wizard/token">
        <SparklesIcon ref={iconRef} size={18} className="text-white" />
        <span>Start Building</span>
      </Link>
    </Button>
  );
}
