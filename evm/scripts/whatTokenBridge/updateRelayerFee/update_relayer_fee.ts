import { ethers } from "ethers";
import WhatTokenBridgeJson from "../../abi/WhatTokenBridge.json";

export async function updateRelayerFee(
  rpcUrl: string,
  whatTokenBridgeAddress: string,
  privateKey: string,
  newRelayerFee: number,
) {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const whatTokenBridge = new ethers.Contract(
    whatTokenBridgeAddress,
    WhatTokenBridgeJson.abi,
    wallet
  );

  const receipt = await whatTokenBridge.updateRelayerFee(newRelayerFee);

  console.log(receipt);
}
