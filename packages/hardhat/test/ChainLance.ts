import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainLance } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

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
    const txSubmitWork = await chainLance.connect(worker).submitWork(projectId);
    const receiptSubmitWork = await txSubmitWork.wait();
    expect(receiptSubmitWork?.status).is.equal(1, "Work submition failed");
    ///////////////////////////////////////////////////////////////////
    // Get worker balance
    ///////////////////////////////////////////////////////////////////
    const worker_balance_before = await ethers.provider.getBalance(worker.address);
    ///////////////////////////////////////////////////////////////////
    // Accept Work
    ///////////////////////////////////////////////////////////////////
    const txAcceptWork = await chainLance.connect(employer).acceptWork(projectId);
    const receiptAcceptWork = await txAcceptWork.wait();

    const worker_balance_after = await ethers.provider.getBalance(worker.address);

    const balance_change = worker_balance_after - worker_balance_before;
    expect(receiptAcceptWork?.status).is.equal(1, "Work acception failed");
    if (receiptAcceptWork) {
      expect(balance_change).is.equal(BigInt(projectPrice), "Worker did not recieve payment");
    }
  });

  it("Should allow cancelling/rejecting during the work on the project", async function () {
    const [employer, worker] = await ethers.getSigners();

    const projectId = "id2";
    const projectPrice = 200000;
    const timeSpanToCancel = 2;
    const txCreateProject = await chainLance.connect(employer).createProject(projectId, projectPrice, timeSpanToCancel);
    const receiptCreateProject = await txCreateProject.wait();

    expect(receiptCreateProject).is.not.null;
    expect(receiptCreateProject?.status).is.equal(1, "project creation failed");

    const bidId = "bid2";
    await chainLance.connect(worker).bidProject(projectId, bidId, projectPrice, timeSpanToCancel - 1);

    await chainLance.connect(employer).acceptBid(projectId, bidId, { value: projectPrice });

    await chainLance.connect(worker).submitWork(projectId);

    ///////////////////////////////////////////////////////////////////
    // Reject work submition
    ///////////////////////////////////////////////////////////////////
    const txRejectWork = await chainLance.connect(employer).rejectWork(projectId);
    const receiptRejectWork = await txRejectWork.wait();
    expect(receiptRejectWork?.status).is.equal(1, "work rejection failed");

    ///////////////////////////////////////////////////////////////////
    // Cancel work
    ///////////////////////////////////////////////////////////////////

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay((timeSpanToCancel + 1) * 1000);

    const txCancelWork = await chainLance.connect(employer).cancelWork(projectId);
    const receiptCancelWork = await txCancelWork.wait();
    expect(receiptCancelWork?.status).is.equal(1, "work cancellation failed");
  });
});

describe("ChainLance: query info on project", function () {
  let chainLance: ChainLance;
  before(async () => {
    const chainLanceFactory = await ethers.getContractFactory("ChainLance");
    chainLance = (await chainLanceFactory.deploy()) as ChainLance;
    await chainLance.waitForDeployment();

    const [employer1, employer2, employer3, worker1, worker2, worker3] = await ethers.getSigners();
    ///////////////////////////////////////////////////////////////////
    // Work with state: Open
    const noBidsProjectId = "id42";
    const noBidsProjectPrice = 1000;
    const txCreateNoBidsProject = await chainLance
      .connect(employer1)
      .createProject(noBidsProjectId, noBidsProjectPrice, 100);
    await txCreateNoBidsProject.wait();
    ///////////////////////////////////////////////////////////////////
    // Work with state: InWork
    const oneBidProjectId = "id3";
    const oneBidProjectPrice = 350000;
    const txCreateOneBidProject = await chainLance
      .connect(employer1)
      .createProject(oneBidProjectId, oneBidProjectPrice, 100);
    await txCreateOneBidProject.wait();

    const bidId1 = "bidid1";
    await chainLance.connect(worker1).bidProject(oneBidProjectId, bidId1, oneBidProjectPrice, 1);

    const txAcceptBid1 = await chainLance
      .connect(employer1)
      .acceptBid(oneBidProjectId, bidId1, { value: oneBidProjectPrice });
    await txAcceptBid1.wait();
    // expect(val1?.status).is.to.be.equal(2, "contract call should fail")
    ///////////////////////////////////////////////////////////////////
    // Work with state: InReview
    const twoBidsProjectId = "id4";
    const twoBidsProjectPrice = 40000;
    const txCreateTwoBidsProject = await chainLance
      .connect(employer2)
      .createProject(twoBidsProjectId, twoBidsProjectPrice, 100);
    await txCreateTwoBidsProject.wait();

    const bidId2 = "bidid2";
    await chainLance.connect(worker2).bidProject(twoBidsProjectId, bidId2, twoBidsProjectPrice, 1);

    const bidId3 = "bidid3";
    await chainLance.connect(worker3).bidProject(twoBidsProjectId, bidId3, twoBidsProjectPrice, 1);

    const txAcceptBid2 = await chainLance
      .connect(employer2)
      .acceptBid(twoBidsProjectId, bidId2, { value: twoBidsProjectPrice });
    await txAcceptBid2.wait();

    const txSubmitWork2 = await chainLance.connect(worker2).submitWork(twoBidsProjectId);
    await txSubmitWork2.wait();
    ///////////////////////////////////////////////////////////////////
    // Work with state: Completed
    const completedProjectId = "id5";
    const completedProjectPrice = 12000;
    const txCreateCompletedProject = await chainLance
      .connect(employer3)
      .createProject(completedProjectId, completedProjectPrice, 100);
    await txCreateCompletedProject.wait();

    const bidId4 = "bidid4";
    await chainLance.connect(worker1).bidProject(completedProjectId, bidId4, completedProjectPrice, 1);

    const txAcceptBid4 = await chainLance
      .connect(employer3)
      .acceptBid(completedProjectId, bidId4, { value: completedProjectPrice });
    await txAcceptBid4.wait();

    const txSubmitWork4 = await chainLance.connect(worker1).submitWork(completedProjectId);
    await txSubmitWork4.wait();

    const txAcceptWork = await chainLance.connect(employer3).acceptWork(completedProjectId);
    await txAcceptWork.wait();
    ///////////////////////////////////////////////////////////////////
    // Work with state: Canceled
    const canceledProjectId = "id6";
    const canceledProjectPrice = 313131;
    const txCreateCanceledProject = await chainLance
      .connect(employer2)
      .createProject(canceledProjectId, canceledProjectPrice, 100);
    await txCreateCanceledProject.wait();

    const bidId5 = "bidid5";
    await chainLance.connect(worker1).bidProject(canceledProjectId, bidId5, canceledProjectPrice, 1);

    const bidId6 = "bidid6";
    await chainLance.connect(worker2).bidProject(canceledProjectId, bidId6, canceledProjectPrice, 1);

    const bidId7 = "bidid7";
    await chainLance.connect(worker3).bidProject(canceledProjectId, bidId7, canceledProjectPrice, 1);

    await chainLance.connect(employer2).cancelProject(canceledProjectId);
  });

  it("Should list projects in different states", async function () {
    const openProjects = await chainLance.listProjectsWithState(0);
    expect(openProjects).to.include("id42");
    expect(openProjects).is.lengthOf(1);

    const inWorkProjects = await chainLance.listProjectsWithState(1);
    expect(inWorkProjects).to.include("id3");
    expect(inWorkProjects).is.lengthOf(1);

    const inReviewProjects = await chainLance.listProjectsWithState(2);
    expect(inReviewProjects).to.include("id4");
    expect(inReviewProjects).is.lengthOf(1);

    const completedProjects = await chainLance.listProjectsWithState(3);
    expect(completedProjects).to.include("id5");
    expect(completedProjects).is.lengthOf(1);

    const canceledProjects = await chainLance.listProjectsWithState(4);
    expect(canceledProjects).to.include("id6");
    expect(canceledProjects).is.lengthOf(1);
  });
});

describe("ChainLance: check access rights", function () {
  let chainLance: ChainLance;
  let employer1: SignerWithAddress;
  let employer2: SignerWithAddress;
  let employer3: SignerWithAddress;
  let worker1: SignerWithAddress;
  let worker2: SignerWithAddress;

  before(async () => {
    const chainLanceFactory = await ethers.getContractFactory("ChainLance");
    chainLance = await chainLanceFactory.deploy();
    await chainLance.waitForDeployment();

    [employer1, employer2, employer3, worker1, worker2] = await ethers.getSigners();

    ///////////////////////////////////////////////////////////////////
    // Work with state: Open
    const noBidsProjectId = "id42";
    const noBidsProjectPrice = 1000;
    const txCreateNoBidsProject = await chainLance
      .connect(employer1)
      .createProject(noBidsProjectId, noBidsProjectPrice, 100);
    await txCreateNoBidsProject.wait();

    ///////////////////////////////////////////////////////////////////
    // Work with state: InWork
    const oneBidProjectId = "id3";
    const oneBidProjectPrice = 350000;
    const txCreateOneBidProject = await chainLance
      .connect(employer1)
      .createProject(oneBidProjectId, oneBidProjectPrice, 100);
    await txCreateOneBidProject.wait();

    const bidId1 = "bidid1";
    await chainLance.connect(worker1).bidProject(oneBidProjectId, bidId1, oneBidProjectPrice, 1);

    const txAcceptBid1 = await chainLance
      .connect(employer1)
      .acceptBid(oneBidProjectId, bidId1, { value: oneBidProjectPrice });
    await txAcceptBid1.wait();

    ///////////////////////////////////////////////////////////////////
    // Work with state: InReview
    const twoBidsProjectId = "id4";
    const twoBidsProjectPrice = 40000;
    const txCreateTwoBidsProject = await chainLance
      .connect(employer2)
      .createProject(twoBidsProjectId, twoBidsProjectPrice, 100);
    await txCreateTwoBidsProject.wait();

    const bidId2 = "bidid2";
    await chainLance.connect(worker2).bidProject(twoBidsProjectId, bidId2, twoBidsProjectPrice, 1);

    const txAcceptBid2 = await chainLance
      .connect(employer2)
      .acceptBid(twoBidsProjectId, bidId2, { value: twoBidsProjectPrice });
    await txAcceptBid2.wait();

    const txSubmitWork2 = await chainLance.connect(worker2).submitWork(twoBidsProjectId);
    await txSubmitWork2.wait();

    ///////////////////////////////////////////////////////////////////
    // Work with state: Completed
    const completedProjectId = "id5";
    const completedProjectPrice = 12000;
    const txCreateCompletedProject = await chainLance
      .connect(employer3)
      .createProject(completedProjectId, completedProjectPrice, 100);
    await txCreateCompletedProject.wait();

    const bidId4 = "bidid4";
    await chainLance.connect(worker1).bidProject(completedProjectId, bidId4, completedProjectPrice, 1);

    const txAcceptBid4 = await chainLance
      .connect(employer3)
      .acceptBid(completedProjectId, bidId4, { value: completedProjectPrice });
    await txAcceptBid4.wait();

    const txSubmitWork4 = await chainLance.connect(worker1).submitWork(completedProjectId);
    await txSubmitWork4.wait();

    const txAcceptWork = await chainLance.connect(employer3).acceptWork(completedProjectId);
    await txAcceptWork.wait();
  });

  it("Should allow to change project state to employer only", async function () {
    const projectId1 = "id42"; // Open (employer1)
    const projectId2 = "id4"; // InReview (employer2)
    const bidId = "bidid1";
    const bidPrice = 1000;

    await expect(chainLance.connect(worker1).acceptBid(projectId1, bidId, { value: bidPrice })).to.be.revertedWith(
      "not owner",
    );

    await expect(chainLance.connect(employer2).acceptBid(projectId1, bidId, { value: bidPrice })).to.be.revertedWith(
      "not owner",
    );

    await expect(chainLance.connect(employer1).acceptBid(projectId1, bidId, { value: bidPrice })).to.be.revertedWith(
      "unknown bid",
    );

    await expect(chainLance.connect(employer1).acceptWork(projectId2)).to.be.revertedWith("not owner");

    await expect(chainLance.connect(employer3).acceptWork(projectId2)).to.be.revertedWith("not owner");
  });

  it("Should allow to change work state to worker only", async function () {
    const projectId1 = "id3"; // InWork
    const projectId2 = "id5"; // Completed
    const projectId3 = "id42"; // Open
    const projectId4 = "id4"; // InReview

    await expect(chainLance.connect(employer1).submitWork(projectId1)).to.be.revertedWith("not worker");

    await expect(chainLance.connect(worker2).submitWork(projectId1)).to.be.revertedWith("not worker");

    await expect(chainLance.connect(worker1).submitWork(projectId3)).to.be.revertedWith("not in work");

    await expect(chainLance.connect(worker2).submitWork(projectId4)).to.be.revertedWith("not in work");

    await expect(chainLance.connect(worker1).submitWork(projectId2)).to.be.revertedWith("not in work");
  });
});
