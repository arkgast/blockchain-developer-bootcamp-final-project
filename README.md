# Winlo - Lottery DApp

DApp created for users to play lottery.

## How to use

This project uses advance hardhat template and it was tested with node v14.x and v16.x

### Environment variables

Environment variables needed are in the next file `.env.example`.

Execute the next command and set the proper values on `.env` file.

    $ cp .env.example .env

### Install dependencies

    $ npm install

### Compile contracts

    $ npm run compile

### Run unit tests

    $ npm test

### Run integration tests

    $ npm run test:e2e

> To run this tests successfully you need to have some LINK.

### Deploy

    $ npm run deploy

## Ethereum address `0xe24376969016f0C32792e12413b824C2a0BC2dfe`

## Url of deployed site

https://winlo.vercel.app/

## Project screencast

https://drive.google.com/file/d/1khHWJdOfOROZXQuELpMZwBkMBbzm4iWu/view?usp=sharing

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
│     │   ├── test                                 Mock contracts used for testing.                           │
│     │   ├── CircuitBreaker.sol                   Implementation of circuit breaker pattern.                 │
│     │   ├── Ownable.sol                          Implementation of ownable pattern.                         │
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

> Tasks are in are set on [github projects][1] 

[1]: https://github.com/arkgast/blockchain-developer-bootcamp-final-project/projects/1
