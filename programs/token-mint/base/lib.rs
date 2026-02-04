use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

#[program]
pub mod token_mint {
    use super::*;

    /// Creates a new Token-2022 mint with the specified configuration.
    /// 
    /// # Arguments
    /// * `ctx` - The context containing all accounts needed for mint creation
    /// * `name` - The token name (for metadata)
    /// * `symbol` - The token symbol (for metadata)
    /// * `uri` - The metadata URI pointing to off-chain JSON
    /// * `decimals` - Number of decimal places for the token
    pub fn create_mint(
        ctx: Context<CreateMint>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        instructions::create_mint::handler(ctx, name, symbol, uri, decimals)
    }
}
