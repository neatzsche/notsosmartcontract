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
    if (getCookie("contractAddress")) {
        contractAddress = getCookie("contractAddress");
        document.getElementById("contractAddress").innerText = contractAddress;
    }
    if(getCookie("owner")){
        let owner = getCookie("owner");
        document.getElementById("owner").innerText = owner;
    }

}


async function deployLottery() {
    window.contract = await new window.web3.eth.Contract(deployABI, "0x263882904B191B746f01496fB1D6436B66551073");
    const account = await getCurrentAccount();

    await window.contract.methods.deployLottery().send({ from: account });
    contractAddress = await window.contract.methods.userToContract(account).call()
    document.cookie = `contractAddress=${contractAddress}`
    document.getElementById("contractAddress").innerText = contractAddress;
    
    window.contract = await new window.web3.eth.Contract(targetABI, contractAddress);
    
    let owner = await window.contract.methods.owner().call();
    document.getElementById("owner").innerText = owner;
    document.cookie = `ownerN=${owner}`

}

async function sendGuess() {
    if (contractAddress == ".") {

    }
    else {
        let number = document.getElementById("guess").value
        window.contract = await new window.web3.eth.Contract(targetABI, contractAddress);
        const account = await getCurrentAccount();
        await window.contract.methods.checkNumber(number).send({ from: account });
        let owner = await window.contract.methods.owner().call();
        document.getElementById("owner").innerText=owner;
        document.cookie = `owner=${owner}`
    }
}

async function checkContract(){
    let message = "lottery";
    const account = await getCurrentAccount();
    const signature = await web3.eth.personal.sign(message, account);
    $.ajax({
        url: '/checklottery',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
           account: account,
           signature: signature
        }),
        //dataType: 'json',
        success: function(response){
            document.getElementById("flag").innerText = response;
        }
    });
}

let contractAddress = ".";
init();
