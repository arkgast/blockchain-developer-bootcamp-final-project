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
- [ ] Improve design and to do list

## Contract

- [ ] Create tests
- [ ] Apply circuit breaker pattern
- [ ] Apply ownable design pattern 
- [ ] Generate random ticket number (Use chainlink RVF)
- [ ] Allow users to buy a ticket
- [ ] Emmit event when a ticket is bought
- [ ] Select random winner
- [ ] Emit event when a winner is selected
- [ ] Return list of all participants
- [ ] Improve security with Open Zeppelin Contracts

## Frontend

- [ ] Connect wallet
- [ ] Use active wallet
- [ ] Buy lottery ticket
- [ ] Display lottery ticket
- [ ] Receive notification when lottery event completes
- [ ] Show lottery winner
- [ ] List users who bought a ticket
- [ ] List previous winers

## Utils
- [  ] Create script to save contract abi and address into the proper files once it is deployed
