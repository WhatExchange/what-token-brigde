import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import * as anchor from "@coral-xyz/anchor";
import * as mock from "@certusone/wormhole-sdk/lib/cjs/mock";

chaiUse(chaiAsPromised);
import {
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
} from "@solana/web3.js";
import { WhatTokenBridge } from "../sdk/what_transfer_token_bridge";
import { LOCALHOST, PAYER_KEYPAIR, CORE_BRIDGE_PID } from "./helpers";
import {
  createTransferFeeConfigToken,
  mintTransferHookTokenTo,
} from "./helpers/create_token";
import {
  createUserWithLamports,
  postSignedMsgAsVaaOnSolana,
  publishAndSign,
} from "./helpers/helper";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { CHAINS } from "@certusone/wormhole-sdk";
import { BN } from "@coral-xyz/anchor";

describe("What token bridge", function () {
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as anchor.Wallet;

  let whatTokenBridgeProgram: WhatTokenBridge;
  let whatMint: PublicKey;

  let newOwnerCandidate: Signer;
  let user: Signer;
  let recipient: Signer;

  const realForeignEmitterChain = CHAINS.ethereum;
  const realForeignEmitterAddress = Buffer.alloc(32, "deadbeef", "hex");

  const connection = new Connection(LOCALHOST, "processed");

  const whatMintDecimals = 6;

  async function instantiate() {
    const whatMint = await createTransferFeeConfigToken(
      connection,
      wallet.payer,
      whatMintDecimals
    );

    const program = new WhatTokenBridge(connection, whatMint, CORE_BRIDGE_PID);

    [newOwnerCandidate, user, recipient] = await Promise.all([
      createUserWithLamports(connection, 10),
      createUserWithLamports(connection, 10),
      createUserWithLamports(connection, 10),
    ]);

    return { program, whatMint };
  }

  it("should initialize", async function () {
    const result = await instantiate();
    whatTokenBridgeProgram = result.program;
    whatMint = result.whatMint;
    const fee = 100; //0.1 %

    const tx = await whatTokenBridgeProgram.initialize(
      wallet.publicKey,
      fee,
      whatMint
    );
    await sendAndConfirmTransaction(connection, tx, [wallet.payer]);

    const config = await whatTokenBridgeProgram.getConfigData();
    expect(config.owner.toString()).to.equal(wallet.publicKey.toString());
    expect(config.fee.toString()).to.equal(fee.toString());
    expect(config.whatMint.toString()).to.equal(whatMint.toString());
  });

  it("throw error if not owner", async function () {
    const newFee = 200; //0.1 %

    try {
      const updateConfigTx = await whatTokenBridgeProgram.updateConfig(
        user.publicKey,
        new BN(newFee),
        null
      );
      await sendAndConfirmTransaction(connection, updateConfigTx, [user]);
    } catch (_err: any) {
      const msg =
        "Program log: AnchorError caused by account: config_account. Error Code: Unauthorized. Error Number: 6000. Error Message: Unauthorized.";
      expect(_err.transactionLogs[2]).to.equal(msg);
    }
  });

  it("should update config", async function () {
    const newFee = 200; //0.1 %

    const updateConfigTx = await whatTokenBridgeProgram.updateConfig(
      wallet.publicKey,
      new BN(newFee),
      null
    );
    await sendAndConfirmTransaction(connection, updateConfigTx, [wallet.payer]);

    const config = await whatTokenBridgeProgram.getConfigData();
    expect(config.fee.toString()).to.equal(newFee.toString());
  });

  it("should register foreign chain and address", async function () {
    const registerChainTx = await whatTokenBridgeProgram.registerEmitter(
      wallet.payer.publicKey,
      realForeignEmitterChain,
      realForeignEmitterAddress
    );
    await sendAndConfirmTransaction(connection, registerChainTx, [
      wallet.payer,
    ]);
    const emitterData = await whatTokenBridgeProgram.getForeignEmitterData(
      realForeignEmitterChain
    );
    expect(emitterData.chain).to.equal(realForeignEmitterChain);
    expect(emitterData.address.toString()).to.equal(
      realForeignEmitterAddress.toString()
    );
  });

  it("should send what token through bridge from user", async function () {
    //Send token to user
    const mintAmount = 1000 * 10 ** whatMintDecimals;
    await mintTransferHookTokenTo(
      connection,
      wallet.payer,
      user.publicKey,
      whatMint,
      mintAmount
    );
    await mintTransferHookTokenTo(
      connection,
      wallet.payer,
      recipient.publicKey,
      whatMint,
      mintAmount
    );
    await mintTransferHookTokenTo(
      connection,
      wallet.payer,
      whatTokenBridgeProgram.configPDA,
      whatMint,
      1_000_000 * 10 ** whatMintDecimals
    );

    const recipientAddress = "0x" + "00123456".repeat(5);

    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      whatMint,
      user.publicKey,
      true,
      "confirmed",
      {},
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_PROGRAM_ID
    );

    const sendAmount = 100 * 10 ** whatMintDecimals;

    const tx = await whatTokenBridgeProgram.lockAndSend(
      user.publicKey,
      sendAmount,
      recipientAddress
    );
    await sendAndConfirmTransaction(connection, tx, [user]);
  });

  it("should send what token again", async function () {
    const recipientAddress = "0x" + "00123456".repeat(5);

    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      whatMint,
      user.publicKey,
      true,
      "confirmed",
      {},
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_PROGRAM_ID
    );

    const sendAmount = 100 * 10 ** whatMintDecimals;

    const tx = await whatTokenBridgeProgram.lockAndSend(
      user.publicKey,
      sendAmount,
      recipientAddress
    );
    await sendAndConfirmTransaction(connection, tx, [user]);
  });

  it("should update config with enabled whitelist = true", async function () {
    const updateConfigTx = await whatTokenBridgeProgram.updateConfig(
      wallet.publicKey,
      null,
      true
    );
    await sendAndConfirmTransaction(connection, updateConfigTx, [wallet.payer]);

    const config = await whatTokenBridgeProgram.getConfigData();
    expect(config.whitelistEnabled).to.equal(true);
  });

  it("should redeem what token with valid vaa", async function () {
    const realEmitter = new mock.MockEmitter(
      realForeignEmitterAddress.toString("hex"),
      realForeignEmitterChain
    );

    const redeemAmount = 1000 * 10 ** whatMintDecimals;

    const signedMsg = publishAndSign(
      recipient.publicKey,
      BigInt(redeemAmount),
      realEmitter
    );

    await postSignedMsgAsVaaOnSolana(connection, signedMsg, PAYER_KEYPAIR);

    const redeemTx = await whatTokenBridgeProgram.redeemWhat(
      recipient.publicKey,
      signedMsg
    );

    await sendAndConfirmTransaction(connection, redeemTx, [recipient]);
  });

  it("should transfer ownership", async function () {
    const transferOwnershipTx = await whatTokenBridgeProgram.transferOwnership(
      wallet.publicKey,
      newOwnerCandidate.publicKey
    );
    await sendAndConfirmTransaction(connection, transferOwnershipTx, [
      wallet.payer,
    ]);

    const config = await whatTokenBridgeProgram.getConfigData();
    expect(config.ownerCandidate.toString()).to.equal(
      newOwnerCandidate.publicKey.toString()
    );
  });

  it("should confirm ownership transfer", async function () {
    const confirmOwnershipTranfer =
      await whatTokenBridgeProgram.confirmOwnershipTransfer(
        newOwnerCandidate.publicKey
      );
    await sendAndConfirmTransaction(connection, confirmOwnershipTranfer, [
      newOwnerCandidate,
    ]);

    const config = await whatTokenBridgeProgram.getConfigData();
    expect(config.owner.toString()).to.equal(
      newOwnerCandidate.publicKey.toString()
    );
  });
});
