import { Keypair, Connection, Signer, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CORE_BRIDGE_PID, MOCK_GUARDIANS } from "./consts";
import { NodeWallet, postVaaSolana } from "@certusone/wormhole-sdk/lib/cjs/solana";
import * as mock from "@certusone/wormhole-sdk/lib/cjs/mock";
import { BN } from "@coral-xyz/anchor";

export async function createUserWithLamports(
  connection: Connection,
  lamports: number,
): Promise<Signer> {
  const account = Keypair.generate();
  const signature = await connection.requestAirdrop(
    account.publicKey,
    lamports * LAMPORTS_PER_SOL
  );
  const block = await connection.getLatestBlockhash();
  await connection.confirmTransaction({ ...block, signature });
  return account;
}

export function publishAndSign(recipient: PublicKey, amount: bigint, emitter: mock.MockEmitter) {
  const buf = Buffer.alloc(41);
  buf.writeUInt8(1, 0);//REDEEM PAYLOAD
  recipient.toBuffer().copy(buf, 1);
  buf.writeBigInt64BE(amount, 33);
  const finality = 1;
  const batchId = 0;

  return guardianSign(emitter.publishMessage(batchId, buf, finality));
}

export function guardianSign(message: Buffer) {
  return MOCK_GUARDIANS.addSignatures(message, [0])

}

export async function postSignedMsgAsVaaOnSolana(
  connection: Connection,
  signedMsg: Buffer,
  payer: Signer
): Promise<void> {
  const wallet = NodeWallet.fromSecretKey(payer.secretKey);

  const tx = await postVaaSolana(
    connection,
    wallet.signTransaction,
    CORE_BRIDGE_PID,
    wallet.key(),
    signedMsg
  );
}

