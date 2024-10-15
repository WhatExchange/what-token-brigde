import {
  Connection,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  PublicKey,
  Signer,
} from "@solana/web3.js";
import { WhatTokenBridge } from "../ts/sdk/what_transfer_token_bridge";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { CHAINS, parseVaa } from "@certusone/wormhole-sdk";
import {
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
  transfer,
} from "@solana/spl-token";
import { postSignedMsgAsVaaOnSolana } from "../ts/tests/helpers/helper";
import { BN } from "@coral-xyz/anchor";

const ownerPubkey = new PublicKey(
  "2f2D9o7tedW7J2Cn3c2ruh9rkcNdo3NUxw8rewxerszu"
);
const ownerPrivatekey = bs58.decode(
  "3QDEv53wkJkQJEVCdazzjzZxcHvFrv6JmiF2WBMUPXErGKkk92AGWUsJufLVcjjwZu1qBGbpscGc8tg7N1bTtpVs"
);

export const owner = new Keypair({
  publicKey: ownerPubkey.toBytes(),
  secretKey: ownerPrivatekey,
});
const foreignEmitterAddress = Buffer.from(
  "0x5d25c83e49075fe87cab5deb966e999719358629",
  "utf-8"
);
const whatMint = new PublicKey("F5UJ4t3i4mKSf4qUQ1jc4s3AERrTepJKW4BcNGNyyr8q");
const wormholeId = new PublicKey(
  "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
);

async function main() {
  const rpcUrl = "https://api.devnet.solana.com";
  //const rpcUrl = 'https://jupiter.rpcpool.com/cf7fb662-7e8b-44b5-90d7-4efb862e0d5e';
  const connection = new Connection(rpcUrl, "confirmed");

  const whatTokenBrigde = new WhatTokenBridge(connection, whatMint, wormholeId);

  //initialize
  // const initTx = await whatTokenBrigde.initialize(owner.publicKey, 0, whatMint);
  // await sendAndConfirmTransaction(connection, initTx, [owner]);

  // const registerEmitterTx = await whatTokenBrigde.registerEmitter(owner.publicKey, CHAINS.sepolia, foreignEmitterAddress);
  // await sendAndConfirmTransaction(connection, registerEmitterTx, [owner]);

  // //const vaa = 'AQAAAAABAMpFmPqz7lWshS5yH712TMQJyzFNzlZQXWLdeGwlxudNI/4P19GyAnTXh14kIHJ9xS9++iqum0k/OQkVKw6fq1kAZvwnVAAAAAAnEgAAAAAAAAAAAAAAAF0lyD5JB1/ofKtd65ZumZcZNYYpAAAAAAAAAAIBAWVYuIL34Qcngg4FWB+fhlgcMDBcwJPjpGZxmeKLNB39AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+g=';
  // const vaa = 'AQAAAAABAEES9bqWjWcVTby389wTcXhDHPwezYDLj4VoP1dSAJHbaaaf57aszlpEhWuKjMmY21w57xL/6+/psbFQmBS8rpkBZv1zNAAAAAAnEgAAAAAAAAAAAAAAAF0lyD5JB1/ofKtd65ZumZcZNYYpAAAAAAAAAAMBAWVYuIL34Qcngg4FWB+fhlgcMDBcwJPjpGZxmeKLNB39AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+g=';

  // //send token to treasury
  const vaa =
    "AQAAAAABAJjVtkzJRzERfSOt/WlsdigOOwvwY4YGoxAcTlukNjTiFpL6WmWhPN5uj13nq5BFHzGI933Fm10Y+7E5cDvibPEBZv9ySAAAAAAnEgAAAAAAAAAAAAAAAF0lyD5JB1/ofKtd65ZumZcZNYYpAAAAAAAAAAQBAWVYuIL34Qcngg4FWB+fhlgcMDBcwJPjpGZxmeKLNB39AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+g=";
  // await postSignedMsgAsVaaOnSolana(connection, Buffer.from(vaa, 'base64'), owner);

  const configPDA = whatTokenBrigde.configPDA;
  console.log("configPDA: ", configPDA);
  const sendAndLockTx = await whatTokenBrigde.lockAndSend(
    owner.publicKey,
    1000,
    "0x71a988Be0D0d09bF11018A7FfDB76Cc7a974eB0F"
  );

  const tx = await sendAndConfirmTransaction(connection, sendAndLockTx, [owner,]);
  console.log("Send token at tx: ", tx);
  // const redeemTx = await whatTokenBrigde.redeemWhat(owner.publicKey, Buffer.from(vaa, 'base64'));
  // await sendAndConfirmTransaction(connection,redeemTx, [owner] );
}

export async function sendToken2022To(
  connection: Connection,
  tokenMint: PublicKey,
  owner: Signer,
  from: PublicKey,
  to: PublicKey,
  amount: number
): Promise<String> {
  const sourceTokenAccount = getAssociatedTokenAddressSync(
    tokenMint,
    from,
    true,
    TOKEN_2022_PROGRAM_ID
  );

  const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    owner,
    tokenMint,
    to,
    true,
    "confirmed",
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const mintInfo = await getMint(
    connection,
    tokenMint,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );

  const tx = await transfer(
    connection,
    owner,
    sourceTokenAccount,
    destinationTokenAccount.address,
    owner,
    amount * 10 ** mintInfo.decimals,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  return tx;
}
main();
