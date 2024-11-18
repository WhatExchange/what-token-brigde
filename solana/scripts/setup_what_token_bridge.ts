import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { WhatTokenBridge } from "../ts/sdk/what_transfer_token_bridge";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const fee = 100; //0.1 %

  const wallet = Keypair.fromSecretKey(
    bs58.decode(
      "2zg1pgBoRM818yagpCxgmu7pZSJ4HGEKzZwZfHDtqmBEczZwVu5dQzneDnvjyJbLbMM7qcihz9KsvYgcgBJbyva2"
    )
  );
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

  const tx = await whatTokenBridgeProgram.initialize(
    wallet.publicKey,
    fee,
    whatTokenMint
  );
  const txHash = await sendAndConfirmTransaction(connection, tx, [wallet]);

  console.log(
    `Initialize what token brigde at tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet`
  );
}

main();
