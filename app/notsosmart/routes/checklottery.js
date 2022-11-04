var express = require('express');
var router = express.Router();
var Web3 = require('web3')

let deployABI = [
  {
    "inputs": [],
    "name": "deployLottery",
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
        "internalType": "uint256",
        "name": "_guess",
        "type": "uint256"
      }
    ],
    "name": "checkNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
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
  }
]

/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/90574c16dbde4fb8ae00e4535fb5d765"))
    const signature = req.body.signature;
    const account = req.body.account;
    const deployContract = new web3.eth.Contract(deployABI, "0x263882904B191B746f01496fB1D6436B66551073")
    const playerContractAddress = await deployContract.methods.userToContract(account).call()
    const playerContract = new web3.eth.Contract(targetABI, playerContractAddress)
    const owner = await playerContract.methods.owner().call()
    const validSignature = web3.eth.accounts.recover('lottery', signature)
    console.log(validSignature)
    console.log(account)
    if (account == validSignature) {
      if (account == owner) {
        res.send('flag{bl0cks-r-N0t-r@ndumb-baby}');
      } else {
        res.send('not owner of contract');
      }
    } else {
      res.send('invalid signature')
    }
  } catch {
    res.send('malformed request or no contract');
  }
});

module.exports = router;