use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::{Mint, InterfaceAccount};
use spl_token_2022::{
    extension::ExtensionType,
    instruction as token_instruction,
};

// @wizard:inject.lib.modules
pub mod close_mint;
pub use close_mint::*;
// @wizard:end

// @wizard:inject.lib.instructions

    /// Closes the mint account and returns rent to the destination.
    /// Requires total supply to be 0.
    pub fn close_mint(ctx: Context<CloseMint>) -> Result<()> {
        close_mint::handler(ctx)
    }
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::close_mint;
// @wizard:end

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::MintCloseAuthority);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    invoke(
        &token_instruction::initialize_mint_close_authority(
            token_program.key,
            mint.key,
            Some(&ctx.accounts.close_authority.key()),
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("MintCloseAuthority initialized: {}", ctx.accounts.close_authority.key());
// @wizard:end

// @wizard:inject.create_mint.accounts
    /// The close authority that can close the mint
    pub close_authority: Signer<'info>,
// @wizard:end

/// Close mint extension allows closing the mint account to reclaim rent.
///
/// WARNING: Once closed, the mint cannot be recreated with the same address.

/// Closes the mint account and returns rent to the destination.
///
/// Requirements:
/// - Total supply must be 0 (all tokens burned)
/// - Caller must be the close authority
pub fn handler(ctx: Context<CloseMint>) -> Result<()> {
    msg!("Closing mint account: {}", ctx.accounts.mint.key());
    msg!("Rent returned to: {}", ctx.accounts.destination.key());

    // Close mint via CPI to Token-2022 program
    invoke(
        &token_instruction::close_account(
            ctx.accounts.token_program.key,
            ctx.accounts.mint.key,
            ctx.accounts.destination.key,
            ctx.accounts.close_authority.key,
            &[],  // No multisig signers
        )?,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.destination.to_account_info(),
            ctx.accounts.close_authority.to_account_info(),
        ],
    )?;

    msg!("Mint closed successfully");
    Ok(())
}

#[derive(Accounts)]
pub struct CloseMint<'info> {
    /// The mint account to close
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    /// The close authority for this mint
    pub close_authority: Signer<'info>,

    /// The account to receive the rent
    /// CHECK: Any account can receive the rent
    #[account(mut)]
    pub destination: AccountInfo<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,
}

#[error_code]
pub enum CloseMintError {
    #[msg("Cannot close mint with non-zero supply")]
    NonZeroSupply,

    #[msg("Close authority mismatch")]
    InvalidCloseAuthority,
}
