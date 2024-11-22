import { ethers } from "ethers";
import erc20 from './abi/WhatTokenABI.json'
import * as whatTokenBrigdeJson from './abi/WhatTokenBridge.json'
import { CHAIN_ID_SOLANA, tryHexToNativeString, tryNativeToHexString } from "@certusone/wormhole-sdk";

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

export async function sendWhat(recipient: string, amount: number) {

  const redeemTx = await whatTokenBrigde
    .lockAndSend(recipient, amount)
    .then((tx: ethers.ContractTransaction) => tx.wait())
    .catch((msg: any) => {
      console.error(msg);
      return null;
    });

  console.log(`Sending what token at tx https://wormholescan.io/#/tx/${redeemTx.transactionHash}?network=Testnet`);
}

export async function approve() {
    //approve token

    const approveTx = await whatToken
    .approve(whatTokenBrigdeAddress, 100000000000000)
    .then((tx: ethers.ContractTransaction) => tx.wait())
    .catch((msg: any) => {
      console.error(msg);
      return null;
    });
  console.log("Approve at tx: ", approveTx.transactionHash);
}


(async function executeTransactions() {
    const recipientNative = "Grq8wT5R8LLsi8XgjrD3nicthetWho8pCyTtAAU99g7x";
    const recipientHex = '0x' + tryNativeToHexString(recipientNative, CHAIN_ID_SOLANA);
    console.log('recipientHex: ', recipientHex);
    const nativeToHexString = tryHexToNativeString(recipientHex, CHAIN_ID_SOLANA);
    console.log('nativeToHexString: ', nativeToHexString)
    const amount = 100;
    // await approve();
    for (let i = 0; i < 20; i++) {
      console.log(`Sending transaction ${i + 1}`);
      await sendWhat(recipientHex, amount);
      console.log(`Transaction ${i + 1} complete`);
  
      // Wait 1 second before the next iteration
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  })();
