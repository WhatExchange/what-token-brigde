// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {IWormhole} from "modules/wormhole/IWormhole.sol";
import {WhatTokenBridge} from "contracts/what_token_bridge/WhatTokenBridge.sol";

contract ContractScript is Script {
    IWormhole wormhole;
    WhatTokenBridge whatTokenBridge;

    uint32 feePrecision;
    uint32 relayerFee;
    function setUp() public {
        wormhole = IWormhole(vm.envAddress("WORMHOLE_ADDRESS"));
        relayerFee = uint32(vm.envUint("RELAYER_FEE"));
        feePrecision = uint32(vm.envUint("FEE_PRECISION"));
    }

    function deployWhatTokenBridge() public {
        whatTokenBridge = new WhatTokenBridge(
            address(wormhole),
            wormhole.chainId(),
            1, // wormholeFinality
            feePrecision,
            relayerFee // relayerFee (percentage terms)
        );
    }

    function run() public {
        vm.startBroadcast();

        deployWhatTokenBridge();

        vm.stopBroadcast();
    }
}
