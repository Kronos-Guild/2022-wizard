# Template Schema Reference

This document describes the `template.toml` schema and `@wizard` marker comments used to define Solana program templates for the wizard.

## Overview

Each program in `programs/<program-name>/` requires:
1. A `template.toml` file defining program metadata and extension config
2. Rust files with `@wizard` marker comments declaring code injections

## template.toml Schema

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
```

## Marker Comments (Injection Declarations)

Instead of declaring injections in `template.toml`, use `@wizard` marker comments directly in your Rust files. This keeps the injection code close to the source and avoids duplication.

### Syntax

**Block markers** (multi-line):
```rust
// @wizard:inject.<target>.<type>
... code to inject ...
// @wizard:end
```

**Inline markers** (for args only):
```rust
// @wizard:inject.<target>.args arg1: Type1, arg2: Type2
```

### Target

- `lib` - Inject into `lib.rs`
- `<instruction_id>` - Inject into an instruction file (e.g., `create_mint`)

### Types

| Type | Target | Description |
|------|--------|-------------|
| `modules` | lib | Module declaration (`pub mod foo;`) |
| `instructions` | lib | New instruction function in `#[program]` module |
| `imports` | instruction | Use statements |
| `args` | instruction | Function parameters (also added to `#[instruction]`) |
| `extension_types` | instruction | Extension type registration (e.g., `extension_types.push(...)`) |
| `init_extensions` | instruction | Extension initialization CPIs (before mint init) |
| `body` | instruction | Code injected before `Ok(())` |
| `accounts` | instruction | Account fields in Accounts struct |

### Examples

**Module declaration** (injected into lib.rs):
```rust
// @wizard:inject.lib.modules
pub mod transfer_fee;
// @wizard:end
```

**New instruction** (injected into lib.rs):
```rust
// @wizard:inject.lib.instructions

    /// Updates the transfer fee configuration.
    pub fn update_transfer_fee(
        ctx: Context<UpdateTransferFee>,
        fee_basis_points: u16,
    ) -> Result<()> {
        transfer_fee::update_fee::handler(ctx, fee_basis_points)
    }
// @wizard:end
```

**Imports** (injected into instruction file):
```rust
// @wizard:inject.create_mint.imports
use crate::transfer_fee;
// @wizard:end
```

**Args** (single line format):
```rust
// @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64
```

**Extension types** (register extension type for space calculation):
```rust
// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::TransferFeeConfig);
// @wizard:end
```

**Init extensions** (initialize extension before mint init):
```rust
// @wizard:inject.create_mint.init_extensions
    invoke(
        &transfer_fee_ix::initialize_transfer_fee_config(
            token_program.key, mint.key,
            Some(&fee_authority.key()), Some(&fee_authority.key()),
            fee_basis_points, max_fee,
        )?,
        &[mint.to_account_info()],
    )?;
// @wizard:end
```

**Body code** (injected before `Ok(())`):
```rust
// @wizard:inject.create_mint.body
    metadata::validate_metadata(&name, &symbol, &uri)?;
// @wizard:end
```

**Accounts** (added to Accounts struct):
```rust
// @wizard:inject.create_mint.accounts
    /// The fee authority that can update and collect fees
    pub fee_authority: Signer<'info>,
// @wizard:end
```

## Injection Points

The assembly functions inject code at specific locations in base files:

| Injection | Target File | Insertion Point |
|-----------|-------------|-----------------|
| `modules` | lib.rs | After `pub mod error;` |
| `instructions` | lib.rs | After the `create_mint` function body |
| `imports` | instruction files | After `use anchor_spl::token_2022::Token2022;` |
| `args` | instruction files | Added to function params and `#[instruction]` macro |
| `extension_types` | instruction files | After `extension_types` vector declaration |
| `init_extensions` | instruction files | After MetadataPointer init, before mint init |
| `body` | instruction files | Before final `Ok(())` |
| `accounts` | instruction files | Before closing `}` of Accounts struct |

## Directory Structure

```
programs/<program-name>/
├── template.toml           # Metadata and config only
├── Cargo.toml              # Standard Anchor Cargo.toml
├── base/                   # Core files (always included)
│   ├── lib.rs
│   ├── error.rs
│   ├── instructions/
│   │   ├── mod.rs
│   │   └── <instruction>.rs
│   └── state/
│       └── mod.rs
└── extensions/             # Optional features with @wizard markers
    └── <extension-id>/
        ├── mod.rs          # Contains @wizard marker comments
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

See `programs/token-mint/` for a complete working example:
- `template.toml` - Program metadata and extension config
- `extensions/transfer-fee/mod.rs` - Example with all marker types
