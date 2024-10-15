
import * as anchor from '@coral-xyz/anchor';
import { Provider } from '@coral-xyz/anchor';

import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, Connection } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMintLen,
} from '@solana/spl-token';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';


const ownerPubkey = new PublicKey("2f2D9o7tedW7J2Cn3c2ruh9rkcNdo3NUxw8rewxerszu");
const ownerPrivatekey = bs58.decode("3QDEv53wkJkQJEVCdazzjzZxcHvFrv6JmiF2WBMUPXErGKkk92AGWUsJufLVcjjwZu1qBGbpscGc8tg7N1bTtpVs");

export const owner = new Keypair({
  publicKey: ownerPubkey.toBytes(),
  secretKey: ownerPrivatekey,
});

const rpcDevnet = 'https://api.devnet.solana.com';
const connection = new Connection(rpcDevnet, 'confirmed');

export async function createTransferFeeConfigToken( decimals: number): Promise<PublicKey> {
  // const mint = new Keypair();

  // const extensions = [ExtensionType.TransferFeeConfig];
  // const mintLen = getMintLen(extensions);
  // const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  // const transaction = new Transaction().add(
  //   SystemProgram.createAccount({
  //     fromPubkey: owner.publicKey,
  //     newAccountPubkey: mint.publicKey,
  //     space: mintLen,
  //     lamports: lamports,
  //     programId: TOKEN_2022_PROGRAM_ID,
  //   }),
  //   createInitializeTransferFeeConfigInstruction(
  //     mint.publicKey,
  //     owner.publicKey,
  //     owner.publicKey,
  //     0,
  //     BigInt(0),
  //     TOKEN_2022_PROGRAM_ID,
  //   ),
  //   createInitializeMintInstruction(mint.publicKey, decimals, owner.publicKey, null, TOKEN_2022_PROGRAM_ID),
  // );

  // await sendAndConfirmTransaction(connection, transaction, [owner, mint], { skipPreflight: true, commitment: 'confirmed' });

  const whatMint = new PublicKey('F5UJ4t3i4mKSf4qUQ1jc4s3AERrTepJKW4BcNGNyyr8q');
  const configPDA = new PublicKey('EPPcTkLbqGcKXJQqmaqmwX7QxPvcKYGwu2yKmjMZ7mcU');


  //await mintTransferTokenFeeConfigTo(configPDA, whatMint, 1_000_000 * 10 ** decimals);
  await mintTransferTokenFeeConfigTo(configPDA, whatMint, 1_000_000 * 10 ** decimals);


  console.log('mint.publicKey: ',whatMint);
  return whatMint;
}

export async function mintTransferTokenFeeConfigTo( recipient: PublicKey, mint: PublicKey, amount: number): Promise<String> {
  const destinationTokenAccount = getAssociatedTokenAddressSync(
    mint,
    recipient,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      owner.publicKey,
      destinationTokenAccount,
      recipient,
      mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
    createMintToInstruction(mint, destinationTokenAccount, owner.publicKey, amount, [], TOKEN_2022_PROGRAM_ID),
  );

  const txSig = await sendAndConfirmTransaction(connection, transaction, [owner], { skipPreflight: true });

  return txSig
}

createTransferFeeConfigToken(9)