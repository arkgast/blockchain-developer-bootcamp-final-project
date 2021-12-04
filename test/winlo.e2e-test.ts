import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import LinkTokenInterface from "@chainlink/contracts/abi/v0.8/LinkTokenInterface.json";
import { Winlo, Winlo__factory } from "../typechain"; // eslint-disable-line

const { VRF_CONSUMER_ADDRESS, LINK_TOKEN_ADDRESS, KEY_HASH } = process.env;
const FIXED_TICKET_COST = ethers.utils.parseEther("0.001");

const transferLinkToContract = async (
  contractInstance: Winlo,
  owner: SignerWithAddress
) => {
  const linkTokenContract = new ethers.Contract(
    LINK_TOKEN_ADDRESS || "",
    LinkTokenInterface,
    owner
  );

  const linkAmount = "100000000000000000"; // 0.1 link
  const transferTransaction = await linkTokenContract.transfer(
    contractInstance.address,
    linkAmount
  );
  await transferTransaction.wait();
};

describe("Winlo Integration Tests", function () {
  let Contract: Winlo__factory; // eslint-disable-line
  let contractInstance: Winlo;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("Winlo");
    contractInstance = await Contract.deploy(
      VRF_CONSUMER_ADDRESS || "",
      LINK_TOKEN_ADDRESS || "",
      KEY_HASH || ""
    );
    await contractInstance.deployed();
    console.log(
      "\t🚀 https://rinkeby.etherscan.io/address/%s",
      contractInstance.address
    );
  });

  it("should select a random winner", async () => {
    console.log("\t✋ sometimes tests fail due to connection, please retry.");
    const [owner] = await ethers.getSigners();
    await transferLinkToContract(contractInstance, owner);

    // Buy tickets
    await contractInstance
      .connect(owner)
      .buyTicket({ value: FIXED_TICKET_COST });

    // Select winner
    const transaction = await contractInstance.connect(owner).selectWinner();
    await transaction.wait();

    // Wait for winner to be selected
    // and check contract state after that
    await new Promise<void>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const result = await contractInstance.randomResult();
        const randomNumber = ethers.BigNumber.from(result._hex).toString();

        // once random number is filled out interval should end and test should pass
        if (randomNumber !== "0") {
          const lastWinner = await contractInstance.lastWinner();
          expect(lastWinner).to.equal(owner.address);

          const winners = await contractInstance.getWinners();
          expect(winners.length).to.equal(1);
          expect(winners).to.contain(owner.address);

          const players = await contractInstance.getPlayers();
          expect(players.length).to.equal(0);

          expect(parseInt(randomNumber)).to.be.greaterThanOrEqual(0);

          clearInterval(intervalId);
          resolve();
        }
      }, 5 * 1000); // 5 seconds
    });
  });
});
