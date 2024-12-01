import { ethers } from "ethers";
import WhatTokenBridgeJson from "../../abi/WhatTokenBridge.json";

export async function registerEmitter(
  rpcUrl: string,
  whatTokenBridgeAddress: string,
  privateKey: string,
  emitterChainId: number,
  emitterAddress: string
) {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const whatTokenBridge = new ethers.Contract(
    whatTokenBridgeAddress,
    WhatTokenBridgeJson.abi,
    wallet
  );

  const receipt = await whatTokenBridge.registerEmitter(
    emitterChainId,
    emitterAddress
  );

  console.log(receipt);
}
