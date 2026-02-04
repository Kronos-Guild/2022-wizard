/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * 
 * Generated from: programs/token-mint/
 * Run "pnpm extract-templates" to regenerate.
 */

export const programInfo = {
  id: "token-mint",
  name: "Token Mint",
  description: "Create Token-2022 mints with optional extensions like metadata, transfer fees, and more.",
  version: "0.1.0",
} as const;

export const baseFiles = {
  "lib.rs": `use anchor_lang::prelude::*;

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
  "mod.rs": `/// State module for Token Mint program
///
/// Add any program state structs here.
/// These are typically PDA accounts that store program configuration.

/// Seed for mint authority PDA (when using PDA authority mode)
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";
`,
  "create_mint.rs": `use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

/// Creates a new Token-2022 mint.
///
/// This is the base instruction that creates a mint account.
/// Extensions are added by including additional files from the extensions/ folder.
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

    // Base mint creation logic
    // The actual CPI calls will be implemented based on enabled extensions

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateMint<'info> {
    /// The account paying for rent and transaction fees
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The mint account to be created
    /// This will be initialized as a Token-2022 mint
    #[account(mut)]
    pub mint: Signer<'info>,

    /// The mint authority that can mint new tokens
    pub mint_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,

    /// System program for account creation
    pub system_program: Program<'info, System>,
}
`,
  "error.rs": `use anchor_lang::prelude::*;

/// Custom errors for the Token Mint program
#[error_code]
pub enum TokenMintError {
    /// The caller is not authorized to perform this action
    #[msg("Unauthorized access")]
    Unauthorized,

    /// The provided token name is invalid (empty or too long)
    #[msg("Invalid token name")]
    InvalidName,

    /// The provided token symbol is invalid (empty or too long)
    #[msg("Invalid token symbol")]
    InvalidSymbol,

    /// The provided decimals value is out of range (must be 0-9)
    #[msg("Invalid decimals value")]
    InvalidDecimals,
}
`,
} as const;

export const extensions = {
  "metadata": {
    id: "metadata",
    name: "Metadata",
    description: "Store token name, symbol, and URI on-chain using Token-2022 metadata extension",
    default: true,
    locked: true,
    conflictsWith: [],
    config: undefined,
    files: {
      "mod.rs": `use anchor_lang::prelude::*;
use spl_token_metadata_interface::state::TokenMetadata;

/// Initialize metadata extension for the mint.
///
/// This adds on-chain metadata (name, symbol, uri) to the token using
/// the Token-2022 metadata extension.
///
/// # Arguments
/// * \`name\` - The token name
/// * \`symbol\` - The token symbol  
/// * \`uri\` - URI pointing to off-chain JSON metadata
pub fn init_metadata(name: String, symbol: String, uri: String) -> Result<TokenMetadata> {
    msg!("Initializing metadata extension");
    msg!("  Name: {}", name);
    msg!("  Symbol: {}", symbol);
    msg!("  URI: {}", uri);

    let metadata = TokenMetadata {
        name,
        symbol,
        uri,
        ..Default::default()
    };

    Ok(metadata)
}

/// Validates metadata fields
pub fn validate_metadata(name: &str, symbol: &str) -> Result<()> {
    require!(
        !name.is_empty() && name.len() <= 32,
        MetadataError::InvalidName
    );
    require!(
        !symbol.is_empty() && symbol.len() <= 10,
        MetadataError::InvalidSymbol
    );
    Ok(())
}

#[error_code]
pub enum MetadataError {
    #[msg("Token name must be 1-32 characters")]
    InvalidName,

    #[msg("Token symbol must be 1-10 characters")]
    InvalidSymbol,
}
`,
    },
  },
  "transfer-fee": {
    id: "transfer-fee",
    name: "Transfer Fee",
    description: "Charge a percentage fee on every token transfer",
    default: false,
    locked: false,
    conflictsWith: ["non-transferable"],
    config: {
        "fee_bps": {
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
    files: {
      "mod.rs": `use anchor_lang::prelude::*;

/// Maximum allowed transfer fee in basis points (100% = 10000 bps)
pub const MAX_FEE_BASIS_POINTS: u16 = 10000;

/// Configuration for the transfer fee extension.
///
/// Transfer fees are charged on every token transfer and collected
/// in a withheld account that can be harvested by the fee authority.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TransferFeeConfig {
    /// Fee in basis points (1 bp = 0.01%)
    /// Example: 100 = 1% fee
    pub fee_basis_points: u16,

    /// Maximum fee in token units (with decimals)
    /// This caps the fee for large transfers
    pub max_fee: u64,
}

impl TransferFeeConfig {
    /// Creates a new transfer fee configuration
    pub fn new(fee_basis_points: u16, max_fee: u64) -> Result<Self> {
        require!(
            fee_basis_points <= MAX_FEE_BASIS_POINTS,
            TransferFeeError::FeeTooHigh
        );

        Ok(Self {
            fee_basis_points,
            max_fee,
        })
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

/// Initialize transfer fee extension on the mint
pub fn init_transfer_fee(fee_basis_points: u16, max_fee: u64) -> Result<TransferFeeConfig> {
    msg!("Initializing transfer fee extension");
    msg!(
        "  Fee: {} basis points ({}%)",
        fee_basis_points,
        fee_basis_points as f64 / 100.0
    );
    msg!("  Max fee: {} tokens", max_fee);

    TransferFeeConfig::new(fee_basis_points, max_fee)
}

#[error_code]
pub enum TransferFeeError {
    #[msg("Transfer fee exceeds maximum allowed (10000 basis points)")]
    FeeTooHigh,

    #[msg("Invalid fee configuration")]
    InvalidFeeConfig,
}
`,
      "update_fee.rs": `use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

use super::{TransferFeeConfig, TransferFeeError, MAX_FEE_BASIS_POINTS};

/// Updates the transfer fee configuration for a mint.
///
/// Only the fee authority can update the fee.
/// Changes take effect on all subsequent transfers.
pub fn handler(ctx: Context<UpdateTransferFee>, fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );

    msg!("Updating transfer fee");
    msg!(
        "  New fee: {} basis points ({}%)",
        fee_basis_points,
        fee_basis_points as f64 / 100.0
    );
    msg!("  New max fee: {} tokens", max_fee);

    // Update fee configuration via CPI to Token-2022 program
    // Implementation would go here

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateTransferFee<'info> {
    /// The mint account with transfer fee extension
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    /// The fee authority that can update the fee
    pub fee_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}
`,
    },
  },
  "close-mint": {
    id: "close-mint",
    name: "Close Mint",
    description: "Allow the mint authority to close the mint and reclaim rent",
    default: false,
    locked: false,
    conflictsWith: [],
    config: undefined,
    files: {
      "mod.rs": `use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

/// Close mint extension allows the mint authority to close the mint
/// account and reclaim the rent.
///
/// This is useful for:
/// - One-time token distributions where the mint is no longer needed
/// - Reclaiming SOL from unused mints
/// - Cleaning up test mints
///
/// WARNING: Once closed, the mint cannot be recreated with the same address.

/// Closes the mint account and returns rent to the payer.
///
/// Requirements:
/// - Total supply must be 0 (all tokens burned)
/// - Caller must be the close authority
pub fn handler(ctx: Context<CloseMint>) -> Result<()> {
    msg!("Closing mint account");
    msg!("  Rent returned to: {}", ctx.accounts.destination.key());

    // Close mint via CPI to Token-2022 program
    // Implementation would go here

    Ok(())
}

#[derive(Accounts)]
pub struct CloseMint<'info> {
    /// The mint account to close
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,

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
    id: "non-transferable",
    name: "Non-Transferable",
    description: "Make tokens soulbound - they cannot be transferred after minting",
    default: false,
    locked: false,
    conflictsWith: ["transfer-fee"],
    config: undefined,
    files: {
      "mod.rs": `use anchor_lang::prelude::*;

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

/// Marker struct for non-transferable tokens.
///
/// This extension has no configuration - it's simply enabled or not.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct NonTransferableConfig {
    /// Timestamp when the extension was initialized
    pub initialized_at: i64,
}

impl NonTransferableConfig {
    pub fn new() -> Self {
        Self {
            initialized_at: Clock::get().map(|c| c.unix_timestamp).unwrap_or(0),
        }
    }
}

impl Default for NonTransferableConfig {
    fn default() -> Self {
        Self::new()
    }
}

/// Initialize non-transferable extension on the mint.
///
/// Once initialized, all tokens minted will be non-transferable.
pub fn init_non_transferable() -> Result<NonTransferableConfig> {
    msg!("Initializing non-transferable (soulbound) extension");
    msg!("  Tokens minted from this mint cannot be transferred");

    Ok(NonTransferableConfig::new())
}

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
} as const;

export type ExtensionId = keyof typeof extensions;
