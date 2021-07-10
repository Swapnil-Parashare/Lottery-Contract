const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol');             // It returns absolute path for our "Inbox.sol"

const source = fs.readFileSync(lotteryPath,'utf-8');                             // Here we are reading our file content in an "Asynchronous" Manner. Now the "source" variable contains all our solidity code.

// console.log(solc.compile(source,1));                                           // Here we are compiling our "Solidity" Smart Contract Code using Solidity compiler which we have included.

module.exports = solc.compile(source,1).contracts[':Lottery'];                                        // Here we are exporting our compiled code.
