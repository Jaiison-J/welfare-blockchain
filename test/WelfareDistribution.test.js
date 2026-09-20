/**
 * WelfareDistribution Test Suite
 * Course: BIC702 Blockchain Technology - Activity 1
 * Author: Jaison J
 * 
 * Test Scenarios:
 * 1. Contract deployment & initial admin assignment
 * 2. Beneficiary registration (Valid name and scheme)
 * 3. Beneficiary retrieval (getBeneficiary and getBeneficiaryCount)
 * 4. Beneficiary approval by admin
 * 5. Benefit distribution after approval
 * 6. Public verification of beneficiary status
 * 7. Unauthorized registration (non-admin caller reverts)
 * 8. Unauthorized approval (non-admin caller reverts)
 * 9. Unauthorized distribution (non-admin caller reverts)
 * 10. Distribution attempt BEFORE approval (reverts)
 * 11. Invalid / Non-existent beneficiary ID query (reverts)
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WelfareDistribution Smart Contract", function () {
  let welfareContract;
  let admin;
  let nonAdmin;
  let beneficiaryWallet;

  beforeEach(async function () {
    // Get signers from local Ethereum node / Ganache / Hardhat
    [admin, nonAdmin, beneficiaryWallet] = await ethers.getSigners();

    // Deploy contract
    const WelfareDistribution = await ethers.getContractFactory("WelfareDistribution");
    welfareContract = await WelfareDistribution.deploy();
    await welfareContract.waitForDeployment();
  });

  // -------------------------------------------------------------
  // Test 1: Deployment & Admin Setting
  // -------------------------------------------------------------
  it("Test 1: Should set the deploying account as government admin", async function () {
    const contractAdmin = await welfareContract.admin();
    expect(contractAdmin).to.equal(admin.address);
    const initialCount = await welfareContract.getBeneficiaryCount();
    expect(initialCount).to.equal(0);
  });

  // -------------------------------------------------------------
  // Test 2: Beneficiary Registration
  // -------------------------------------------------------------
  it("Test 2: Should register a new beneficiary and emit BeneficiaryRegistered", async function () {
    await expect(
      welfareContract.connect(admin).registerBeneficiary("Jaison Demo", "Student Scholarship")
    )
      .to.emit(welfareContract, "BeneficiaryRegistered")
      .withArgs(1, "Jaison Demo", "Student Scholarship", (val) => val > 0, admin.address);

    const count = await welfareContract.getBeneficiaryCount();
    expect(count).to.equal(1);
  });

  // -------------------------------------------------------------
  // Test 3: Beneficiary Retrieval
  // -------------------------------------------------------------
  it("Test 3: Should accurately retrieve registered beneficiary details", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Rahul Demo", "Education Support");
    
    const b = await welfareContract.getBeneficiary(1);
    expect(b.id).to.equal(1);
    expect(b.name).to.equal("Rahul Demo");
    expect(b.schemeName).to.equal("Education Support");
    expect(b.amount).to.equal(0);
    expect(b.status).to.equal(0); // 0 = Registered
    expect(b.registrationTimestamp).to.be.gt(0);
    expect(b.distributionTimestamp).to.equal(0);
  });

  // -------------------------------------------------------------
  // Test 4: Beneficiary Approval
  // -------------------------------------------------------------
  it("Test 4: Should approve a registered beneficiary and update status to Approved (1)", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Ananya Demo", "Medical Assistance");

    await expect(welfareContract.connect(admin).approveBeneficiary(1))
      .to.emit(welfareContract, "BeneficiaryApproved")
      .withArgs(1, (val) => val > 0, admin.address);

    const b = await welfareContract.getBeneficiary(1);
    expect(b.status).to.equal(1); // 1 = Approved
  });

  // -------------------------------------------------------------
  // Test 5: Benefit Distribution
  // -------------------------------------------------------------
  it("Test 5: Should disburse benefit to an approved beneficiary and update status to Distributed (2)", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Jaison Demo", "Student Scholarship");
    await welfareContract.connect(admin).approveBeneficiary(1);

    const benefitAmount = 10000;
    await expect(welfareContract.connect(admin).distributeBenefit(1, benefitAmount))
      .to.emit(welfareContract, "BenefitDistributed")
      .withArgs(1, benefitAmount, (val) => val > 0, admin.address);

    const b = await welfareContract.getBeneficiary(1);
    expect(b.status).to.equal(2); // 2 = Distributed
    expect(b.amount).to.equal(benefitAmount);
    expect(b.distributionTimestamp).to.be.gt(0);
  });

  // -------------------------------------------------------------
  // Test 6: Public Verification
  // -------------------------------------------------------------
  it("Test 6: Should allow anyone to verify beneficiary existence and details", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Jaison Demo", "Student Scholarship");

    // Can be called by anyone (nonAdmin)
    const result = await welfareContract.connect(nonAdmin).verifyBeneficiary(1);
    expect(result.exists).to.equal(true);
    expect(result.name).to.equal("Jaison Demo");
    expect(result.schemeName).to.equal("Student Scholarship");
  });

  // -------------------------------------------------------------
  // Test 7: Unauthorized Registration
  // -------------------------------------------------------------
  it("Test 7: Should reject registration attempt by non-admin caller", async function () {
    await expect(
      welfareContract.connect(nonAdmin).registerBeneficiary("Intruder", "Unauthorized Scheme")
    ).to.be.revertedWith("Error: Caller is not the authorized government admin");
  });

  // -------------------------------------------------------------
  // Test 8: Unauthorized Approval
  // -------------------------------------------------------------
  it("Test 8: Should reject approval attempt by non-admin caller", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Jaison Demo", "Student Scholarship");

    await expect(
      welfareContract.connect(nonAdmin).approveBeneficiary(1)
    ).to.be.revertedWith("Error: Caller is not the authorized government admin");
  });

  // -------------------------------------------------------------
  // Test 9: Unauthorized Distribution
  // -------------------------------------------------------------
  it("Test 9: Should reject distribution attempt by non-admin caller", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Jaison Demo", "Student Scholarship");
    await welfareContract.connect(admin).approveBeneficiary(1);

    await expect(
      welfareContract.connect(nonAdmin).distributeBenefit(1, 5000)
    ).to.be.revertedWith("Error: Caller is not the authorized government admin");
  });

  // -------------------------------------------------------------
  // Test 10: Distribution BEFORE Approval
  // -------------------------------------------------------------
  it("Test 10: Should reject distribution attempt on a beneficiary who is not yet approved", async function () {
    await welfareContract.connect(admin).registerBeneficiary("Jaison Demo", "Student Scholarship");
    // Notice: approveBeneficiary(1) was skipped!

    await expect(
      welfareContract.connect(admin).distributeBenefit(1, 10000)
    ).to.be.revertedWith("Error: Beneficiary has not been approved yet");
  });

  // -------------------------------------------------------------
  // Test 11: Invalid Beneficiary ID Query
  // -------------------------------------------------------------
  it("Test 11: Should reject operations on non-existent beneficiary ID", async function () {
    const invalidId = 999;

    await expect(
      welfareContract.connect(admin).getBeneficiary(invalidId)
    ).to.be.revertedWith("Error: Beneficiary ID does not exist");

    await expect(
      welfareContract.connect(admin).approveBeneficiary(invalidId)
    ).to.be.revertedWith("Error: Beneficiary ID does not exist");
  });
});
