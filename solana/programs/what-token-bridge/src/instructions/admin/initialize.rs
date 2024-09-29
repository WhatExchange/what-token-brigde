use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::{constants::SEED_PREFIX_CONFIG, ConfigAccount};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub what_mint: InterfaceAccount<'info, Mint>,
    #[account(
        init_if_needed,
        payer = owner,
        space = ConfigAccount::LEN,
        seeds = [SEED_PREFIX_CONFIG],
        bump,
    )]
    pub config_account: Account<'info, ConfigAccount>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct InitializedEvent {
    pub owner: Pubkey,
    pub fee: u64,
}

pub fn initialize(ctx: Context<Initialize>, fee: u64) -> Result<()> {
    let config_account = &mut ctx.accounts.config_account;

    config_account.owner = *ctx.accounts.owner.key;
    config_account.bump = ctx.bumps.config_account;
    config_account.what_mint = ctx.accounts.what_mint.key();
    config_account.fee = fee;

    emit!(InitializedEvent {
        owner: config_account.owner,
        fee,
    });

    Ok(())
}
