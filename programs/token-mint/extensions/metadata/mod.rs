use anchor_lang::prelude::*;
use spl_token_metadata_interface::state::TokenMetadata;

/// Initialize metadata extension for the mint.
///
/// This adds on-chain metadata (name, symbol, uri) to the token using
/// the Token-2022 metadata extension.
///
/// # Arguments
/// * `name` - The token name
/// * `symbol` - The token symbol  
/// * `uri` - URI pointing to off-chain JSON metadata
pub fn init_metadata(name: String, symbol: String, uri: String) -> Result<TokenMetadata> {
    msg!("Initializing metadata extension");
    msg!("  Name: {}", name);
    msg!("  Symbol: {}", symbol);
    msg!("  URI: {}", uri);

    let metadata = TokenMetadata {
        name,
        symbol,
        uri,
        ..Default::default()
    };

    Ok(metadata)
}

/// Validates metadata fields
pub fn validate_metadata(name: &str, symbol: &str) -> Result<()> {
    require!(
        !name.is_empty() && name.len() <= 32,
        MetadataError::InvalidName
    );
    require!(
        !symbol.is_empty() && symbol.len() <= 10,
        MetadataError::InvalidSymbol
    );
    Ok(())
}

#[error_code]
pub enum MetadataError {
    #[msg("Token name must be 1-32 characters")]
    InvalidName,

    #[msg("Token symbol must be 1-10 characters")]
    InvalidSymbol,
}
