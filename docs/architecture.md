# System Architecture & Technical Specification

**Project:** Blockchain-Based Welfare Scheme Distribution Tracking System  
**Course:** BIC702 Blockchain Technology — Activity 1  
**Author:** Jaison J (BE Computer Science & Engineering)

---

## 1. System Overview

The Welfare Scheme Distribution Tracking System addresses persistent challenges in government direct-benefit schemes—including intermediary leakage, ghost beneficiaries, administrative record tampering, and lack of citizen auditability.

By executing the business logic within an Ethereum-compatible Solidity smart contract (`WelfareDistribution.sol`), all registration, approval, and disbursement events are permanently etched onto an append-only, tamper-resistant cryptographic ledger.

---

## 2. Multi-Tier Architectural Layers

```
+-------------------------------------------------------------------------------+
|                           PRESENTATION LAYER (UI)                             |
|  - React 19 + Tailwind CSS Dashboard                                         |
|  - Admin Dashboard (Register, Approve, Distribute)                           |
|  - Public Verification Portal (Query by Beneficiary ID)                       |
|  - Blockchain Audit Trail & Block Explorer                                   |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                       WEB3 INTEGRATION LAYER (Ethers.js)                     |
|  - BrowserProvider (MetaMask window.ethereum)                                 |
|  - JsonRpcProvider (Ganache Local Node http://127.0.0.1:7545)                 |
|  - In-Browser EVM Simulator (Zero-setup testnet preview)                     |
|  - Contract Interface (WelfareDistribution ABI + Address)                    |
+-------------------------------------------------------------------------------+
                                      |
                                      v (JSON-RPC over HTTP/IPC)
+-------------------------------------------------------------------------------+
|                       EXECUTION & CONSENSUS LAYER (EVM)                       |
|  - Ganache Local Blockchain (Chain ID: 1337 / 5777)                           |
|  - Ethereum Virtual Machine (EVM opcode execution)                           |
|  - Cryptographic Keccak-256 Hashing & Nonce Tracking                         |
|  - Proof-of-Authority / Local Mining & Gas Engine                             |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                        SMART CONTRACT STORAGE LAYER                           |
|  - WelfareDistribution.sol                                                    |
|  - State Variables: admin (address), _beneficiaryIdCounter (uint256)           |
|  - Data Structures: struct Beneficiary, enum BeneficiaryStatus                |
|  - Mappings: mapping(uint256 => Beneficiary) beneficiaries                    |
|  - Audit Array: uint256[] allBeneficiaryIds                                  |
|  - Event Logs: BeneficiaryRegistered, BeneficiaryApproved, BenefitDistributed  |
+-------------------------------------------------------------------------------+
```

---

## 3. End-to-End Application Data Flow

```
[Government Nodal Officer]
          |
          | 1. Connect MetaMask / Ganache
          v
[Web3 Frontend (Ethers.js)]
          |
          | 2. Invoke registerBeneficiary(name, scheme)
          v
[Smart Contract: WelfareDistribution.sol]
          |-- Validates msg.sender == admin
          |-- Increments ID counter (e.g. ID = 1)
          |-- Writes struct to beneficiaries[1] with status = Registered
          |-- Emits BeneficiaryRegistered event
          v
[Block Mined in Ganache]
          |-- Gas consumed: ~78,540 units
          |-- Tx Hash generated (0x4a9f...abc1)
          v
[Official Verification Phase]
          |
          | 3. Invoke approveBeneficiary(1)
          v
[Smart Contract: WelfareDistribution.sol]
          |-- Validates msg.sender == admin & status == Registered
          |-- Updates status to Approved (1)
          |-- Emits BeneficiaryApproved event
          v
[Disbursement Phase]
          |
          | 4. Invoke distributeBenefit(1, amount)
          v
[Smart Contract: WelfareDistribution.sol]
          |-- Validates msg.sender == admin & status == Approved
          |-- Validates amount > 0
          |-- Updates status to Distributed (2) & distributionTimestamp = block.timestamp
          |-- Emits BenefitDistributed event
          v
[Citizen / Auditor Public Query]
          |
          | 5. Invoke getBeneficiary(1) / verifyBeneficiary(1)
          v
[Read-Only EVM Call]
          |-- Instant 0 gas read call
          |-- Returns full lifecycle proof and cryptographic status badge
```

---

## 4. Key Architectural Decisions

1. **Direct Frontend-to-Blockchain Interaction:**  
   Eliminating a conventional backend server (Node.js/Express) for state storage prevents the emergence of a centralized honey-pot or single point of failure. The browser communicates directly with the decentralized blockchain node.

2. **No Traditional Database for Core Transactions:**  
   Relational databases allow root administrators to perform `UPDATE` or `DELETE` operations without cryptographic trace. Storing state inside the EVM guarantees append-only permanence.

3. **Separation of Concerns in Solidity Storage:**  
   Using both a `mapping(uint256 => Beneficiary)` and an `allBeneficiaryIds` array enables constant-time $O(1)$ key lookup alongside deterministic enumeration for UI dashboards.
