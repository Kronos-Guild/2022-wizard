use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::extension::{transfer_fee::instruction as transfer_fee_instruction, ExtensionType};

pub mod update_fee;

// @wizard:inject.lib.modules
pub mod transfer_fee;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::transfer_fee;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_ix;
// @wizard:end

// @wizard:inject.create_mint.args fee_basis_points: u16, max_fee: u64

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::TransferFeeConfig);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    transfer_fee::validate_fee_config(fee_basis_points, max_fee)?;
    invoke(
        &transfer_fee_ix::initialize_transfer_fee_config(
            token_program.key,
            mint.key,
            Some(&ctx.accounts.fee_authority.key()),  // transfer_fee_config_authority
            Some(&ctx.accounts.fee_authority.key()),  // withdraw_withheld_authority
            fee_basis_points,
            max_fee,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("TransferFeeConfig initialized: {} bps, max {}", fee_basis_points, max_fee);
// @wizard:end

// @wizard:inject.create_mint.accounts
    /// The fee authority that can update fees and withdraw withheld amounts
    pub fee_authority: Signer<'info>,
// @wizard:end

/// Maximum allowed transfer fee in basis points (100% = 10000 bps)
pub const MAX_FEE_BASIS_POINTS: u16 = 10000;

/// Validates transfer fee configuration
pub fn validate_fee_config(fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );
    msg!("Transfer fee config validated: {} bps, max {} tokens", fee_basis_points, max_fee);
    Ok(())
}

/// Configuration for the transfer fee extension (for reference/calculation)
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TransferFeeConfig {
    pub fee_basis_points: u16,
    pub max_fee: u64,
}

impl TransferFeeConfig {
    pub fn new(fee_basis_points: u16, max_fee: u64) -> Result<Self> {
        require!(fee_basis_points <= MAX_FEE_BASIS_POINTS, TransferFeeError::FeeTooHigh);
        Ok(Self { fee_basis_points, max_fee })
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

#[error_code]
pub enum TransferFeeError {
    #[msg("Transfer fee exceeds maximum allowed (10000 basis points)")]
    FeeTooHigh,

    #[msg("Invalid fee configuration")]
    InvalidFeeConfig,
}
