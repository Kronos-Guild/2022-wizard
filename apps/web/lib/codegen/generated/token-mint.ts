/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * Generated from: programs/token-mint/
 * Run "pnpm extract-templates" to regenerate.
 *
 * This file contains:
 * - Base file templates
 * - Extension injection rules
 * - Extension metadata
 */

// =============================================================================
// Program Info
// =============================================================================

export const programInfo = {
  id: "token-mint",
  name: "Token Mint",
  description: "Create Token-2022 mints with optional extensions like metadata, transfer fees, and more.",
  version: "0.1.0",
} as const;

// =============================================================================
// Base Files (always included)
// =============================================================================

export const baseFiles = {
  lib: `use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

#[program]
pub mod token_mint {
    use super::*;

    /// Creates a new Token-2022 mint with the specified configuration.
    /// 
    /// # Arguments
    /// * \`ctx\` - The context containing all accounts needed for mint creation
    /// * \`name\` - The token name (for metadata)
    /// * \`symbol\` - The token symbol (for metadata)
    /// * \`uri\` - The metadata URI pointing to off-chain JSON
    /// * \`decimals\` - Number of decimal places for the token
    pub fn create_mint(
        ctx: Context<CreateMint>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        instructions::create_mint::handler(ctx, name, symbol, uri, decimals)
    }
}
`,
  instructions: {
    "create_mint": `use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::{
    extension::{metadata_pointer::instruction as metadata_pointer_instruction, ExtensionType},
    instruction as token_instruction,
    state::Mint,
};
use spl_token_metadata_interface::{instruction as metadata_instruction, state::TokenMetadata};

/// Creates a new Token-2022 mint with metadata extension.
///
/// This is the base instruction that creates a mint account with on-chain metadata.
/// The mint is created with MetadataPointer and TokenMetadata extensions.
/// Additional extensions can be enabled via the wizard.
///
/// # Arguments
/// * \`name\` - Token name (1-32 characters)
/// * \`symbol\` - Token symbol (1-10 characters)
/// * \`uri\` - URI pointing to off-chain JSON metadata
/// * \`decimals\` - Number of decimal places (0-9 typically)
pub fn handler(
    ctx: Context<CreateMint>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
) -> Result<()> {
    msg!("Creating Token-2022 mint: {} ({})", name, symbol);
    msg!("Decimals: {}", decimals);
    msg!("URI: {}", uri);

    let payer = &ctx.accounts.payer;
    let mint = &ctx.accounts.mint;
    let mint_authority = &ctx.accounts.mint_authority;
    let token_program = &ctx.accounts.token_program;
    let system_program = &ctx.accounts.system_program;

    // @wizard:inject.create_mint.body
    // @wizard:end

    let mut extension_types = vec![ExtensionType::MetadataPointer];

    // @wizard:inject.create_mint.extension_types
    // @wizard:end

    let mint_space = ExtensionType::try_calculate_account_len::<Mint>(&extension_types)
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

    let metadata = TokenMetadata {
        update_authority: Some(mint_authority.key())
            .try_into()
            .map_err(|_| ErrorCode::AccountDidNotSerialize)?,
        mint: mint.key(),
        name: name.clone(),
        symbol: symbol.clone(),
        uri: uri.clone(),
        additional_metadata: vec![],
    };
    let metadata_space = metadata
        .tlv_size_of()
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

    let total_space = mint_space + metadata_space;
    msg!(
        "Allocating {} bytes (mint: {}, metadata: {})",
        total_space,
        mint_space,
        metadata_space
    );

    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(total_space);

    invoke(
        &anchor_lang::solana_program::system_instruction::create_account(
            payer.key,
            mint.key,
            lamports,
            total_space as u64,
            token_program.key,
        ),
        &[
            payer.to_account_info(),
            mint.to_account_info(),
            system_program.to_account_info(),
        ],
    )?;
    msg!("Mint account created");

    invoke(
        &metadata_pointer_instruction::initialize(
            token_program.key,
            mint.key,
            Some(mint_authority.key()),
            Some(mint.key()),
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("MetadataPointer initialized");

    // @wizard:inject.create_mint.init_extensions
    // @wizard:end

    invoke(
        &token_instruction::initialize_mint2(
            token_program.key,
            mint.key,
            mint_authority.key,
            None,
            decimals,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("Mint initialized with {} decimals", decimals);

    invoke(
        &metadata_instruction::initialize(
            token_program.key,
            mint.key,
            mint_authority.key,
            mint.key,
            mint_authority.key,
            name.clone(),
            symbol.clone(),
            uri.clone(),
        ),
        &[mint.to_account_info(), mint_authority.to_account_info()],
    )?;
    msg!("Metadata initialized: {} ({})", name, symbol);

    msg!("Mint created successfully: {}", mint.key());
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateMint<'info> {
    /// The account paying for rent and transaction fees
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The mint account to be created
    /// This will be initialized as a Token-2022 mint with extensions
    #[account(mut)]
    pub mint: Signer<'info>,

    /// The mint authority that can mint new tokens
    /// Also serves as the metadata update authority
    pub mint_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,

    /// System program for account creation
    pub system_program: Program<'info, System>,
}
`,
  },
  other: {
    "mod.rs": `// State module for Token Mint program
//
// Add any program state structs here.
// These are typically PDA accounts that store program configuration.
`,
    "error.rs": `use anchor_lang::prelude::*;

/// Custom errors for the Token Mint program
#[error_code]
pub enum TokenMintError {
    /// The caller is not authorized to perform this action
    #[msg("Unauthorized access")]
    Unauthorized,
}
`,
  },
} as const;

// =============================================================================
// Extension Definitions with Injection Rules
// =============================================================================

export interface LibInjection {
  modules?: string;
  instructions?: string;
}

export interface InstructionInjection {
  imports?: string;
  args?: string[];
  body?: string;
  accounts?: string;
  extension_types?: string;
  init_extensions?: string;
}

export interface Extension {
  name: string;
  description: string;
  default: boolean;
  locked: boolean;
  conflictsWith: string[];
  config?: Record<string, {
    type: string;
    name: string;
    description?: string;
    default?: number | string | boolean;
    min?: number;
    max?: number;
  }>;
  inject: {
    lib?: LibInjection;
    [instructionId: string]: LibInjection | InstructionInjection | undefined;
  };
  files: Record<string, string>;
}

export const extensions: Record<string, Extension> = {
  "metadata": {
    name: "Metadata",
    description: "Store token name, symbol, and URI on-chain using Token-2022 metadata extension",
    default: true,
    locked: true,
    conflictsWith: [],
    config: undefined,
    inject: {
      lib: {
        modules: `pub mod metadata;`,
        instructions: undefined,
      },
      "create_mint": {
        imports: `use crate::metadata;`,
        args: undefined,
        body: `    metadata::validate_metadata(&name, &symbol, &uri)?;`,
        accounts: undefined,
        extension_types: undefined,
        init_extensions: undefined,
      },
    },
    files: {
      "mod.rs": `use anchor_lang::prelude::*;

// @wizard:inject.lib.modules
pub mod metadata;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::metadata;
// @wizard:end

// @wizard:inject.create_mint.body
    metadata::validate_metadata(&name, &symbol, &uri)?;
// @wizard:end

/// Maximum length for token name
pub const MAX_NAME_LENGTH: usize = 32;

/// Maximum length for token symbol
pub const MAX_SYMBOL_LENGTH: usize = 10;

/// Maximum length for metadata URI
pub const MAX_URI_LENGTH: usize = 200;

/// Validates metadata fields before mint creation.
///
/// # Arguments
/// * \`name\` - Token name (1-32 characters)
/// * \`symbol\` - Token symbol (1-10 characters)
/// * \`uri\` - Metadata URI (1-200 characters)
///
/// # Errors
/// Returns error if any field is empty or exceeds maximum length.
pub fn validate_metadata(name: &str, symbol: &str, uri: &str) -> Result<()> {
    // Validate name
    require!(
        !name.is_empty() && name.len() <= MAX_NAME_LENGTH,
        MetadataError::InvalidName
    );

    // Validate symbol
    require!(
        !symbol.is_empty() && symbol.len() <= MAX_SYMBOL_LENGTH,
        MetadataError::InvalidSymbol
    );

    // Validate URI
    require!(
        !uri.is_empty() && uri.len() <= MAX_URI_LENGTH,
        MetadataError::InvalidUri
    );

    msg!("Metadata validation passed");
    msg!("  Name: {} ({} chars)", name, name.len());
    msg!("  Symbol: {} ({} chars)", symbol, symbol.len());
    msg!("  URI: {} chars", uri.len());

    Ok(())
}

#[error_code]
pub enum MetadataError {
    #[msg("Token name must be 1-32 characters")]
    InvalidName,

    #[msg("Token symbol must be 1-10 characters")]
    InvalidSymbol,

    #[msg("Token URI must be 1-200 characters")]
    InvalidUri,
}
`,
    },
  },
  "transfer-fee": {
    name: "Transfer Fee",
    description: "Charge a percentage fee on every token transfer",
    default: false,
    locked: false,
    conflictsWith: ["non-transferable"],
    config: {
        "fee_basis_points": {
            "type": "number",
            "name": "Fee (Basis Points)",
            "description": "100 = 1%",
            "default": 100,
            "min": 0,
            "max": 10000
        },
        "max_fee": {
            "type": "number",
            "name": "Max Fee",
            "description": "Maximum fee in token units",
            "default": 1000000,
            "min": 0
        }
    },
    inject: {
      lib: {
        modules: `pub mod transfer_fee;
pub use transfer_fee::update_fee::*;`,
        instructions: `
/// Updates the transfer fee configuration.
/// Only the fee authority can call this.
pub fn update_transfer_fee(
    ctx: Context<UpdateTransferFee>,
    fee_basis_points: u16,
    max_fee: u64,
) -> Result<()> {
    transfer_fee::update_fee::handler(ctx, fee_basis_points, max_fee)
}`,
      },
      "create_mint": {
        imports: `use crate::transfer_fee;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_ix;`,
        args: ["fee_basis_points: u16","max_fee: u64"],
        body: undefined,
        accounts: `    /// The fee authority that can update fees and withdraw withheld amounts
    pub fee_authority: Signer<'info>,`,
        extension_types: `    extension_types.push(ExtensionType::TransferFeeConfig);`,
        init_extensions: `    transfer_fee::validate_fee_config(fee_basis_points, max_fee)?;
    invoke(
        &transfer_fee_ix::initialize_transfer_fee_config(
            token_program.key,
            mint.key,
            Some(&ctx.accounts.fee_authority.key()),  // transfer_fee_config_authority
            Some(&ctx.accounts.fee_authority.key()),  // withdraw_withheld_authority
            fee_basis_points,
            max_fee,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("TransferFeeConfig initialized: {} bps, max {}", fee_basis_points, max_fee);`,
      },
    },
    files: {
      "mod.rs": `use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::extension::{transfer_fee::instruction as transfer_fee_instruction, ExtensionType};

pub mod update_fee;

// @wizard:inject.lib.modules
pub mod transfer_fee;
pub use transfer_fee::update_fee::*;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::transfer_fee;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_ix;
// @wizard:end

// @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::TransferFeeConfig);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    transfer_fee::validate_fee_config(fee_basis_points, max_fee)?;
    invoke(
        &transfer_fee_ix::initialize_transfer_fee_config(
            token_program.key,
            mint.key,
            Some(&ctx.accounts.fee_authority.key()),  // transfer_fee_config_authority
            Some(&ctx.accounts.fee_authority.key()),  // withdraw_withheld_authority
            fee_basis_points,
            max_fee,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("TransferFeeConfig initialized: {} bps, max {}", fee_basis_points, max_fee);
// @wizard:end

// @wizard:inject.create_mint.accounts
    /// The fee authority that can update fees and withdraw withheld amounts
    pub fee_authority: Signer<'info>,
// @wizard:end

/// Maximum allowed transfer fee in basis points (100% = 10000 bps)
pub const MAX_FEE_BASIS_POINTS: u16 = 10000;

/// Validates transfer fee configuration
pub fn validate_fee_config(fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );
    msg!("Transfer fee config validated: {} bps, max {} tokens", fee_basis_points, max_fee);
    Ok(())
}

/// Configuration for the transfer fee extension (for reference/calculation)
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TransferFeeConfig {
    pub fee_basis_points: u16,
    pub max_fee: u64,
}

impl TransferFeeConfig {
    pub fn new(fee_basis_points: u16, max_fee: u64) -> Result<Self> {
        require!(fee_basis_points <= MAX_FEE_BASIS_POINTS, TransferFeeError::FeeTooHigh);
        Ok(Self { fee_basis_points, max_fee })
    }

    /// Calculates the fee for a given transfer amount
    pub fn calculate_fee(&self, amount: u64) -> u64 {
        let fee = (amount as u128)
            .checked_mul(self.fee_basis_points as u128)
            .unwrap_or(0)
            .checked_div(10000)
            .unwrap_or(0) as u64;
        std::cmp::min(fee, self.max_fee)
    }
}

#[error_code]
pub enum TransferFeeError {
    #[msg("Transfer fee exceeds maximum allowed (10000 basis points)")]
    FeeTooHigh,

    #[msg("Invalid fee configuration")]
    InvalidFeeConfig,
}
`,
      "update_fee.rs": `use anchor_lang::prelude::InterfaceAccount;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::Mint;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_instruction;

use super::{TransferFeeError, MAX_FEE_BASIS_POINTS};

// @wizard:inject.lib.instructions

/// Updates the transfer fee configuration.
/// Only the fee authority can call this.
pub fn update_transfer_fee(
    ctx: Context<UpdateTransferFee>,
    fee_basis_points: u16,
    max_fee: u64,
) -> Result<()> {
    transfer_fee::update_fee::handler(ctx, fee_basis_points, max_fee)
}
// @wizard:end

/// Updates the transfer fee configuration for a mint.
///
/// Only the fee authority can update the fee.
/// Changes take effect on all subsequent transfers.
pub fn handler(ctx: Context<UpdateTransferFee>, fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );

    msg!(
        "Updating transfer fee to {} bps, max {}",
        fee_basis_points,
        max_fee
    );

    // Update fee configuration via CPI to Token-2022 program
    invoke(
        &transfer_fee_instruction::set_transfer_fee(
            ctx.accounts.token_program.key,
            &ctx.accounts.mint.key(),
            ctx.accounts.fee_authority.key,
            &[], // No multisig signers
            fee_basis_points,
            max_fee,
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.fee_authority.to_account_info(),
        ],
    )?;

    msg!("Transfer fee updated successfully");
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateTransferFee<'info> {
    /// The mint account with transfer fee extension
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// The fee authority that can update the fee
    pub fee_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}
`,
    },
  },
  "close-mint": {
    name: "Close Mint",
    description: "Allow the mint authority to close the mint and reclaim rent",
    default: false,
    locked: false,
    conflictsWith: [],
    config: undefined,
    inject: {
      lib: {
        modules: `pub mod close_mint;
pub use close_mint::*;`,
        instructions: `
    /// Closes the mint account and returns rent to the destination.
    /// Requires total supply to be 0.
    pub fn close_mint(ctx: Context<CloseMint>) -> Result<()> {
        close_mint::handler(ctx)
    }`,
      },
      "create_mint": {
        imports: `use crate::close_mint;`,
        args: undefined,
        body: undefined,
        accounts: `    /// The close authority that can close the mint
    pub close_authority: Signer<'info>,`,
        extension_types: `    extension_types.push(ExtensionType::MintCloseAuthority);`,
        init_extensions: `    invoke(
        &token_instruction::initialize_mint_close_authority(
            token_program.key,
            mint.key,
            Some(&ctx.accounts.close_authority.key()),
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("MintCloseAuthority initialized: {}", ctx.accounts.close_authority.key());`,
      },
    },
    files: {
      "mod.rs": `use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::Mint;
use spl_token_2022::{
    extension::ExtensionType,
    instruction as token_instruction,
};

// @wizard:inject.lib.modules
pub mod close_mint;
pub use close_mint::*;
// @wizard:end

// @wizard:inject.lib.instructions

    /// Closes the mint account and returns rent to the destination.
    /// Requires total supply to be 0.
    pub fn close_mint(ctx: Context<CloseMint>) -> Result<()> {
        close_mint::handler(ctx)
    }
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::close_mint;
// @wizard:end

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::MintCloseAuthority);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    invoke(
        &token_instruction::initialize_mint_close_authority(
            token_program.key,
            mint.key,
            Some(&ctx.accounts.close_authority.key()),
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("MintCloseAuthority initialized: {}", ctx.accounts.close_authority.key());
// @wizard:end

// @wizard:inject.create_mint.accounts
    /// The close authority that can close the mint
    pub close_authority: Signer<'info>,
// @wizard:end

/// Close mint extension allows closing the mint account to reclaim rent.
///
/// WARNING: Once closed, the mint cannot be recreated with the same address.

/// Closes the mint account and returns rent to the destination.
///
/// Requirements:
/// - Total supply must be 0 (all tokens burned)
/// - Caller must be the close authority
pub fn handler(ctx: Context<CloseMint>) -> Result<()> {
    msg!("Closing mint account: {}", ctx.accounts.mint.key());
    msg!("Rent returned to: {}", ctx.accounts.destination.key());

    // Close mint via CPI to Token-2022 program
    invoke(
        &token_instruction::close_account(
            ctx.accounts.token_program.key,
            &ctx.accounts.mint.key(),
            ctx.accounts.destination.key,
            ctx.accounts.close_authority.key,
            &[],  // No multisig signers
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.destination.to_account_info(),
            ctx.accounts.close_authority.to_account_info(),
        ],
    )?;

    msg!("Mint closed successfully");
    Ok(())
}

#[derive(Accounts)]
pub struct CloseMint<'info> {
    /// The mint account to close
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// The close authority for this mint
    pub close_authority: Signer<'info>,

    /// The account to receive the rent
    /// CHECK: Any account can receive the rent
    #[account(mut)]
    pub destination: AccountInfo<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}

#[error_code]
pub enum CloseMintError {
    #[msg("Cannot close mint with non-zero supply")]
    NonZeroSupply,

    #[msg("Close authority mismatch")]
    InvalidCloseAuthority,
}
`,
    },
  },
  "non-transferable": {
    name: "Non-Transferable",
    description: "Make tokens soulbound - they cannot be transferred after minting",
    default: false,
    locked: false,
    conflictsWith: ["transfer-fee"],
    config: undefined,
    inject: {
      lib: {
        modules: `pub mod non_transferable;`,
        instructions: undefined,
      },
      "create_mint": {
        imports: `use crate::non_transferable;`,
        args: undefined,
        body: undefined,
        accounts: undefined,
        extension_types: `    extension_types.push(ExtensionType::NonTransferable);`,
        init_extensions: `    invoke(
        &token_instruction::initialize_non_transferable_mint(
            token_program.key,
            mint.key,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("NonTransferable initialized - tokens are soulbound");`,
      },
    },
    files: {
      "mod.rs": `use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use spl_token_2022::extension::ExtensionType;
use spl_token_2022::instruction as token_instruction;

// @wizard:inject.lib.modules
pub mod non_transferable;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::non_transferable;
// @wizard:end

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::NonTransferable);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    invoke(
        &token_instruction::initialize_non_transferable_mint(
            token_program.key,
            mint.key,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("NonTransferable initialized - tokens are soulbound");
// @wizard:end

/// Non-transferable (Soulbound) token extension.
///
/// When enabled, tokens cannot be transferred between accounts after minting.
/// This is useful for:
/// - Credentials and certifications
/// - Membership badges
/// - Achievement tokens
/// - Reputation scores
/// - Identity tokens
///
/// Note: This extension is mutually exclusive with transfer-fee
/// (fees don't make sense if transfers are impossible).

#[error_code]
pub enum NonTransferableError {
    #[msg("Non-transferable tokens cannot be transferred")]
    TransferNotAllowed,

    #[msg("Cannot enable both non-transferable and transfer-fee extensions")]
    IncompatibleWithTransferFee,
}
`,
    },
  },
};

export type ExtensionId = keyof typeof extensions;

// =============================================================================
// Code Assembly Functions
// =============================================================================

/**
 * Replaces a marker block (// @wizard:inject.X.Y ... // @wizard:end) with replacement content.
 * Used to inject extension code at specific marker positions in base templates.
 */
function replaceMarkerBlock(code: string, markerType: string, replacement: string): string {
  const lines = code.split("\n");
  const result: string[] = [];
  let skipping = false;
  for (const line of lines) {
    if (line.includes("@wizard:inject.") && line.includes("." + markerType)) {
      skipping = true;
      result.push(replacement);
      continue;
    }
    if (skipping && line.trim() === "// @wizard:end") {
      skipping = false;
      continue;
    }
    if (!skipping) {
      result.push(line);
    }
  }
  return result.join("\n");
}

/**
 * Strips all @wizard marker comments from the code.
 * Handles both block markers (// @wizard:inject... // @wizard:end) and inline markers.
 */
function stripMarkerComments(code: string): string {
  // Remove block markers: // @wizard:inject.X.Y ... // @wizard:end
  // Using [\s\S] instead of . with 's' flag for ES5 compatibility
  let result = code.replace(/^[ \t]*\/\/ @wizard:inject\.[^\n]*\n[\s\S]*?^[ \t]*\/\/ @wizard:end\n?/gm, '');
  // Remove inline markers: // @wizard:inject.X.args ...
  result = result.replace(/^[ \t]*\/\/ @wizard:inject\.[^\n]*\n?/gm, '');
  // Clean up any resulting double blank lines
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
}

/**
 * Assembles lib.rs with enabled extensions injected.
 * @param enabledExtensions - List of enabled extension IDs
 * @param programName - The program name in snake_case (e.g., "my_token")
 */
export function assembleLib(enabledExtensions: ExtensionId[], programName?: string): string {
  let code: string = baseFiles.lib;

  // Replace program module name if provided
  if (programName) {
    code = code.replace(/pub mod token_mint/, `pub mod ${programName}`);
  }

  // Collect all module declarations, instructions, and args to inject
  const modules: string[] = [];
  const instructions: string[] = [];
  const args: string[] = [];

  for (const extId of enabledExtensions) {
    const ext = extensions[extId];
    if (ext?.inject?.lib) {
      if (ext.inject.lib.modules) {
        modules.push(ext.inject.lib.modules);
      }
      if (ext.inject.lib.instructions) {
        instructions.push(ext.inject.lib.instructions);
      }
    }
    // Collect args from instruction injections (e.g., create_mint args)
    for (const [target, injection] of Object.entries(ext?.inject ?? {})) {
      if (target === "lib") continue;
      const instrInj = injection as InstructionInjection | undefined;
      if (instrInj?.args) {
        args.push(...instrInj.args);
      }
    }
  }

  // Inject modules after the last "pub mod" line
  if (modules.length > 0) {
    const moduleLines = modules.join("\n");
    // Find the last "pub mod" line and inject after it
    code = code.replace(
      /(pub mod error;)/,
      `$1\n\n// Extension modules\n${moduleLines}`
    );
  }

  // Inject extension args into create_mint function signature and forwarding call
  if (args.length > 0) {
    const argsStr = args.join(",\n        ");
    // Add args to function signature
    code = code.replace(
      /(pub fn create_mint\([^)]*decimals: u8,)\n(\s*\) -> Result<\(\)>)/,
      `$1\n        // Extension arguments\n        ${argsStr},\n    ) -> Result<()>`
    );
    // Add arg names to the handler forwarding call
    const argNames = args.map(a => a.split(":")[0].trim()).join(", ");
    code = code.replace(
      /(instructions::create_mint::handler\(ctx, name, symbol, uri, decimals)(\))/,
      `$1, ${argNames})`
    );
  }

  // Inject instructions before the closing brace of the program module
  if (instructions.length > 0) {
    const instrCode = instructions.join("\n");
    // Find the create_mint function's closing and add instructions after it
    code = code.replace(
      /(instructions::create_mint::handler\([^)]+\)\s*})/,
      `$1\n${instrCode}`
    );
  }

  // Strip any remaining marker comments
  code = stripMarkerComments(code);

  return code;
}

/**
 * Assembles an instruction file with enabled extensions injected.
 */
export function assembleInstruction(
  instructionId: string,
  enabledExtensions: ExtensionId[],
  _extensionConfigs?: Record<string, Record<string, unknown>>
): string {
  const baseCode = baseFiles.instructions[instructionId as keyof typeof baseFiles.instructions];
  if (!baseCode) {
    throw new Error(`Unknown instruction: ${instructionId}`);
  }

  let code: string = baseCode;

  // Collect injections
  const imports: string[] = [];
  const args: string[] = [];
  const bodyParts: string[] = [];
  const accounts: string[] = [];
  const extensionTypes: string[] = [];
  const initExtensions: string[] = [];

  for (const extId of enabledExtensions) {
    const ext = extensions[extId];
    const injection = ext?.inject?.[instructionId] as InstructionInjection | undefined;
    if (injection) {
      if (injection.imports) imports.push(injection.imports);
      if (injection.args) args.push(...injection.args);
      if (injection.body) bodyParts.push(injection.body);
      if (injection.accounts) accounts.push(injection.accounts);
      if (injection.extension_types) extensionTypes.push(injection.extension_types);
      if (injection.init_extensions) initExtensions.push(injection.init_extensions);
    }
  }

  // Inject imports after the last "use" statement
  if (imports.length > 0) {
    const importCode = imports.join("\n");
    code = code.replace(
      /(use anchor_spl::token_2022::Token2022;)/,
      `$1\n\n// Extension imports\n${importCode}`
    );
  }

  // Inject args into function signature and #[instruction] macro
  if (args.length > 0) {
    const argsStr = args.join(",\n    ");
    // Add to function signature
    code = code.replace(
      /decimals: u8,\n\) -> Result<\(\)>/,
      `decimals: u8,\n    // Extension arguments\n    ${argsStr},\n) -> Result<()>`
    );
    // Add to #[instruction] macro (with types, e.g. "fee_basis_points: u16, max_fee: u64")
    const instrArgs = args.join(", ");
    code = code.replace(
      /(#\[instruction\([^)]+)(\)\])/,
      `$1, ${instrArgs}$2`
    );
  }

  // Inject body code before Ok(())
  if (bodyParts.length > 0) {
    const bodyCode = bodyParts.join("\n\n");
    code = code.replace(
      /(\n\s*Ok\(\(\)\)\n})/,
      `\n${bodyCode}\n\n    Ok(())\n}`
    );
  }

  // Inject accounts before the closing brace of the Accounts struct
  if (accounts.length > 0) {
    const accountsCode = accounts.join("\n\n");
    code = code.replace(
      /(pub system_program: Program<'info, System>,\n})/,
      `pub system_program: Program<'info, System>,\n\n    // Extension accounts\n${accountsCode}\n}`
    );
  }

  // Inject extension_types at marker position in base template
  if (extensionTypes.length > 0) {
    const typesCode = extensionTypes.join("\n");
    code = replaceMarkerBlock(code, "extension_types", typesCode);
  }

  // Inject init_extensions at marker position in base template
  if (initExtensions.length > 0) {
    const initCode = initExtensions.join("\n");
    code = replaceMarkerBlock(code, "init_extensions", initCode);
  }

  // Strip any remaining marker comments
  code = stripMarkerComments(code);

  return code;
}
