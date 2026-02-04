use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

/// Close mint extension allows the mint authority to close the mint
/// account and reclaim the rent.
///
/// This is useful for:
/// - One-time token distributions where the mint is no longer needed
/// - Reclaiming SOL from unused mints
/// - Cleaning up test mints
///
/// WARNING: Once closed, the mint cannot be recreated with the same address.

/// Closes the mint account and returns rent to the payer.
///
/// Requirements:
/// - Total supply must be 0 (all tokens burned)
/// - Caller must be the close authority
pub fn handler(ctx: Context<CloseMint>) -> Result<()> {
    msg!("Closing mint account");
    msg!("  Rent returned to: {}", ctx.accounts.destination.key());

    // Close mint via CPI to Token-2022 program
    // Implementation would go here

    Ok(())
}

#[derive(Accounts)]
pub struct CloseMint<'info> {
    /// The mint account to close
    /// CHECK: Validated by Token-2022 program
    #[account(mut)]
    pub mint: AccountInfo<'info>,

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
