const HDWalletProvider = require('truffle-hdwallet-provider')          
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    'scare around almost clutch spirit stairs scan trumpet poverty fetch wool exist',         
    'https://rinkeby.infura.io/v3/ec2a5eddab6d4046a0f8ef8f7db57754'                           
)                                                                                             
                                                                                                                                                                                            
const web3 = new Web3(provider);

const deploy = async () => {              
                                               
    const accounts = await web3.eth.getAccounts();

    console.log(`Contract is deployed from Account : ${accounts[0]}`);

    const result = await new web3.eth.Contract(JSON.parse(interface))
                  .deploy( { data : bytecode })                                 // Here no initial arguments are needed.
                  .send( { from : accounts[0], gas : 1000000});

    console.log(`Contract is deployed at : ${result.options.address}`);
    console.log(`Interface of Contract   : ${interface}`);
}
deploy();
