import type { TemplateContext } from "./types";

/**
 * Generates the error.rs file with custom program errors.
 */
export function errorRs(_ctx: TemplateContext): string {
  return `use anchor_lang::prelude::*;

#[error_code]
pub enum TokenWizardError {
    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Invalid token name")]
    InvalidName,

    #[msg("Invalid token symbol")]
    InvalidSymbol,

    #[msg("Invalid decimals value")]
    InvalidDecimals,

    #[msg("Transfer fee exceeds maximum allowed")]
    TransferFeeExceedsMax,
}
`;
}
