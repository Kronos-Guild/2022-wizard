# Token-2022 Wizard Program Templates

This document contains all the code and structure for the Token-2022 Wizard program templates.

---

## Folder Structure

```
programs/
├── CONTRIBUTING.md              # Contribution guidelines
├── TEMPLATE_SCHEMA.md           # Template schema documentation
├── program-template.md          # This file
└── token-mint/
    ├── Anchor.toml              # Anchor configuration
    ├── Cargo.toml               # Rust dependencies
    ├── template.toml            # Wizard template configuration
    ├── base/                    # Core files (always included)
    │   ├── lib.rs               # Program entry point
    │   ├── error.rs             # Custom error types
    │   ├── instructions/
    │   │   ├── mod.rs           # Instructions module
    │   │   └── create_mint.rs   # Main mint creation instruction
    │   └── state/
    │       └── mod.rs           # Program state definitions
    └── extensions/              # Optional Token-2022 extensions
        ├── metadata/
        │   └── mod.rs           # Metadata extension (locked/always included)
        ├── transfer-fee/
        │   ├── mod.rs           # Transfer fee initialization
        │   └── update_fee.rs    # Update fee instruction
        ├── close-mint/
        │   └── mod.rs           # Close mint extension
        └── non-transferable/
            └── mod.rs           # Non-transferable (soulbound) extension
```

---

## Configuration Files

### `Anchor.toml`

```toml
[features]
seeds = false
skip-lint = false

[programs.localnet]
token_mint = "4bxpnhHC89YQZ15cLKv9XxtdwZF2x7CBZYFKks9Bru76"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

### `Cargo.toml`

```toml
[package]
name = "token-mint"
version = "0.1.0"
description = "Token-2022 mint program with optional extensions"
edition = "2021"

[profile.release]
overflow-checks = true

[lib]
crate-type = ["cdylib", "lib"]
name = "token_mint"

[features]
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

[dependencies]
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token-2022"] }
spl-token-2022 = "8"
spl-token-metadata-interface = "0.8.0"
spl-type-length-value = "0.8.0"
```

### `template.toml`

This file defines how the wizard assembles the program from base and extension files.

```toml
# Token Mint Program Template Configuration
#
# This file defines how the wizard assembles the program from base and extension files.
# Rust contributors: Edit the .rs files with @wizard marker comments.
#
# INJECTION MARKERS IN RUST FILES:
# Extensions use marker comments in their .rs files to declare injections:
#   // @wizard:inject.<target>.<type>
#   ... code ...
#   // @wizard:end
#
# For args (single line):
#   // @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64
#
# Targets: "lib" or instruction id (e.g., "create_mint")
# Types: "modules", "instructions", "imports", "args", "body", "accounts"

[program]
id = "token-mint"
name = "Token Mint"
description = "Create Token-2022 mints with optional extensions like metadata, transfer fees, and more."
version = "0.1.0"

# Base files are always included - these are the "templates" that get modified
[base]
lib = "base/lib.rs"
instructions = [
    { id = "create_mint", file = "base/instructions/create_mint.rs" },
]
other = [
    "base/instructions/mod.rs",
    "base/state/mod.rs",
    "base/error.rs",
]

# =============================================================================
# EXTENSIONS
# =============================================================================
# Each extension declares its files. Injection rules are defined in the .rs files
# using @wizard marker comments (see extensions/*/mod.rs for examples).

[extensions.metadata]
name = "Metadata"
description = "Store token name, symbol, and URI on-chain using Token-2022 metadata extension"
default = true
locked = true  # Cannot be disabled - always included
files = ["extensions/metadata/mod.rs"]

# -----------------------------------------------------------------------------

[extensions.transfer-fee]
name = "Transfer Fee"
description = "Charge a percentage fee on every token transfer"
default = false
conflicts_with = ["non-transferable"]
files = [
    "extensions/transfer-fee/mod.rs",
    "extensions/transfer-fee/update_fee.rs",
]

# UI configuration for this extension
[extensions.transfer-fee.config]
fee_basis_points = { type = "number", name = "Fee (Basis Points)", description = "100 = 1%", default = 100, min = 0, max = 10000 }
max_fee = { type = "number", name = "Max Fee", description = "Maximum fee in token units", default = 1000000, min = 0 }

# -----------------------------------------------------------------------------

[extensions.close-mint]
name = "Close Mint"
description = "Allow the mint authority to close the mint and reclaim rent"
default = false
files = ["extensions/close-mint/mod.rs"]

# -----------------------------------------------------------------------------

[extensions.non-transferable]
name = "Non-Transferable"
description = "Make tokens soulbound - they cannot be transferred after minting"
default = false
conflicts_with = ["transfer-fee"]
files = ["extensions/non-transferable/mod.rs"]
```

---

## Base Files

### `base/lib.rs`

Program entry point that defines the main program module and instruction handlers.

```rust
use anchor_lang::prelude::*;

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
    /// * `ctx` - The context containing all accounts needed for mint creation
    /// * `name` - The token name (for metadata)
    /// * `symbol` - The token symbol (for metadata)
    /// * `uri` - The metadata URI pointing to off-chain JSON
    /// * `decimals` - Number of decimal places for the token
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
```

### `base/instructions/mod.rs`

```rust
pub mod create_mint;

pub use create_mint::*;
```

### `base/instructions/create_mint.rs`

The main instruction that creates a Token-2022 mint with metadata extension. Contains wizard injection points for optional extensions.

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::{
    extension::{metadata_pointer::instruction as metadata_pointer_instruction, ExtensionType},
    instruction as token_instruction,
    state::Mint,
};
use spl_token_metadata_interface::{
    instruction as metadata_instruction,
    state::TokenMetadata,
};

/// Creates a new Token-2022 mint with metadata extension.
///
/// This is the base instruction that creates a mint account with on-chain metadata.
/// The mint is created with MetadataPointer and TokenMetadata extensions.
/// Additional extensions can be enabled via the wizard.
///
/// # Arguments
/// * `name` - Token name (1-32 characters)
/// * `symbol` - Token symbol (1-10 characters)
/// * `uri` - URI pointing to off-chain JSON metadata
/// * `decimals` - Number of decimal places (0-9 typically)
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

    // =========================================================================
    // STEP 1: Build extension types list
    // =========================================================================
    // Base extension: MetadataPointer (always included)
    let mut extension_types = vec![ExtensionType::MetadataPointer];

    // @wizard:inject.create_mint.extension_types
    // Extensions add their types here (e.g., extension_types.push(ExtensionType::TransferFeeConfig);)
    // @wizard:end

    // =========================================================================
    // STEP 2: Calculate space
    // =========================================================================
    let mint_space = ExtensionType::try_calculate_account_len::<Mint>(&extension_types)
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

    // Calculate TokenMetadata space (variable length)
    let metadata = TokenMetadata {
        update_authority: Some(mint_authority.key()).try_into()
            .map_err(|_| ErrorCode::AccountDidNotSerialize)?,
        mint: mint.key(),
        name: name.clone(),
        symbol: symbol.clone(),
        uri: uri.clone(),
        additional_metadata: vec![],
    };
    let metadata_space = metadata.tlv_size_of()
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

    let total_space = mint_space + metadata_space;
    msg!("Allocating {} bytes (mint: {}, metadata: {})", total_space, mint_space, metadata_space);

    // =========================================================================
    // STEP 3: Create mint account
    // =========================================================================
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

    // =========================================================================
    // STEP 4: Initialize extensions (BEFORE mint initialization)
    // =========================================================================

    // 4a. Initialize MetadataPointer (always)
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
    // Extensions initialize here (BEFORE mint init)
    // @wizard:end

    // =========================================================================
    // STEP 5: Initialize the mint
    // =========================================================================
    invoke(
        &token_instruction::initialize_mint2(
            token_program.key,
            mint.key,
            mint_authority.key,
            None, // freeze authority
            decimals,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("Mint initialized with {} decimals", decimals);

    // =========================================================================
    // STEP 6: Initialize TokenMetadata (AFTER mint initialization)
    // =========================================================================
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
        &[
            mint.to_account_info(),
            mint_authority.to_account_info(),
        ],
    )?;
    msg!("Metadata initialized: {} ({})", name, symbol);

    // @wizard:inject.create_mint.body
    // Additional extension logic (post-mint initialization)
    // @wizard:end

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
```

### `base/state/mod.rs`

```rust
/// State module for Token Mint program
///
/// Add any program state structs here.
/// These are typically PDA accounts that store program configuration.

/// Seed for mint authority PDA (when using PDA authority mode)
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";
```

### `base/error.rs`

```rust
use anchor_lang::prelude::*;

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
```

---

## Extensions

### Metadata Extension (Locked - Always Included)

**File:** `extensions/metadata/mod.rs`

Provides validation for token metadata. The actual metadata initialization is handled in `create_mint.rs`.

```rust
use anchor_lang::prelude::*;

// =============================================================================
// Wizard Injection Markers
// =============================================================================
// NOTE: Metadata is a "locked" extension - always included in base.
// The actual metadata initialization happens in create_mint.rs.
// This file provides validation helpers that can be used by the wizard.

// @wizard:inject.lib.modules
pub mod metadata;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::metadata;
// @wizard:end

// @wizard:inject.create_mint.body
    // Validate metadata fields before initialization
    metadata::validate_metadata(&name, &symbol, &uri)?;
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

/// Maximum length for token name
pub const MAX_NAME_LENGTH: usize = 32;

/// Maximum length for token symbol
pub const MAX_SYMBOL_LENGTH: usize = 10;

/// Maximum length for metadata URI
pub const MAX_URI_LENGTH: usize = 200;

/// Validates metadata fields before mint creation.
///
/// # Arguments
/// * `name` - Token name (1-32 characters)
/// * `symbol` - Token symbol (1-10 characters)
/// * `uri` - Metadata URI (1-200 characters)
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
```

---

### Transfer Fee Extension

Charges a percentage fee on every token transfer.

**Conflicts with:** `non-transferable`

#### `extensions/transfer-fee/mod.rs`

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::extension::{transfer_fee::instruction as transfer_fee_instruction, ExtensionType};

pub mod update_fee;

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod transfer_fee;
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
    // Initialize TransferFeeConfig extension
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

// =============================================================================
// Extension Implementation
// =============================================================================

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
```

#### `extensions/transfer-fee/update_fee.rs`

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_instruction;

use super::{TransferFeeError, MAX_FEE_BASIS_POINTS};

// =============================================================================
// Wizard Injection Markers
// =============================================================================

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

// =============================================================================
// Handler Implementation
// =============================================================================

/// Updates the transfer fee configuration for a mint.
///
/// Only the fee authority can update the fee.
/// Changes take effect on all subsequent transfers.
pub fn handler(ctx: Context<UpdateTransferFee>, fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );

    msg!("Updating transfer fee to {} bps, max {}", fee_basis_points, max_fee);

    // Update fee configuration via CPI to Token-2022 program
    invoke(
        &transfer_fee_instruction::set_transfer_fee(
            ctx.accounts.token_program.key,
            ctx.accounts.mint.key,
            ctx.accounts.fee_authority.key,
            &[],  // No multisig signers
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
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    /// The fee authority that can update the fee
    pub fee_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}
```

---

### Close Mint Extension

Allows the mint authority to close the mint and reclaim rent.

**File:** `extensions/close-mint/mod.rs`

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::{
    extension::{mint_close_authority::instruction as close_authority_instruction, ExtensionType},
    instruction as token_instruction,
};

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod close_mint;
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
use spl_token_2022::extension::mint_close_authority::instruction as close_authority_ix;
// @wizard:end

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::MintCloseAuthority);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    // Initialize MintCloseAuthority extension
    invoke(
        &close_authority_ix::initialize_mint_close_authority(
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

// =============================================================================
// Extension Implementation
// =============================================================================

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
            ctx.accounts.mint.key,
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
```

---

### Non-Transferable Extension (Soulbound Tokens)

Makes tokens non-transferable after minting (soulbound).

**Conflicts with:** `transfer-fee`

**File:** `extensions/non-transferable/mod.rs`

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use spl_token_2022::extension::{non_transferable::instruction as non_transferable_instruction, ExtensionType};

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod non_transferable;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::non_transferable;
use spl_token_2022::extension::non_transferable::instruction as non_transferable_ix;
// @wizard:end

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::NonTransferable);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    // Initialize NonTransferable extension (soulbound tokens)
    invoke(
        &non_transferable_ix::initialize_non_transferable_mint(
            token_program.key,
            mint.key,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("NonTransferable initialized - tokens are soulbound");
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

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
```

---

## Wizard Injection Markers Reference

The wizard uses special marker comments to assemble the final program:

| Marker Type | Target | Description |
|-------------|--------|-------------|
| `@wizard:inject.lib.modules` | lib.rs | Adds module declarations |
| `@wizard:inject.lib.instructions` | lib.rs | Adds new instruction handlers |
| `@wizard:inject.create_mint.imports` | create_mint.rs | Adds use statements |
| `@wizard:inject.create_mint.args` | create_mint.rs | Adds function parameters |
| `@wizard:inject.create_mint.extension_types` | create_mint.rs | Adds extension types to the list |
| `@wizard:inject.create_mint.init_extensions` | create_mint.rs | Adds extension initialization (before mint init) |
| `@wizard:inject.create_mint.body` | create_mint.rs | Adds code after mint initialization |
| `@wizard:inject.create_mint.accounts` | create_mint.rs | Adds account fields to the Accounts struct |

---

## Extension Conflicts

| Extension | Conflicts With |
|-----------|---------------|
| `transfer-fee` | `non-transferable` |
| `non-transferable` | `transfer-fee` |

---

## Summary

| Feature | Description | Status |
|---------|-------------|--------|
| **Basic Mint Creation** | Create Token-2022 mint with name, symbol, decimals | ✅ Implemented |
| **Metadata Extension** | On-chain name, symbol, URI | ✅ Locked (always included) |
| **Transfer Fee** | Charge fees on transfers | ✅ Optional |
| **Close Mint** | Close mint and reclaim rent | ✅ Optional |
| **Non-Transferable** | Soulbound tokens | ✅ Optional |
