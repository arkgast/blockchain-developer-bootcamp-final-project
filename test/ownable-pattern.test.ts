import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

chai.use(solidity);
const { expect } = chai;

describe("Ownable", function () {
  it("should change ownership by owner", async () => {
    const Contract = await ethers.getContractFactory("Ownable");
    const contractInstance = await Contract.deploy();
    await contractInstance.deployed();

    const [owner, newOwner] = await ethers.getSigners();
    await contractInstance.connect(owner).changeOwner(newOwner.address);

    const contractOwner = await contractInstance.owner();
    expect(contractOwner).to.equal(newOwner.address);
  });

  it("should trigger an error when ownership tries to change by another user", async () => {
    const Contract = await ethers.getContractFactory("Ownable");
    const contractInstance = await Contract.deploy();
    await contractInstance.deployed();

    const [, newOwner] = await ethers.getSigners();

    await expect(
      contractInstance.connect(newOwner).changeOwner(newOwner.address)
    ).to.be.reverted;
  });
});
