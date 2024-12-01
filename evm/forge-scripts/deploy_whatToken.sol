// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {WhatToken} from "modules/token/WhatToken.sol";

contract ContractScript is Script {
    WhatToken whatToken;

    function deployWhatToken() public {
        // deploy the ERC20 token
        whatToken = new WhatToken(
            vm.addr(uint256(vm.envBytes32("WALLET_PRIVATE_KEY"))),
            6, // token decimals
            1e9 // supply
        );
    }

    function run() public {
        // begin sending transactions
        vm.startBroadcast();

        // HelloToken.sol
        deployWhatToken();

        // finished
        vm.stopBroadcast();
    }
}
