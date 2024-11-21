import { ethers } from "ethers";
import erc20 from './abi/WhatTokenABI.json'
const abi = [
  {
    type: "constructor",
    inputs: [
      { name: "wormhole_", type: "address", internalType: "address" },
      { name: "chainId_", type: "uint16", internalType: "uint16" },
      {
        name: "wormholeFinality_",
        type: "uint8",
        internalType: "uint8",
      },
      { name: "feePrecision_", type: "uint32", internalType: "uint32" },
      {
        name: "relayerFeePercentage_",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "calculateRelayerFee",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "chainId",
    inputs: [],
    outputs: [{ name: "", type: "uint16", internalType: "uint16" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decodeMessage",
    inputs: [{ name: "encodedMessage", type: "bytes", internalType: "bytes" }],
    outputs: [
      {
        name: "parsedMessage",
        type: "tuple",
        internalType: "struct WhatTokenBridgeStructs.TransferMessage",
        components: [
          { name: "payloadID", type: "uint8", internalType: "uint8" },
          {
            name: "recipient",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "encodeMessage",
    inputs: [
      {
        name: "parsedMessage",
        type: "tuple",
        internalType: "struct WhatTokenBridgeStructs.TransferMessage",
        components: [
          { name: "payloadID", type: "uint8", internalType: "uint8" },
          {
            name: "recipient",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [{ name: "encodedMessage", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "feePrecision",
    inputs: [],
    outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReceivedMessage",
    inputs: [{ name: "hash", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      { name: "recipient", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRegisteredEmitter",
    inputs: [
      { name: "emitterChainId", type: "uint16", internalType: "uint16" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isMessageConsumed",
    inputs: [{ name: "hash", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isPaused",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWhitelistEnabled",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWhitelisted",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lockAndSend",
    inputs: [
      { name: "recipient", type: "bytes32", internalType: "bytes32" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "messageSequence",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "redeemAndUnlock",
    inputs: [{ name: "encodedMessage", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "registerEmitter",
    inputs: [
      {
        name: "emitterChainId",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "emitterAddress",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "relayerFeePercentage",
    inputs: [],
    outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setWhatTokenAddress",
    inputs: [{ name: "whatToken", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "whatToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "wormhole",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IWormhole" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "wormholeFinality",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "error",
    name: "FailedVaaParseAndVerification",
    inputs: [{ name: "reason", type: "string", internalType: "string" }],
  },
  { type: "error", name: "InsufficientContractBalance", inputs: [] },
  { type: "error", name: "InvalidAmount", inputs: [] },
  { type: "error", name: "InvalidEVMAddress", inputs: [] },
  { type: "error", name: "InvalidMessageLength", inputs: [] },
  { type: "error", name: "InvalidWormholeFeeAmount", inputs: [] },
  { type: "error", name: "RecipientZeroAddress", inputs: [] },
  { type: "error", name: "TransferFailed", inputs: [] },
  { type: "error", name: "VaaAlreadyClaimed", inputs: [] },
  { type: "error", name: "WhatTokenZeroAddress", inputs: [] },
  { type: "error", name: "WormholeZeroAddress", inputs: [] },
  { type: "error", name: "WrongChainId", inputs: [] },
  { type: "error", name: "WrongEmitterAddress", inputs: [] },
  { type: "error", name: "WrongEmitterChainId", inputs: [] },
  { type: "error", name: "WrongWormholeFinality", inputs: [] },
];

export async function sendWhat(recipient: string, amount: number) {
  const rpcUrl = "https://sepolia.drpc.org";
  const privateKey =
    "7cbe96c29aafe39772bf498f68e139e70a566af00b3aaa170c9dc0d47210b256";
  const whatTokenBrigdeAddress = "0x4709D12202c7fF0a3ff52f783c1bDF4fd8056Aab";
  const whatTokenAddress = "0x27d6723BFcE688d6Ec8c0e0857f55bECBFEddCD5";

  const ethProvider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const ethWallet = new ethers.Wallet(privateKey, ethProvider);

  const whatToken = new ethers.Contract(whatTokenAddress, erc20.abi, ethWallet);

  const whatTokenBrigde = new ethers.Contract(
    whatTokenBrigdeAddress,
    abi,
    ethWallet
  );

  //approve token

//   const approveTx = await whatToken
//     .approve(whatTokenBrigdeAddress, 1000000000)
//     .then((tx: ethers.ContractTransaction) => tx.wait())
//     .catch((msg: any) => {
//       console.error(msg);
//       return null;
//     });
//   console.log("Approve at tx: ", approveTx.transactionHash);

  const redeemTx = await whatTokenBrigde
    .lockAndSend(recipient, amount)
    .then((tx: ethers.ContractTransaction) => tx.wait())
    .catch((msg: any) => {
      console.error(msg);
      return null;
    });

  console.log(`Sending what token at tx https://wormholescan.io/#/tx/${redeemTx.transactionHash}?network=Testnet`);
}


(async function executeTransactions() {
    const recipient = "0x00000000000000000000000090f8bf6a479f320ead074411a4b0e7944ea8c9c1";
    const amount = 100;
  
    for (let i = 0; i < 20; i++) {
      console.log(`Sending transaction ${i + 1}`);
      await sendWhat(recipient, amount);
      console.log(`Transaction ${i + 1} complete`);
  
      // Wait 1 second before the next iteration
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  })();
