import type { TemplateContext } from "./types";

/**
 * Generates the instructions/mod.rs file.
 * This exports all instruction modules.
 */
export function instructionsMod(ctx: TemplateContext): string {
  const { extensions } = ctx;

  const modules: string[] = [
    "pub mod create_mint;",
    "pub use create_mint::*;",
  ];

  if (extensions.transferFee) {
    modules.push("");
    modules.push("pub mod update_transfer_fee;");
    modules.push("pub use update_transfer_fee::*;");
  }

  if (extensions.closeMint) {
    modules.push("");
    modules.push("pub mod close_mint;");
    modules.push("pub use close_mint::*;");
  }

  return modules.join("\n") + "\n";
}
