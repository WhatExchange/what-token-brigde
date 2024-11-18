import {
  createTransferFeeConfigToken,
  mintTransferHookTokenTo,
} from "../ts/tests/helpers/create_token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

async function main() {
  const decimals = 6;
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.fromSecretKey(
    bs58.decode(
      "2zg1pgBoRM818yagpCxgmu7pZSJ4HGEKzZwZfHDtqmBEczZwVu5dQzneDnvjyJbLbMM7qcihz9KsvYgcgBJbyva2"
    )
  );

  const whatTokenMint = await createTransferFeeConfigToken(
    connection,
    wallet,
    decimals
  );

  console.log(
    `Deploy what token at address: https://explorer.solana.com/address/${whatTokenMint}?cluster=devnet`
  );

  const amount = 1_000_000 * 10 ** decimals;
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
}

main();
