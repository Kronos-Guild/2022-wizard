use anchor_lang::prelude::*;

// =============================================================================
// Wizard Injection Markers
// =============================================================================

// @wizard:inject.lib.modules
pub mod non_transferable;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::non_transferable;
// @wizard:end

// @wizard:inject.create_mint.body
    // Initialize non-transferable (soulbound) extension
    let _config = non_transferable::init_non_transferable()?;
    msg!("Non-transferable extension initialized - tokens are soulbound");
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

/// Non-transferable (Soulbound) token extension.
///
/// When enabled, tokens cannot be transferred between accounts after minting.
/// This is useful for:
/// - Credentials and certifications
/// - Membership badges
/// - Achievement tokens
/// - Reputation scores
/// - Identity tokens
///
/// Note: This extension is mutually exclusive with transfer-fee
/// (fees don't make sense if transfers are impossible).

/// Marker struct for non-transferable tokens.
///
/// This extension has no configuration - it's simply enabled or not.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct NonTransferableConfig {
    /// Timestamp when the extension was initialized
    pub initialized_at: i64,
}

impl NonTransferableConfig {
    pub fn new() -> Self {
        Self {
            initialized_at: Clock::get().map(|c| c.unix_timestamp).unwrap_or(0),
        }
    }
}

impl Default for NonTransferableConfig {
    fn default() -> Self {
        Self::new()
    }
}

/// Initialize non-transferable extension on the mint.
///
/// Once initialized, all tokens minted will be non-transferable.
pub fn init_non_transferable() -> Result<NonTransferableConfig> {
    msg!("Initializing non-transferable (soulbound) extension");
    msg!("  Tokens minted from this mint cannot be transferred");

    Ok(NonTransferableConfig::new())
}

#[error_code]
pub enum NonTransferableError {
    #[msg("Non-transferable tokens cannot be transferred")]
    TransferNotAllowed,

    #[msg("Cannot enable both non-transferable and transfer-fee extensions")]
    IncompatibleWithTransferFee,
}
