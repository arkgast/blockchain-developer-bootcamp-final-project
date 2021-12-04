import { ethers } from "hardhat";
import { resolve } from "path";
import { copyFile, writeFile, readFile } from "fs";
import { promisify } from "util";

const copyFileAsync = promisify(copyFile);
const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

const FRONTED_SRC_PATH = resolve("frontend", "src");
const CONTRACTS_PATH = resolve("artifacts", "contracts");

const { VRF_CONSUMER_ADDRESS, LINK_TOKEN_ADDRESS, KEY_HASH } = process.env;

async function main() {
  const Winlo = await ethers.getContractFactory("Winlo");
  const winlo = await Winlo.deploy(
    VRF_CONSUMER_ADDRESS || "",
    LINK_TOKEN_ADDRESS || "",
    KEY_HASH || ""
  );
  await winlo.deployed();

  console.log("Winlo deployed to:", winlo.address);

  await updateContractAddress(winlo.address);
  await copypAbiFile();
}

async function copypAbiFile() {
  const srcPath = resolve(CONTRACTS_PATH, "Winlo.sol", "Winlo.json");
  const tgtPath = resolve(FRONTED_SRC_PATH, "utils", "Winlo.json");
  await copyFileAsync(srcPath, tgtPath);
}

async function updateContractAddress(address: string) {
  const filePath = resolve(FRONTED_SRC_PATH, "shared", "constants.ts");
  const fileContent = await readFrontendConstantsFile(filePath);

  fileContent[1] = `const CONTRACT_ADDRESS="${address}";`;
  await writeFileAsync(filePath, fileContent.join("\n"));

  await writeFileAsync("deployed_address.txt", address);
}

async function readFrontendConstantsFile(filePath: string) {
  const fileContent = await readFileAsync(filePath);
  const fileRows = fileContent.toString("utf8").split("\n");
  return fileRows;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
