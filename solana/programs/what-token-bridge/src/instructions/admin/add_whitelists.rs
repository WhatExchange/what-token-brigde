use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{constants::SEED_PREFIX_CONFIG, ConfigAccount, WhatTokenBrigdeError};

#[derive(Accounts)]
pub struct AddWhitelists<'info> {
    #[account(
        mut,
        constraint = config_account.owner == *owner.key  @ WhatTokenBrigdeError::Unauthorized
    )]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub what_mint: Account<'info, Mint>,
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

pub fn add_whitelists(ctx: Context<AddWhitelists>, whitelists: Vec<Pubkey>) -> Result<()> {
    let config_account = &mut ctx.accounts.config_account;

    for whitelist in whitelists.iter() {
        if !config_account.whitelists.contains(whitelist) {
            config_account.whitelists.push(*whitelist);

        }
    }

    Ok(())
}
