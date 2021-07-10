const assert = require('assert');                        
const ganache = require('ganache-cli');                  
const Web3 = require('web3');                            
const web3 = new Web3(ganache.provider());               
const { interface, bytecode } = require('../compile');   

let accounts;                                            
let lottery;                                                

beforeEach( async () => {                                  
    
    try{                                                       
        accounts = await web3.eth.getAccounts();                                   
        
        lottery    = await new web3.eth.Contract(JSON.parse(interface))               
                        .deploy({ data : bytecode})                                    // NO initial arguments. 
                        .send({ from : accounts[0], gas : '1000000'}) ;
    }                                                                               
                                                                                    
    catch(err)                                                                      
    {                                                                               
        lottery = err;
    }        
})
 
describe("Contract1 : Lottery",()=>{


    it("Test1 : Deploys a contract.",() => {                                      // Successful Contract Deployment.
        assert.ok(lottery.options.address);              
    });



    it("Test2 : Manager Address", async() => {

        const manager = await lottery.methods.manager().call({                     // This is the current manager.
            from : accounts[5]
        })

        assert.equal(accounts[0],manager);                                         // Whether manager is set equal to the account which deployes the contract.
    })
    


    it("Test3 : Entering 'Single Account' into Lottery", async () =>{

        await lottery.methods.enter().send({                                         // 1]We are entering into the lottery by using 'enter' function
            from : accounts[3],                                                      // 2]From our 4nd account provided by 'ganache'.
            value : web3.utils.toWei('0.02','ether')                                 // 3]We are also send sufficient ethers with it.
        });

        const players = await lottery.methods.getPlayers().call({                    // We are fetching players list by using "getPlayers" function.
            from : accounts[8]
        })

                                                                                      // Note : 1st Function call is a transaction, hence we used ".send()".
                                                                                      //        2nd Function call is just fetching of data, hence used ".call()"
                                
        assert.equal(accounts[3],players[0]);                                         // 1st Player should be equal to the 'account' used.     Note : (expectation, reality) 'reality' should be equal to expectation.
        assert.equal(1,players.length)                                                // At this instant we should have single player inside our contract.

    })


    it("Test4 : Entering 'Multiple Account' into Lottery", async () =>{

        await lottery.methods.enter().send({                                         
            from : accounts[6],                                                      
            value : web3.utils.toWei('0.02','ether')                                 
        });

        await lottery.methods.enter().send({                                         
            from : accounts[7],                                                      
            value : web3.utils.toWei('0.02','ether')                                 
        });

        await lottery.methods.enter().send({                                         
            from : accounts[8],                                                      
            value : web3.utils.toWei('0.02','ether')                                 
        });


        const players = await lottery.methods.getPlayers().call({                    
            from : accounts[2]
        })
                                                                                                                                                                
        assert.equal(accounts[6],players[0]);                                         
        assert.equal(accounts[7],players[1]);                                         
        assert.equal(accounts[8],players[2]);                                         
        
        assert.equal(3,players.length)                                                

    })

    it("Test5 : Sufficient amount of money sent", async () =>{

        try{
            
            await lottery.methods.enter().send({
                from : accounts[4],
                value : 200                                                      // 1]Here we are intentionally not sending enough money, so we want that an error to occurs here.
            })                                                                   // 2]Remeber 'await' waits till Promise is settled i.e either resolved or rejected, but it can only handle resolved promises.
                                                                                 // 3]In order to handle rejected promises we need to use try-catch block.

            assert(false);                                                       //1]This statement makes sure that we fails the test. Imagine if due to some bug in contract a person is able to enter into the lottery without sending enough money.
                                                                                 //2]Then error will not be thrown and we will not enter "catch block". Then this line will run and we will fail the test.
        }catch(err){
            assert(err);                                                         // We will pass this test if an error occurs as we expect it to. 
        }                                                                      
    })

    it("Test6 : Function Modifier", async () =>{

        try{

            await lottery.methods.pickWinner().call({                                // 1] Only Manager is allowed to execute this function. Currently accounts[0] is our manager, as he deployed our contract, also we have checked it Test2.
            from : account[8]                                                        // 2] So here error must be thrown.                                                  
            });

            assert(false);

        }catch(err){
            assert(err);
        }
        
    })

    it("Test7 : Money sent to Winner", async () => {
      
        await lottery.methods.enter().send({                                          // 1]Single Player Enters the Lottery.                 
            from : accounts[5],                                                   
            value : web3.utils.toWei('2','ether')                                 
        });

        const initialBalance = await web3.eth.getBalance(accounts[5]);                // 2]Players Balance before winner is selected.

        await lottery.methods.pickWinner().send({
            from : accounts[0]                                                        // 3] Manager instructs 'Contracts' to pick a winner.
        })

        const finalBalance = await web3.eth.getBalance(accounts[5]);                  // 4] Players balance after winner is selected. As single person is presnt hence he is winner.

        const difference = finalBalance - initialBalance;                             // Lets say person has 2 Ethers, He spent it and enters a lottery now he has 0 Ethers(Initial Balance), He won the lottery now he has 2 Ethers(Final Balance) again.
        assert(difference > web3.utils.toWei('1.8','ether'));                         // Assume 0.2 Ethers are spent as gas, so the difference between final and initial balance should be greater than 1.8 Ethers. 
    
    })

    
})   