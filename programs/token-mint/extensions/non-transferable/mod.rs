use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use spl_token_2022::extension::ExtensionType;
use spl_token_2022::instruction as token_instruction;

// @wizard:inject.lib.modules
pub mod non_transferable;
// @wizard:end

// @wizard:inject.create_mint.imports
use crate::non_transferable;
// @wizard:end

// @wizard:inject.create_mint.extension_types
    extension_types.push(ExtensionType::NonTransferable);
// @wizard:end

// @wizard:inject.create_mint.init_extensions
    invoke(
        &token_instruction::initialize_non_transferable_mint(
            token_program.key,
            mint.key,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("NonTransferable initialized - tokens are soulbound");
// @wizard:end

/// Non-transferable (Soulbound) token extension.
///
/// When enabled, tokens cannot be transferred between accounts after minting.
/// This is useful for:
/// - Credentials and certifications
/// - Membership badges
/// - Achievement tokens
/// - Reputation scores
/// - Identity tokens
///
/// Note: This extension is mutually exclusive with transfer-fee
/// (fees don't make sense if transfers are impossible).

#[error_code]
pub enum NonTransferableError {
    #[msg("Non-transferable tokens cannot be transferred")]
    TransferNotAllowed,

    #[msg("Cannot enable both non-transferable and transfer-fee extensions")]
    IncompatibleWithTransferFee,
}
