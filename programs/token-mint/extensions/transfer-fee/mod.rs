use anchor_lang::prelude::*;

// =============================================================================
// Wizard Injection Markers
// =============================================================================
// These comments tell the wizard what code to inject into base files.

// @wizard:inject.lib.modules
pub mod transfer_fee;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::transfer_fee;
// @wizard:end

// @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64

// @wizard:inject.create_mint.body
    // Initialize transfer fee extension
    let _fee_config = transfer_fee::init_transfer_fee(fee_basis_points, max_fee)?;
    msg!("Transfer fee extension initialized: {} bps, max {}", fee_basis_points, max_fee);
// @wizard:end

// @wizard:inject.create_mint.accounts
    /// The fee authority that can update and collect fees
    pub fee_authority: Signer<'info>,
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

/// Maximum allowed transfer fee in basis points (100% = 10000 bps)
pub const MAX_FEE_BASIS_POINTS: u16 = 10000;

/// Configuration for the transfer fee extension.
///
/// Transfer fees are charged on every token transfer and collected
/// in a withheld account that can be harvested by the fee authority.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TransferFeeConfig {
    /// Fee in basis points (1 bp = 0.01%)
    /// Example: 100 = 1% fee
    pub fee_basis_points: u16,

    /// Maximum fee in token units (with decimals)
    /// This caps the fee for large transfers
    pub max_fee: u64,
}

impl TransferFeeConfig {
    /// Creates a new transfer fee configuration
    pub fn new(fee_basis_points: u16, max_fee: u64) -> Result<Self> {
        require!(
            fee_basis_points <= MAX_FEE_BASIS_POINTS,
            TransferFeeError::FeeTooHigh
        );

        Ok(Self {
            fee_basis_points,
            max_fee,
        })
    }

    /// Calculates the fee for a given transfer amount
    pub fn calculate_fee(&self, amount: u64) -> u64 {
        let fee = (amount as u128)
            .checked_mul(self.fee_basis_points as u128)
            .unwrap_or(0)
            .checked_div(10000)
            .unwrap_or(0) as u64;

        std::cmp::min(fee, self.max_fee)
    }
}

/// Initialize transfer fee extension on the mint
pub fn init_transfer_fee(fee_basis_points: u16, max_fee: u64) -> Result<TransferFeeConfig> {
    msg!("Initializing transfer fee extension");
    msg!(
        "  Fee: {} basis points ({}%)",
        fee_basis_points,
        fee_basis_points as f64 / 100.0
    );
    msg!("  Max fee: {} tokens", max_fee);

    TransferFeeConfig::new(fee_basis_points, max_fee)
}

#[error_code]
pub enum TransferFeeError {
    #[msg("Transfer fee exceeds maximum allowed (10000 basis points)")]
    FeeTooHigh,

    #[msg("Invalid fee configuration")]
    InvalidFeeConfig,
}
