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



function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

async function init() {
    await loadWeb3();
    if (getCookie("contractAddressR")) {
        contractAddress = getCookie("contractAddressR");
        document.getElementById("contractAddress").innerText = contractAddress;
    }
    if (getCookie("ownerR")) {
        let owner = getCookie("ownerR");
        document.getElementById("owner").innerText = owner;
    }
    if (getCookie("balanceR")) {
        let balance = getCookie("balanceR");
        document.getElementById("balance").innerText = balance;
    }

}


async function deployRecycle() {
    window.contract = await new window.web3.eth.Contract(deployABI, "0xfe262b2a6393a9638fa25c4f2B468dB1be9be40D");
    const account = await getCurrentAccount();
    var amount = 0.005
    var wei = web3.utils.toWei(amount.toString(), 'ether')
    await window.contract.methods.deployRecycleContract().send({ from: account, value: wei });
    contractAddress = await window.contract.methods.userToContract(account).call()
    document.cookie = `contractAddressR=${contractAddress}`
    document.getElementById("contractAddress").innerText = contractAddress;


    window.contract = await new window.web3.eth.Contract(targetABI, contractAddress);

    let owner = await window.contract.methods.owner().call();
    document.getElementById("owner").innerText = owner;
    document.cookie = `ownerR=${owner}`

    let balance = await web3.eth.getBalance(contractAddress);
    document.getElementById("balance").innerText = balance;
    document.cookie = `balanceR=${balance}`

}

async function checkBalance() {
    if (contractAddress == ".") {

    }
    else {

        window.contract = await new window.web3.eth.Contract(targetABI, contractAddress);
        const account = await getCurrentAccount();
        let owner = await window.contract.methods.owner().call();
        document.getElementById("owner").innerText = owner;
        document.cookie = `ownerR=${owner}`

        let balance = await web3.eth.getBalance(contractAddress);
        document.getElementById("balance").innerText = balance;
        document.cookie = `balanceR=${balance}`

    }
}

async function checkContract() {
    let message = "recycle";
    const account = await getCurrentAccount();
    const signature = await web3.eth.personal.sign(message, account);
    $.ajax({
        url: '/checkrecycle',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            account: account,
            signature: signature
        }),
        //dataType: 'json',
        success: function (response) {
            document.getElementById("flag").innerText = response;
        }
    });
}

let contractAddress = ".";
init();
