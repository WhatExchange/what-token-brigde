// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {IWormhole} from "modules/wormhole/IWormhole.sol";
import {WhatTokenBrigde} from "contracts/what_token_brigde/WhatTokenBrigde.sol";

contract ContractScript is Script {
    IWormhole wormhole;
    WhatTokenBrigde whatTokenBrigde;

    function setUp() public {
        wormhole = IWormhole(vm.envAddress("TESTING_WORMHOLE_ADDRESS"));
    }

    function deployWhatTokenBrigde() public {
        whatTokenBrigde = new WhatTokenBrigde(
            address(wormhole),
            wormhole.chainId(),
            1, // wormholeFinality
            1e6, // feePrecision
            10000 // relayerFee (percentage terms)
        );
    }

    function run() public {
        vm.startBroadcast();

        deployWhatTokenBrigde();

        vm.stopBroadcast();
    }
}
