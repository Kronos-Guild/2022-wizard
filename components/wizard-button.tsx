"use client"

import Link from "next/link"
import { useRef } from "react"
import { SparklesIcon, type SparklesIconHandle } from "@/components/ui/sparkles"
import { Button } from "@/components/ui/button"

export function WizardButton() {
  const iconRef = useRef<SparklesIconHandle>(null)

  return (
    <Button
      asChild
      className="group mt-8 h-12 gap-2.5 rounded-xl px-7 text-sm font-medium text-white transition-all duration-300 hover:gap-3.5 hover:scale-[1.02] active:scale-[0.98]"
      style={{ 
        backgroundColor: 'oklch(0.5 0.2 25)',
        boxShadow: '0 4px 14px oklch(0.5 0.2 25 / 0.35)'
      }}
      onMouseEnter={(e) => {
        iconRef.current?.startAnimation()
        const target = e.currentTarget as HTMLElement
        target.style.backgroundColor = 'oklch(0.45 0.2 25)'
        target.style.boxShadow = '0 6px 20px oklch(0.5 0.2 25 / 0.45)'
      }}
      onMouseLeave={(e) => {
        iconRef.current?.stopAnimation()
        const target = e.currentTarget as HTMLElement
        target.style.backgroundColor = 'oklch(0.5 0.2 25)'
        target.style.boxShadow = '0 4px 14px oklch(0.5 0.2 25 / 0.35)'
      }}
    >
      <Link href="/wizard">
        <SparklesIcon ref={iconRef} size={18} className="text-white" />
        <span>Start Wizard</span>
      </Link>
    </Button>
  )
}
