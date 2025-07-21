import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const Contract = await ethers.getContractFactory("SimpleStorage");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("address:", address);

  // read ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  // contract.ts
  const outputPath = path.join(__dirname, "../frontend/constants/contract.ts");
  const outputContent = `
export const CONTRACT_ADDRESS = "${address}";
export const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};
`;

  fs.writeFileSync(outputPath, outputContent);
  console.log("ABI frontend/constants/contract.ts");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
