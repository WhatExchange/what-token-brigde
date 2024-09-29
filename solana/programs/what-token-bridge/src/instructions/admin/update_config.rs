use anchor_lang::prelude::*;

use crate::{ConfigAccount, WhatTokenBrigdeError};

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = config_account.owner == *owner.key  @ WhatTokenBrigdeError::Unauthorized
    )]
    pub config_account: Account<'info, ConfigAccount>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct UpdateConfigEvent {
    pub new_owner: Option<Pubkey>,
    pub new_fee: Option<u64>,
    pub new_whitelist_enabled: Option<bool>,
}

pub fn update_config(ctx: Context<UpdateConfig>, fee: Option<u64>, new_owner: Option<Pubkey>, whitelist_enabled: Option<bool>) -> Result<()> {
    let config_account = &mut ctx.accounts.config_account;

    if let Some(fee) = fee {
        config_account.fee = fee;
    }

    if let Some(new_owner) = new_owner {
        config_account.owner = new_owner;
    } 

    if let Some(whitelist_enabled) = whitelist_enabled {
        config_account.whitelist_enabled = whitelist_enabled;
    }

    emit!(UpdateConfigEvent {
        new_owner: Some(config_account.owner),
        new_fee: Some(config_account.fee),
        new_whitelist_enabled: Some(config_account.whitelist_enabled),
    });

    Ok(())
}
