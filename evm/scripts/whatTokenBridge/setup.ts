import { ethers } from "ethers";
import WhatTokenBridgeJson from "../abi/WhatTokenBridge.json";
import WhatTokenJson from "../abi/ERC20.json";
import dotenv from "dotenv";

dotenv.config();

async function setup() {
  // Environment variables

  const {
    RPC_URL,
    WHAT_TOKEN_BRIDGE_ADDRESS,
    PRIVATE_KEY,
    WHAT_TOKEN_ADDRESS,
    SOLANA_EMITTER_ADDRESS,
    INITIAL_RELAYER_FEE,
  } = process.env;

  if (
    !RPC_URL ||
    !WHAT_TOKEN_BRIDGE_ADDRESS ||
    !PRIVATE_KEY ||
    !WHAT_TOKEN_ADDRESS ||
    !SOLANA_EMITTER_ADDRESS
  ) {
    throw new Error("Missing required environment variables");
  }

  // Setup provider and wallet
  const provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Contract instances
  const whatTokenBridge = new ethers.Contract(
    WHAT_TOKEN_BRIDGE_ADDRESS,
    WhatTokenBridgeJson.abi,
    wallet
  );

  const whatToken = new ethers.Contract(
    WHAT_TOKEN_ADDRESS,
    WhatTokenJson.abi,
    wallet
  );

  try {
    // 1. Set What Token Address
    console.log("Setting What Token address...");
    const setTokenTx = await whatTokenBridge.setWhatTokenAddress(
      WHAT_TOKEN_ADDRESS
    );
    await setTokenTx.wait();
    console.log("What Token address set successfully");

    // 2. Register Solana Emitter
    console.log("Registering Solana emitter...");
    const emitterAddressBytes32 = ethers.utils.hexZeroPad(
      SOLANA_EMITTER_ADDRESS,
      32
    );
    const registerEmitterTx = await whatTokenBridge.registerEmitter(
      1, // Solana chain ID
      emitterAddressBytes32
    );
    await registerEmitterTx.wait();
    console.log("Solana emitter registered successfully");

    // 3. Update Relayer Fee
    console.log("Updating relayer fee...");
    const updateFeeTx = await whatTokenBridge.updateRelayerFeePercentage(
      INITIAL_RELAYER_FEE || 1000 // Default to 10% (with precision of 10000)
    );
    await updateFeeTx.wait();
    console.log("Relayer fee updated successfully");

    // 4. Transfer WHAT tokens to bridge
    console.log("Transferring WHAT tokens to bridge...");
    const amount = ethers.utils.parseUnits("500000000", 18); // 500M tokens
    const transferTx = await whatToken.transfer(
      WHAT_TOKEN_BRIDGE_ADDRESS,
      amount
    );
    await transferTx.wait();
    console.log("Token transfer completed successfully");

    console.log("Setup completed successfully!");
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
}

// Execute setup
if (require.main === module) {
  setup()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
