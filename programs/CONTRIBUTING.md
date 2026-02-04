# Contributing to Token Mint Extensions

This guide explains how to add new extensions to the Token Mint program.

## Quick Start

1. Create your extension in `programs/token-mint/extensions/<your-extension>/`
2. Add `@wizard` marker comments to declare injections
3. Register the extension in `programs/token-mint/template.toml`
4. Run `pnpm extract-templates` from the `scripts/` directory
5. Test in the wizard UI

## Step-by-Step Guide

### 1. Create the Extension Module

Create a new directory for your extension:

```
programs/token-mint/extensions/my-extension/
├── mod.rs           # Main module (required)
└── other_file.rs    # Additional files (optional)
```

### 2. Add Wizard Marker Comments

In your `mod.rs`, add marker comments to declare what code should be injected:

```rust
use anchor_lang::prelude::*;

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod my_extension;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::my_extension;
// @wizard:end

// For function arguments (single line format):
// @wizard:inject.create_mint.args my_param: u64

// @wizard:inject.create_mint.body
    // Initialize my extension
    my_extension::init(my_param)?;
    msg!("My extension initialized");
// @wizard:end

// If you need additional accounts:
// @wizard:inject.create_mint.accounts
//     /// My account description
//     pub my_account: Signer<'info>,
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

pub fn init(param: u64) -> Result<()> {
    msg!("My extension initialized with param: {}", param);
    Ok(())
}
```

### 3. Register in template.toml

Add your extension to `programs/token-mint/template.toml`:

```toml
[extensions.my-extension]
name = "My Extension"
description = "What this extension does"
default = false
conflicts_with = []  # List extensions that can't be used together
files = ["extensions/my-extension/mod.rs"]

# Optional: Add configurable parameters
[extensions.my-extension.config]
my_param = { type = "number", name = "My Parameter", default = 100 }
```

### 4. Extract Templates

Run the extraction script to generate TypeScript code:

```bash
cd scripts
pnpm extract-templates
```

This parses your marker comments and generates `apps/web/lib/codegen/generated/token-mint.ts`.

### 5. Test Your Extension

Start the dev server and test:

```bash
pnpm dev
```

Visit `http://localhost:3000/wizard/token` and toggle your extension.

## Marker Comment Reference

### Block Markers (multi-line)

```rust
// @wizard:inject.<target>.<type>
... code ...
// @wizard:end
```

### Inline Markers (args only)

```rust
// @wizard:inject.<target>.args arg1: Type1, arg2: Type2
```

### Targets

| Target | Description |
|--------|-------------|
| `lib` | Inject into lib.rs |
| `create_mint` | Inject into create_mint instruction |

### Types

| Type | Target | What it does |
|------|--------|--------------|
| `modules` | lib | Adds `pub mod` declaration |
| `instructions` | lib | Adds new instruction function |
| `imports` | instruction | Adds `use` statement |
| `args` | instruction | Adds function parameters |
| `body` | instruction | Adds code before `Ok(())` |
| `accounts` | instruction | Adds account to struct |

## Adding a New Instruction

If your extension needs a new instruction (like `update_transfer_fee`), use the `lib.instructions` marker:

```rust
// In extensions/my-extension/handler.rs

// @wizard:inject.lib.instructions

    /// My new instruction
    pub fn my_instruction(ctx: Context<MyInstruction>, param: u64) -> Result<()> {
        my_extension::handler::handle(ctx, param)
    }
// @wizard:end
```

## Best Practices

### 1. Keep Markers at the Top
Put all marker comments at the top of your file, before the actual implementation:

```rust
// =============================================================================
// Wizard Injection Markers
// =============================================================================
// ... markers here ...

// =============================================================================
// Extension Implementation  
// =============================================================================
// ... actual code here ...
```

### 2. Document Conflicts
If your extension conflicts with another, declare it in both:

```toml
# In template.toml
[extensions.my-extension]
conflicts_with = ["other-extension"]

[extensions.other-extension]
conflicts_with = ["my-extension"]
```

### 3. Provide Good Defaults
For config fields, always set sensible defaults:

```toml
[extensions.my-extension.config]
amount = { type = "number", name = "Amount", default = 1000, min = 1 }
```

### 4. Preserve Indentation
Body and accounts injections should match the indentation of the target file (4 spaces):

```rust
// @wizard:inject.create_mint.body
    // Note: 4-space indent to match Rust code
    my_extension::init()?;
// @wizard:end
```

## Troubleshooting

### "File not found" error
Ensure all files listed in `files = [...]` exist.

### Markers not being parsed
- Check syntax: `// @wizard:inject.<target>.<type>`
- Ensure `// @wizard:end` closes block markers
- Args must be on a single line

### TypeScript errors after extraction
Run `pnpm build` to see detailed errors. Common issues:
- Unescaped backticks in Rust code
- Template literal syntax `${}` in Rust strings

## CI/CD

Pull requests automatically:
1. Validate `template.toml`
2. Run `extract-templates`
3. Check for uncommitted generated files
4. Build the project

If CI fails, check the action logs for details.

## Example Extensions

See these existing extensions for reference:
- `extensions/metadata/mod.rs` - Simple extension with body injection
- `extensions/transfer-fee/mod.rs` - Full example with args, accounts, body
- `extensions/transfer-fee/update_fee.rs` - Adding new instructions
- `extensions/close-mint/mod.rs` - Extension with new instruction
