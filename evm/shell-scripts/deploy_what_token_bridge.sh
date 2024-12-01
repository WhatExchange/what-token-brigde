source .env

export PRIVATE_KEY=$PRIVATE_KEY
export RELAYER_FEE=1000
export FEE_PRECISION=10000
export RPC_URL=https://sepolia.drpc.org
export WORMHOLE_ADDRESS=0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78

echo "deploying what token bridge contracts to Base"
forge script forge-scripts/deploy_what_token_bridge.sol \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast --slow