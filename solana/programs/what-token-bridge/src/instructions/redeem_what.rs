use anchor_lang::prelude::*;
use wormhole_anchor_sdk::wormhole::{self, program::Wormhole};

use crate::{
    constants::SEED_PREFIX_CONFIG, helper::transfer_from_pool_to_user, ConfigAccount, ForeignEmitter, Received, WhatTokenBridgeMessage, WhatTokenBrigdeError
};

use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount},
};

#[event]
pub struct RedeemEvent {
    pub recipient: [u8; 32],
    pub amount: u64,
}

type WhatTokenBridgeVaa = wormhole::PostedVaa<WhatTokenBridgeMessage>;

#[derive(Accounts)]
#[instruction(vaa_hash: [u8; 32])]
pub struct RedeemWhat<'info> {
    #[account(mut)]
    /// Payer will pay Wormhole fee to transfer tokens and create temporary
    /// token account.
    pub payer: Signer<'info>,

    #[account(mut)]
    /// CHECK: recipient may differ from payer if a relayer paid for this
    /// transaction.
    pub recipient: UncheckedAccount<'info>,

    #[account(mut)]
    pub what_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        constraint = config_account.what_mint == what_mint.key() @ WhatTokenBrigdeError::InvalidMint
    )]
    pub config_account: Account<'info, ConfigAccount>,

    #[account(
        seeds = [
            wormhole::SEED_PREFIX_POSTED_VAA,
            &vaa_hash
        ],
        bump,
        seeds::program = wormhole_program.key
    )]
    pub posted: Account<'info, WhatTokenBridgeVaa>,

    #[account(mut)]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = payer,
        seeds = [
            Received::SEED_PREFIX,
            &posted.emitter_chain().to_le_bytes()[..],
            &posted.sequence().to_le_bytes()[..]
        ],
        bump,
        space = Received::MAXIMUM_SIZE
    )]
    pub received: Account<'info, Received>,

    #[account(
        seeds = [
            ForeignEmitter::SEED_PREFIX,
            &posted.emitter_chain().to_le_bytes()[..]
        ],
        bump,
        constraint = foreign_emitter.verify(posted.emitter_address()) @ WhatTokenBrigdeError::InvalidForeignEmitter
    )]
    pub foreign_emitter: Account<'info, ForeignEmitter>,

    pub wormhole_program: Program<'info, Wormhole>,

    pub token_2022_program: Program<'info, Token2022>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
}

pub fn redeem_what(ctx: Context<RedeemWhat>, vaa_hash: [u8; 32]) -> Result<()> {
    let config_account = &mut *ctx.accounts.config_account;

    let posted_message = &ctx.accounts.posted;

    if let WhatTokenBridgeMessage::Redeem { recipient, amount } = posted_message.data() {
        require!(
            ctx.accounts.recipient.key().to_bytes() == *recipient,
            WhatTokenBrigdeError::InvalidRecipient
        );

        let signer: &[&[u8]] = &[SEED_PREFIX_CONFIG, &[config_account.bump]];

        transfer_from_pool_to_user(
            ctx.accounts.vault_token_account.to_account_info(),
            ctx.accounts.recipient_token_account.to_account_info(),
            ctx.accounts.config_account.to_account_info(),
            ctx.accounts.token_2022_program.to_account_info(),
            ctx.accounts.what_mint.clone(),
            *amount,
            &[&signer],
        )?;

        let received = &mut ctx.accounts.received;
        received.batch_id = posted_message.batch_id();
        received.wormhole_message_hash = vaa_hash;
        received.recipient = ctx.accounts.recipient.key();
        received.amount = amount.clone();

        emit!(RedeemEvent {
            recipient: *recipient,
            amount: *amount
        });

        Ok(())
    } else {
        Err(WhatTokenBrigdeError::InvalidData.into())
    }
}
