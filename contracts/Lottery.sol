// SPDX-License-Identifier: MIT
pragma solidity >=0.4.26;                                        // Specifies Solidity Version. Suggested by Sir :- 0.4.17, but I am using 0.4.26


contract Lottery{

    address public manager;
    address[] public players;
    address public winner;

    constructor() public{                                       // "msg" is the global object which gives information about sender and the trasaction itself.
       manager = msg.sender;                                    // Here we setting the person whoever deploys the contract as 'manager'. 
    }


/* enter() :-
1]"enter" --> The one who wants to enter our lottery contract has to run this function
2]Anyone who wish to enter the lottery should send some money to the contract.
3]Therefore we have marked this function as "payable".    
*/

    function enter() public payable{   
        
        require(msg.value > 0.01 ether);                         // 1]"require()" is the global function used for validation purpose.
                                                                 // 2]If validation is done successfully then only function will execute otherwise it will be terminated.
                                                                 // 3]Here we are specifying the validation that sender of transaction should atleast send 0.01 Ether with it, inorder to enter our lottery.
        players.push(msg.sender);                  
    }
    
    function no_of_players() public view returns(uint){
        return players.length;
    }
    
    // This is pseudo random number generator as we now the sources which are 1]Block Difficulty 2]Current Time 3]List of Players, Hence result can be manipulated.
   
    function random() public view returns(uint){               // Here we are hasing "Block Difficulty" ,"Current Time" and "List of Addresses of Players" to generate a random number.
       
        return uint(keccak256(block.difficulty,now,players));  // 1]"sha3()" is the funciton which is avialable globally. keccak256 and sha3 are the same thing.
                                                               // 2] "block" is again the global variable avialable to us.
                                                               // 3] "now" is also the global variable which gives us current time.
                                                               // 4] Here we are converting our generated "hash" into unsigned integer.
    }
    
    // Function Modifiers
    
    modifier restricted(){                                     // 1]We can add this modifier to any function we want.
        require(msg.sender == manager);                                 // 2]By doing so the all the code of function will be internally copied at "_" underscore. It acts like place holder.
        _;                                                     // 3]Thus we don't want to write the condition before each funciton we want to restrict.
    }
    
    function pickWinner() public restricted{
        
        uint index = random() % players.length;                // "index" will always be in between 0 to 'players.length - 1'. Well that's the basic property of modulus operation.
        players[index].transfer(this.balance);                 // Here we are transfer the entire money our contract holds to the winner's account.
        winner = players[index];                               // Note : 1] Addresses are not like normal datatypes, they are like objects which has certain methods tied to it.
                                                               //        2] address.transfer() function is used to send money to the addresses.
                                                               //        3] this.balance --> here 'this' refers to current contract instance and 'balance' refers to all the money it holds.
    
        players = new address[](0);                            // Here we are creating a brand new dynamic array with initial size 0. Now 'players' is pointing to this newly created array.
                                                               // We are doing this just to re-run our lottery contract freshly.
    }
    
    // Getting list of all our players
    
    function getPlayers() public view returns (address[]){     // Here we are returning array of addresses
        return players;
    }
    
    function getCurrentBalance() public view returns (uint){   // This returns number of ethers our contract holds
        return this.balance/1000000000000000000;
    }

}
