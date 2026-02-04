import type { TemplateContext } from "./types";

/**
 * Generates the state/mod.rs file.
 * Add any program state structs here.
 */
export function stateMod(_ctx: TemplateContext): string {
  return `// State module
// Add any program state structs here

pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";

// Example:
// #[account]
// pub struct TokenConfig {
//     pub authority: Pubkey,
//     pub mint: Pubkey,
//     pub bump: u8,
// }
`;
}
