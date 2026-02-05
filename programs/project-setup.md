# Token-2022 Extensions Project Setup Guide

A complete guide to setting up an Anchor project with SPL Token-2022 extensions using the wizard template system.

---

## Prerequisites

```bash
# Solana CLI (v1.18+ recommended)
solana --version

# Anchor CLI (v0.30+ recommended, this guide uses 0.32.x)
anchor --version

# Rust
rustc --version

# Node.js & Yarn
node --version
yarn --version
```

---

## 1. Initialize Project

```bash
# Create new Anchor project
anchor init token_mint
cd token_mint

# Create the folder structure
mkdir -p programs/token-mint/src/{instructions,state}
```

---

## 2. Configure Dependencies

### Cargo.toml (programs/token-mint/Cargo.toml)

```toml
[package]
name = "token-mint"
version = "0.1.0"
description = "Token-2022 mint program with optional extensions"
edition = "2021"

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
anchor-lang = { version = "0.32.1", features = ["interface-instructions"] }
anchor-spl = "0.32.1"

# Token-2022 program types and instructions
spl-token-2022 = "8"

# For metadata extension
spl-token-metadata-interface = "0.8.0"
spl-type-length-value = "0.8.0"
```

### Cargo.toml (workspace root)

```toml
[workspace]
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
```

### package.json

```json
{
  "license": "ISC",
  "scripts": {
    "lint:fix": "prettier */*.js \"*/**/*{.js,.ts}\" -w",
    "lint": "prettier */*.js \"*/**/*{.js,.ts}\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "0.32.1",
    "@solana/spl-token": "^0.4.13"
  },
  "devDependencies": {
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "prettier": "^2.6.2",
    "ts-mocha": "^10.0.0",
    "typescript": "^5.7.3"
  }
}
```

### Anchor.toml

```toml
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.localnet]
token_mint = "YOUR_PROGRAM_ID"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["mocha", "chai", "node"],
    "typeRoots": ["./node_modules/@types"],
    "lib": ["es2020"],
    "module": "commonjs",
    "target": "es2020",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["tests/**/*"]
}
```

---

## 3. Template System Overview

The template system has two components:

1. **Base Files** - Always included, contain the core mint creation logic
2. **Extensions** - Optional modules that inject code into specific marker locations

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Copy Base Files                                             │
│     • lib.rs, error.rs, instructions/, state/                   │
├─────────────────────────────────────────────────────────────────┤
│  2. Select Extensions                                           │
│     • metadata (locked - always included)                       │
│     • transfer-fee (optional)                                   │
│     • close-mint (optional)                                     │
│     • non-transferable (optional)                               │
├─────────────────────────────────────────────────────────────────┤
│  3. Inject Extension Code at Markers                            │
│     • @wizard:inject.lib.modules                                │
│     • @wizard:inject.lib.instructions                           │
│     • @wizard:inject.create_mint.*                              │
├─────────────────────────────────────────────────────────────────┤
│  4. Build & Test                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Project Structure

```
token_mint/
├── Anchor.toml
├── Cargo.toml
├── package.json
├── tsconfig.json
├── programs/
│   └── token-mint/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── error.rs
│           ├── metadata.rs          # Always included
│           ├── transfer_fee.rs      # Optional
│           ├── close_mint.rs        # Optional
│           ├── non_transferable.rs  # Optional
│           ├── instructions/
│           │   ├── mod.rs
│           │   └── create_mint.rs
│           └── state/
│               └── mod.rs
└── tests/
    └── token_mint.ts
```

---

## 5. Understanding Injection Markers

Each extension file contains markers that tell the wizard where to inject code:

```rust
// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::TransferFeeConfig);
// @wizard:end
```

This means: "Insert this code into `create_mint.rs` at the `extension_types` injection point."

### Injection Point Reference

| Marker | Location | Purpose |
|--------|----------|---------|
| `@wizard:inject.lib.modules` | lib.rs | Add `pub mod extension_name;` |
| `@wizard:inject.lib.instructions` | lib.rs | Add instruction handlers |
| `@wizard:inject.create_mint.imports` | create_mint.rs top | Add `use` statements |
| `@wizard:inject.create_mint.args` | handler function signature | Add parameters (single line) |
| `@wizard:inject.create_mint.extension_types` | After base extension list | Push extension types |
| `@wizard:inject.create_mint.init_extensions` | Before mint init | Initialize extensions |
| `@wizard:inject.create_mint.body` | After mint init | Post-init logic |
| `@wizard:inject.create_mint.accounts` | CreateMint struct | Add account fields |

---

## 6. Extension Selection

| Extension | Default | Notes |
|-----------|---------|-------|
| **Metadata** | ✅ Locked | Always included, cannot disable |
| **Transfer Fee** | ☐ | Conflicts with Non-Transferable |
| **Close Mint** | ☐ | Allow mint authority to close mint |
| **Non-Transferable** | ☐ | Conflicts with Transfer Fee |

### Conflict Rules

| If you enable... | You cannot enable... |
|------------------|---------------------|
| Transfer Fee | Non-Transferable |
| Non-Transferable | Transfer Fee |

*Reason: Transfer fees don't make sense if tokens can't be transferred.*

---

## 7. Base Files (Always Included)

### src/lib.rs

```rust
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

pub mod instructions;
pub mod state;
pub mod error;

// @wizard:inject.lib.modules
// Extensions add their modules here
// @wizard:end

use instructions::*;

#[program]
pub mod token_mint {
    use super::*;

    /// Creates a new Token-2022 mint with the specified configuration.
    pub fn create_mint(
        ctx: Context<CreateMint>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        // @wizard:inject.create_mint.args
        // @wizard:end
    ) -> Result<()> {
        instructions::create_mint::handler(ctx, name, symbol, uri, decimals)
    }

    // @wizard:inject.lib.instructions
    // Extensions add their instruction handlers here
    // @wizard:end
}
```

### src/instructions/mod.rs

```rust
pub mod create_mint;

pub use create_mint::*;
```

### src/instructions/create_mint.rs

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

// @wizard:inject.create_mint.imports
// Extensions add their imports here
// @wizard:end

pub fn handler(
    ctx: Context<CreateMint>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
    // @wizard:inject.create_mint.args (inline)
) -> Result<()> {
    msg!("Creating Token-2022 mint: {} ({})", name, symbol);

    let payer = &ctx.accounts.payer;
    let mint = &ctx.accounts.mint;
    let mint_authority = &ctx.accounts.mint_authority;
    let token_program = &ctx.accounts.token_program;
    let system_program = &ctx.accounts.system_program;

    // =========================================================================
    // STEP 1: Build extension types list
    // =========================================================================
    let mut extension_types = vec![ExtensionType::MetadataPointer];

    // @wizard:inject.create_mint.extension_types
    // Extensions add their types here
    // @wizard:end

    // =========================================================================
    // STEP 2: Calculate space
    // =========================================================================
    let mint_space = ExtensionType::try_calculate_account_len::<Mint>(&extension_types)
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

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
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The mint account to be created
    #[account(mut)]
    pub mint: Signer<'info>,

    pub mint_authority: Signer<'info>,

    // @wizard:inject.create_mint.accounts
    // Extensions add their accounts here
    // @wizard:end

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
```

### src/state/mod.rs

```rust
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";
```

### src/error.rs

```rust
use anchor_lang::prelude::*;

#[error_code]
pub enum TokenMintError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid token name")]
    InvalidName,
    #[msg("Invalid token symbol")]
    InvalidSymbol,
    #[msg("Invalid decimals value")]
    InvalidDecimals,
}
```

---

## 8. Extension Files

### Metadata Extension (Locked - Always Included)

**src/metadata.rs**

```rust
use anchor_lang::prelude::*;

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod metadata;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::metadata;
// @wizard:end

// @wizard:inject.create_mint.body
    metadata::validate_metadata(&name, &symbol, &uri)?;
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

pub const MAX_NAME_LENGTH: usize = 32;
pub const MAX_SYMBOL_LENGTH: usize = 10;
pub const MAX_URI_LENGTH: usize = 200;

pub fn validate_metadata(name: &str, symbol: &str, uri: &str) -> Result<()> {
    require!(
        !name.is_empty() && name.len() <= MAX_NAME_LENGTH,
        MetadataError::InvalidName
    );
    require!(
        !symbol.is_empty() && symbol.len() <= MAX_SYMBOL_LENGTH,
        MetadataError::InvalidSymbol
    );
    require!(
        !uri.is_empty() && uri.len() <= MAX_URI_LENGTH,
        MetadataError::InvalidUri
    );
    msg!("Metadata validation passed");
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

**src/transfer_fee.rs**

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_instruction;

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod transfer_fee;
// @wizard:end

// @wizard:inject.lib.instructions

    /// Updates the transfer fee configuration.
    pub fn update_transfer_fee(
        ctx: Context<UpdateTransferFee>,
        fee_basis_points: u16,
        max_fee: u64,
    ) -> Result<()> {
        transfer_fee::update_fee_handler(ctx, fee_basis_points, max_fee)
    }
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
            Some(&ctx.accounts.fee_authority.key()),
            Some(&ctx.accounts.fee_authority.key()),
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

pub const MAX_FEE_BASIS_POINTS: u16 = 10000;

pub fn validate_fee_config(fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );
    msg!("Transfer fee config: {} bps, max {} tokens", fee_basis_points, max_fee);
    Ok(())
}

pub fn update_fee_handler(
    ctx: Context<UpdateTransferFee>,
    fee_basis_points: u16,
    max_fee: u64,
) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );

    invoke(
        &transfer_fee_instruction::set_transfer_fee(
            ctx.accounts.token_program.key,
            ctx.accounts.mint.key,
            ctx.accounts.fee_authority.key,
            &[],
            fee_basis_points,
            max_fee,
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.fee_authority.to_account_info(),
        ],
    )?;

    msg!("Transfer fee updated: {} bps, max {}", fee_basis_points, max_fee);
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateTransferFee<'info> {
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    pub fee_authority: Signer<'info>,
    pub token_program: Program<'info, Token2022>,
}

#[error_code]
pub enum TransferFeeError {
    #[msg("Transfer fee exceeds maximum (10000 basis points)")]
    FeeTooHigh,
    #[msg("Invalid fee configuration")]
    InvalidFeeConfig,
}
```

---

### Close Mint Extension

**src/close_mint.rs**

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::instruction as token_instruction;

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod close_mint;
// @wizard:end

// @wizard:inject.lib.instructions

    /// Closes the mint account and returns rent to the destination.
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

pub fn handler(ctx: Context<CloseMint>) -> Result<()> {
    msg!("Closing mint account: {}", ctx.accounts.mint.key());

    invoke(
        &token_instruction::close_account(
            ctx.accounts.token_program.key,
            ctx.accounts.mint.key,
            ctx.accounts.destination.key,
            ctx.accounts.close_authority.key,
            &[],
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.destination.to_account_info(),
            ctx.accounts.close_authority.to_account_info(),
        ],
    )?;

    msg!("Mint closed, rent returned to {}", ctx.accounts.destination.key());
    Ok(())
}

#[derive(Accounts)]
pub struct CloseMint<'info> {
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    pub close_authority: Signer<'info>,
    /// CHECK: Any account can receive the rent
    #[account(mut)]
    pub destination: AccountInfo<'info>,
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

### Non-Transferable Extension (Soulbound)

**src/non_transferable.rs**

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;

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
/// Use cases:
/// - Credentials and certifications
/// - Membership badges
/// - Achievement tokens
/// - Reputation scores
/// - Identity tokens

#[error_code]
pub enum NonTransferableError {
    #[msg("Non-transferable tokens cannot be transferred")]
    TransferNotAllowed,
    #[msg("Cannot enable both non-transferable and transfer-fee")]
    IncompatibleWithTransferFee,
}
```

---

## 9. Assembled Example: Transfer Fee + Close Mint

Here's what the final assembled code looks like with **Metadata** + **Transfer Fee** + **Close Mint** enabled:

### Assembled src/lib.rs

```rust
use anchor_lang::prelude::*;

declare_id!("YOUR_PROGRAM_ID");

pub mod instructions;
pub mod state;
pub mod error;

// Injected modules
pub mod metadata;
pub mod transfer_fee;
pub mod close_mint;

use instructions::*;

#[program]
pub mod token_mint {
    use super::*;

    pub fn create_mint(
        ctx: Context<CreateMint>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        // Injected args from transfer-fee
        fee_basis_points: u16,
        max_fee: u64,
    ) -> Result<()> {
        instructions::create_mint::handler(ctx, name, symbol, uri, decimals, fee_basis_points, max_fee)
    }

    // Injected instructions
    pub fn update_transfer_fee(
        ctx: Context<UpdateTransferFee>,
        fee_basis_points: u16,
        max_fee: u64,
    ) -> Result<()> {
        transfer_fee::update_fee_handler(ctx, fee_basis_points, max_fee)
    }

    pub fn close_mint(ctx: Context<CloseMint>) -> Result<()> {
        close_mint::handler(ctx)
    }
}
```

### Assembled src/instructions/create_mint.rs

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::{
    extension::{metadata_pointer::instruction as metadata_pointer_instruction, ExtensionType},
    instruction as token_instruction,
    state::Mint,
};
use spl_token_metadata_interface::{instruction as metadata_instruction, state::TokenMetadata};

// Injected imports
use crate::metadata;
use crate::transfer_fee;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_ix;
use crate::close_mint;
use spl_token_2022::extension::mint_close_authority::instruction as close_authority_ix;

pub fn handler(
    ctx: Context<CreateMint>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
    fee_basis_points: u16,
    max_fee: u64,
) -> Result<()> {
    msg!("Creating Token-2022 mint: {} ({})", name, symbol);

    let payer = &ctx.accounts.payer;
    let mint = &ctx.accounts.mint;
    let mint_authority = &ctx.accounts.mint_authority;
    let token_program = &ctx.accounts.token_program;
    let system_program = &ctx.accounts.system_program;

    // STEP 1: Build extension types
    let mut extension_types = vec![ExtensionType::MetadataPointer];

    // Injected extension types
    extension_types.push(ExtensionType::TransferFeeConfig);
    extension_types.push(ExtensionType::MintCloseAuthority);

    // STEP 2: Calculate space
    let mint_space = ExtensionType::try_calculate_account_len::<Mint>(&extension_types)
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

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

    // STEP 3: Create mint account
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(total_space);

    invoke(
        &anchor_lang::solana_program::system_instruction::create_account(
            payer.key, mint.key, lamports, total_space as u64, token_program.key,
        ),
        &[payer.to_account_info(), mint.to_account_info(), system_program.to_account_info()],
    )?;

    // STEP 4: Initialize extensions (BEFORE mint init)

    // MetadataPointer (always)
    invoke(
        &metadata_pointer_instruction::initialize(
            token_program.key, mint.key, Some(mint_authority.key()), Some(mint.key()),
        )?,
        &[mint.to_account_info()],
    )?;

    // Injected: TransferFeeConfig
    transfer_fee::validate_fee_config(fee_basis_points, max_fee)?;
    invoke(
        &transfer_fee_ix::initialize_transfer_fee_config(
            token_program.key, mint.key,
            Some(&ctx.accounts.fee_authority.key()),
            Some(&ctx.accounts.fee_authority.key()),
            fee_basis_points, max_fee,
        )?,
        &[mint.to_account_info()],
    )?;

    // Injected: MintCloseAuthority
    invoke(
        &close_authority_ix::initialize_mint_close_authority(
            token_program.key, mint.key, Some(&ctx.accounts.close_authority.key()),
        )?,
        &[mint.to_account_info()],
    )?;

    // STEP 5: Initialize mint
    invoke(
        &token_instruction::initialize_mint2(
            token_program.key, mint.key, mint_authority.key, None, decimals,
        )?,
        &[mint.to_account_info()],
    )?;

    // STEP 6: Initialize TokenMetadata
    invoke(
        &metadata_instruction::initialize(
            token_program.key, mint.key, mint_authority.key, mint.key, mint_authority.key,
            name.clone(), symbol.clone(), uri.clone(),
        ),
        &[mint.to_account_info(), mint_authority.to_account_info()],
    )?;

    // Injected body: metadata validation
    metadata::validate_metadata(&name, &symbol, &uri)?;

    msg!("Mint created: {}", mint.key());
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8, fee_basis_points: u16, max_fee: u64)]
pub struct CreateMint<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Mint to be created
    #[account(mut)]
    pub mint: Signer<'info>,

    pub mint_authority: Signer<'info>,

    // Injected accounts
    pub fee_authority: Signer<'info>,
    pub close_authority: Signer<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
```

---

## 10. Extension Combinations Quick Reference

| Combination | Extensions | Extra Args | Extra Accounts | Extra Instructions |
|-------------|-----------|------------|----------------|-------------------|
| **Base** | MetadataPointer | - | - | - |
| **+ Transfer Fee** | + TransferFeeConfig | fee_basis_points, max_fee | fee_authority | update_transfer_fee |
| **+ Close Mint** | + MintCloseAuthority | - | close_authority | close_mint |
| **+ Non-Transferable** | + NonTransferable | - | - | - |
| **Fee + Close** | Both | fee_basis_points, max_fee | fee_authority, close_authority | update_transfer_fee, close_mint |

---

## 11. Build & Test

```bash
# Install dependencies
yarn install

# Build program
anchor build

# Get program ID and update declare_id!() + Anchor.toml
anchor keys list

# Rebuild with correct ID
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

---

## 12. Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Account data too small" | Extension space not included | Add all extensions to `extension_types` vec |
| "Extension not initialized" | Wrong order | Initialize extensions BEFORE `initialize_mint2` |
| "Invalid account owner" | Wrong program | Use `Token2022`, not `Token` |
| "Metadata pointer not set" | Missing init | Initialize metadata pointer before mint |
| Conflicting extensions | transfer-fee + non-transferable | Choose one or the other |

---

## 13. Resources

- [SPL Token-2022 Docs](https://spl.solana.com/token-2022)
- [Anchor Book](https://www.anchor-lang.com/)
- [Token Extensions Guide](https://solana.com/developers/guides/token-extensions)
- [Solana Cookbook](https://solanacookbook.com/)
