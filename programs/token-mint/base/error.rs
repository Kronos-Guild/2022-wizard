use anchor_lang::prelude::*;

/// Custom errors for the Token Mint program
#[error_code]
pub enum TokenMintError {
    /// The caller is not authorized to perform this action
    #[msg("Unauthorized access")]
    Unauthorized,
}
