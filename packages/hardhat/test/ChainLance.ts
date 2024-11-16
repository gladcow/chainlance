import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainLance } from "../typechain-types";

describe("ChainLance: work on project", function () {
  // We define a fixture to reuse the same setup in every test.

  let chainLance: ChainLance;
  before(async () => {
    // const [owner] = await ethers.getSigners();
    const chainLanceFactory = await ethers.getContractFactory("ChainLance");
    chainLance = (await chainLanceFactory.deploy()) as ChainLance;
    await chainLance.waitForDeployment();
  });

  it("Should allow to work on project", async function () {
    // get blockchain users
    const [employer, worker] = await ethers.getSigners();

    //////////////////////////////////////////////////////////////////
    // Project creation
    //////////////////////////////////////////////////////////////////
    const projectId = "id1";
    const projectPrice = 100000;
    // create transaction with "createProject" call
    // use connect(user) to execute contract from given user
    const txCreateProject = await chainLance.connect(employer).createProject(projectId, projectPrice, 100);
    // wait for transaction execution
    const receiptCreateProject = await txCreateProject.wait();
    // check transaction was accepted in the block
    expect(receiptCreateProject).is.not.null;
    // check there was no error in contract execution
    expect(receiptCreateProject?.status).is.equal(1, "project creation failed");

    ///////////////////////////////////////////////////////////////////
    // Bidding the project
    ///////////////////////////////////////////////////////////////////
    const bidId = "bid1";
    const txCreateBid = await chainLance.connect(worker).bidProject(projectId, bidId, projectPrice, 1);
    const receiptCreateBid = await txCreateBid.wait();
    expect(receiptCreateBid?.status).is.equal(1, "bid creation failed");

    ///////////////////////////////////////////////////////////////////
    // Accepting the bid
    ///////////////////////////////////////////////////////////////////
    // acceptBid should send a funds to pay for the work to the contract,
    // we do it with additional argument of the contract call
    // we can set any tx fields with this argument
    // "value" field is used to send money to the contract
    const txAcceptBid = await chainLance.connect(employer).acceptBid(projectId, bidId, { value: projectPrice });
    const receiptAcceptBid = await txAcceptBid.wait();
    expect(receiptAcceptBid?.status).is.equal(1, "bid creation failed");

    ///////////////////////////////////////////////////////////////////
    // Submit work
    ///////////////////////////////////////////////////////////////////
    // TODO

    ///////////////////////////////////////////////////////////////////
    // Accept Work
    ///////////////////////////////////////////////////////////////////
    // TODO
    // Additional note: we should check that worker receives his balance here
    // Use ethers.provider.getBalance(user.address) to get user balance
    // Worker balance after project completion should be greater than it was before
    // on the (projectPrice - receipt.usedGas)
  });

  it("Should allow cancelling/rejecting during the work on the project", async function () {
    // TODO
  });
});

describe("ChainLance: query info on project", function () {
  // We define a fixture to reuse the same setup in every test.

  let chainLance: ChainLance;
  before(async () => {
    // const [owner] = await ethers.getSigners();
    const chainLanceFactory = await ethers.getContractFactory("ChainLance");
    chainLance = (await chainLanceFactory.deploy()) as ChainLance;
    await chainLance.waitForDeployment();
    // TODO: create some projects in different states and several bids on them to check different
    // they can be used in all "it" sections
  });

  it("Should list projects in different states", async function () {
    // TODO
  });
});

describe("ChainLance: check access rights", function () {
  // We define a fixture to reuse the same setup in every test.

  let chainLance: ChainLance;
  before(async () => {
    // const [owner] = await ethers.getSigners();
    const chainLanceFactory = await ethers.getContractFactory("ChainLance");
    chainLance = (await chainLanceFactory.deploy()) as ChainLance;
    await chainLance.waitForDeployment();
    // TODO: create some projects in different states and several bids on them to check different
    // they can be used in all "it" sections
  });

  it("Should allow to change project state to employer only", async function () {
    // TODO
  });

  it("Should allow to change work state to worker only", async function () {
    // TODO
  });
});
