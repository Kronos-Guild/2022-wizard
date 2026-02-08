use anchor_lang::prelude::InterfaceAccount;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::Mint;
use spl_token_2022::extension::transfer_fee::instruction as transfer_fee_instruction;

use super::{TransferFeeError, MAX_FEE_BASIS_POINTS};

// @wizard:inject.lib.instructions

/// Updates the transfer fee configuration.
/// Only the fee authority can call this.
pub fn update_transfer_fee(
    ctx: Context<UpdateTransferFee>,
    fee_basis_points: u16,
    max_fee: u64,
) -> Result<()> {
    transfer_fee::update_fee::handler(ctx, fee_basis_points, max_fee)
}
// @wizard:end

/// Updates the transfer fee configuration for a mint.
///
/// Only the fee authority can update the fee.
/// Changes take effect on all subsequent transfers.
pub fn handler(ctx: Context<UpdateTransferFee>, fee_basis_points: u16, max_fee: u64) -> Result<()> {
    require!(
        fee_basis_points <= MAX_FEE_BASIS_POINTS,
        TransferFeeError::FeeTooHigh
    );

    msg!(
        "Updating transfer fee to {} bps, max {}",
        fee_basis_points,
        max_fee
    );

    // Update fee configuration via CPI to Token-2022 program
    invoke(
        &transfer_fee_instruction::set_transfer_fee(
            ctx.accounts.token_program.key,
            &ctx.accounts.mint.key(),
            ctx.accounts.fee_authority.key,
            &[], // No multisig signers
            fee_basis_points,
            max_fee,
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.fee_authority.to_account_info(),
        ],
    )?;

    msg!("Transfer fee updated successfully");
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateTransferFee<'info> {
    /// The mint account with transfer fee extension
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// The fee authority that can update the fee
    pub fee_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}
