use anchor_lang::{prelude::Pubkey, pubkey};

pub const OWNER: Pubkey = pubkey!("Grq8wT5R8LLsi8XgjrD3nicthetWho8pCyTtAAU99g7x");

pub const SEED_PREFIX_MESSAGE: &[u8; 7] = b"message";

pub const SEED_PREFIX_SEQUENCE: &[u8; 8] = b"sequence";

pub const SEED_PREFIX_CONFIG: &[u8; 6] = b"config";

pub const BASIS_POINTS: u16 = 10_000;
