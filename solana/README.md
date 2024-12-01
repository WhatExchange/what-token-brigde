

## WhatTokenBridge Admin Functions

This section describes all administrative functions available in the WhatTokenBridge SDK. These functions are restricted to the contract owner/admin.

### Core Admin Functions

#### Initialize
```typescript
initialize(owner: PublicKey, fee: number, whatMint: PublicKey): Promise<Transaction>
```

Initializes the WhatTokenBridge contract with initial parameters.
- `owner`: The initial owner's public key
- `fee`: The initial transfer fee amount
- `whatMint`: The WHAT token mint address
- Returns: Transaction that needs to be signed and submitted

#### Update Config
```typescript
updateConfig(owner: PublicKey, newFee: BN | null, whitelistEnabled: boolean | null): Promise<Transaction>
```

Updates the contract's configuration parameters.
- `owner`: Current owner's public key
- `newFee`: New transfer fee amount (pass null to keep current value)
- `whitelistEnabled`: Enable/disable whitelist functionality (pass null to keep current value)
- Returns: Transaction that needs to be signed and submitted

### Ownership Management

#### Transfer Ownership
```typescript
transferOwnership(owner: PublicKey, newOwnerCandidate: PublicKey): Promise<Transaction>
```

Initiates ownership transfer to a new address. The transfer must be confirmed by the new owner.
- `owner`: Current owner's public key
- `newOwnerCandidate`: New owner's public key
- Returns: Transaction that needs to be signed and submitted

#### Confirm Ownership Transfer
```typescript
confirmOwnershipTransfer(ownerCandidate: PublicKey): Promise<Transaction>
```

Confirms ownership transfer. Must be called by the new owner candidate.
- `ownerCandidate`: The public key of the owner candidate
- Returns: Transaction that needs to be signed and submitted

### Whitelist Management

#### Add Whitelist
```typescript
addWhitelist(owner: PublicKey, whitelists: PublicKey[]): Promise<Transaction>
```

Adds addresses to the whitelist.
- `owner`: Current owner's public key
- `whitelists`: Array of public keys to add to whitelist
- Returns: Transaction that needs to be signed and submitted

#### Remove Whitelist
```typescript
removeWhitelist(owner: PublicKey, whitelists: PublicKey[]): Promise<Transaction>
```

Removes addresses from the whitelist.
- `owner`: Current owner's public key
- `whitelists`: Array of public keys to remove from whitelist
- Returns: Transaction that needs to be signed and submitted

### Cross-Chain Configuration

#### Register Emitter
```typescript
registerEmitter(owner: PublicKey, chainId: ChainId, foreignEmitterAddress: Buffer): Promise<Transaction>
```

Registers a foreign emitter for cross-chain transfers.
- `owner`: Current owner's public key
- `chainId`: The chain ID of the foreign emitter
- `foreignEmitterAddress`: The address of the foreign emitter contract
- Returns: Transaction that needs to be signed and submitted

### Usage Example

```typescript
// Initialize SDK
const whatBridge = new WhatTokenBridge(connection, whatMintAddress);

// Initialize contract
const initTx = await whatBridge.initialize(
  ownerKeypair.publicKey,
  1000, // fee
  whatMintAddress
);
await sendAndConfirmTransaction(connection, initTx, [ownerKeypair]);

// Update config
//We use basis point is 10000 so 2000 meaning 20%
const updateTx = await whatBridge.updateConfig(
  ownerKeypair.publicKey,
  new BN(2000), // new fee
  true // enable whitelist
);
await sendAndConfirmTransaction(connection, updateTx, [ownerKeypair]);

// Add addresses to whitelist
const addWhitelistTx = await whatBridge.addWhitelist(
  ownerKeypair.publicKey,
  [user1.publicKey, user2.publicKey]
);
await sendAndConfirmTransaction(connection, addWhitelistTx, [ownerKeypair]);
```

### Important Notes

1. All these functions require owner privileges to execute
2. Transactions must be signed by the appropriate authority (owner or owner candidate)
3. Some operations (like ownership transfer) require multiple steps to complete
4. Failed transactions will revert if called by non-authorized addresses
5. All functions return an unsigned transaction that must be signed and submitted to the network

[anchor book]: https://book.anchor-lang.com/getting_started/installation.html
[wormhole repo]: https://github.com/wormhole-foundation/wormhole/tree/main/solana

[Solana docs]: https://docs.solana.com/

