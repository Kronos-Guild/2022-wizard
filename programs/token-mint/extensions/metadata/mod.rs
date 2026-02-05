use anchor_lang::prelude::*;

// =============================================================================
// Wizard Injection Markers
// =============================================================================
// NOTE: Metadata is a "locked" extension - always included in base.
// The actual metadata initialization happens in create_mint.rs.
// This file provides validation helpers that can be used by the wizard.

// @wizard:inject.lib.modules
pub mod metadata;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::metadata;
// @wizard:end

// @wizard:inject.create_mint.body
    // Validate metadata fields before initialization
    metadata::validate_metadata(&name, &symbol, &uri)?;
// @wizard:end

// =============================================================================
// Extension Implementation
// =============================================================================

/// Maximum length for token name
pub const MAX_NAME_LENGTH: usize = 32;

/// Maximum length for token symbol
pub const MAX_SYMBOL_LENGTH: usize = 10;

/// Maximum length for metadata URI
pub const MAX_URI_LENGTH: usize = 200;

/// Validates metadata fields before mint creation.
///
/// # Arguments
/// * `name` - Token name (1-32 characters)
/// * `symbol` - Token symbol (1-10 characters)
/// * `uri` - Metadata URI (1-200 characters)
///
/// # Errors
/// Returns error if any field is empty or exceeds maximum length.
pub fn validate_metadata(name: &str, symbol: &str, uri: &str) -> Result<()> {
    // Validate name
    require!(
        !name.is_empty() && name.len() <= MAX_NAME_LENGTH,
        MetadataError::InvalidName
    );

    // Validate symbol
    require!(
        !symbol.is_empty() && symbol.len() <= MAX_SYMBOL_LENGTH,
        MetadataError::InvalidSymbol
    );

    // Validate URI
    require!(
        !uri.is_empty() && uri.len() <= MAX_URI_LENGTH,
        MetadataError::InvalidUri
    );

    msg!("Metadata validation passed");
    msg!("  Name: {} ({} chars)", name, name.len());
    msg!("  Symbol: {} ({} chars)", symbol, symbol.len());
    msg!("  URI: {} chars", uri.len());

    Ok(())
}

#[error_code]
pub enum MetadataError {
    #[msg("Token name must be 1-32 characters")]
    InvalidName,

    #[msg("Token symbol must be 1-10 characters")]
    InvalidSymbol,

    #[msg("Token URI must be 1-200 characters")]
    InvalidUri,
}
