"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, Vault, ImageIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeEditorMock } from "@/components/code-editor-mock";
import { StartBuildingButton } from "@/components/start-building-button";

interface ProgramOptionProps {
  title: string;
  icon: React.ReactNode;
  href?: string;
  soon?: boolean;
}

function ProgramOption({ title, icon, href, soon }: ProgramOptionProps) {
  const content = (
    <div
      className={cn(
        "group flex h-full items-center gap-3 rounded-xl border border-foreground/10 bg-background px-5 py-4 transition-all duration-200",
        soon
          ? "cursor-not-allowed opacity-50"
          : "hover:border-foreground/20 hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
          soon
            ? "bg-foreground/5 text-foreground/40"
            : "bg-brand/10 text-brand group-hover:bg-brand/15"
        )}
      >
        {icon}
      </div>

      <span
        className="flex-1 font-medium tracking-tight"
        style={{ fontFamily: "var(--font-clash)" }}
      >
        {title}
      </span>

      {soon ? (
        <span className="shrink-0 rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/40">
          Soon
        </span>
      ) : (
        <ArrowRight className="h-4 w-4 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
      )}
    </div>
  );

  if (soon || !href) {
    return <div className="h-full">{content}</div>;
  }

  return <Link href={href} className="h-full">{content}</Link>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

const codeEditorVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

const programCardsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
    },
  },
};

const programCardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function HomeContent() {
  return (
    <div className="relative flex min-h-[calc(100vh-120px)] flex-1 flex-col justify-between">
      {/* Hero Section */}
      <section className="flex flex-1 justify-center px-6 py-12 lg:px-12 lg:py-16">
        <div className="flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: Title + Description + CTA */}
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-7xl font-semibold tracking-tighter sm:text-8xl lg:text-9xl leading-[0.85]"
              style={{ fontFamily: "var(--font-clash)" }}
              variants={itemVariants}
            >
              <span className="text-foreground">2022</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.5 0.2 25), oklch(0.6 0.22 30))",
                }}
              >
                Wizard
              </span>
            </motion.h1>
            <motion.p
              className="mt-6 text-base text-foreground/40 tracking-widest uppercase"
              style={{ fontFamily: "var(--font-clash)" }}
              variants={itemVariants}
            >
              Anchor Program Generator
            </motion.p>
            <motion.p
              className="mt-6 max-w-sm text-sm leading-relaxed text-foreground/50"
              variants={itemVariants}
            >
              Generate secure, production-ready Token-2022 programs from audited
              building blocks.
            </motion.p>

            <motion.div variants={itemVariants}>
              <StartBuildingButton />
            </motion.div>
          </motion.div>

          {/* Right: Code editor mock */}
          <motion.div
            className="w-full lg:flex-1 lg:max-w-2xl"
            variants={codeEditorVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Fixed height container to prevent layout shift */}
            <div className="h-[540px]">
              <CodeEditorMock />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Types Section */}
      <motion.section
        className="flex flex-col items-center px-6 pb-8 pt-4 lg:px-12"
        initial="hidden"
        animate="visible"
        variants={programCardsVariants}
      >
        <motion.p
          className="text-sm text-foreground/40 tracking-widest uppercase"
          style={{ fontFamily: "var(--font-clash)" }}
          variants={programCardVariants}
        >
          Or choose a program type
        </motion.p>

        <div className="mt-6 flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center">
          <motion.div variants={programCardVariants} className="sm:flex-1 sm:max-w-[240px]">
            <ProgramOption
              title="Token Mint"
              icon={<Coins className="h-5 w-5" />}
              href="/wizard/token"
            />
          </motion.div>
          <motion.div variants={programCardVariants} className="sm:flex-1 sm:max-w-[240px]">
            <ProgramOption
              title="Vault"
              icon={<Vault className="h-5 w-5" />}
              soon
            />
          </motion.div>
          <motion.div variants={programCardVariants} className="sm:flex-1 sm:max-w-[240px]">
            <ProgramOption
              title="NFT Collection"
              icon={<ImageIcon className="h-5 w-5" />}
              soon
            />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
