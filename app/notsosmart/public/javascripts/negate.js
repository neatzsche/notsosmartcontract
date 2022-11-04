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
    if (getCookie("contractAddressN")) {
        contractAddress = getCookie("contractAddressN");
        document.getElementById("contractAddress").innerText = contractAddress;
    }
    if (getCookie("ownerN")) {
        let owner = getCookie("ownerN");
        document.getElementById("owner").innerText = owner;
    }
    if (getCookie("tokensN")) {
        tokens = getCookie("tokensN");
        document.getElementById("tokens").innerText = tokens;
    }

}


async function deployNegate() {
    window.contract = await new window.web3.eth.Contract(deployABI, "0xB524122f416345C030A8B7b612A28A4c79c04240");
    const account = await getCurrentAccount();

    await window.contract.methods.deployTakeover().send({ from: account });
    contractAddress = await window.contract.methods.userToContract(account).call()
    document.cookie = `contractAddressN=${contractAddress}`
    document.getElementById("contractAddress").innerText = contractAddress;
 

    window.contract = await new window.web3.eth.Contract(targetABI, contractAddress);
    
    let owner = await window.contract.methods.owner().call();
    document.getElementById("owner").innerText = owner;
    document.cookie = `ownerN=${owner}`

    tokens = await window.contract.methods.shares(account).call();
    document.cookie = `tokensN=${tokens}`;
    document.getElementById("tokens").innerText = tokens;

}

async function sendToken() {
    if (contractAddress == ".") {

    }
    else {
        let amount = document.getElementById("amount").value;
        let sendTo = document.getElementById("sendTo").value;

        if (parseInt(amount) >= tokens) {
            alert("Not enough tokens :^)")
        } else {
            window.contract = await new window.web3.eth.Contract(targetABI, contractAddress);
            const account = await getCurrentAccount();
            await window.contract.methods.transfer(sendTo, amount).send({ from: account });
            let owner = await window.contract.methods.owner().call();
            document.getElementById("owner").innerText = owner;
            document.cookie = `ownerN=${owner}`
            tokens = await window.contract.methods.shares(account).call();
            document.cookie = `tokensN=${tokens}`;
            document.getElementById("tokens").innerText = tokens;
        }
    }
}

async function checkContract() {
    let message = "negate";
    const account = await getCurrentAccount();
    const signature = await web3.eth.personal.sign(message, account);
    $.ajax({
        url: '/checknegate',
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

let tokens;
let contractAddress = ".";
init();
