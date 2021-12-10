import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
/* eslint-disable camelcase */
import {
  LinkToken,
  LinkToken__factory,
  VRFCoordinatorMock,
  VRFCoordinatorMock__factory,
  Winlo,
  Winlo__factory,
} from "../typechain"; // eslint-disable-line

const { KEY_HASH } = process.env;
const FIXED_TICKET_COST = ethers.utils.parseEther("0.001");

const transferLink = async (
  linkTokenInstance: LinkToken,
  winloContractAddress: string
) => {
  const amount = "1000000000000000000"; // 1 Link
  return linkTokenInstance.transfer(winloContractAddress, amount);
};

describe("Winlo", function () {
  let Winlo: Winlo__factory;
  let winloInstance: Winlo;

  let LinkToken: LinkToken__factory;
  let linkTokenInstance: LinkToken;

  let VRFCoordinator: VRFCoordinatorMock__factory;
  let vRFCoordinator: VRFCoordinatorMock;
  /* eslint-enable camelcase */

  let owner: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;

  beforeEach(async () => {
    LinkToken = await ethers.getContractFactory("LinkToken");
    linkTokenInstance = await LinkToken.deploy();
    await linkTokenInstance.deployed();

    VRFCoordinator = await ethers.getContractFactory("VRFCoordinatorMock");
    vRFCoordinator = await VRFCoordinator.deploy(linkTokenInstance.address);
    await vRFCoordinator.deployed();

    Winlo = await ethers.getContractFactory("Winlo");
    winloInstance = await Winlo.deploy(
      vRFCoordinator.address,
      linkTokenInstance.address,
      KEY_HASH || ""
    );
    await winloInstance.deployed();

    [owner, player1, player2] = await ethers.getSigners();
  });

  it("should initialize with correct states", async () => {
    const { AddressZero } = ethers.constants;
    expect(await winloInstance.owner()).to.equal(owner.address);
    expect((await winloInstance.getPlayers()).length).to.equal(0);
    expect((await winloInstance.getWinners()).length).to.equal(0);
    expect(await winloInstance.lastWinner()).to.equal(AddressZero);
    expect((await winloInstance.randomResult()).toString()).to.equal("0");
    expect(await winloInstance.ticketPrice()).to.equal(FIXED_TICKET_COST);
    expect(await winloInstance.paused()).to.equal(false);
  });

  it("should buy a ticket contract is UNPAUSED", async () => {
    await expect(
      winloInstance.connect(owner).buyTicket({ value: FIXED_TICKET_COST })
    )
      .to.emit(winloInstance, "NewPlayer")
      .withArgs(owner.address);

    const players = await winloInstance.getPlayers();
    expect(players).to.contain(owner.address);
  });

  it("should not buy a ticket if contract is PAUSED", async () => {
    // Reverts when contract is PAUSED
    await winloInstance.pause();
    await expect(
      winloInstance.buyTicket({ value: FIXED_TICKET_COST })
    ).to.be.revertedWith("Pausable: paused");

    // Completes when contract is UNPAUSED
    await winloInstance.unpause();
    await winloInstance.buyTicket({ value: FIXED_TICKET_COST });
  });

  it("should not buy a ticket when eth sent is not enough", async () => {
    const lowerEntryFee = ethers.utils.parseEther("0.0001");
    await expect(
      winloInstance.connect(owner).buyTicket({ value: lowerEntryFee })
    ).to.be.reverted;
  });

  it("should return exeeded eth when buying ticket", async () => {
    const higherEntryFee = ethers.utils.parseEther("0.1");
    await expect(
      winloInstance.connect(player1).buyTicket({ value: higherEntryFee })
    )
      .to.emit(winloInstance, "Refund")
      .withArgs(player1.address, higherEntryFee.sub(FIXED_TICKET_COST));
  });

  it("should change ticketPrice when contract is PAUSED", async () => {
    await winloInstance.pause();
    const newTicketPrice = ethers.utils.parseEther("0.1");
    await winloInstance.changeTicketPrice(newTicketPrice);
  });

  it("should not change ticketPrice when contract is UNPAUSED", async () => {
    const newTicketPrice = ethers.utils.parseEther("0.1");
    await expect(
      winloInstance.changeTicketPrice(newTicketPrice)
    ).to.be.revertedWith("Pausable: not paused");
  });

  it("should select a winner when there is enough LINK", async () => {
    // Fund contract with link
    await transferLink(linkTokenInstance, winloInstance.address);

    // Buy tickets
    await winloInstance
      .connect(player1)
      .buyTicket({ value: FIXED_TICKET_COST });
    await winloInstance
      .connect(player2)
      .buyTicket({ value: FIXED_TICKET_COST });

    // Select winner
    const tx = await winloInstance.connect(owner).selectWinner();
    const receipt = await tx.wait();
    const reqId = receipt.events![0].topics[0];

    // Mock VRFCoordinator
    await vRFCoordinator.callBackWithRandomness(
      reqId,
      1, // select player2 as winner
      winloInstance.address
    );

    const lastWinner = await winloInstance.lastWinner();
    const players = await winloInstance.getPlayers();
    const winners = await winloInstance.getWinners();

    expect(lastWinner).to.equal(player2.address);
    expect(winners).to.contain(player2.address);
    expect(winners.length).to.equal(1);
    expect(players.length).to.equal(0);
  });

  it("should not select a winner when there is not enough LINK", async () => {
    // Selecting winner without funding contract with link
    await winloInstance
      .connect(player1)
      .buyTicket({ value: FIXED_TICKET_COST });

    // Select winner
    await expect(
      winloInstance.connect(owner).selectWinner()
    ).to.be.revertedWith("Not enough LINK");
  });

  it("should allow to select winner only by owner", async () => {
    // Fund contract with link
    await transferLink(linkTokenInstance, winloInstance.address);

    await winloInstance
      .connect(player1)
      .buyTicket({ value: FIXED_TICKET_COST });

    await expect(winloInstance.connect(player1).selectWinner()).to.be.reverted;
    await winloInstance.connect(owner).selectWinner();
  });

  it("should allow to pause/unpause contract only if caller is owner", async () => {
    await expect(winloInstance.connect(player1).pause()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    await winloInstance.connect(owner).pause();

    await expect(winloInstance.connect(player1).unpause()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    await winloInstance.connect(owner).unpause();
  });
});
