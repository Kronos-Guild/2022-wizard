"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SunMoonIcon } from "@/components/ui/sun-moon"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm"
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      <SunMoonIcon size={16} className="text-foreground/70" />
    </Button>
  )
}
