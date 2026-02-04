# Rust Code Templates

This directory contains the Rust code templates for the 2022 Wizard generator.

## Contributing

Want to add or edit the generated Rust code? You're in the right place!

### How It Works

Each `.ts` file in this directory exports template functions that generate Rust code. The templates use simple string interpolation with TypeScript - no complex templating engine needed.

### Template Structure

```
templates/
├── README.md           # You are here
├── index.ts            # Exports all templates
├── lib.ts              # lib.rs template
├── instructions/
│   ├── mod.ts          # instructions/mod.rs template  
│   ├── create-mint.ts  # create_mint.rs template
│   ├── update-transfer-fee.ts
│   └── close-mint.ts
├── state.ts            # state/mod.rs template
├── error.ts            # error.rs template
└── anchor-toml.ts      # Anchor.toml template
```

### Template Context

Each template receives a `TemplateContext` object with:

```typescript
interface TemplateContext {
  // Token basics
  name: string;           // Token name (e.g., "MyToken")
  symbol: string;         // Token symbol (e.g., "MTK")
  decimals: number;       // Token decimals (0-9)
  programName: string;    // Snake_case program name
  
  // Authority
  authority: "keypair" | "pda";
  
  // Cluster
  cluster: "devnet" | "mainnet-beta" | "localnet";
  
  // Extensions (boolean flags)
  extensions: {
    metadata: boolean;
    closeMint: boolean;
    nonTransferable: boolean;
    transferFee: boolean;
  };
  
  // Transfer fee config (when transferFee is enabled)
  transferFeeConfig: {
    feeBps: number;       // Fee in basis points (e.g., 100 = 1%)
    maxFee: number;       // Maximum fee in tokens
  };
}
```

### Adding a New Extension

1. Add the extension flag to `lib/wizard/types.ts`
2. Add UI toggle in `components/wizard/settings-panel.tsx`
3. Create/edit templates in this directory:
   - Add imports to `lib.ts` if needed
   - Add instruction to `instructions/` 
   - Update `instructions/mod.ts` to export it
   - Add any new error variants to `error.ts`

### Example: Adding Code to create_mint.rs

Edit `templates/instructions/create-mint.ts`:

```typescript
export function createMint(ctx: TemplateContext): string {
  // Conditionally add code based on extensions
  const myNewFeature = ctx.extensions.myFeature
    ? `
    // My new feature code
    do_something();`
    : "";

  return `
use anchor_lang::prelude::*;
// ... rest of template
${myNewFeature}
// ... rest of template
`;
}
```

### Testing Your Changes

1. Run the dev server: `pnpm dev`
2. Open http://localhost:3000/wizard
3. Toggle extensions and check the code preview updates correctly
4. Make sure the code is valid Rust (syntax highlighting will help catch errors)

### Code Style

- Use 4 spaces for Rust indentation
- Keep templates readable - use helper functions for complex logic
- Add comments in generated code to help users understand it
- Use TypeScript template literals for multi-line strings
