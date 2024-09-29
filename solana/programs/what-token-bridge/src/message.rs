use anchor_lang::{AnchorDeserialize, AnchorSerialize};
use std::io;
use wormhole_io::Readable;

const PAYLOAD_ID_SEND: u8 = 0;
const PAYLOAD_ID_REDEEM: u8 = 1;

#[derive(Clone)]
pub enum WhatTokenBridgeMessage {
    Send {
        recipient: [u8; 20],
        amount: [u8; 8],
    },
    Redeem {
        recipient: [u8; 32],
        amount: u64,
    },
}

impl AnchorSerialize for WhatTokenBridgeMessage {
    fn serialize<W: io::Write>(&self, writer: &mut W) -> io::Result<()> {
        match self {
            WhatTokenBridgeMessage::Send { recipient, amount } => {
                PAYLOAD_ID_SEND.serialize(writer)?;
                recipient.serialize(writer)?;
                amount.serialize(writer)?;
                Ok(())
            }
            WhatTokenBridgeMessage::Redeem { recipient, amount } => {
                PAYLOAD_ID_REDEEM.serialize(writer)?;
                recipient.serialize(writer)?;
                amount.serialize(writer)?; // Serialize the amount as a u64
                Ok(())
            }
        }
    }
}

impl AnchorDeserialize for WhatTokenBridgeMessage {
    fn deserialize_reader<R: io::Read>(reader: &mut R) -> io::Result<Self> {
        match u8::read(reader)? {
            PAYLOAD_ID_SEND => Ok(WhatTokenBridgeMessage::Send {
                recipient: <[u8; 20]>::read(reader)?,
                amount: <[u8; 8]>::read(reader)?,
            }),
            PAYLOAD_ID_REDEEM => Ok(WhatTokenBridgeMessage::Redeem {
                recipient: <[u8; 32]>::read(reader)?,
                amount: u64::read(reader)?,
            }),
            _ => Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "invalid payload ID",
            )),
        }
    }
}
