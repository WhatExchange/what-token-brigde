/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/what_token_bridge.json`.
 */
export type WhatTokenBridge = {
  "address": "H2A4zRKip3vL652k6sxXtSYRTbnzBrrREvAjPKu7nAr",
  "metadata": {
    "name": "whatTokenBridge",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Bridge token WHAT between Solana and Base"
  },
  "instructions": [
    {
      "name": "addWhitelists",
      "discriminator": [
        164,
        164,
        75,
        161,
        172,
        106,
        159,
        195
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "configAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "whitelists",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "confirmOwnershipTransfer",
      "discriminator": [
        44,
        137,
        156,
        242,
        47,
        7,
        37,
        101
      ],
      "accounts": [
        {
          "name": "ownerCandidate",
          "writable": true,
          "signer": true
        },
        {
          "name": "configAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "whatMint",
          "writable": true
        },
        {
          "name": "configAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lockAndSend",
      "discriminator": [
        236,
        85,
        228,
        53,
        216,
        83,
        251,
        239
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "whatMint",
          "writable": true
        },
        {
          "name": "configAccount",
          "writable": true
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "wormholeMessage",
          "writable": true
        },
        {
          "name": "wormholeSequence",
          "writable": true
        },
        {
          "name": "wormholeBridge",
          "writable": true
        },
        {
          "name": "wormholeFeeCollector",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  101,
                  101,
                  95,
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  111,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "wormholeProgram",
          "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
        },
        {
          "name": "token2022Program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "clock",
          "address": "SysvarC1ock11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipientAddress",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "redeemAndUnlock",
      "discriminator": [
        163,
        149,
        242,
        130,
        202,
        251,
        53,
        201
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "Payer will pay Wormhole fee to transfer tokens and create temporary",
            "token account."
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "recipient",
          "docs": [
            "transaction."
          ],
          "writable": true
        },
        {
          "name": "whatMint",
          "writable": true
        },
        {
          "name": "configAccount",
          "writable": true
        },
        {
          "name": "posted",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  115,
                  116,
                  101,
                  100,
                  86,
                  65,
                  65
                ]
              },
              {
                "kind": "arg",
                "path": "vaaHash"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "received",
          "writable": true
        },
        {
          "name": "foreignEmitter"
        },
        {
          "name": "wormholeProgram",
          "address": "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
        },
        {
          "name": "token2022Program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vaaHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "registerEmitter",
      "discriminator": [
        217,
        153,
        40,
        34,
        190,
        121,
        144,
        105
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "configAccount",
          "writable": true
        },
        {
          "name": "foreignEmitter",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "chain",
          "type": "u16"
        },
        {
          "name": "address",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "removeWhitelists",
      "discriminator": [
        149,
        85,
        226,
        90,
        79,
        148,
        99,
        241
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "configAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "whitelists",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "transferOwnership",
      "discriminator": [
        65,
        177,
        215,
        73,
        53,
        45,
        99,
        47
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "configAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newOwnerCandidate",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "configAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateConfigArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "configAccount",
      "discriminator": [
        189,
        255,
        97,
        70,
        186,
        189,
        24,
        102
      ]
    },
    {
      "name": "foreignEmitter",
      "discriminator": [
        209,
        139,
        241,
        247,
        96,
        178,
        159,
        2
      ]
    },
    {
      "name": "received",
      "discriminator": [
        227,
        186,
        72,
        102,
        0,
        233,
        222,
        41
      ]
    }
  ],
  "events": [
    {
      "name": "emitterRegisteredEvent",
      "discriminator": [
        128,
        223,
        217,
        159,
        16,
        62,
        181,
        47
      ]
    },
    {
      "name": "initializedEvent",
      "discriminator": [
        136,
        202,
        63,
        120,
        152,
        146,
        41,
        79
      ]
    },
    {
      "name": "lockAndSendEvent",
      "discriminator": [
        219,
        27,
        41,
        204,
        12,
        19,
        131,
        30
      ]
    },
    {
      "name": "redeemAndUnlockEvent",
      "discriminator": [
        2,
        188,
        192,
        79,
        69,
        234,
        117,
        81
      ]
    },
    {
      "name": "updateConfigEvent",
      "discriminator": [
        96,
        112,
        253,
        102,
        59,
        78,
        75,
        134
      ]
    },
    {
      "name": "whitelistAddedEvent",
      "discriminator": [
        123,
        13,
        187,
        218,
        198,
        10,
        192,
        230
      ]
    },
    {
      "name": "whitelistRemovedEvent",
      "discriminator": [
        250,
        175,
        142,
        175,
        6,
        201,
        108,
        171
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "invalidOwnerCandidate",
      "msg": "Invalid owner candidate"
    },
    {
      "code": 6002,
      "name": "invalidMint",
      "msg": "invalidMint"
    },
    {
      "code": 6003,
      "name": "invalidTokenOwner",
      "msg": "Invalid token owner"
    },
    {
      "code": 6004,
      "name": "invalidWormholeBridge",
      "msg": "invalidWormholeBridge"
    },
    {
      "code": 6005,
      "name": "invalidWormholeFeeCollector",
      "msg": "invalidWormholeFeeCollector"
    },
    {
      "code": 6006,
      "name": "invalidWormholeEmitter",
      "msg": "invalidWormholeEmitter"
    },
    {
      "code": 6007,
      "name": "invalidWormholeSequence",
      "msg": "invalidWormholeSequence"
    },
    {
      "code": 6008,
      "name": "invalidSysvar",
      "msg": "invalidSysvar"
    },
    {
      "code": 6009,
      "name": "ownerOnly",
      "msg": "ownerOnly"
    },
    {
      "code": 6010,
      "name": "overflow",
      "msg": "overflow"
    },
    {
      "code": 6011,
      "name": "bumpNotFound",
      "msg": "bumpNotFound"
    },
    {
      "code": 6012,
      "name": "invalidForeignContract",
      "msg": "invalidForeignContract"
    },
    {
      "code": 6013,
      "name": "zeroBridgeAmount",
      "msg": "zeroBridgeAmount"
    },
    {
      "code": 6014,
      "name": "invalidTokenBridgeConfig",
      "msg": "invalidTokenBridgeConfig"
    },
    {
      "code": 6015,
      "name": "invalidTokenBridgeAuthoritySigner",
      "msg": "invalidTokenBridgeAuthoritySigner"
    },
    {
      "code": 6016,
      "name": "invalidTokenBridgeCustodySigner",
      "msg": "invalidTokenBridgeCustodySigner"
    },
    {
      "code": 6017,
      "name": "invalidTokenBridgeEmitter",
      "msg": "invalidTokenBridgeEmitter"
    },
    {
      "code": 6018,
      "name": "invalidTokenBridgeSequence",
      "msg": "invalidTokenBridgeSequence"
    },
    {
      "code": 6019,
      "name": "invalidTokenBridgeSender",
      "msg": "invalidTokenBridgeSender"
    },
    {
      "code": 6020,
      "name": "invalidRecipient",
      "msg": "invalidRecipient"
    },
    {
      "code": 6021,
      "name": "invalidTransferTokenAccount",
      "msg": "invalidTransferTokenAccount"
    },
    {
      "code": 6022,
      "name": "invalidTransferToChain",
      "msg": "invalidTransferTokenChain"
    },
    {
      "code": 6023,
      "name": "invalidTransferTokenChain",
      "msg": "invalidTransferTokenChain"
    },
    {
      "code": 6024,
      "name": "invalidRelayerFee",
      "msg": "invalidRelayerFee"
    },
    {
      "code": 6025,
      "name": "invalidPayerAta",
      "msg": "invalidPayerAta"
    },
    {
      "code": 6026,
      "name": "invalidTransferToAddress",
      "msg": "invalidTransferToAddress"
    },
    {
      "code": 6027,
      "name": "alreadyRedeemed",
      "msg": "alreadyRedeemed"
    },
    {
      "code": 6028,
      "name": "invalidTokenBridgeForeignEndpoint",
      "msg": "invalidTokenBridgeForeignEndpoint"
    },
    {
      "code": 6029,
      "name": "nonExistentRelayerAta",
      "msg": "nonExistentRelayerAta"
    },
    {
      "code": 6030,
      "name": "invalidTokenBridgeMintAuthority",
      "msg": "invalidTokenBridgeMintAuthority"
    },
    {
      "code": 6031,
      "name": "invalidData",
      "msg": "invalidData"
    },
    {
      "code": 6032,
      "name": "invalidForeignEmitter",
      "msg": "invalidForeignEmitter"
    }
  ],
  "types": [
    {
      "name": "configAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "ownerCandidate",
            "type": "pubkey"
          },
          {
            "name": "wormhole",
            "type": {
              "defined": {
                "name": "wormholeAddresses"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "sequence",
            "type": "u64"
          },
          {
            "name": "whatMint",
            "type": "pubkey"
          },
          {
            "name": "whitelistEnabled",
            "type": "bool"
          },
          {
            "name": "whitelists",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "finality",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "emitterRegisteredEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chain",
            "type": "u16"
          },
          {
            "name": "address",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "foreignEmitter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chain",
            "type": "u16"
          },
          {
            "name": "address",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "initializedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lockAndSendEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "sequence",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "received",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "batchId",
            "type": "u32"
          },
          {
            "name": "wormholeMessageHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "redeemAndUnlockEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newFee",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "whitelistEnabled",
            "type": {
              "option": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "updateConfigEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newFee",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "newWhitelistEnabled",
            "type": {
              "option": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "whitelistAddedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "addedWhitelists",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "whitelistRemovedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "removedWhitelists",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "wormholeAddresses",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bridge",
            "type": "pubkey"
          },
          {
            "name": "feeCollector",
            "type": "pubkey"
          },
          {
            "name": "sequence",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
