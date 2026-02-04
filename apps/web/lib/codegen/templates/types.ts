/**
 * Context passed to all template functions.
 * This is derived from WizardState but simplified for template use.
 */
export interface TemplateContext {
  // Token basics
  name: string;
  symbol: string;
  decimals: number;
  /** Snake_case version of name for Rust identifiers */
  programName: string;

  // Authority type
  authority: "keypair" | "pda";

  // Target cluster
  cluster: "devnet" | "mainnet-beta" | "localnet";

  // Extension flags
  extensions: {
    metadata: boolean;
    closeMint: boolean;
    nonTransferable: boolean;
    transferFee: boolean;
  };

  // Transfer fee configuration (when transferFee extension is enabled)
  transferFeeConfig: {
    /** Fee in basis points (100 = 1%) */
    feeBps: number;
    /** Maximum fee in token units */
    maxFee: number;
  };
}

/**
 * A generated file with its content and metadata.
 */
export interface GeneratedFile {
  /** Unique identifier for the file (used as React key) */
  id: string;
  /** Display label in the UI */
  label: string;
  /** Full path in the generated project */
  path: string;
  /** File content */
  content: string;
}
