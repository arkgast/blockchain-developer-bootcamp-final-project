import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Winlo, Winlo__factory } from "../typechain";

describe("Winlo", function () {
  let Contract: Winlo__factory;
  let contractInstance: Winlo;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  const FIXED_TICKET_COST = ethers.utils.parseEther("0.001");

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("Winlo");
    contractInstance = await Contract.deploy();
    await contractInstance.deployed();

    [owner, addr1] = await ethers.getSigners();
  });

  it("should buy a ticket", async () => {
    await expect(
      contractInstance.connect(owner).buyTicket({ value: FIXED_TICKET_COST })
    )
      .to.emit(contractInstance, "NewPlayer")
      .withArgs(owner.address);

    const players = await contractInstance.getPlayers();
    expect(players).to.contain(owner.address);
  });

  it("should revert if not enough eth is sent", async () => {
    const lowerEntryFee = ethers.utils.parseEther("0.0001");
    await expect(
      contractInstance.connect(owner).buyTicket({ value: lowerEntryFee })
    ).to.be.reverted;
  });

  it("should return exeeded eth", async () => {
    const higherEntryFee = ethers.utils.parseEther("0.1");
    await expect(
      contractInstance.connect(addr1).buyTicket({ value: higherEntryFee })
    )
      .to.emit(contractInstance, "Refund")
      .withArgs(addr1.address, higherEntryFee.sub(FIXED_TICKET_COST));
  });

  it("should select a winner", async () => {
    await contractInstance
      .connect(addr1)
      .buyTicket({ value: FIXED_TICKET_COST });

    await expect(contractInstance.connect(owner).selectWinner())
      .to.emit(contractInstance, "Winner")
      .withArgs(addr1.address, FIXED_TICKET_COST);

    const winners = await contractInstance.getWinners();
    expect(winners).to.contain(addr1.address);

    const players = await contractInstance.getPlayers();
    expect(players.length).to.equal(0);
  });

  it("should allow to select winner only by owner", async () => {
    await contractInstance
      .connect(addr1)
      .buyTicket({ value: FIXED_TICKET_COST });

    await expect(contractInstance.connect(addr1).selectWinner()).to.be.reverted;
    await contractInstance.connect(owner).selectWinner();
  });

  it("should display last winner", async () => {
    await contractInstance
      .connect(addr1)
      .buyTicket({ value: FIXED_TICKET_COST });
    await contractInstance.connect(owner).selectWinner();

    const lastWinner = await contractInstance.lastWinner();
    expect(lastWinner).to.equal(addr1.address);
  });
});
