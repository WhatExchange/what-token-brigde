# What Token Bridge

A cross-chain token bridge implementation using Wormhole protocol.

## Overview

This project implements a token bridge that allows users to transfer tokens between different blockchain networks using Wormhole as the messaging protocol.

## Key Features

- Cross-chain token transfers
- Relayer fee system
- Token amount normalization
- Secure message verification

## Deployment 
### BASE Chain
#### 1. Deploy what token bridge on BASE chain
```
cd evm
```
- Configure .env file by copy from .env.example

- Build your project by running command
```
make build
``` 
- Config your custom setting at file ***shell-scripts/deployment_what_token_bridge.sh***. This fee configure is 10%(1000/10000). Update on your own fee

```
export PRIVATE_KEY=$PRIVATE_KEY
export RELAYER_FEE=1000
export FEE_PRECISION=10000
export RPC_URL=https://sepolia.drpc.org
export WORMHOLE_ADDRESS=0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78
```
- Run command to deploy on target chain on EVM
```bash shell-scripts/deployment_what_token_bridge.sh```

#### 2. Init your project (all this step need to done)
- Set what token address
- Set emitter address from Solana
- Send what token to bridge contract (500M)
- You can run command to setup. Also update your own setting in .env file

```
yarn setup
```

### SOLANA Chain

```
cd solana
```
1. Setup admin key at file ***solana/programs/what-token-bridge/src/constants.rs***

2. Build and deploy program
```
anchor build
```
3. Sync keys
```
anchor keys list  && anchor keys sync 
```
4. Deploy program
```
anchor deploy
```
5. Setup your own setting in .env file
```
BASE_CHAIN_ID=<YOUR BASE CHAIN ID>
BASE_EMITTER_ADDRESS=<YOUR BASE EMITTER ADDRESS>
SOLANA_WORMHOLE_BRIDGE_ID=<YOUR SOLANA WORMHOLE BRIDGE ID>
WHAT_MINT=<YOUR WHAT MINT>
SOLANA_WALLET_PRIVATE_KEY=<YOUR SOLANA WALLET PRIVATE KEY>
```
6. Run command to setup bridge
- Setup what token bridge
- Register emitter from base chain
- Mint what token to admin wallet
- Setup what token bridge

```
yarn setup-bridge
```