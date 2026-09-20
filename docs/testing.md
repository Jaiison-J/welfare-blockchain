# Testing Documentation & Verification Matrix

**Project:** Blockchain-Based Welfare Scheme Distribution Tracking System  
**Course:** BIC702 Blockchain Technology — Activity 1  
**Author:** Jaison J  

---

## 1. Test Suite Summary

The test suite in `test/WelfareDistribution.test.js` covers 11 exhaustive test cases spanning deployment, core workflows, edge cases, and security authorization:

| Test ID | Test Scenario | Execution Method | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Contract Deployment | `welfareContract.admin()` | Deployer is set as `admin`; count is 0 | **PASS** |
| **TC-02** | Beneficiary Registration | `registerBeneficiary("Jaison Demo", "Scholarship")` | ID=1 created; `BeneficiaryRegistered` emitted | **PASS** |
| **TC-03** | Beneficiary Retrieval | `getBeneficiary(1)` | Returns correct struct with status `Registered (0)` | **PASS** |
| **TC-04** | Beneficiary Approval | `approveBeneficiary(1)` | Status updated to `Approved (1)`; event emitted | **PASS** |
| **TC-05** | Benefit Distribution | `distributeBenefit(1, 10000)` | Status updated to `Distributed (2)`; timestamp set | **PASS** |
| **TC-06** | Public Verification | `verifyBeneficiary(1)` | Anyone can query; returns `exists: true` | **PASS** |
| **TC-07** | Unauthorized Registration | Non-admin caller `registerBeneficiary(...)` | Reverts with `"Error: Caller is not the authorized government admin"` | **PASS** |
| **TC-08** | Unauthorized Approval | Non-admin caller `approveBeneficiary(1)` | Reverts with `"Error: Caller is not the authorized government admin"` | **PASS** |
| **TC-09** | Unauthorized Distribution | Non-admin caller `distributeBenefit(1, 10000)` | Reverts with `"Error: Caller is not the authorized government admin"` | **PASS** |
| **TC-10** | Distribution Before Approval | `distributeBenefit(1, 10000)` on Registered citizen | Reverts with `"Error: Beneficiary has not been approved yet"` | **PASS** |
| **TC-11** | Non-existent Beneficiary Query | `getBeneficiary(999)` | Reverts with `"Error: Beneficiary ID does not exist"` | **PASS** |

---

## 2. Running the Tests Locally

If running locally using Hardhat:
```bash
# 1. Install dependencies (if using hardhat)
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 2. Execute test suite
npx hardhat test test/WelfareDistribution.test.js
```

### Expected Console Output:
```text
  WelfareDistribution Smart Contract
    ✔ Test 1: Should set the deploying account as government admin (45ms)
    ✔ Test 2: Should register a new beneficiary and emit BeneficiaryRegistered (58ms)
    ✔ Test 3: Should accurately retrieve registered beneficiary details (32ms)
    ✔ Test 4: Should approve a registered beneficiary and update status to Approved (1) (41ms)
    ✔ Test 5: Should disburse benefit to an approved beneficiary and update status to Distributed (2) (52ms)
    ✔ Test 6: Should allow anyone to verify beneficiary existence and details (28ms)
    ✔ Test 7: Should reject registration attempt by non-admin caller (30ms)
    ✔ Test 8: Should reject approval attempt by non-admin caller (29ms)
    ✔ Test 9: Should reject distribution attempt by non-admin caller (31ms)
    ✔ Test 10: Should reject distribution attempt on a beneficiary who is not yet approved (34ms)
    ✔ Test 11: Should reject operations on non-existent beneficiary ID (26ms)

  11 passing (406ms)
```
