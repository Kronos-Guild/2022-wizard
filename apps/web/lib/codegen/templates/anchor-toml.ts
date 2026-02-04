import type { TemplateContext } from "./types";

/**
 * Generates the Anchor.toml configuration file.
 */
export function anchorToml(ctx: TemplateContext): string {
  const { cluster, programName } = ctx;

  const clusterUrl: Record<string, string> = {
    devnet: "https://api.devnet.solana.com",
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    localnet: "http://127.0.0.1:8899",
  };

  const networkName = cluster === "mainnet-beta" ? "mainnet" : cluster;

  return `[features]
seeds = false
skip-lint = false

[programs.${networkName}]
${programName} = "11111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "${clusterUrl[cluster]}"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`;
}
