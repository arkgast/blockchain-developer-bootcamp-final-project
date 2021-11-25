import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Winlo, Winlo__factory } from "../typechain";

describe("Winlo", function () {
  let Contract: Winlo__factory;
  let contractInstance: Winlo;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("Winlo");
    contractInstance = await Contract.deploy();
    await contractInstance.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  it("should buy a ticket", async () => {
    await expect(contractInstance.connect(owner).buyTicket())
      .to.emit(contractInstance, "NewPlayer")
      .withArgs(owner.address);

    const players = await contractInstance.getPlayers();
    expect(players).to.contain(owner.address);
  });

  it("should select winner", async () => {
    await contractInstance.connect(addr1).buyTicket();
    await contractInstance.connect(owner).selectWinner();

    const winners = await contractInstance.getWinners();

    expect(winners).to.contain(addr1.address);
  });

  it("should allow to select winner only by owner", async () => {
    await contractInstance.connect(addr1).buyTicket();
    await expect(contractInstance.connect(addr1).selectWinner()).to.be.reverted;
    await contractInstance.connect(owner).selectWinner();
  });

  it("should display last winner", async () => {
    await contractInstance.connect(addr1).buyTicket();
    await contractInstance.connect(owner).selectWinner();

    const lastWinner = await contractInstance.lastWinner();
    expect(lastWinner).to.equal(addr1.address);
  });

  it.skip("should allow to start a new lottery round", async () => {});

  it.skip("should allow to finish current lottery", async () => {});
});
