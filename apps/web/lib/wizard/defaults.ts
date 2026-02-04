import type { WizardState } from "@/lib/wizard/types";

export const DEFAULTS: WizardState = {
  name: "MyToken",
  symbol: "MTK",
  decimals: 9,
  authority: "keypair",
  cluster: "devnet",
  extensions: {
    metadata: true,
    closeMint: false,
    nonTransferable: false,
    transferFee: false,
  },
  transferFeeConfig: {
    feeBps: 250,
    maxFee: 1000000,
  },
};
