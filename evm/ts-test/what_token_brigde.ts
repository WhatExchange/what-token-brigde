import {expect} from "chai";
import {ethers} from "ethers";
import {MockGuardians} from "@certusone/wormhole-sdk/lib/cjs/mock";
import {
  CHAIN_ID_ETH,
  CHAIN_ID_AVAX,
  tryNativeToHexString,
  ChainId,
} from "@certusone/wormhole-sdk";
import {
  AVAX_HOST,
  AVAX_WORMHOLE_ADDRESS,
  WALLET_PRIVATE_KEY,
  AVAX_WORMHOLE_GUARDIAN_SET_INDEX,
  GUARDIAN_PRIVATE_KEY,
  FORK_AVAX_CHAIN_ID,
  ETH_HOST,
  ETH_WORMHOLE_ADDRESS,
  FORK_ETH_CHAIN_ID,
} from "./helpers/consts";
import {
  formatWormholeMessageFromReceipt,
  readWhatTokenBridgeContractAddress,
  readWhatTokenContractAddress,
} from "./helpers/utils";
import {WhatTokenBridge__factory, IWormhole__factory, IERC20__factory} from "../ethers-contracts";

describe("What token bridge Test", () => {
  // avax wallet
  const avaxProvider = new ethers.providers.StaticJsonRpcProvider(AVAX_HOST);
  const avaxWallet = new ethers.Wallet(WALLET_PRIVATE_KEY, avaxProvider);

  // eth wallet
  const ethProvider = new ethers.providers.StaticJsonRpcProvider(ETH_HOST);
  const ethWallet = new ethers.Wallet(WALLET_PRIVATE_KEY, ethProvider);

  // wormhole contract
  const avaxWormhole = IWormhole__factory.connect(
    AVAX_WORMHOLE_ADDRESS,
    avaxWallet
  );
  const ethWormhole = IWormhole__factory.connect(
    ETH_WORMHOLE_ADDRESS,
    ethWallet
  );

  const avaxWormWhatToken = IERC20__factory.connect(
    readWhatTokenContractAddress(FORK_AVAX_CHAIN_ID as ChainId),
    avaxWallet
  );
  const ethWormWhatToken = IERC20__factory.connect(
    readWhatTokenContractAddress(FORK_ETH_CHAIN_ID as ChainId),
    ethWallet
  );

  const avaxWhatTokenBridge = WhatTokenBridge__factory.connect(
    readWhatTokenBridgeContractAddress(FORK_AVAX_CHAIN_ID as ChainId),
    avaxWallet
  );

  const ethWhatTokenBridge  = WhatTokenBridge__factory.connect(
    readWhatTokenBridgeContractAddress(FORK_ETH_CHAIN_ID as ChainId),
    ethWallet
  );

  describe("Test Contract Deployment and Emitter Registration", () => {
    it("Verify AVAX Contract Deployment", async () => {
      const deployedChainId = await avaxWhatTokenBridge.chainId();
      expect(deployedChainId).to.equal(CHAIN_ID_AVAX);
    });

    it("Verify ETH Contract Deployment", async () => {
      const deployedChainId = await ethWhatTokenBridge.chainId();
      expect(deployedChainId).to.equal(CHAIN_ID_ETH);
    });   

    it("Should Register Bridge Contract Emitter on AVAX", async () => {
      // Convert the target contract address to bytes32, since other
      // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
      const targetContractAddressHex =
        "0x" + tryNativeToHexString(ethWhatTokenBridge.address, CHAIN_ID_ETH);

      // register the emitter
      const receipt = await avaxWhatTokenBridge
        .registerEmitter(CHAIN_ID_ETH, targetContractAddressHex)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          // should not happen
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      // query the contract and confirm that the emitter is set in storage
      const emitterInContractState = await avaxWhatTokenBridge.getRegisteredEmitter(
        CHAIN_ID_ETH
      );
      expect(emitterInContractState).to.equal(targetContractAddressHex);
    });

    it("Should Register Bridge Contract Emitter on ETH", async () => {
      // Convert the target contract address to bytes32, since other
      // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
      const targetContractAddressHex =
        "0x" + tryNativeToHexString(avaxWhatTokenBridge.address, CHAIN_ID_AVAX);

      const receipt = await ethWhatTokenBridge
        .registerEmitter(CHAIN_ID_AVAX, targetContractAddressHex)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      const emitterInContractState = await ethWhatTokenBridge.getRegisteredEmitter(
        CHAIN_ID_AVAX
      );
      expect(emitterInContractState).to.equal(targetContractAddressHex);
    });

    it("Should Register What Token on AVAX", async () => {
      const receipt = await avaxWhatTokenBridge
        .setWhatTokenAddress(avaxWormWhatToken.address)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      const whatTokenAddress = await avaxWhatTokenBridge.whatToken();
      expect(whatTokenAddress.toLowerCase()).to.equal(avaxWormWhatToken.address.toLowerCase());
    });

    it("Should Register What Token on ETH", async () => {
      const receipt = await ethWhatTokenBridge
        .setWhatTokenAddress(ethWormWhatToken.address)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      const whatTokenAddress = await ethWhatTokenBridge.whatToken();
      expect(whatTokenAddress.toLowerCase()).to.equal(ethWormWhatToken.address.toLowerCase());
    });
  });

  describe("Test What Token Bridge Interface", () => {
    const guardians = new MockGuardians(AVAX_WORMHOLE_GUARDIAN_SET_INDEX, [
      GUARDIAN_PRIVATE_KEY,
    ]);

    let localVariables: any = {};

    it("Should Send Transfer Message From AVAX", async () => {
      localVariables.amount = 1000;
      localVariables.recipientAddress = ethWallet.address;

      {
        const receipt = await avaxWormWhatToken
          .approve(avaxWhatTokenBridge.address, localVariables.amount)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
      }

      console.log('"0x" + tryNativeToHexString(ethWallet.address, CHAIN_ID_AVAX; ', "0x" + tryNativeToHexString(ethWallet.address, CHAIN_ID_AVAX));
      const receipt = await avaxWhatTokenBridge
        .lockAndSend("0x" + tryNativeToHexString(ethWallet.address, CHAIN_ID_AVAX)
        , localVariables.amount)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      const unsignedMessages = await formatWormholeMessageFromReceipt(
        receipt!,
        CHAIN_ID_AVAX
      );
      expect(unsignedMessages.length).to.equal(1);

      localVariables.signedTransferMessage = guardians.addSignatures(
        unsignedMessages[0],
        [0]
      );
    });

    it("Should Receive Transfer Message on ETH", async () => {

      const amount = 1_000_000;
      //transfer token to bridge
      {
        const receipt = await ethWormWhatToken
          .transfer(ethWhatTokenBridge.address, amount)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
      }

      const receipt = await ethWhatTokenBridge
        .redeemAndUnlock(localVariables.signedTransferMessage)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      //parse the verified message by calling the wormhole core endpoint `parseVM`.
      const parsedVerifiedMessage = await ethWormhole.parseVM(
        localVariables.signedTransferMessage
      );

      const storedMessage = await ethWhatTokenBridge.getReceivedMessage(
        parsedVerifiedMessage.hash
      );
      expect(storedMessage.recipient).to.equal(localVariables.recipientAddress);
      expect(storedMessage.amount.toNumber()).to.equal(localVariables.amount);

      // confirm that the contract marked the message as "consumed"
      const isMessageConsumed = await ethWhatTokenBridge.isMessageConsumed(
        parsedVerifiedMessage.hash
      );
      expect(isMessageConsumed).to.be.true;

      // clear localVariables
      localVariables = {};
    });
  });
});
