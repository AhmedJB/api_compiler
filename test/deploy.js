// Copyright 2017 https://tokenmarket.net - MIT licensed
//
// Run with Node 7.x as:
//
// node --harmony-async-await  deploy.js
//

let fs = require("fs");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
try {
    acc = web3.personal.unlockAccount(web3.eth.coinbase, password);
  } catch(e) {
    console.log(e);
    return;
  }

console.log(acc.address)

let private = "f999d0d8cddc71da85a95405820dfdf585b65a6b7b6930c8619b54fc182c9fc1";

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
let source = fs.readFileSync("source.json");
let contracts = JSON.parse(source)["contracts"];

// ABI description as JSON structure
let abi = contracts['NFT.sol']['TestT'].abi;

// Smart contract EVM bytecode as hex
let code = '0x' + contracts['NFT.sol']['TestT'].evm.bytecode;

// Create Contract proxy class
let SampleContract = acc.eth.contract(abi);

// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account");
var password = "";



console.log("Deploying the contract");
let contract = SampleContract.new({from: acc.address, gas: 10000000, data: code});

// Transaction has entered to geth memory pool
console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
  while (true) {
    let receipt = acc.eth.getTransactionReceipt(contract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

waitBlock();