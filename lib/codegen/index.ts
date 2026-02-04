import type { WizardState } from "@/lib/wizard/types";
import {
  type GeneratedFile,
  type TemplateContext,
  libRs,
  instructionsMod,
  createMint,
  stateMod,
  errorRs,
  anchorToml,
} from "./templates";

export type { GeneratedFile, TemplateContext };

/**
 * Converts a string to snake_case for Rust identifiers.
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Creates a TemplateContext from the WizardState.
 * This transforms UI state into a format optimized for templates.
 */
function createTemplateContext(state: WizardState): TemplateContext {
  return {
    name: state.name,
    symbol: state.symbol,
    decimals: state.decimals,
    programName: toSnakeCase(state.name),
    authority: state.authority,
    cluster: state.cluster,
    extensions: { ...state.extensions },
    transferFeeConfig: { ...state.transferFeeConfig },
  };
}

/**
 * Generates all code files based on the wizard state.
 * This is the main entry point called by the UI.
 */
export function generateCode(state: WizardState): GeneratedFile[] {
  const ctx = createTemplateContext(state);

  return [
    {
      id: "lib.rs",
      label: "lib.rs",
      path: "programs/token_wizard/src/lib.rs",
      content: libRs(ctx),
    },
    {
      id: "instructions/mod.rs",
      label: "instructions/mod.rs",
      path: "programs/token_wizard/src/instructions/mod.rs",
      content: instructionsMod(ctx),
    },
    {
      id: "instructions/create_mint.rs",
      label: "create_mint.rs",
      path: "programs/token_wizard/src/instructions/create_mint.rs",
      content: createMint(ctx),
    },
    {
      id: "state/mod.rs",
      label: "state/mod.rs",
      path: "programs/token_wizard/src/state/mod.rs",
      content: stateMod(ctx),
    },
    {
      id: "error.rs",
      label: "error.rs",
      path: "programs/token_wizard/src/error.rs",
      content: errorRs(ctx),
    },
    {
      id: "Anchor.toml",
      label: "Anchor.toml",
      path: "Anchor.toml",
      content: anchorToml(ctx),
    },
  ];
}
