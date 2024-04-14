import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  signature,
  setSignature,
}) {
  async function onChange(evt) {
    const pKey = evt.target.value;
    setAddress();
    setSignature();
    setPrivateKey(pKey);
    if (pKey.trim().length > 0) {
      address = toHex(secp256k1.getPublicKey(pKey));
      const message = toHex(new Uint8Array(""));
      // create signature that will be sent with address to the server
      signature = secp256k1.sign(message, pKey).toCompactHex();
      setAddress(address);
      setSignature(signature);
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type in your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      {address && <div>Address: {address.slice(0, 12)}...</div>}
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
