import {
  CHAIN_ID_SEPOLIA,
  CHAIN_ID_SOLANA,
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";

import { ethers } from "ethers";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { WhatTokenBridge as SolanaWhatTokenBridge } from "../../../solana/ts/sdk/what_transfer_token_bridge";
import { postVaaSolana } from "@certusone/wormhole-sdk";
import bs58 from "bs58";
import { postSignedMsgAsVaaOnSolana } from "../../../solana/scripts/utils/index";
import { config } from "dotenv";
import WhatTokenBridgeJson from "../abi/WhatBridgeABI.json";
import WhatTokenJson from "../abi/ERC20.json";

config();
//connection
const solanaConnection = new Connection(clusterApiUrl("devnet"));
const sepoliaProvider = new ethers.providers.StaticJsonRpcProvider(
  process.env.BASE_RPC_URL!
);
//wallet
const sepoliaWalet = new ethers.Wallet(
  process.env.BASE_WALLET_PRIVATE_KEY!,
  sepoliaProvider
);
const solanaWallet = Keypair.fromSecretKey(
  bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY!)
);
async function bridgeFromSepoliaToSolana(amount: number, recipient: string) {
  const sepoliaWhatTokenBridge = new ethers.Contract(
    process.env.WHAT_TOKEN_BRIDGE_ADDRESS!,
    WhatTokenBridgeJson.abi,
    sepoliaWalet
  );

  const sepoliaWhatToken = new ethers.Contract(
    process.env.WHAT_TOKEN_ADDRESS!,
    WhatTokenJson.abi,
    sepoliaWalet
  )

  const allowance = await sepoliaWhatToken.allowance(sepoliaWalet.address, sepoliaWhatTokenBridge.address);

  if(allowance < amount) {
    await sepoliaWhatToken.approve(sepoliaWhatTokenBridge.address, 100_000 * 10 ** 6);
  }

  const receipt = await sepoliaWhatTokenBridge
    .lockAndSend(
      "0x" + tryNativeToHexString(recipient.toString(), CHAIN_ID_SOLANA),
      amount
    )
    .then((tx: ethers.ContractTransaction) => tx.wait())
    .catch((msg: any) => {
      console.log(msg);
      return null;
    });

  if (receipt) {
    const vaa = await getWormholeOperationWithInterval(receipt.transactionHash);
    if (vaa) {
      const signedVaa = Buffer.from(vaa, "base64");
      const tx = await postSignedMsgAsVaaOnSolana(
        solanaConnection,
        signedVaa,
        solanaWallet,
        new PublicKey(process.env.SOLANA_WORMHOLE_BRIDGE_ID!)
      );
      if (tx.length) {
        const whatTokenBridgeProgram = new SolanaWhatTokenBridge(
          solanaConnection,
          sepoliaWhatTokenBridge.address,
          process.env.SOLANA_WORMHOLE_BRIDGE_ID!
        );
        const tx = await whatTokenBridgeProgram.redeemAndUnlock(
          solanaWallet.publicKey,
          signedVaa
        );
        const txHash = await sendAndConfirmTransaction(solanaConnection, tx, [
          solanaWallet,
        ]);

        console.log(
          `Redeem what token brigde at tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet`
        );
      }
    }
  }
}

function getWormholeOperationWithInterval(txHash: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const baseUrl = "https://api.testnet.wormholescan.io/api/v1/operations";
    const params = new URLSearchParams({
      page: "0",
      pageSize: "10",
      sortOrder: "ASC",
      txHash: txHash,
    });

    // Add timeout safety (e.g., 5 minutes)
    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error("Timeout: Failed to get VAA after 30 minutes"));
    }, 30 * 60 * 1000);

    const intervalId = setInterval(async () => {
      try {
        console.log("Attempting to fetch VAA...");

        const response = await axios.get(`${baseUrl}?${params}`);

        const data = response.data;

        if (
          data.operations &&
          data.operations.length > 0 &&
          data.operations[0].vaa &&
          data.operations[0].vaa.raw
        ) {
          console.log("VAA found successfully!");
          clearInterval(intervalId);
          clearTimeout(timeout);
          resolve(data.operations[0].vaa.raw);
        } else {
          console.log("VAA not ready yet, waiting...");
        }
      } catch (error) {
        console.error("Error fetching VAA:", error);
      }
    }, 5000);
  });
}

bridgeFromSepoliaToSolana(
  10 * 10 ** 6,
  "Grq8wT5R8LLsi8XgjrD3nicthetWho8pCyTtAAU99g7x"
);
