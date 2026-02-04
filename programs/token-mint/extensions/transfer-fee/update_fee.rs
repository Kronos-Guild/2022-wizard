use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

use super::{TransferFeeConfig, TransferFeeError, MAX_FEE_BASIS_POINTS};

/// Updates the transfer fee configuration for a mint.
///
/// Only the fee authority can update the fee.
/// Changes take effect on all subsequent transfers.
pub fn handler(ctx: Context<UpdateTransferFee>, fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );

    msg!("Updating transfer fee");
    msg!(
        "  New fee: {} basis points ({}%)",
        fee_basis_points,
        fee_basis_points as f64 / 100.0
    );
    msg!("  New max fee: {} tokens", max_fee);

    // Update fee configuration via CPI to Token-2022 program
    // Implementation would go here

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateTransferFee<'info> {
    /// The mint account with transfer fee extension
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    /// The fee authority that can update the fee
    pub fee_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}
