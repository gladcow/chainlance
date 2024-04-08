//import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainLance } from "../typechain-types";

describe("ChainLance", function () {
  // We define a fixture to reuse the same setup in every test.

  let chainLance: ChainLance;
  before(async () => {
    // const [owner] = await ethers.getSigners();
    const chainLanceFactory = await ethers.getContractFactory("ChainLance");
    chainLance = (await chainLanceFactory.deploy()) as ChainLance;
    await chainLance.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      //expect(await chainLance.greeting()).to.equal("Building Unstoppable Apps!!!");
    });

    it("Should allow setting a new message", async function () {
      //const newGreeting = "Learn Scaffold-ETH 2! :)";
      // await chainLance.setGreeting(newGreeting);
      //expect(await chainLance.greeting()).to.equal(newGreeting);
    });
  });
});
