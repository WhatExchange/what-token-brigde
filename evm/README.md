### Deploying What Token Bridge

To deploy the What Token Bridge contracts to Base network, follow these steps:

1. Create a `.env` file in the root directory with the following variables:
   ```env
   PRIVATE_KEY=your_wallet_private_key
   ```

2. Run the deployment script:
   ```bash
   ./shell-scripts/deploy_what_token_bridge.sh
   ```

The script will use these default configurations:
- Set default parameters:
  - Relayer fee: 1000
  - Fee precision: 10000 
  - (Equivalent to 10% relayer fee)

Network Configuration:
- Default RPC: Sepolia (https://sepolia.drpc.org)
- Default Wormhole Address: 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78

You can modify these network settings by updating the following variables in the script:
```bash
export RPC_URL=<your-network-rpc>           # Change for different networks
export WORMHOLE_ADDRESS=<wormhole-address>  # Change based on network's Wormhole deployment
```

Example Network Configurations:

1. Base Mainnet:
```bash
export RPC_URL=https://mainnet.base.org
export WORMHOLE_ADDRESS=0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6
```

2. Testnet Configurations:
- Sepolia: 
  - RPC: https://sepolia.drpc.org
  - Wormhole: 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78
- Base Goerli: 
  - RPC: https://goerli.base.org
  - Wormhole: 0x23908A62110e21C04F3A4e011d24F901F911744A

Make sure you have:
- Sufficient ETH in your wallet for deployment
- Forge installed and properly configured
- Required permissions if deploying to production networks

### Owner Functions

The WhatTokenBridge contract includes several administrative functions that can only be called by the contract owner. Below are the available owner functions and their usage:

#### Core Admin Functions

##### Update Owner
```solidity
function updateOwner(address owner_) public onlyOwner
```
Updates the contract owner address.
- `owner_`: New owner address
- Reverts if zero address is provided
- Only callable by current owner

##### Update Wormhole
```solidity
function updateWormhole(address wormhole_) public onlyOwner
```
Updates the Wormhole contract address.
- `wormhole_`: New Wormhole contract address
- Reverts if zero address is provided
- Only callable by current owner

##### Update Chain ID
```solidity
function updateChainId(uint16 chainId_) public onlyOwner
```
Updates the chain ID for the contract.
- `chainId_`: New chain ID
- Reverts if chain ID is zero
- Only callable by current owner

##### Update Wormhole Finality
```solidity
function updateWormholeFinality(uint8 finality) public onlyOwner
```
Updates the number of blocks required for Wormhole finality.
- `finality`: New finality requirement
- Reverts if finality is zero
- Only callable by current owner

#### Fee Configuration

##### Update Fee Parameters
```solidity
function updateFeePrecision(uint32 feePrecision_) public onlyOwner
function updateRelayerFeePercentage(uint32 relayerFeePercentage_) public onlyOwner
```
Updates fee-related parameters:
- `feePrecision_`: New fee precision value (denominator for fee calculations)
- `relayerFeePercentage_`: New relayer fee percentage
- Reverts if invalid values provided
- Only callable by current owner

#### Whitelist Management

##### Update Whitelist State
```solidity
function updateWhitelistEnabled(bool enabled) public onlyOwner
```
Enables or disables whitelist functionality.
- `enabled`: New whitelist enabled state
- Only callable by current owner

##### Update Individual Whitelist
```solidity
function updateWhitelist(address account, bool enabled) public onlyOwner
```
Updates whitelist status for specific accounts.
- `account`: Address to update
- `enabled`: Whitelist status for the address
- Only callable by current owner

#### Usage Examples

```javascript
// Update owner
await whatTokenBridge.updateOwner(newOwnerAddress);

// Update fee configuration
await whatTokenBridge.updateFeePrecision(10000);
await whatTokenBridge.updateRelayerFeePercentage(100); // 1% with precision of 10000

// Enable whitelist and add addresses
await whatTokenBridge.updateWhitelistEnabled(true);
await whatTokenBridge.updateWhitelist(userAddress, true);

// Register foreign emitter
await whatTokenBridge.registerEmitter(
    FOREIGN_CHAIN_ID,
    FOREIGN_CONTRACT_ADDRESS
);
```

#### Important Security Notes

1. All functions are protected by the `onlyOwner` modifier
2. Input validation is performed for all critical parameters
3. Zero addresses are not allowed for critical address updates
4. Fee percentage must be less than fee precision
5. Chain IDs must be valid and non-zero
6. Changes to critical parameters should be carefully managed

For more detailed information about the contract's functionality, please refer to the contract documentation.
