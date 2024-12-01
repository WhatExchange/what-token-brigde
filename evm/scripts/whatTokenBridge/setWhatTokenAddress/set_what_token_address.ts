import { ethers } from "ethers";
import WhatTokenBridgeJson from "../../abi/WhatTokenBridge.json";

export async function setWhatTokenAddress(
  rpcUrl: string,
  whatTokenBridgeAddress: string,
  privateKey: string,
  whatTokenAddress: string
) {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const whatTokenBridge = new ethers.Contract(
    whatTokenBridgeAddress,
    WhatTokenBridgeJson.abi,
      wallet
  );

  const receipt = await whatTokenBridge.setWhatTokenAddress(whatTokenAddress);

  console.log(receipt);
}
