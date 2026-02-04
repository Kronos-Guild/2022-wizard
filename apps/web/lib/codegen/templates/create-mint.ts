import type { TemplateContext } from "./types";

/**
 * Generates the instructions/create_mint.rs file.
 * This is the main instruction for creating a token mint with extensions.
 */
export function createMint(ctx: TemplateContext): string {
  const { extensions, authority, transferFeeConfig } = ctx;
  const isPda = authority === "pda";

  // Build extension types array
  const extensionTypes: string[] = [];
  if (extensions.metadata) {
    extensionTypes.push("ExtensionType::MetadataPointer");
  }
  if (extensions.transferFee) {
    extensionTypes.push("ExtensionType::TransferFeeConfig");
  }
  if (extensions.closeMint) {
    extensionTypes.push("ExtensionType::MintCloseAuthority");
  }
  if (extensions.nonTransferable) {
    extensionTypes.push("ExtensionType::NonTransferable");
  }

  // Build code sections conditionally
  const extensionsInit =
    extensionTypes.length > 0
      ? `
    // Initialize extensions
    let extensions = vec![
        ${extensionTypes.join(",\n        ")},
    ];`
      : "";

  const metadataInit = extensions.metadata
    ? `
    // Set token metadata
    let metadata = TokenMetadata {
        name: name.clone(),
        symbol: symbol.clone(),
        uri: uri.clone(),
        ..Default::default()
    };
    
    msg!("Creating token: {} ({})", name, symbol);`
    : "";

  const nonTransferableComment = extensions.nonTransferable
    ? `
    // Non-transferable (soulbound) token
    // Tokens cannot be transferred once minted`
    : "";

  const transferFeeInit = extensions.transferFee
    ? `
    // Configure transfer fee
    // Fee: ${(transferFeeConfig.feeBps / 100).toFixed(2)}% (${transferFeeConfig.feeBps} basis points)
    // Max fee: ${transferFeeConfig.maxFee} tokens
    let transfer_fee_basis_points: u16 = ${transferFeeConfig.feeBps};
    let max_transfer_fee: u64 = ${transferFeeConfig.maxFee};`
    : "";

  // Mint authority account definition
  const mintAuthorityAccount = isPda
    ? `    /// Mint authority PDA
    #[account(
        seeds = [b"mint_authority", mint.key().as_ref()],
        bump,
    )]
    pub mint_authority: AccountInfo<'info>,`
    : `    /// The mint authority (keypair)
    pub mint_authority: Signer<'info>,`;

  // Additional imports for PDA
  const pdaImport = isPda ? "\nuse crate::state::MINT_AUTHORITY_SEED;" : "";

  // Metadata import
  const metadataImport = extensions.metadata
    ? "use spl_token_metadata_interface::state::TokenMetadata;"
    : "";

  return `use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::extension::ExtensionType;${pdaImport}
${metadataImport}

pub fn handler(
    ctx: Context<CreateMint>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
) -> Result<()> {${extensionsInit}${metadataInit}${nonTransferableComment}${transferFeeInit}

    // Mint creation logic here
    // The actual CPI calls to create the mint with extensions
    // would be implemented based on your specific requirements

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateMint<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Mint account to be created
    #[account(mut)]
    pub mint: Signer<'info>,

${mintAuthorityAccount}

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
`;
}
