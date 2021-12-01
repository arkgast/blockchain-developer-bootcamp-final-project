# Winlo - Lottery DApp

DApp created for users to play lottery.

# How to use

## Install dependencies

    $ npm install
    $ cd frontend && npm install

## Contracts interaction

### Compile contracts

    $ npm run compile

### Run unit tests

    $ npm test

### Run integration tests

    $ npm run test:e2e

> To run this tests successfully you need to have LINK

## Project structure

```
+─────────────────────────────────────────────────────────────────────────────────────────────────────────────+
│             Folder structure                                        Description                             │ 
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────+
│     ├── frontend                                 React project that allows to interact with the contract.   │
│     │   ├── public                               Files used on deployment.                                  │
│     │   ├── src                                  Source code.                                               │
│     │   │   ├── components                       React components.                                          │
│     │   │   ├── shared                           Shared modules that could be used along the project.       │
│     │   │   ├── utils                            Contract abi files.                                        │
│     │   │   ├── App.tsx                          Main project component.                                    │
│     │   │   └── index.tsx                        Project entry point.                                       │
│     │   ├── package.json                         Frontend dependencies.                                     │
│     │   ├── README.md                            Description and intructions about how to run the project.  │
│     │   └── tsconfig.json                        Typescript configuration for fronted project.              │
├     │                                                                                                       │ 
│     ├── contracts                                Lottery contracts.                                         │
│     │   ├── CircuitBreaker.sol                   Implementation of circuit breaker pattern.                 │
│     │   ├── Ownable.sol                          Implementation of ownable pattern.                         │
│     │   ├── RandomNumberConsumer.sol             Implementation of random number consumer.                  │
│     │   └── Winlo.sol                            Main contract.                                             │
│     ├── scripts                                  Scripts used to automate tasks.                            │
│     │   └── deploy.ts                            Deploy contracts.                                          │
│     ├── test                                     Tests directory.                                           │
│     │   ├── circuit-breaker-pattern.test.ts      Circuit Breaker pattern tests.                             │
│     │   ├── ownable-pattern.test.ts              Ownable pattern tests.                                     │
│     │   ├── random-number-consumer.e2e-test.ts   Integration test for random number consumer.               │
│     │   └── winlo.test.ts                        Main contract tests.                                       │
│     ├── avoiding_common_attacks.md               List of smart contract weaknesses.                         │
│     ├── design_attern_decisions.md               Explanation of why the design patterns where used.         │
│     ├── hardhat.config.ts                        Hardhat configurations.                                    │
│     ├── package.json                             Hardhat project dependencies.                              │
│     ├── README.md                                Description and instruction about the project.             │
│     └── tsconfig.json                            Typescript configurations for hardhat project.             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

# To do list

- [x] Initial design of the project
- [ ] General improvements and refactor
- [ ] Improve design and to do list

### Contract

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

### Frontend

- [x] Connect wallet
- [x] Use active wallet
- [x] Buy lottery ticket
- [x] Receive notification when lottery event completes
- [x] Show lottery winner
- [x] List users who bought a ticket
- [x] List previous winers

### Utils
- [  ] Create script to save contract abi and address into the proper files once it is deployed
