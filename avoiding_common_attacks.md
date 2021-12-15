# Security

List of all smart contract weaknesses.

> Purpose of listing all is educational.

A check is placed on each weakness recomendation to confirm if it is solved and in some cases there would a commenta to clarify the approach to solve. 
Some recommendations might not be checked due to lack of knowledge at this point of my learning progress.

## SWC-101 - Integer Overflow and Underflow

- [x] It is recommended to use vetted safe math libraries for arithmetic operations consistently throughout the smart contract system.

> Solidity v0.8.x uses SafeMath to ensure proper behavior of math operations.

## SWC-102 - Outdated Compiler Version

- [x] It is recommended to use a recent version of the Solidity compiler.

> Compiler used here is v0.8.9 which is one of the latest ones.

## SWC-103 - Floating Pragma

- [x] Lock the pragma version and also consider known bugs (https://github.com/ethereum/solidity/releases) for the compiler version that is chosen.

> Pragma version is pointing to the exact solidity version v0.8.9

- [x] Pragma statements can be allowed to float when a contract is intended for consumption by other developers, as in the case with contracts in a library or EthPM package. Otherwise, the developer would need to manually update the pragma in order to compile locally.

> Pragma version is exact thus contract is not gonna be used by other developers.

## SWC-105 - Unprotected Ether Withdrawal

- [x] Implement controls so withdrawals can only be triggered by authorized parties or according to the specs of the smart contract system.

> Thanks to access control pattern withdraw method can only be used by owner of the contract.

## SWC-106 - Unprotected SELFDESTRUCT Instruction

- [x] Consider removing the self-destruct functionality unless it is absolutely required. If there is a valid use-case, it is recommended to implement a multisig scheme so that multiple parties must approve the self-destruct action.

> self-destruct functionality is not being used.

## SWC-107 - Reentrancy Attack

- [x] Make sure all internal state changes are performed before the call is executed. This is known as the Checks-Effects-Interactions pattern.

- [x] Use a reentrancy lock (ie. OpenZeppelin's ReentrancyGuard.

Reentrancy attack is prevented by using internal states.

## SWC-108 - State Variable Default Visibility

- [x] Variables can be specified as being public, internal or private. Explicitly define visibility for all state variables.

> All variables on the proeject have specific visibility.

## SWC-109 - Uninitialized Storage Pointer

- [x] Check if the contract requires a storage object as in many situations this is actually not the case. If a local variable is sufficient, mark the storage location of the variable explicitly with the memory attribute. If a storage variable is needed then initialise it upon declaration and additionally specify the storage location storage. 

> Note: As of compiler version 0.5.0 and higher this issue has been systematically resolved as contracts with uninitialised storage pointers do no longer compile.

## SWC-110 - Assert Violation

- [x] Consider whether the condition checked in the assert() is actually an invariant. If not, replace the assert() statement with a require() statement.

> require is being used and there are tests that ensures its proper behavior.

## SWC-111 - Use of Deprecated Solidity Functions

- [x] Solidity provides alternatives to the deprecated constructions. Most of them are aliases, thus replacing old constructions will not break current behavior.

> By using on of the latests versions of solidity this issue is being avoided.

## SWC-112 - Delegatecall to Untrusted Callee

- [x] Use delegatecall with caution and make sure to never call into untrusted contracts. If the target address is derived from user input ensure to check it against a whitelist of trusted contracts.

    > delegatecall is not being used.

## SWC-113 - DoS with Failed Call

- [x] Avoid combining multiple calls in a single transaction, especially when calls are executed as part of a loop

> There is only one call for a single transaction.

- [ ] Always assume that external calls can fail

- [ ] Implement the contract logic to handle failed calls

## SWC-114 - Transaction Order Dependence -

- [x] A possible way to remedy for race conditions in submission of information in exchange for a reward is called a commit reveal hash scheme. Instead of submitting the answer the party who has the answer submits hash(salt, address, answer) [salt being some number of their choosing] the contract stores this hash and the sender's address. To claim the reward the sender then submits a transaction with the salt, and answer. The contract hashes (salt, msg.sender, answer) and checks the hash produced against the stored hash, if the hash matches the contract releases the reward. </br></br>
The best fix for the ERC20 race condition is to add a field to the inputs of approve which is the expected current value and to have approve revert if Eve's current allowance is not what Alice indicated she was expecting. However this means that your contract no longer conforms to the ERC20 standard. If it important to your project to have the contract conform to ERC20, you can add a safe approve function. From the user perspective it is possible to mediate the ERC20 race condition by setting approvals to zero before changing them.

## SWC-115 - Authorization through tx.origin

- [x] tx.origin should not be used for authorization. Use msg.sender instead.

> msg.sender is being used to validate ownership and for the player to interact with the contract.

## SWC-116 - Block values as a proxy for time

- [x] Developers should write smart contracts with the notion that block values are not precise, and the use of them can lead to unexpected effects. Alternatively, they may make use oracles.

> block values are not being used.

## SWC-117 - Signature Malleability

- [x] A signature should never be included into a signed message hash to check if previously messages have been processed by the contract.

> off-chain signatures are not being used.

## SWC-118 Incorrect Constructor Name

- [x] Solidity version 0.4.22 introduces a new constructor keyword that make a constructor definitions clearer. It is therefore recommended to upgrade the contract to a recent version of the Solidity compiler and change to the new constructor declaration.

> v0.8.x of solidity has a clear way to declare constructors.

## SWC-119 Shadowing State Variables

- [x] Review storage variable layouts for your contract systems carefully and remove any ambiguities. Always check for compiler warnings as they can flag the issue within a single contract.

> Contracts don't share state variables names.

## SWC-120 - Weak Sources of Randomness from Chain Attributes

- [x] Using external sources of randomness via oracles, e.g. Oraclize. Note that this approach requires trusting in oracle, thus it may be reasonable to use multiple oracles.

> VRF is being used to generate random numbers.

## SWC-121 - Missing Protection against Signature Replay Attacks

> Signature verification is not being performed

## SWC-122 - Lack of Proper Signature Verification

> Interaction with the contract doesn't require off-chain signatures.

## SWC-123 - Requirement Violation

- [x] If the required logical condition is too strong, it should be weakened to allow all valid external inputs.

> require conditions are strong enough to ensure contract correct behavior.

## SWC-124 - Write to Arbitrary Storage Location

- [x] As a general advice, given that all data structures share the same storage (address) space, one should make sure that writes to one data structure cannot inadvertently overwrite entries of another data structure.

> It is not possible to overwrite sensible storage locations. Ownable pattern is implemented to avoid changing contract owner and verification of entry fee is done so only users that pay are part of the lottery.

## SWC-125 - Incorrect Inheritance Order

- [x] When inheriting multiple contracts, especially if they have identical functions, a developer should carefully specify inheritance in the correct order. The rule of thumb is to inherit contracts from more /general/ to more /specific/.

> Contract Winlo inherits two contracts that doesn't share function names.

## SWC-126 - Insufficient Gas Griefing

- [x] Only allow trusted users to relay transactions.

- [ ] Require that the forwarder provides enough gas.

## SWC-127 - Arbitrary Jump with Function Type Variable

- [ ] The use of assembly should be minimal. A developer should not allow a user to assign arbitrary values to function type variables.

## SWC-128 - DoS With Block Gas Limit

- [x] Caution is advised when you expect to have large arrays that grow over time. Actions that require looping across the entire data structure should be avoided.

> No array is being looped.

## SWC-129 - Typographical Error

- [ ] The weakness can be avoided by performing pre-condition checks on any math operation or using a vetted library for arithmetic calculations such as SafeMath developed by OpenZeppelin.

## SWC-130 - Right-To-Left-Override control character (U+202E)

- [ ] There are very few legitimate uses of the U+202E character. It should not appear in the source code of a smart contract.

> U+202E character is not being used.

## SWC-131 - Presence of unused variables

- [x] Remove all unused variables from the code base.

> There are not unused variables in the code base.

## SWC-132 - Unexpected Ether balance

- [ ] Avoid strict equality checks for the Ether balance in a contract.

## SWC-133 - Hash Collisions With Multiple Variable Length Arguments

- [ ] When using abi.encodePacked(), it's crucial to ensure that a matching signature cannot be achieved using different parameters. To do so, either do not allow users access to parameters used in abi.encodePacked(), or use fixed length arrays. Alternatively, you can simply use abi.encode() instead.

- [ ] It is also recommended that you use replay protection (see SWC-121), although an attacker can still bypass this by front-running

## SWC-134 - Message call with hardcoded gas amount

- [x] Avoid the use of transfer() and send() and do not otherwise specify a fixed amount of gas when performing calls. Use .call.value(...)("") instead. Use the checks-effects-interactions pattern and/or reentrancy locks to prevent reentrancy attacks.

> transfer() and send() methods are not being used.

## SWC-135 - Code With No Effects

- [ ] It's important to carefully ensure that your contract works as intended. Write unit tests to verify correct behaviour of the code.

## SWC-136 Unencrypted Private Data On-Chain

- [ ] Any private data should either be stored off-chain, or carefully encrypted.
