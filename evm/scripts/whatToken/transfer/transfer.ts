import { ethers } from "ethers";
import WhatTokenJson from "../../abi/ERC20.json";

export async function transfer(
  rpcUrl: string,
  whatTokenAddress: string,
  privateKey: string,
  receiverAddress: string,
  amount: number
) {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const whatToken = new ethers.Contract(
    whatTokenAddress,
    WhatTokenJson.abi,
    wallet
  );

  const receipt = await whatToken.transfer(receiverAddress, amount);

  console.log(receipt);
}
