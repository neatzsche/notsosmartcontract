var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var axios = require('axios');


const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

/* GET home page. */
router.get('/', async (req, res, next) => {
	try {
		if (req.query.contract && req.query.id) {
			const networkUrl = (req.query.network == "ropsten") ? "https://ropsten.infura.io/v3/90574c16dbde4fb8ae00e4535fb5d765" : "https://mainnet.infura.io/v3/90574c16dbde4fb8ae00e4535fb5d765"
			const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl))
			const contractAddress = req.query.contract;
			const id = req.query.id;
			const contract = new web3.eth.Contract(contractABI, contractAddress);
			const tokenURI = await contract.methods.tokenURI(id).call();
			const metaData = await axios.get(tokenURI);
			var sendResponse = "<html><head></head><body>";
			for (const property in metaData.data){
				sendResponse += `<b>${property}:</b> ${JSON.stringify(metaData.data[property])}<br/>`
			}
			if (metaData.data.image) {
				sendResponse += `<img src="${metaData.data.image}">`;
			}
			sendResponse += "</body></html>";
			res.send(sendResponse);
		}
		else {
			res.send('Please set query parameters contract and id to select nft, network defaults to mainnet but can be set to ropsten w/ network=ropsten. Currently does not support ipfs');
		}
	}
	catch {
		res.send('bad');
	}
});

module.exports = router;
