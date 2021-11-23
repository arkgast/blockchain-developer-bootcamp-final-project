import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Ownable__factory, Ownable } from "../typechain";

describe("Ownable", function () {
  let Contract: Ownable__factory;
  let contractInstance: Ownable;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("CircuitBreaker");
    contractInstance = await Contract.deploy();
    await contractInstance.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  it("should change ownership by owner", async () => {
    await contractInstance.connect(owner).changeOwner(addr1.address);

    const contractOwner = await contractInstance.owner();
    expect(contractOwner).to.equal(addr1.address);
  });

  it("should throw when ownership tries to change by another user", async () => {
    await expect(contractInstance.connect(addr1).changeOwner(addr1.address)).to
      .be.reverted;
  });
});
