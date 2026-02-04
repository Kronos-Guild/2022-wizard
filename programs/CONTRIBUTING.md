# Contributing to Token Mint Extensions

This guide explains how to add new extensions to the Token Mint program.

## Quick Start

1. Create your extension in `programs/token-mint/extensions/<your-extension>/`
2. Add injection rules to `programs/token-mint/template.toml`
3. Run `pnpm extract-templates` from the `scripts/` directory
4. Test in the wizard UI

## Step-by-Step Guide

### 1. Create the Extension Module

Create a new directory for your extension:

```
programs/token-mint/extensions/my-extension/
├── mod.rs           # Main module (required)
└── other_file.rs    # Additional files (optional)
```

Example `mod.rs`:

```rust
use anchor_lang::prelude::*;

/// Initialize the extension during mint creation
pub fn init_my_extension(param: u64) -> Result<()> {
    msg!("My extension initialized with param: {}", param);
    // Your initialization logic here
    Ok(())
}
```

### 2. Define the Extension in template.toml

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

# Inject into lib.rs
[extensions.my-extension.inject.lib]
modules = "pub mod my_extension;"

# Inject into create_mint instruction
[extensions.my-extension.inject.create_mint]
imports = "use crate::my_extension;"
args = ["my_param: u64"]
body = """
    // Initialize my extension
    my_extension::init_my_extension(my_param)?;"""
```

### 3. Extract Templates

Run the extraction script to generate TypeScript code:

```bash
cd scripts
pnpm extract-templates
```

This generates `apps/web/lib/codegen/generated/token-mint.ts` with your extension.

### 4. Test Your Extension

Start the dev server and test:

```bash
pnpm dev
```

Visit `http://localhost:3000/wizard/token` and toggle your extension.

## Injection Types Reference

### `modules` (lib.rs)
Adds module declarations:
```toml
modules = "pub mod my_extension;"
```
→ Inserted after `pub mod error;` in lib.rs

### `instructions` (lib.rs)
Adds new program instructions:
```toml
instructions = """
    pub fn my_instruction(ctx: Context<MyInstruction>) -> Result<()> {
        my_extension::handler(ctx)
    }"""
```
→ Inserted inside the `#[program]` module

### `imports` (instruction files)
Adds use statements:
```toml
imports = "use crate::my_extension;"
```
→ Inserted after existing imports

### `args` (instruction files)
Adds function parameters:
```toml
args = ["my_param: u64", "another_param: bool"]
```
→ Added to function signature AND `#[instruction]` macro

### `body` (instruction files)
Adds execution code:
```toml
body = """
    // Your code here
    my_extension::do_something()?;"""
```
→ Inserted before `Ok(())`

### `accounts` (instruction files)
Adds account fields:
```toml
accounts = """
    /// My account description
    pub my_account: Signer<'info>,"""
```
→ Added to the Accounts struct

## Best Practices

### 1. Keep Extensions Focused
Each extension should do one thing well. If you need multiple features, consider separate extensions.

### 2. Document Conflicts
If your extension conflicts with another (e.g., non-transferable + transfer-fee), declare it:
```toml
conflicts_with = ["non-transferable"]
```

### 3. Provide Good Defaults
For config fields, always set sensible defaults:
```toml
[extensions.my-extension.config]
amount = { type = "number", name = "Amount", default = 1000, min = 1 }
```

### 4. Write Clear Body Injections
Add comments to injected code:
```toml
body = """
    // My Extension: Initialize the foo configuration
    my_extension::init_foo(param)?;
    msg!("Foo initialized");"""
```

### 5. Test Combinations
Test your extension with other extensions enabled/disabled to catch injection conflicts.

## Troubleshooting

### "File not found" error
Ensure all files listed in `files = [...]` exist.

### Injection in wrong location
Check that base files have the expected patterns (see TEMPLATE_SCHEMA.md).

### TypeScript errors after extraction
Run `pnpm build` to see detailed errors. Common issues:
- Unescaped backticks in Rust code
- Template literal syntax `${}` in Rust strings

## CI/CD

Pull requests automatically run `extract-templates` and validate:
- All referenced files exist
- template.toml is valid TOML
- Generated TypeScript compiles

If CI fails, check the action logs for details.
