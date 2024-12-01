import { updateRelayerFee } from "./update_relayer_fee";

const RPC_URL = "https://sepolia.drpc.org";
const WHAT_TOKEN_BRIDGE_ADDRESS = "0xD9dA3CFf588da538a16aF9b17D9cEa0155DD9675";
const PRIVATE_KEY = "60fcfb2b974c8983a81f87abce14f8283c766aa7252a9d890054fe4babdc1d5a";
const NEW_RELAYER_FEE = 2000;

updateRelayerFee(
  RPC_URL,
  WHAT_TOKEN_BRIDGE_ADDRESS,
  PRIVATE_KEY,
  NEW_RELAYER_FEE
);
