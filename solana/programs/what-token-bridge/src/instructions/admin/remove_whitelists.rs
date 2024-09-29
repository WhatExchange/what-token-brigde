use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{constants::SEED_PREFIX_CONFIG, ConfigAccount, WhatTokenBrigdeError};

#[derive(Accounts)]
pub struct RemoveWhitelists<'info> {
    #[account(
        mut,
        constraint = config_account.owner == *owner.key  @ WhatTokenBrigdeError::Unauthorized
    )]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub what_mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [SEED_PREFIX_CONFIG],
        bump,
    )]
    pub config_account: Account<'info, ConfigAccount>,

    pub system_program: Program<'info, System>,
}

pub fn remove_whitelists(ctx: Context<RemoveWhitelists>, whitelists: Vec<Pubkey>) -> Result<()> {
    let config_account = &mut ctx.accounts.config_account;

    for whitelist in whitelists.iter() {
        if let Some(index) = config_account.whitelists.iter().position(|x| x == whitelist) {
            config_account.whitelists.remove(index);
        }
    }

    Ok(())
}
