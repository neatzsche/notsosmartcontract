var express = require('express');
var router = express.Router();
var Web3 = require('web3')

let deployABI = [
	{
		"inputs": [],
		"name": "deployRecycleContract",
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
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
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
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
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
    const deployContract = new web3.eth.Contract(deployABI, "0xfe262b2a6393a9638fa25c4f2B468dB1be9be40D")
    const playerContractAddress = await deployContract.methods.userToContract(account).call()
    const playerContract = new web3.eth.Contract(targetABI, playerContractAddress)
    const owner = await playerContract.methods.owner().call()
    const validSignature = web3.eth.accounts.recover('recycle', signature)
    console.log(validSignature)
    console.log(account)
    if (account == validSignature) {
      if (account == owner) {
        res.send('flag{Upd@te-St@t3-b4-C@Ll1nG-0ut$1D3-c0NtR@ctz}');
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