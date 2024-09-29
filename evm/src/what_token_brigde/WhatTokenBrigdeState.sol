// SPDX-License-Identifier: Apache 2
pragma solidity ^0.8.19;

import "modules/wormhole/IWormhole.sol";

contract WhatTokenBrigdeStorage {
    struct Lock {
        address recipient;
        uint256 amount;
    }
    struct State {
        address owner;
        address wormhole;
        uint16 chainId;
        uint8 wormholeFinality;
        bool isPaused;
        bool whitelistEnbled;
        address whatToken;

        // precision of relayer fee percentage
        uint32 feePrecision;

        // relayer fee in percentage terms
        uint32 relayerFeePercentage;

        mapping(address => bool) whitelist;
        mapping(uint16 => bytes32) registeredEmitters;
        mapping(bytes32 => Lock) receivedMessages;
        mapping(bytes32 => bool) consumedMessages;
    }
}

contract WhatTokenBrigdeState {
    WhatTokenBrigdeStorage.State _state;
}
