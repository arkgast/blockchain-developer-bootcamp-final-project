# Winlo - Lottery DApp

Lottery app created with hardhat and react.

# Commands

## Compile contract

```shell
hardhat compile
```

## Deploy contract

```shell
hardhat run --network <network-name> scripts/<script-file>
```

## Etherscan verification

```shell
npx hardhat verify --network <network-name> <deployet-contract-address>
```

# To do list

- [x] Initial design of the project
- [ ] General improvements and refactor
- [ ] Improve design and to do list

## Contract

- [x] Create tests
- [x] Apply circuit breaker pattern
- [x] Apply ownable design pattern 
- [ ] Generate random ticket number (Use chainlink RVF)
- [x] Allow users to buy a ticket
- [x] Emmit event when a ticket is bought
- [ ] Select random winner
- [x] Emit event when a winner is selected
- [x] Return list of all participants
- [x] Return list of all winners
- [ ] Improve security with Open Zeppelin Contracts

## Frontend

- [x] Connect wallet
- [x] Use active wallet
- [x] Buy lottery ticket
- [ ] Display lottery ticket
- [x] Receive notification when lottery event completes
- [x] Show lottery winner
- [ ] List users who bought a ticket
- [ ] List previous winers

## Utils
- [  ] Create script to save contract abi and address into the proper files once it is deployed
