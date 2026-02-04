export type MintAuthority = "keypair" | "pda";

export type Cluster = "devnet" | "mainnet-beta" | "localnet";

export interface ExtensionState {
  metadata: boolean;
  closeMint: boolean;
  nonTransferable: boolean;
  transferFee: boolean;
}

export interface TransferFeeConfig {
  feeBps: number;
  maxFee: number;
}

export interface WizardState {
  name: string;
  symbol: string;
  decimals: number;
  authority: MintAuthority;
  cluster: Cluster;
  extensions: ExtensionState;
  transferFeeConfig: TransferFeeConfig;
}
