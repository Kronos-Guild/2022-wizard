use anchor_lang::prelude::*;

/// Custom errors for the Token Mint program
#[error_code]
pub enum TokenMintError {
    /// The caller is not authorized to perform this action
    #[msg("Unauthorized access")]
    Unauthorized,

    /// The provided token name is invalid (empty or too long)
    #[msg("Invalid token name")]
    InvalidName,

    /// The provided token symbol is invalid (empty or too long)
    #[msg("Invalid token symbol")]
    InvalidSymbol,

    /// The provided decimals value is out of range (must be 0-9)
    #[msg("Invalid decimals value")]
    InvalidDecimals,
}
