import type { TemplateContext } from "./types";

/**
 * Generates the main lib.rs file for the Anchor program.
 */
export function libRs(ctx: TemplateContext): string {
  const { programName, extensions } = ctx;

  // Build imports
  const imports = ["use anchor_lang::prelude::*;"];

  if (
    extensions.metadata ||
    extensions.transferFee ||
    extensions.closeMint ||
    extensions.nonTransferable
  ) {
    imports.push("use anchor_spl::token_2022::Token2022;");
  }

  // Build instructions
  const instructions: string[] = [
    `    pub fn create_mint(
        ctx: Context<CreateMint>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        instructions::create_mint::handler(ctx, name, symbol, uri, decimals)
    }`,
  ];

  if (extensions.transferFee) {
    instructions.push(`
    pub fn update_transfer_fee(
        ctx: Context<UpdateTransferFee>,
        fee_basis_points: u16,
        max_fee: u64,
    ) -> Result<()> {
        instructions::update_transfer_fee::handler(ctx, fee_basis_points, max_fee)
    }`);
  }

  if (extensions.closeMint) {
    instructions.push(`
    pub fn close_mint(ctx: Context<CloseMint>) -> Result<()> {
        instructions::close_mint::handler(ctx)
    }`);
  }

  return `${imports.join("\n")}

declare_id!("11111111111111111111111111111111");

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

#[program]
pub mod ${programName} {
    use super::*;

${instructions.join("\n")}
}
`;
}
