use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod helper;
pub mod instructions;
pub mod message;
pub mod state;

use error::*;
use instructions::*;
use message::*;
use state::*;

declare_id!("3jpFhHiErPVYLUJs6UwgSXmJvgjVtGgiZYrBb8Y3bvQG");

#[program]
pub mod what_token_bridge {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, fee: u64) -> Result<()> {
        instructions::initialize(ctx, fee)?;
        Ok(())
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        fee: Option<u64>,
        new_owner: Option<Pubkey>,
        whitelist_enabled: Option<bool>,
    ) -> Result<()> {
        instructions::update_config(ctx, fee, new_owner, whitelist_enabled)?;
        Ok(())
    }

    pub fn register_emitter(
        ctx: Context<RegisterEmitter>,
        chain: u16,
        address: [u8; 32],
    ) -> Result<()> {
        instructions::register_emitter(ctx, chain, address)?;
        Ok(())
    }

    pub fn lock_and_send(
        ctx: Context<LockAndSend>,
        amount: u64,
        recipient_address: [u8; 20],
    ) -> Result<()> {
        instructions::lock_and_send(ctx, amount, &recipient_address)?;
        Ok(())
    }

    pub fn redeem_what(ctx: Context<RedeemWhat>, vaa_hash: [u8; 32]) -> Result<()> {
        instructions::redeem_what(ctx, vaa_hash)?;
        Ok(())
    }

    pub fn add_whitelists(ctx: Context<AddWhitelists>, whitelists: Vec<Pubkey>) -> Result<()> {
        instructions::add_whitelists(ctx, whitelists)?;
        Ok(())
    }

    pub fn remove_whitelists(
        ctx: Context<RemoveWhitelists>,
        whitelists: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::remove_whitelists(ctx, whitelists)?;
        Ok(())
    }
}
