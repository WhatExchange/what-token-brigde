import { ethers } from "ethers";
import erc20 from "./abi/WhatTokenABI.json";
import * as whatTokenBrigdeJson from "./abi/WhatTokenBridge.json";
import {
  CHAIN_ID_SOLANA,
  tryHexToNativeString,
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";

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

export async function registerEmitter() {
  const emitterAddress = "580e32002cf6a65e58538aa2f1ba4648f1291aad2f2b7506b330bcd51a0d6158";
  const emitterByte = Buffer.from(emitterAddress, "hex");

  const redeemTx = await whatTokenBrigde
    .registerEmitter(CHAIN_ID_SOLANA, emitterByte)
    .then((tx: ethers.ContractTransaction) => tx.wait())
    .catch((msg: any) => {
      console.error(msg);
      return null;
    });

  console.log(
    `Register emiiter at tx https://sepolia.etherscan.io/tx/${redeemTx.transactionHash}`
  );
}
registerEmitter();
