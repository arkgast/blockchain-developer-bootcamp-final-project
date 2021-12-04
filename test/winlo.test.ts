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

  const FIXED_TICKET_COST = ethers.utils.parseEther("0.001");

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

  it("should buy a ticket", async () => {
    await expect(
      winloInstance.connect(owner).buyTicket({ value: FIXED_TICKET_COST })
    )
      .to.emit(winloInstance, "NewPlayer")
      .withArgs(owner.address);

    const players = await winloInstance.getPlayers();
    expect(players).to.contain(owner.address);
  });

  it("should revert if not enough eth is sent", async () => {
    const lowerEntryFee = ethers.utils.parseEther("0.0001");
    await expect(
      winloInstance.connect(owner).buyTicket({ value: lowerEntryFee })
    ).to.be.reverted;
  });

  it("should return exeeded eth", async () => {
    const higherEntryFee = ethers.utils.parseEther("0.1");
    await expect(
      winloInstance.connect(player1).buyTicket({ value: higherEntryFee })
    )
      .to.emit(winloInstance, "Refund")
      .withArgs(player1.address, higherEntryFee.sub(FIXED_TICKET_COST));
  });

  it("should select a winner", async () => {
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

  it("should allow to select winner only by owner", async () => {
    // Fund contract with link
    await transferLink(linkTokenInstance, winloInstance.address);

    await winloInstance
      .connect(player1)
      .buyTicket({ value: FIXED_TICKET_COST });

    await expect(winloInstance.connect(player1).selectWinner()).to.be.reverted;
    await winloInstance.connect(owner).selectWinner();
  });
});
