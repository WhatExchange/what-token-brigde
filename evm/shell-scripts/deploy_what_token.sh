#!/bin/bash
export WALLET_PRIVATE_KEY="7cbe96c29aafe39772bf498f68e139e70a566af00b3aaa170c9dc0d47210b256"
export RPC_URL="https://sepolia.drpc.org"

# Execute the Forge script
forge script forge-scripts/deploy_what_token.sol \
    --rpc-url $RPC_URL \
    --private-key $WALLET_PRIVATE_KEY \
    --broadcast --slow
