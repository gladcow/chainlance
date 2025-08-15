import fs from "fs";
import path from "path";
import { network } from "hardhat"
import hre from "hardhat";
import { contractToDeploy } from "../deploy.config.js";


async function main() {
  
  const { ethers } = await network.connect();
  const chainIdAndName = await ethers.provider.getNetwork();
  const chainId = chainIdAndName.chainId.toString()
  const contractFactory = await ethers.getContractFactory(contractToDeploy);
  const contract = await contractFactory.deploy();
  const adress = await contract.getAddress()

  const frontendDir = path.resolve(path.dirname(''), "..", "nextjs", "contracts");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });

  const { abi } = await hre.artifacts.readArtifact(contractToDeploy);
  fs.writeFileSync(
    path.join(frontendDir, "contract.json"),
    JSON.stringify({ [chainId]: {"contractName": contractToDeploy, "address": adress, abi }}, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});