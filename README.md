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


## Main Functions

### Lock and Send Tokens

Locks tokens on the source chain and initiates a cross-chain transfer.

**Parameters:**
- `amount`: The amount of tokens to transfer
- `recipient`: The recipient's address on the destination chain

**Returns:**
- VAA (Verified Action Approval) string if successful
- `null` if transaction fails

**Example:**

```
async function lockAndSend(amount: number, recipient: PublicKey): Promise<string>
```

### Redeem and Unlock

```
async function redeemAndUnlock(vaa: string): Promise<boolean>
```
Redeems tokens on the destination chain using the VAA from the source chain.

**Parameters:**
- `vaa`: The VAA string from the source chain transaction

**Returns:**
- `true` if redemption successful
- `false` if redemption fails

**Example:**

```
const success = await redeemAndUnlock(vaa);
```

### Get Wormhole Operation

```
async function getWormholeOperationWithInterval(txHash: string): Promise<string>
```
Polls the Wormhole API to retrieve the VAA for a transaction.

**Parameters:**
- `txHash`: Transaction hash from the source chain

**Returns:**
- VAA string when available

**Example:**

```
const vaa = await getWormholeOperationWithInterval(txHash);
```

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/what-token-bridge.git
cd what-token-bridge
```

2. Install dependencies:
```
npm install
```

3. Create `.env` file:
```
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
WORMHOLE_RPC=wormhole_rpc_url
```

## Development

1. Build the project:
```
npm run build
```

2. Run tests:
```
npm test
```

3. Start development server:
```
npm run dev
```

## Configuration

### Chain IDs
- Ethereum Testnet: 1
- BSC Testnet: 2
- (Add other supported chains...)

### Contract Addresses
```
const ADDRESSES = {
  ETHEREUM: {
    token: "0x...",
    bridge: "0x...",
  },
  BSC: {
    token: "0x...",
    bridge: "0x...",
  }
};
```

## Error Handling

Common errors and their solutions:

1. **InvalidWormholeFeeAmount**
   - Cause: Insufficient ETH sent for Wormhole message fee
   - Solution: Include proper message fee with transaction

2. **RecipientZeroAddress**
   - Cause: Invalid recipient address provided
   - Solution: Ensure valid recipient address

3. **VaaAlreadyClaimed**
   - Cause: Attempting to redeem already processed VAA
   - Solution: Check VAA status before redemption

## Security Considerations

1. **Token Approvals**
   - Always approve only the exact amount needed
   - Revoke approvals after use

2. **Message Verification**
   - Always verify VAA signatures
   - Check emitter addresses

3. **Amount Handling**
   - Use SafeMath for calculations
   - Verify token decimals

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

[Add your license here]

## Contact

[Add your contact information]
```

This README provides:
- Clear function documentation
- Installation instructions
- Development setup
- Configuration details
- Error handling guidance
- Security considerations
- Contributing guidelines

You should customize it based on your specific implementation details, adding:
- Actual contract addresses
- Specific configuration values
- Additional functions
- Project-specific requirements
- Your preferred contribution workflow
- License information
- Contact details

Remember to keep the README updated as your project evolves!