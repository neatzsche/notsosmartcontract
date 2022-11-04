var express = require('express');
var router = express.Router();
var Web3 = require('web3')

let deployABI = [
  {
    "inputs": [],
    "name": "deployTakeover",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userToContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

let targetABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getShares",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "player",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "shares",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "_value",
        "type": "uint32"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]



/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/90574c16dbde4fb8ae00e4535fb5d765"))
    const signature = req.body.signature;
    const account = req.body.account;
    const deployContract = new web3.eth.Contract(deployABI, "0xB524122f416345C030A8B7b612A28A4c79c04240")
    const playerContractAddress = await deployContract.methods.userToContract(account).call()
    const playerContract = new web3.eth.Contract(targetABI, playerContractAddress)
    const owner = await playerContract.methods.owner().call()
    const validSignature = web3.eth.accounts.recover('negate', signature)
    console.log(validSignature)
    console.log(account)
    if (account == validSignature) {
      if (account == owner) {
        res.send('flag{1nt3g3Rz-0v3rfl0w-0N-eVM}');
      } else {
        res.send('not owner of contract');
      }
    } else {
      res.send('invalid signature')
    }
  }
  catch {
    res.send("malformed request or no contract");
  }

});

module.exports = router;