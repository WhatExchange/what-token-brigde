import bs58 from "bs58";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { mintTransferHookTokenTo } from "./utils";

const connection = new Connection(clusterApiUrl("devnet"));

const wallet = Keypair.fromSecretKey(
  bs58.decode(
    "2zg1pgBoRM818yagpCxgmu7pZSJ4HGEKzZwZfHDtqmBEczZwVu5dQzneDnvjyJbLbMM7qcihz9KsvYgcgBJbyva2"
  )
);
async function mintToken(): Promise<String> {
  const amount = 10_000_000 * 10 ** 6;
  const whatTokenMint = new PublicKey(
    "JPtZKEUm2QjzpnSSgwAPkZCw9tuyiQyFP5678QoDjGD"
  );
  const txHash = await mintTransferHookTokenTo(
    connection,
    wallet,
    wallet.publicKey,
    whatTokenMint,
    amount
  );

  console.log(
    `Mint ${amount} what token at tx: https://explorer.solana.com/tx/${txHash}?cluster=devnet`
  );
  return txHash;
}

mintToken();
