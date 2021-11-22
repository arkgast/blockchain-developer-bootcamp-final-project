import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CircuitBreaker__factory, CircuitBreaker } from "../typechain";

describe("Circuit Breaker", function () {
  let Contract: CircuitBreaker__factory;
  let contractInstance: CircuitBreaker;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("CircuitBreaker");
    contractInstance = await Contract.deploy();
    await contractInstance.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  it("should allow change state only by owner", async () => {
    await expect(contractInstance.connect(addr1).pause()).to.be.reverted;
  });

  it("should change circuit breaker pattern state to Paused", async () => {
    await contractInstance.connect(owner).pause();
    expect(await contractInstance.state()).to.be.equal(0);
  });

  it("should change circuit breaker pattern state to Unpaused", async () => {
    await contractInstance.connect(owner).unpause();
    expect(await contractInstance.state()).to.be.equal(1);
  });
});
