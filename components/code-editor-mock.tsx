"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Code states representing wizard progression
const CODE_STATES = [
  {
    label: "Base Mint",
    lines: [
      { id: "use1", content: "use anchor_lang::prelude::*;", type: "import" },
      { id: "empty1", content: "", type: "empty" },
      { id: "declare", content: 'declare_id!("Wizard22...");', type: "macro" },
      { id: "empty2", content: "", type: "empty" },
      { id: "program", content: "#[program]", type: "attribute" },
      { id: "mod", content: "pub mod token_wizard {", type: "keyword" },
      { id: "use_super", content: "    use super::*;", type: "import" },
      { id: "empty3", content: "", type: "empty" },
      { id: "fn_sig", content: "    pub fn initialize_mint(", type: "keyword" },
      { id: "ctx", content: "        ctx: Context<InitializeMint>,", type: "param" },
      { id: "name", content: "        name: String,", type: "param" },
      { id: "symbol", content: "        symbol: String,", type: "param" },
      { id: "decimals", content: "        decimals: u8,", type: "param" },
      { id: "result", content: "    ) -> Result<()> {", type: "keyword" },
      { id: "msg", content: '        msg!("Creating token: {}", name);', type: "macro" },
      { id: "ok", content: "        Ok(())", type: "keyword" },
      { id: "fn_close", content: "    }", type: "bracket" },
      { id: "mod_close", content: "}", type: "bracket" },
    ],
  },
  {
    label: "+ Metadata",
    lines: [
      { id: "use1", content: "use anchor_lang::prelude::*;", type: "import" },
      { id: "use2", content: "use anchor_spl::token_2022::Token2022;", type: "import" },
      { id: "empty1", content: "", type: "empty" },
      { id: "declare", content: 'declare_id!("Wizard22...");', type: "macro" },
      { id: "empty2", content: "", type: "empty" },
      { id: "program", content: "#[program]", type: "attribute" },
      { id: "mod", content: "pub mod token_wizard {", type: "keyword" },
      { id: "use_super", content: "    use super::*;", type: "import" },
      { id: "empty3", content: "", type: "empty" },
      { id: "fn_sig", content: "    pub fn initialize_mint(", type: "keyword" },
      { id: "ctx", content: "        ctx: Context<InitializeMint>,", type: "param" },
      { id: "name", content: "        name: String,", type: "param" },
      { id: "symbol", content: "        symbol: String,", type: "param" },
      { id: "uri", content: "        uri: String,", type: "param-new" },
      { id: "decimals", content: "        decimals: u8,", type: "param" },
      { id: "result", content: "    ) -> Result<()> {", type: "keyword" },
      { id: "comment_meta", content: "        // Initialize metadata extension", type: "comment" },
      { id: "init_meta", content: "        init_metadata(&ctx, name, symbol, uri)?;", type: "call-new" },
      { id: "msg", content: '        msg!("Token created with metadata");', type: "macro" },
      { id: "ok", content: "        Ok(())", type: "keyword" },
      { id: "fn_close", content: "    }", type: "bracket" },
      { id: "mod_close", content: "}", type: "bracket" },
    ],
  },
  {
    label: "+ Transfer Fee",
    lines: [
      { id: "use1", content: "use anchor_lang::prelude::*;", type: "import" },
      { id: "use2", content: "use anchor_spl::token_2022::Token2022;", type: "import" },
      { id: "empty1", content: "", type: "empty" },
      { id: "declare", content: 'declare_id!("Wizard22...");', type: "macro" },
      { id: "empty2", content: "", type: "empty" },
      { id: "program", content: "#[program]", type: "attribute" },
      { id: "mod", content: "pub mod token_wizard {", type: "keyword" },
      { id: "use_super", content: "    use super::*;", type: "import" },
      { id: "empty3", content: "", type: "empty" },
      { id: "fn_sig", content: "    pub fn initialize_mint(", type: "keyword" },
      { id: "ctx", content: "        ctx: Context<InitializeMint>,", type: "param" },
      { id: "name", content: "        name: String,", type: "param" },
      { id: "symbol", content: "        symbol: String,", type: "param" },
      { id: "uri", content: "        uri: String,", type: "param" },
      { id: "decimals", content: "        decimals: u8,", type: "param" },
      { id: "fee_bps", content: "        transfer_fee_bps: u16,", type: "param-new" },
      { id: "result", content: "    ) -> Result<()> {", type: "keyword" },
      { id: "comment_meta", content: "        // Initialize metadata extension", type: "comment" },
      { id: "init_meta", content: "        init_metadata(&ctx, name, symbol, uri)?;", type: "call" },
      { id: "comment_fee", content: "        // Configure transfer fee", type: "comment-new" },
      { id: "set_fee", content: "        set_transfer_fee(&ctx, transfer_fee_bps)?;", type: "call-new" },
      { id: "msg", content: '        msg!("Token with metadata + fees");', type: "macro" },
      { id: "ok", content: "        Ok(())", type: "keyword" },
      { id: "fn_close", content: "    }", type: "bracket" },
      { id: "mod_close", content: "}", type: "bracket" },
    ],
  },
]

function highlightLine(content: string, isNew: boolean): React.ReactNode {
  if (!content) return "\u00A0"

  const tokens: React.ReactNode[] = []
  let remaining = content
  let key = 0

  while (remaining.length > 0) {
    // Leading whitespace
    if (remaining.match(/^(\s+)/)) {
      const match = remaining.match(/^(\s+)/)!
      tokens.push(<span key={key++}>{match[0]}</span>)
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Comments
    if (remaining.match(/^\/\/.*/)) {
      const match = remaining.match(/^\/\/.*/)!
      tokens.push(
        <span key={key++} className="text-foreground/40 italic">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Strings
    if (remaining.match(/^"[^"]*"/)) {
      const match = remaining.match(/^"[^"]*"/)!
      tokens.push(
        <span key={key++} className="text-emerald-600 dark:text-emerald-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Macros
    if (remaining.match(/^[a-z_]+!/)) {
      const match = remaining.match(/^[a-z_]+!/)!
      tokens.push(
        <span key={key++} className="text-purple-600 dark:text-purple-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Attributes
    if (remaining.match(/^#\[[^\]]+\]/)) {
      const match = remaining.match(/^#\[[^\]]+\]/)!
      tokens.push(
        <span key={key++} className="text-amber-600 dark:text-amber-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Keywords
    if (remaining.match(/^(use|pub|mod|fn|struct|let|mut|const|impl|for|if|else|return|self|super)\b/)) {
      const match = remaining.match(/^(use|pub|mod|fn|struct|let|mut|const|impl|for|if|else|return|self|super)\b/)!
      tokens.push(
        <span key={key++} className="text-rose-600 dark:text-rose-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Types
    if (remaining.match(/^(Context|Result|String|Signer|Program|System|Token2022|UncheckedAccount|Accounts|InitializeMint|Ok)\b/)) {
      const match = remaining.match(/^(Context|Result|String|Signer|Program|System|Token2022|UncheckedAccount|Accounts|InitializeMint|Ok)\b/)!
      tokens.push(
        <span key={key++} className="text-sky-600 dark:text-sky-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Primitives
    if (remaining.match(/^(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|bool|str)\b/)) {
      const match = remaining.match(/^(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|bool|str)\b/)!
      tokens.push(
        <span key={key++} className="text-orange-600 dark:text-orange-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Function calls
    if (remaining.match(/^[a-z_]+(?=\()/)) {
      const match = remaining.match(/^[a-z_]+(?=\()/)!
      tokens.push(
        <span key={key++} className="text-violet-600 dark:text-violet-400">
          {match[0]}
        </span>
      )
      remaining = remaining.slice(match[0].length)
      continue
    }

    // Default
    tokens.push(
      <span key={key++} className="text-foreground/70">
        {remaining[0]}
      </span>
    )
    remaining = remaining.slice(1)
  }

  return tokens
}

export function CodeEditorMock() {
  const [currentState, setCurrentState] = useState(0)
  const [prevState, setPrevState] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevState(currentState)
      setCurrentState((prev) => (prev + 1) % CODE_STATES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [currentState])

  const currentCode = CODE_STATES[currentState]
  const prevIds = new Set(CODE_STATES[prevState].lines.map((l) => l.id))

  return (
    <div className="w-full rounded-lg border border-foreground/10 bg-foreground/[0.02] dark:bg-foreground/[0.03] overflow-hidden shadow-sm">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5 bg-foreground/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          </div>
          <span className="ml-2 text-xs text-foreground/40 font-mono">lib.rs</span>
        </div>
        <motion.span
          key={currentCode.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-xs font-medium text-foreground/50 px-2 py-0.5 rounded bg-foreground/5"
        >
          {currentCode.label}
        </motion.span>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto h-[480px] overflow-y-hidden">
        <pre className="text-xs font-mono">
          <code>
            <AnimatePresence mode="popLayout" initial={false}>
              {currentCode.lines.map((line, index) => {
                const isNew = !prevIds.has(line.id) || line.type.includes("-new")
                return (
                  <motion.div
                    key={line.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      backgroundColor: isNew ? "rgba(52, 211, 153, 0.1)" : "transparent",
                    }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.02,
                      layout: { duration: 0.3 },
                      backgroundColor: { duration: 1.5 },
                    }}
                    className="leading-relaxed rounded"
                  >
                    {highlightLine(line.content, isNew)}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </code>
        </pre>
      </div>

      {/* State indicator */}
      <div className="flex items-center justify-center gap-2 pb-3">
        {CODE_STATES.map((state, index) => (
          <button
            key={state.label}
            onClick={() => {
              setPrevState(currentState)
              setCurrentState(index)
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentState
                ? "w-6 bg-foreground/40"
                : "w-1.5 bg-foreground/20 hover:bg-foreground/30"
            }`}
            aria-label={`View ${state.label}`}
          />
        ))}
      </div>
    </div>
  )
}
