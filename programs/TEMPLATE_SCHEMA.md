# Template Schema Reference

This document describes the `template.toml` schema used to define Solana program templates for the wizard.

## Overview

Each program in `programs/<program-name>/` must have a `template.toml` file that defines:
- Program metadata
- Base files (always included)
- Extensions (optional features that inject code)

## Schema

### `[program]` - Required

Program metadata displayed in the wizard UI.

```toml
[program]
id = "token-mint"              # Unique identifier (kebab-case, matches directory name)
name = "Token Mint"            # Display name
description = "Description"    # Short description for the wizard
version = "0.1.0"              # Semantic version
```

### `[base]` - Required

Defines the core files that are always included in generated code.

```toml
[base]
lib = "base/lib.rs"            # Main program entry point

instructions = [               # List of instruction handlers
    { id = "create_mint", file = "base/instructions/create_mint.rs" },
    { id = "transfer", file = "base/instructions/transfer.rs" },
]

other = [                      # Other base files (included but not modified)
    "base/instructions/mod.rs",
    "base/state/mod.rs",
    "base/error.rs",
]
```

### `[extensions.<extension-id>]` - Optional

Each extension represents an optional feature that can be toggled in the wizard.

```toml
[extensions.transfer-fee]
name = "Transfer Fee"                          # Display name
description = "Charge fees on transfers"       # Description shown in wizard
default = false                                # Enabled by default?
locked = false                                 # If true, cannot be toggled (always enabled)
conflicts_with = ["non-transferable"]          # Mutually exclusive extensions
files = [                                      # Extension's Rust files
    "extensions/transfer-fee/mod.rs",
    "extensions/transfer-fee/update_fee.rs",
]
```

### `[extensions.<extension-id>.config]` - Optional

Defines configurable parameters for the extension that appear in the wizard UI.

```toml
[extensions.transfer-fee.config]
fee_basis_points = { 
    type = "number",           # "number" | "string" | "boolean"
    name = "Fee (Basis Points)", 
    description = "100 = 1%",  # Help text
    default = 100,             # Default value
    min = 0,                   # Minimum (for numbers)
    max = 10000                # Maximum (for numbers)
}
max_fee = { 
    type = "number", 
    name = "Max Fee", 
    description = "Maximum fee in token units", 
    default = 1000000, 
    min = 0 
}
```

### `[extensions.<extension-id>.inject]` - Required for extensions

Defines what code to inject into base files when the extension is enabled.

#### Inject into lib.rs

```toml
[extensions.transfer-fee.inject.lib]
modules = "pub mod transfer_fee;"     # Added after the last `pub mod` line

instructions = """
    /// Updates the transfer fee
    pub fn update_transfer_fee(
        ctx: Context<UpdateTransferFee>,
        fee_basis_points: u16,
    ) -> Result<()> {
        transfer_fee::update_fee::handler(ctx, fee_basis_points)
    }"""                              # Added inside the #[program] module
```

#### Inject into instruction files

```toml
[extensions.transfer-fee.inject.create_mint]  # Matches instruction id from [base]
imports = "use crate::transfer_fee;"          # Added after existing `use` statements

args = ["fee_basis_points: u16", "max_fee: u64"]  # Added to function signature & #[instruction]

body = """
    // Initialize transfer fee extension
    let _fee_config = transfer_fee::init_transfer_fee(fee_basis_points, max_fee)?;
    msg!("Transfer fee initialized");"""      # Injected before `Ok(())`

accounts = """
    /// The fee authority
    pub fee_authority: Signer<'info>,"""      # Added to Accounts struct
```

## Injection Points

The extraction script looks for specific patterns in base files to inject extension code:

| Injection | Target File | Insertion Point |
|-----------|-------------|-----------------|
| `modules` | lib.rs | After `pub mod error;` |
| `instructions` | lib.rs | After the `create_mint` function body |
| `imports` | instruction files | After `use anchor_spl::token_2022::Token2022;` |
| `args` | instruction files | Added to function params and `#[instruction]` macro |
| `body` | instruction files | Before final `Ok(())` |
| `accounts` | instruction files | Before closing `}` of Accounts struct |

## Directory Structure

A complete program template should follow this structure:

```
programs/<program-name>/
├── template.toml           # This configuration file
├── Cargo.toml              # Standard Anchor Cargo.toml
├── base/                   # Core files (always included)
│   ├── lib.rs
│   ├── error.rs
│   ├── instructions/
│   │   ├── mod.rs
│   │   └── <instruction>.rs
│   └── state/
│       └── mod.rs
└── extensions/             # Optional features
    └── <extension-id>/
        ├── mod.rs
        └── <additional>.rs
```

## Validation Rules

The extraction script validates:

1. **Required fields**: `program.id`, `program.name`, `base.lib`, `base.instructions`
2. **File existence**: All referenced files must exist
3. **Unique IDs**: Extension IDs and instruction IDs must be unique
4. **Conflict consistency**: If A conflicts with B, B should conflict with A
5. **Config types**: Must be "number", "string", or "boolean"

## Example

See `programs/token-mint/template.toml` for a complete working example.
