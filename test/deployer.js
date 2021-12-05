let fs = require("fs");
let Web3 = require("web3");

let web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

PRIVATE_KEY = "f999d0d8cddc71da85a95405820dfdf585b65a6b7b6930c8619b54fc182c9fc1";


async function send(transaction) {
    acc = await web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    let gas = await transaction.estimateGas({from: acc.address });;
    let options = {
        data: transaction.encodeABI(),
        gas : gas
    };
    let signedTransaction = await web3.eth.accounts.signTransaction(options, PRIVATE_KEY);
    return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}

async function deploy() {
    // solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
let contracts = JSON.parse(fs.readFileSync("./source.json",'utf-8'));
console.log(Object.keys(contracts));
// ABI description as JSON structure
let abi = contracts['NFT.sol']['TestT'].abi;
// Smart contract EVM bytecode as hex
let bin = contracts['NFT.sol']['TestT'].evm.bytecode.object;  
//console.log(bin);
let contract = new web3.eth.Contract(abi);
let handle = await send(contract.deploy({data: "0x" + bin}));
console.log(`contract deployed at address ${handle.contractAddress}`);
return new web3.eth.Contract(abi, handle.contractAddress);
}



deploy();