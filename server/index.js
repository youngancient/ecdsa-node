const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "02faa665a7f22066e6e2b235d6d59bce92a3c6022359dab302f673e43b3b8bbf1b": 100,
  "037d0cdfa9d198c3738ca127c890a279f45887ca9fd41369e81017720b4c52d1a4": 50,
  "02e70b5de288f4bcefdaef734ba6671852f10c9187f97523eea6a6538f0f81d906": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, signature, recipient, amount } = req.body;
  // get signature from client side application
  const message = toHex(new Uint8Array(""));
  // verify if the sender public address was signed using the hidden private key connected to it
  const isSigned = secp256k1.verify(signature, message, sender);
  // once the address is verified, then we are sure that this transaction was signed and approved by the owner of the private key
  if (isSigned) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Invalid transaction" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
