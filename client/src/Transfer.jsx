import { useState } from "react";
import server from "./server";
import {toHex} from "ethereum-cryptography/utils";


function Transfer({ address, setBalance, signature }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        // send address, signature, recipient address and amount to the server
        sender: address,
        signature,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
      setSendAmount("");
      setRecipient("");
    } catch (error) {
      if(error.response){      
        alert(error.response.data.message);
      }else{
        alert(error);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
