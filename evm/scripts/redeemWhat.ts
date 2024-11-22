import { ethers } from "ethers";
import erc20 from "./abi/WhatTokenABI.json";
import * as whatTokenBrigdeJson from "./abi/WhatTokenBridge.json";
import {
  CHAIN_ID_SOLANA,
  tryHexToNativeString,
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";
import { Implementation__factory } from "@certusone/wormhole-sdk/lib/esm/ethers-contracts";
import { contracts } from "@wormhole-foundation/sdk";

const rpcUrl = "https://sepolia.drpc.org";
const privateKey =
  "7cbe96c29aafe39772bf498f68e139e70a566af00b3aaa170c9dc0d47210b256";
const whatTokenBrigdeAddress = "0x18117C8E01d4FC02aCaCFc52ffAF95Cc7dF690FD";
const whatTokenAddress = "0x27BE59861b11EcF02Fcb9bc9d27deDc280EF3136";

const ethProvider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
const ethWallet = new ethers.Wallet(privateKey, ethProvider);

const whatToken = new ethers.Contract(whatTokenAddress, erc20.abi, ethWallet);

const whatTokenBrigde = new ethers.Contract(
  whatTokenBrigdeAddress,
  whatTokenBrigdeJson.abi,
  ethWallet
);

export async function redeemWhat() {
  const vaa =
    "AQAAAAABAI9GzvLVzcsql7IlfoiH0ScJB6HZEEEBovZCPLZpuJ+2UQrcSoiVR728pcrrXAWxxJYVs4F0iIcXhFIAd1qR0hkBZz+l0wAAAAAAAVgOMgAs9qZeWFOKovG6RkjxKRqtLyt1BrMwvNUaDWFYAAAAAAAAAAAgABjUdBHMcX04IsdX9jUozOJQx60yAAAAAACYloA=";
  const vaaBuffer = Buffer.from(vaa, "base64");
  // const buffer = Buffer.from('0x0018d47411cc717d3822c757f63528cce250c7ad320000000000989680', '')

  // decodeMessage(buffer);
//   const redeemTx = await whatTokenBrigde
//     .redeemAndUnlock(vaaBuffer)
//     .then((tx: ethers.ContractTransaction) => tx.wait())
//     .catch((msg: any) => {
//       console.error(msg);
//       return null;
//     });

//   console.log(
//     `Sending what token at tx https://wormholescan.io/#/tx/${redeemTx.transactionHash}?network=Testnet`
//   );
}
redeemWhat();

function decodeMessage(encodedMessage: Buffer) {

  let index = 0;

  // Decode payloadID (1 byte)
  const payloadID = encodedMessage.readUInt8(index);
  index += 1;

  // Decode recipient (32 bytes)
  const recipient = encodedMessage.subarray(index, index + 32).toString("hex");
  index += 32;

  // Decode amount (32 bytes)
  const amount = BigInt(
    `0x${encodedMessage.subarray(index, index + 32).toString("hex")}`
  );
  index += 32;

  return {
    payloadID,
    recipient: `0x${recipient}`, // Format as a hex string
    amount: amount.toString(), // Convert BigInt to string for readability
  };
}
