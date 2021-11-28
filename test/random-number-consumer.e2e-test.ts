import { expect } from "chai";
import { ethers } from "hardhat";
import {
  RandomNumberConsumer,
  RandomNumberConsumer__factory,
} from "../typechain";
import LinkTokenInterface from "@chainlink/contracts/abi/v0.8/LinkTokenInterface.json";

// Rinkeby addresses
const VRF_CONSUMER_ADDRESS = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
const LINK_TOKEN_ADDRESS = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
const KEY_HASH =
  "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";

const transferLinkToContract = async (
  contractInstance: RandomNumberConsumer
) => {
  const [owner] = await ethers.getSigners();
  const linkTokenContract = new ethers.Contract(
    LINK_TOKEN_ADDRESS,
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

describe("RandomNumberConsumer Integration Test", function () {
  let Contract: RandomNumberConsumer__factory;
  let contractInstance: RandomNumberConsumer;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("RandomNumberConsumer");
    contractInstance = await Contract.deploy(
      VRF_CONSUMER_ADDRESS,
      LINK_TOKEN_ADDRESS,
      KEY_HASH
    );
    await contractInstance.deployed();
  });

  it("should generate a random number", async () => {
    await transferLinkToContract(contractInstance);

    const transaction = await contractInstance.getRandomNumber();
    await transaction.wait();

    await new Promise<void>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const result = await contractInstance.randomResult();
        const randomNumber = ethers.BigNumber.from(result._hex).toString();

        // once random number is filled out interval should end and test should pass
        if (randomNumber !== "0") {
          clearInterval(intervalId);
          expect(parseInt(randomNumber)).to.be.greaterThanOrEqual(0);
          resolve();
        }
      }, 5 * 1000);
    });
  });
});
