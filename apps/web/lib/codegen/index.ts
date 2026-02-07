import type { WizardState, ExtensionState } from "@/lib/wizard/types";
import {
  extensions,
  programInfo,
  assembleLib,
  assembleInstruction,
  type ExtensionId,
} from "./generated/token-mint";

/**
 * A generated code file with metadata for display in the UI.
 */
export interface GeneratedFile {
  /** Unique identifier for the file */
  id: string;
  /** Display label for file tabs */
  label: string;
  /** Full path in the generated project */
  path: string;
  /** The file content (Rust code) */
  content: string;
}

/**
 * Maps WizardState extension keys to generated template extension IDs.
 */
const extensionMapping: Record<keyof ExtensionState, ExtensionId> = {
  metadata: "metadata",
  closeMint: "close-mint",
  nonTransferable: "non-transferable",
  transferFee: "transfer-fee",
};

/**
 * Converts a string to snake_case for Rust identifiers.
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Converts a snake_case string to PascalCase for TypeScript types.
 */
function toPascalCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Generates an Anchor.toml configuration file.
 */
function generateAnchorToml(state: WizardState): string {
  const programName = toSnakeCase(state.name);
  return `[features]
seeds = false
skip-lint = false

[programs.${state.cluster}]
${programName} = "11111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "${state.cluster}"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`;
}

/**
 * Generates a Cargo.toml for the program.
 */
function generateCargoToml(state: WizardState): string {
  const programName = toSnakeCase(state.name);
  return `[package]
name = "${programName}"
version = "${programInfo.version}"
description = "${programInfo.description}"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${programName}"

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
spl-token-2022 = "8"
# Pin to versions compatible with anchor-spl 0.32.1 (solana-instruction 2.x)
spl-token-metadata-interface = "0.7"
spl-type-length-value = "0.8"
# Pin blake3 to avoid edition2024 (unsupported by Solana SBF toolchain Cargo 1.84)
blake3 = "=1.8.2"
`;
}

/**
 * Gets the list of enabled extensions from the wizard state.
 * Filters out extensions that conflict with each other.
 */
function getEnabledExtensions(state: WizardState): ExtensionId[] {
  const enabled: ExtensionId[] = [];

  for (const [stateKey, isEnabled] of Object.entries(state.extensions)) {
    if (isEnabled) {
      const extId = extensionMapping[stateKey as keyof ExtensionState];
      if (extId && extensions[extId]) {
        // Check for conflicts with already-enabled extensions
        const ext = extensions[extId];
        const hasConflict = enabled.some((enabledId) =>
          ext.conflictsWith.includes(enabledId)
        );
        if (!hasConflict) {
          enabled.push(extId);
        }
      }
    }
  }

  return enabled;
}

/**
 * Generates all code files based on the wizard state.
 * This is the main entry point called by the UI.
 *
 * Files are assembled by:
 * 1. Taking base files
 * 2. Injecting extension code at appropriate locations based on enabled extensions
 */
export function generateCode(state: WizardState): GeneratedFile[] {
  const programName = toSnakeCase(state.name);
  const basePath = `programs/${programName}/src`;
  const enabledExtensions = getEnabledExtensions(state);

  // Only show the most important files to keep the UI clean
  return [
    // Main program entry point
    {
      id: "lib.rs",
      label: "lib.rs",
      path: `${basePath}/lib.rs`,
      content: assembleLib(enabledExtensions, programName),
    },
    // Core instruction with extension injections
    {
      id: "create_mint.rs",
      label: "create_mint.rs",
      path: `${basePath}/instructions/create_mint.rs`,
      content: assembleInstruction("create_mint", enabledExtensions),
    },
    // Test file showing how to use with configured values
    {
      id: "test.ts",
      label: "test.ts",
      path: `tests/${programName}.ts`,
      content: generateTestFile(state, programName, enabledExtensions),
    },
    // Project config
    {
      id: "Anchor.toml",
      label: "Anchor.toml",
      path: `Anchor.toml`,
      content: generateAnchorToml(state),
    },
    {
      id: "Cargo.toml",
      label: "Cargo.toml",
      path: `programs/${programName}/Cargo.toml`,
      content: generateCargoToml(state),
    },
  ];
}

/**
 * Generates a test file showing how to call the program with configured values.
 */
function generateTestFile(
  state: WizardState,
  programName: string,
  enabledExtensions: ExtensionId[]
): string {
  const hasTransferFee = enabledExtensions.includes("transfer-fee");
  const hasCloseMint = enabledExtensions.includes("close-mint");

  // Build the instruction arguments
  const args = [
    `"${state.name}"`,
    `"${state.symbol}"`,
    `"https://example.com/metadata.json"`,
    `${state.decimals}`,
  ];

  if (hasTransferFee) {
    args.push(`${state.transferFeeConfig.feeBps}`);
    args.push(`new BN(${state.transferFeeConfig.maxFee})`);
  }

  // Build the accounts object
  let accounts = `{
        payer: wallet.publicKey,
        mint: mintKeypair.publicKey,
        mintAuthority: wallet.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,`;

  if (hasTransferFee) {
    accounts += `
        feeAuthority: wallet.publicKey,`;
  }

  if (hasCloseMint) {
    accounts += `
        closeAuthority: wallet.publicKey,`;
  }

  accounts += `
      }`;

  return `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ${toPascalCase(programName)} } from "../target/types/${programName}";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
${hasTransferFee ? 'import { BN } from "bn.js";' : ""}

describe("${programName}", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.${toPascalCase(programName)} as Program<${toPascalCase(programName)}>;
  const wallet = provider.wallet as anchor.Wallet;

  it("creates a mint with configured values", async () => {
    const mintKeypair = Keypair.generate();

    const tx = await program.methods
      .createMint(
        ${args.join(",\n        ")}
      )
      .accounts(${accounts})
      .signers([mintKeypair])
      .rpc();

    console.log("Transaction signature:", tx);
    console.log("Mint address:", mintKeypair.publicKey.toBase58());
  });
});
`;
}

// Re-export extension metadata for the UI
export { extensions, programInfo } from "./generated/token-mint";
export type { ExtensionId } from "./generated/token-mint";
