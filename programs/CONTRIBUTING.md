# Contributing Rust Programs

This guide is for Rust/Anchor developers who want to contribute program templates to 2022 Wizard.

## Overview

The wizard generates Solana programs by assembling real, auditable Rust code from this `programs/` directory. Each program type (token-mint, vault, etc.) is a self-contained Anchor project.

## Structure

```
programs/
└── token-mint/              # Program type
    ├── template.toml        # Configuration for the wizard
    ├── Cargo.toml           # Real Cargo manifest (for testing)
    ├── Anchor.toml          # Anchor config (for testing)
    │
    ├── base/                # Always included
    │   ├── lib.rs
    │   ├── instructions/
    │   │   ├── mod.rs
    │   │   └── create_mint.rs
    │   ├── state/
    │   │   └── mod.rs
    │   └── error.rs
    │
    └── extensions/          # Optional features
        ├── metadata/
        │   └── mod.rs
        ├── transfer-fee/
        │   ├── mod.rs
        │   └── update_fee.rs
        ├── close-mint/
        │   └── mod.rs
        └── non-transferable/
            └── mod.rs
```

## How to Add Code

### Adding to an Existing Extension

1. Find the extension folder (e.g., `extensions/transfer-fee/`)
2. Edit the existing `.rs` files
3. Run `cargo check` to verify it compiles
4. Submit a PR

### Adding a New Extension

1. Create a new folder under `extensions/`:
   ```bash
   mkdir -p programs/token-mint/extensions/my-extension
   ```

2. Add your Rust files:
   ```bash
   touch programs/token-mint/extensions/my-extension/mod.rs
   ```

3. Update `template.toml` to register the extension:
   ```toml
   [extensions.my-extension]
   id = "my-extension"
   name = "My Extension"
   description = "What this extension does"
   default = false
   files = [
       "extensions/my-extension/mod.rs",
   ]
   ```

4. If your extension has configuration options:
   ```toml
   [extensions.my-extension.config]
   some_value = { type = "number", name = "Some Value", default = 100 }
   ```

5. If your extension conflicts with others:
   ```toml
   conflicts_with = ["other-extension"]
   ```

### Adding a New Program Type

1. Create a new folder under `programs/`:
   ```bash
   mkdir -p programs/my-program/base
   mkdir -p programs/my-program/extensions
   ```

2. Copy the structure from an existing program

3. Create `template.toml` with your program's configuration

4. Add `Cargo.toml` and `Anchor.toml` for testing

## Testing Your Code

```bash
cd programs/token-mint

# Check compilation
cargo check

# Run tests (requires Solana toolchain)
anchor test
```

## template.toml Reference

### Program Section
```toml
[program]
id = "token-mint"           # Unique identifier
name = "Token Mint"         # Display name in wizard
description = "..."         # Description for UI
version = "0.1.0"           # Semantic version
```

### Base Section
```toml
[base]
files = [
    "base/lib.rs",          # Main entry point
    "base/instructions/mod.rs",
    # ... more files
]
```

### Extension Section
```toml
[extensions.my-extension]
id = "my-extension"         # Unique identifier
name = "My Extension"       # Display name
description = "..."         # Tooltip/description
default = false             # Enabled by default?
locked = false              # If true, cannot be disabled
conflicts_with = []         # List of incompatible extension IDs
files = [                   # Files to include when enabled
    "extensions/my-extension/mod.rs",
]

# Optional: configuration fields shown in UI
[extensions.my-extension.config]
field_name = { 
    type = "number",        # number, string, boolean
    name = "Display Name",
    description = "Help text",
    default = 100,
    min = 0,                # For numbers
    max = 10000,            # For numbers
}
```

## Code Style

- Use 4 spaces for indentation
- Add doc comments (`///`) to public functions and structs
- Include `msg!()` logs for important operations
- Define errors in dedicated error enums

## Security Guidelines

- All code will be audited before release
- Follow Anchor best practices
- Validate all inputs
- Use checked math operations
- Document security considerations in comments

## Questions?

Open an issue on GitHub or reach out to the team.
