import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { WhatTokenBridge } from "../ts/sdk/what_transfer_token_bridge";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"));

const wallet = Keypair.fromSecretKey(
  bs58.decode(
    "2zg1pgBoRM818yagpCxgmu7pZSJ4HGEKzZwZfHDtqmBEczZwVu5dQzneDnvjyJbLbMM7qcihz9KsvYgcgBJbyva2"
  )
);
async function lockAndSend() {
  const amount = 10 * 10 ** 6;

  const SOLANA_WORMHOLE_BRIGDE = new PublicKey(
    "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
  );

  const whatTokenMint = new PublicKey(
    "JPtZKEUm2QjzpnSSgwAPkZCw9tuyiQyFP5678QoDjGD"
  );

  const whatTokenBridgeProgram = new WhatTokenBridge(
    connection,
    whatTokenMint,
    SOLANA_WORMHOLE_BRIGDE
  );

  const recipient = "0x18d47411Cc717d3822c757F63528ccE250C7ad32";
  const emitterAddress = whatTokenBridgeProgram.configPDA;
  console.log("emmiterAddress: ", emitterAddress.toString());
  const tx = await whatTokenBridgeProgram.lockAndSend(
    wallet.publicKey,
    amount,
    recipient
  );

  await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    whatTokenMint,
    emitterAddress,
    true,
    "confirmed",
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const txHash = await sendAndConfirmTransaction(connection, tx, [wallet]);

  console.log(
    `Initialize what token brigde at tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet`
  );
}

lockAndSend();
