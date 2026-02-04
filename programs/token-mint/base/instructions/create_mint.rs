use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

/// Creates a new Token-2022 mint.
///
/// This is the base instruction that creates a mint account.
/// Extensions are added by including additional files from the extensions/ folder.
pub fn handler(
    ctx: Context<CreateMint>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
) -> Result<()> {
    msg!("Creating Token-2022 mint: {} ({})", name, symbol);
    msg!("Decimals: {}", decimals);
    msg!("URI: {}", uri);

    // Base mint creation logic
    // The actual CPI calls will be implemented based on enabled extensions

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateMint<'info> {
    /// The account paying for rent and transaction fees
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The mint account to be created
    /// This will be initialized as a Token-2022 mint
    #[account(mut)]
    pub mint: Signer<'info>,

    /// The mint authority that can mint new tokens
    pub mint_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,

    /// System program for account creation
    pub system_program: Program<'info, System>,
}
