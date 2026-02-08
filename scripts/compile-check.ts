/**
 * Compile Check — verifies that generated Anchor code actually compiles.
 *
 * For each valid extension combination, this script:
 * 1. Scaffolds a complete Anchor project in a temp directory
 * 2. Runs `anchor build` on it
 * 3. Reports pass/fail
 *
 * Usage:
 *   pnpm --filter @2022-wizard/scripts compile-check
 *
 * Requirements:
 *   - anchor CLI (0.30+)
 *   - solana CLI
 *   - Rust toolchain
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";

// Dynamic import to handle cross-package ESM/CJS boundary
const {
  assembleLib,
  assembleInstruction,
  extensions,
  baseFiles,
  programInfo,
} = await import("../apps/web/lib/codegen/generated/token-mint.ts");

type ExtensionId = keyof typeof extensions;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROGRAM_NAME = "token_mint";

/** All valid extension combinations (metadata is always included). */
const VALID_COMBINATIONS: { label: string; extensions: ExtensionId[] }[] = [
  { label: "base (metadata only)", extensions: ["metadata"] },
  { label: "metadata + transfer-fee", extensions: ["metadata", "transfer-fee"] },
  { label: "metadata + close-mint", extensions: ["metadata", "close-mint"] },
  { label: "metadata + non-transferable", extensions: ["metadata", "non-transferable"] },
  { label: "metadata + transfer-fee + close-mint", extensions: ["metadata", "transfer-fee", "close-mint"] },
  { label: "metadata + non-transferable + close-mint", extensions: ["metadata", "non-transferable", "close-mint"] },
];

// ---------------------------------------------------------------------------
// File generators
// ---------------------------------------------------------------------------

/**
 * Strips @wizard marker comments from extension source files.
 * Replicates the logic in the generated token-mint.ts (not exported).
 */
function stripMarkerComments(code: string): string {
  let result = code.replace(
    /^[ \t]*\/\/ @wizard:inject\.[^\n]*\n[\s\S]*?^[ \t]*\/\/ @wizard:end\n?/gm,
    "",
  );
  result = result.replace(/^[ \t]*\/\/ @wizard:inject\.[^\n]*\n?/gm, "");
  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

/** Generates a Cargo.toml with correct dependency versions for Anchor 0.32.x. */
function generateCargoToml(): string {
  return `[package]
name = "${PROGRAM_NAME}"
version = "${programInfo.version}"
description = "${programInfo.description}"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${PROGRAM_NAME}"

[features]
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

[dependencies]
anchor-lang = { version = "0.32.1", features = ["interface-instructions"] }
anchor-spl = { version = "0.32.1", features = ["token_2022"] }
spl-token-2022 = "8"
# Pin to versions compatible with anchor-spl 0.32.1 (solana-instruction 2.x)
spl-token-metadata-interface = "0.7"
spl-type-length-value = "0.8"
# Pin blake3 to avoid edition2024 (unsupported by Solana SBF toolchain Cargo 1.84)
blake3 = "=1.8.2"
`;
}

/** Generates an Anchor.toml for localnet. */
function generateAnchorToml(): string {
  return `[toolchain]

[features]
resolution = true
skip-lint = false

[programs.localnet]
${PROGRAM_NAME} = "11111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`;
}

/** Generates the workspace-level Cargo.toml. */
function generateWorkspaceCargoToml(): string {
  return `[workspace]
members = [
    "programs/*"
]
resolver = "2"

[profile.release]
overflow-checks = true
lto = "fat"
codegen-units = 1

[profile.release.build-override]
opt-level = 3
incremental = false
codegen-units = 1
`;
}

/**
 * Maps an extension ID to its Rust module name.
 * e.g. "transfer-fee" → "transfer_fee"
 */
function extIdToModuleName(extId: string): string {
  return extId.replace(/-/g, "_");
}

// ---------------------------------------------------------------------------
// Scaffold a single Anchor project
// ---------------------------------------------------------------------------

function scaffoldProject(
  projectDir: string,
  enabledExtensions: ExtensionId[],
): void {
  const srcDir = join(projectDir, "programs", PROGRAM_NAME, "src");
  const instrDir = join(srcDir, "instructions");
  const stateDir = join(srcDir, "state");

  // Create directories
  mkdirSync(instrDir, { recursive: true });
  mkdirSync(stateDir, { recursive: true });

  // --- Root files ---
  writeFileSync(join(projectDir, "Anchor.toml"), generateAnchorToml());
  writeFileSync(join(projectDir, "Cargo.toml"), generateWorkspaceCargoToml());

  // --- Program Cargo.toml ---
  writeFileSync(
    join(projectDir, "programs", PROGRAM_NAME, "Cargo.toml"),
    generateCargoToml(),
  );

  // --- Assembled base files ---
  writeFileSync(
    join(srcDir, "lib.rs"),
    assembleLib(enabledExtensions, PROGRAM_NAME),
  );
  writeFileSync(
    join(instrDir, "create_mint.rs"),
    assembleInstruction("create_mint", enabledExtensions),
  );

  // --- Static base files (from baseFiles.other) ---
  // instructions/mod.rs
  writeFileSync(
    join(instrDir, "mod.rs"),
    "pub mod create_mint;\n\npub use create_mint::*;\n",
  );

  // state/mod.rs
  writeFileSync(join(stateDir, "mod.rs"), stripMarkerComments(baseFiles.other["mod.rs"]));

  // error.rs
  writeFileSync(join(srcDir, "error.rs"), stripMarkerComments(baseFiles.other["error.rs"]));

  // --- Extension module files ---
  for (const extId of enabledExtensions) {
    const ext = extensions[extId];
    if (!ext) continue;

    const moduleName = extIdToModuleName(extId);
    const fileEntries = Object.entries(ext.files);

    if (fileEntries.length === 1) {
      // Single-file module: write as src/<module_name>.rs
      const [, content] = fileEntries[0];
      writeFileSync(
        join(srcDir, `${moduleName}.rs`),
        stripMarkerComments(content),
      );
    } else {
      // Multi-file module: write as src/<module_name>/mod.rs + other files
      const moduleDir = join(srcDir, moduleName);
      mkdirSync(moduleDir, { recursive: true });
      for (const [fileName, content] of fileEntries) {
        writeFileSync(
          join(moduleDir, fileName),
          stripMarkerComments(content),
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Compile Check — Token-2022 Wizard");
  console.log("=".repeat(50));
  console.log();

  // Verify toolchain
  try {
    const anchorVersion = execSync("anchor --version", { encoding: "utf8" }).trim();
    console.log(`Anchor: ${anchorVersion}`);
  } catch {
    console.error("ERROR: anchor CLI not found. Install it first.");
    process.exit(1);
  }

  const baseDir = join(tmpdir(), `wizard-compile-check-${Date.now()}`);
  mkdirSync(baseDir, { recursive: true });
  console.log(`Temp dir: ${baseDir}`);
  console.log();

  const results: { label: string; pass: boolean; error?: string }[] = [];

  for (const combo of VALID_COMBINATIONS) {
    const comboDir = join(baseDir, combo.label.replace(/[^a-zA-Z0-9]+/g, "_"));
    console.log(`--- ${combo.label} ---`);
    console.log(`  Extensions: [${combo.extensions.join(", ")}]`);
    console.log(`  Dir: ${comboDir}`);

    try {
      scaffoldProject(comboDir, combo.extensions);
      console.log("  Scaffolded. Running anchor build...");

      execSync("anchor build", {
        cwd: comboDir,
        encoding: "utf8",
        stdio: "pipe",
        timeout: 300_000, // 5 minutes per build
      });

      console.log("  PASS");
      results.push({ label: combo.label, pass: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Extract useful error info from stdout/stderr
      let detail = msg;
      if (typeof (err as { stderr?: string }).stderr === "string") {
        detail = (err as { stderr: string }).stderr;
      }
      if (typeof (err as { stdout?: string }).stdout === "string") {
        detail = (err as { stdout: string }).stdout + "\n" + detail;
      }
      // Trim to last 40 lines to keep output manageable
      const lines = detail.split("\n");
      if (lines.length > 40) {
        detail = "...(truncated)\n" + lines.slice(-40).join("\n");
      }
      console.log("  FAIL");
      console.log(detail);
      results.push({ label: combo.label, pass: false, error: detail });
    }

    console.log();
  }

  // --- Summary ---
  console.log("=".repeat(50));
  console.log("RESULTS");
  console.log("=".repeat(50));

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;

  for (const r of results) {
    console.log(`  ${r.pass ? "PASS" : "FAIL"}  ${r.label}`);
  }

  console.log();
  console.log(`${passed}/${results.length} passed, ${failed} failed`);
  console.log(`Temp dir: ${baseDir}`);

  // Cleanup option: uncomment to auto-delete temp files
  // rmSync(baseDir, { recursive: true, force: true });

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
