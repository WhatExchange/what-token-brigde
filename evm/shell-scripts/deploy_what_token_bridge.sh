#!/bin/bash
export WALLET_PRIVATE_KEY="7cbe96c29aafe39772bf498f68e139e70a566af00b3aaa170c9dc0d47210b256"
export TESTING_WORMHOLE_ADDRESS="0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78"
export TESTING_WHAT_ADDRESS="0x27d6723BFcE688d6Ec8c0e0857f55bECBFEddCD5"
export WHAT_TOKEN_ADDRESS="0x27BE59861b11EcF02Fcb9bc9d27deDc280EF3136"
export WHAT_TOKEN_BRIDGE_ADDRESS="0x18117C8E01d4FC02aCaCFc52ffAF95Cc7dF690FD"
export RPC_URL="https://sepolia.drpc.org"

# Execute the Forge script
forge script forge-scripts/deploy_what_token_bridge.sol \
    --rpc-url $RPC_URL \
    --private-key $WALLET_PRIVATE_KEY \
    --broadcast --slow