use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token_2022::Token2022;
use spl_token_2022::{
    extension::{metadata_pointer::instruction as metadata_pointer_instruction, ExtensionType},
    instruction as token_instruction,
    state::Mint,
};
use spl_token_metadata_interface::{
    instruction as metadata_instruction,
    state::TokenMetadata,
};

/// Creates a new Token-2022 mint with metadata extension.
///
/// This is the base instruction that creates a mint account with on-chain metadata.
/// The mint is created with MetadataPointer and TokenMetadata extensions.
/// Additional extensions can be enabled via the wizard.
///
/// # Arguments
/// * `name` - Token name (1-32 characters)
/// * `symbol` - Token symbol (1-10 characters)
/// * `uri` - URI pointing to off-chain JSON metadata
/// * `decimals` - Number of decimal places (0-9 typically)
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

    let payer = &ctx.accounts.payer;
    let mint = &ctx.accounts.mint;
    let mint_authority = &ctx.accounts.mint_authority;
    let token_program = &ctx.accounts.token_program;
    let system_program = &ctx.accounts.system_program;

    // =========================================================================
    // STEP 1: Build extension types list
    // =========================================================================
    // Base extension: MetadataPointer (always included)
    let mut extension_types = vec![ExtensionType::MetadataPointer];

    // @wizard:inject.create_mint.extension_types
    // Extensions add their types here (e.g., extension_types.push(ExtensionType::TransferFeeConfig);)
    // @wizard:end

    // =========================================================================
    // STEP 2: Calculate space
    // =========================================================================
    let mint_space = ExtensionType::try_calculate_account_len::<Mint>(&extension_types)
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

    // Calculate TokenMetadata space (variable length)
    let metadata = TokenMetadata {
        update_authority: Some(mint_authority.key()).try_into()
            .map_err(|_| ErrorCode::AccountDidNotSerialize)?,
        mint: mint.key(),
        name: name.clone(),
        symbol: symbol.clone(),
        uri: uri.clone(),
        additional_metadata: vec![],
    };
    let metadata_space = metadata.tlv_size_of()
        .map_err(|_| ErrorCode::AccountDidNotSerialize)?;

    let total_space = mint_space + metadata_space;
    msg!("Allocating {} bytes (mint: {}, metadata: {})", total_space, mint_space, metadata_space);

    // =========================================================================
    // STEP 3: Create mint account
    // =========================================================================
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(total_space);

    invoke(
        &anchor_lang::solana_program::system_instruction::create_account(
            payer.key,
            mint.key,
            lamports,
            total_space as u64,
            token_program.key,
        ),
        &[
            payer.to_account_info(),
            mint.to_account_info(),
            system_program.to_account_info(),
        ],
    )?;
    msg!("Mint account created");

    // =========================================================================
    // STEP 4: Initialize extensions (BEFORE mint initialization)
    // =========================================================================

    // 4a. Initialize MetadataPointer (always)
    invoke(
        &metadata_pointer_instruction::initialize(
            token_program.key,
            mint.key,
            Some(mint_authority.key()),
            Some(mint.key()),
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("MetadataPointer initialized");

    // @wizard:inject.create_mint.init_extensions
    // Extensions initialize here (BEFORE mint init)
    // @wizard:end

    // =========================================================================
    // STEP 5: Initialize the mint
    // =========================================================================
    invoke(
        &token_instruction::initialize_mint2(
            token_program.key,
            mint.key,
            mint_authority.key,
            None, // freeze authority
            decimals,
        )?,
        &[mint.to_account_info()],
    )?;
    msg!("Mint initialized with {} decimals", decimals);

    // =========================================================================
    // STEP 6: Initialize TokenMetadata (AFTER mint initialization)
    // =========================================================================
    invoke(
        &metadata_instruction::initialize(
            token_program.key,
            mint.key,
            mint_authority.key,
            mint.key,
            mint_authority.key,
            name.clone(),
            symbol.clone(),
            uri.clone(),
        ),
        &[
            mint.to_account_info(),
            mint_authority.to_account_info(),
        ],
    )?;
    msg!("Metadata initialized: {} ({})", name, symbol);

    // @wizard:inject.create_mint.body
    // Additional extension logic (post-mint initialization)
    // @wizard:end

    msg!("Mint created successfully: {}", mint.key());
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateMint<'info> {
    /// The account paying for rent and transaction fees
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: The mint account to be created
    /// This will be initialized as a Token-2022 mint with extensions
    #[account(mut)]
    pub mint: Signer<'info>,

    /// The mint authority that can mint new tokens
    /// Also serves as the metadata update authority
    pub mint_authority: Signer<'info>,

    /// Token-2022 program
    pub token_program: Program<'info, Token2022>,

    /// System program for account creation
    pub system_program: Program<'info, System>,
}
