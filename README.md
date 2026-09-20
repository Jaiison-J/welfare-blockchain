# Blockchain-Based Welfare Scheme Distribution Tracking System

An end-to-end decentralized application (dApp) built to track, record, and publicly verify government welfare scheme disbursements on an immutable Ethereum-compatible ledger.

**Course:** BIC702 Blockchain Technology — Activity 1: Real-World Use Cases  
**Author:** Jaison J (Bachelor of Engineering, Computer Science & Engineering)  
**License:** MIT

---

## 1. Project Overview
The **Blockchain-Based Welfare Scheme Distribution Tracking System** demonstrates how decentralized smart contracts can replace opaque, centralized government welfare registries. By recording beneficiary enrollment, administrative verification, and fund distribution events as cryptographically signed transactions on an Ethereum-compatible blockchain, the system ensures non-repudiation, tamper-resistance, and public auditability.

---

## 2. Problem Statement
Centralized welfare disbursement programs frequently suffer from:
- **Ghost Beneficiaries:** Fictitious citizens inserted by corrupt officials into internal databases.
- **Intermediary Leakage:** Funds diverted before reaching rightful recipients.
- **Unauthorized Data Tampering:** Database administrators with root permissions altering or deleting distribution records.
- **Lack of Public Verification:** Citizens and civic auditors having no direct mechanism to verify whether allocated public funds reached intended targets.

---

## 3. Objectives
- Design and deploy an Ethereum-compatible Solidity smart contract (`WelfareDistribution.sol`) enforcing role-based access control.
- Enforce strict state sequencing: `Registered` $\rightarrow$ `Approved` $\rightarrow$ `Distributed`.
- Prevent double-disbursement and unauthorized beneficiary alterations.
- Build an interactive, modern web application connecting via Ethers.js to MetaMask and local Ganache nodes.
- Provide a public verification portal and blockchain transaction audit trail.
- Ensure 100% free local execution with zero paid third-party APIs.

---

## 4. Features
- **Nodal Admin Console:** Government authority wallet controls beneficiary registration and approval workflows.
- **Strict 3-Stage Lifecycle:**
  - `0: REGISTERED` — Citizen enrolled; awaiting background verification.
  - `1: APPROVED` — Verified and approved by authority; eligible for disbursement.
  - `2: DISTRIBUTED` — Benefit allocated and locked on the blockchain.
- **Public Verification Portal:** Search by Beneficiary ID to review full on-chain metadata, timestamps, and validity status.
- **Live Blockchain Transaction Explorer:** Real-time stream of blocks, transaction hashes, gas consumption, and emitted event logs.
- **Dual Connection Modes:**
  - **MetaMask Web3:** Real transaction signing via injected `window.ethereum`.
  - **Ganache Direct RPC:** Direct connection to `http://127.0.0.1:7545`.
  - **In-Browser EVM Simulator:** Zero-friction testnet with instant mining for portable demonstrations.

---

## 5. Technology Stack
- **Smart Contract Language:** Solidity (`^0.8.20`)
- **Blockchain Testnet:** Ganache (Truffle Suite) / Local Hardhat Node
- **Web3 Wallet:** MetaMask Browser Extension
- **Web3 Client Library:** Ethers.js (`v6`)
- **Frontend Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Testing Framework:** Chai + Hardhat (`test/WelfareDistribution.test.js`)

---

## 6. System Architecture
```
[ Nodal Officer (Admin) ]       [ Public Citizen / Auditor ]
           |                                   |
           v                                   v
[ Admin Dashboard (React) ]     [ Public Verification Portal ]
           |                                   |
           +-----------------+-----------------+
                             |
                             v
               [ Ethers.js Web3 Provider ]
                             | (JSON-RPC)
                             v
               [ Ganache Local Blockchain ]
                             |
                             v
         [ Smart Contract: WelfareDistribution.sol ]
         - mapping(uint256 => Beneficiary)
         - onlyAdmin modifier
         - BeneficiaryRegistered / Approved / Distributed Events
```

---

## 7. Blockchain Architecture
- **EVM (Ethereum Virtual Machine):** Executes compiled bytecode deterministically across nodes.
- **Hashing:** Keccak-256 for block hashes, transactions, and event signatures.
- **Account Model:** State-based accounts (Admin EOA $\rightarrow$ Contract Account).
- **Consensus:** Proof-of-Authority (PoA) / local mock mining on Ganache.

---

## 8. Smart Contract Functions
| Function | Visibility | Modifier | Description |
| :--- | :--- | :--- | :--- |
| `registerBeneficiary(name, scheme)` | `external` | `onlyAdmin` | Enrolls citizen; sets status to `Registered`. |
| `approveBeneficiary(id)` | `external` | `onlyAdmin`, `beneficiaryExists` | Approves citizen; sets status to `Approved`. |
| `distributeBenefit(id, amount)` | `external` | `onlyAdmin`, `beneficiaryExists` | Disburses amount; sets status to `Distributed`. |
| `getBeneficiary(id)` | `external view` | `beneficiaryExists` | Retrieves full beneficiary struct. |
| `getBeneficiaryCount()` | `external view` | None | Returns total number of registered citizens. |
| `getAllBeneficiaries()` | `external view` | None | Returns full array of registered beneficiaries. |
| `verifyBeneficiary(id)` | `external view` | None | Safe public verification lookup. |

---

## 9. Project Structure
```
welfare-blockchain/
│
├── contracts/
│   └── WelfareDistribution.sol         # Core Solidity Smart Contract
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                  # Header, network badges, wallet status
│   │   ├── AdminDashboard.tsx          # Register, Approve, Distribute console
│   │   ├── BeneficiaryVerification.tsx # Public on-chain verification
│   │   ├── AuditTrail.tsx              # Blockchain block & transaction explorer
│   │   ├── ContractModal.tsx           # Contract address & ABI settings
│   │   └── WalletConnectModal.tsx      # MetaMask / Ganache connection modal
│   ├── contracts/
│   │   └── contractConfig.ts           # ABI JSON, default addresses, source export
│   ├── services/
│   │   └── blockchain.ts               # Ethers.js service & EVM simulator
│   ├── types/
│   │   └── blockchain.ts               # TypeScript interfaces & enums
│   ├── App.tsx                         # Root component & navigation
│   └── main.tsx                        # React DOM entrypoint
│
├── test/
│   └── WelfareDistribution.test.js     # 11 unit test scenarios
│
├── docs/
│   ├── architecture.md                 # System architecture specification
│   ├── smart-contract.md               # Solidity functions & storage details
│   ├── testing.md                      # Testing procedure & verification matrix
│   └── REPORT_CONTENT.md               # Academic report content for BIC702
│
├── deployment/
│   └── deployment-info.json            # Deployment configuration & addresses
│
├── hardhat.config.cjs                  # Hardhat configuration
├── package.json                        # Dependencies and build scripts
├── README.md                           # GitHub documentation
├── LICENSE                             # Open source MIT license
└── .gitignore                          # Protected files & directories
```

---

## 10. Installation Requirements
- **Node.js:** v18 or higher (Download from [nodejs.org](https://nodejs.org))
- **Ganache:** GUI or CLI (Download from [trufflesuite.com/ganache](https://trufflesuite.com/ganache))
- **MetaMask:** Browser extension for Chrome, Brave, or Firefox ([metamask.io](https://metamask.io))
- **Web Browser:** Any modern browser (Chrome, Edge, Brave, Firefox)

---

## 11. Ganache Setup
1. Launch **Ganache**.
2. Click **Quickstart Ethereum**.
3. Note the RPC Server address: `HTTP://127.0.0.1:7545` and Network ID: `5777` (or `1337`).
4. Ganache will generate 10 pre-funded test accounts with 100 ETH each.
5. Click the **key icon** next to Account #1 to copy its private key (for MetaMask import).

---

## 12. MetaMask Setup
1. Open the MetaMask extension.
2. Click the Network dropdown (top left) $\rightarrow$ **Add Network** $\rightarrow$ **Add a network manually**.
3. Fill in the network details:
   - **Network Name:** Ganache Local
   - **New RPC URL:** `http://127.0.0.1:7545`
   - **Chain ID:** `1337` (or `5777`)
   - **Currency Symbol:** `ETH`
4. Click **Save** and switch to *Ganache Local*.
5. Click Account icon $\rightarrow$ **Import Account** $\rightarrow$ Paste the private key copied from Ganache Account #1.
6. Your imported account will show a balance of **100 ETH**.

---

## 13. Remix Deployment (Method A - Recommended)
1. Open **[Remix IDE](https://remix.ethereum.org)** in your browser.
2. In the `contracts` folder, create a new file named `WelfareDistribution.sol`.
3. Copy the contract code from `contracts/WelfareDistribution.sol` and paste it into Remix.
4. Go to the **Solidity Compiler** tab:
   - Select compiler version `0.8.20`.
   - Click **Compile WelfareDistribution.sol**.
5. Go to the **Deploy & Run Transactions** tab:
   - Environment: Select **Injected Provider - MetaMask**.
   - MetaMask will prompt to connect to Remix $\rightarrow$ Confirm.
   - Click the orange **Deploy** button.
   - Confirm the transaction in MetaMask.
6. Under **Deployed Contracts**, copy the newly created contract address (e.g., `0x5FbD...`).
7. In the web application, open **Contract Details** and paste the deployed address.

---

## 14. Frontend Configuration
The frontend configuration resides in `src/contracts/contractConfig.ts`:
- `DEFAULT_CONTRACT_ADDRESS`: Default contract address.
- `WELFARE_DISTRIBUTION_ABI`: Compiled ABI array containing all functions and events.

You can also dynamically change the contract address at runtime by clicking the address pill in the app navbar.

---

## 15. How to Run
Clone the repository and start the development server:
```bash
# 1. Install dependencies
npm install

# 2. Run the web application
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 16. How to Test
Run the automated test suite covering all 11 test scenarios:
```bash
# Execute test suite using Hardhat
npx hardhat test test/WelfareDistribution.test.js
```
All 11 tests will execute against a local in-memory node and verify access control, state transitions, and error reversion.

---

## 17. Sample Demonstration Data
The project includes pre-configured demo beneficiaries for student presentations:
- **Beneficiary 1:** `Jaison Demo` — *Student Scholarship* — Status: `DISTRIBUTED` (₹10,000)
- **Beneficiary 2:** `Rahul Demo` — *Education Support* — Status: `APPROVED` (₹7,500)
- **Beneficiary 3:** `Ananya Demo` — *Medical Assistance* — Status: `REGISTERED` (₹0)

---

## 18. Screenshots Section
Capture the following screenshots for your lab report:
1. `ganache_running.png`: Ganache local testnet with 10 accounts and block height.
2. `metamask_connected.png`: MetaMask wallet connected to Ganache Local (`http://127.0.0.1:7545`).
3. `remix_compile.png`: Successful compilation of `WelfareDistribution.sol` in Remix IDE.
4. `remix_deploy.png`: Deployment receipt and contract address under Deployed Contracts.
5. `app_admin_dashboard.png`: Web application Admin Dashboard showing registration, approval, and distribution forms.
6. `registration_tx.png`: Confirmation banner showing Tx Hash and Block Number for registration.
7. `approval_tx.png`: Confirmation banner showing status transition to `APPROVED`.
8. `distribution_tx.png`: Disbursement transaction receipt showing ₹10,000 disbursed.
9. `verification_result.png`: Public Verification query showing the verified cryptographic badge for Beneficiary #1.
10. `audit_trail_explorer.png`: Blockchain Explorer view displaying blocks, hashes, gas used, and event logs.

---

## 19. Security Considerations
- **Access Control:** Critical state-modifying functions (`registerBeneficiary`, `approveBeneficiary`, `distributeBenefit`) are restricted strictly to the government admin using the `onlyAdmin` modifier.
- **Precondition Assertions:** Validates non-empty names, valid ID ranges, and positive disbursement amounts using `require()` statements.
- **Sequential Lifecycle Enforcement:** A beneficiary cannot jump directly from `Registered` to `Distributed` without verified `Approved` status.
- **Double-Disbursement Prevention:** The smart contract rejects any attempt to disburse funds to a beneficiary who has already received a distribution (`b.status != BeneficiaryStatus.Distributed`).
- **Zero Real Credentials:** Uses strictly fictional demonstration data; no Aadhaar, PAN, banking PINs, or real private keys are ever stored or transmitted.

---

## 20. Limitations
- **The Oracle Problem:** The blockchain enforces data immutability once written, but cannot verify whether human administrative input was truthful at the moment of entry.
- **Gas & Scalability:** Public Ethereum mainnet incurs high gas costs; production government implementations require Layer 2 rollups or permissioned enterprise chains (e.g., Hyperledger Fabric).
- **Single-Key Reliance:** The prototype uses a single admin key; production requires multi-signature governance.

---

## 21. Future Enhancements
- **Multi-Sig Governance:** District and state-level approval tiers requiring m-of-n administrative signatures before disbursement.
- **Zero-Knowledge Proofs (ZK-SNARKs):** Allow citizens to prove eligibility (e.g., income threshold) without revealing sensitive identity records.
- **CBDC / e-Rupee Integration:** Directly transfer Reserve Bank of India digital tokens to the citizen's wallet within the disbursement transaction.
- **IoT Ration Oracles:** Automated biometric hardware triggering disbursement transactions at distribution centers.

---

## 22. Academic Assignment Mapping
| Assignment Evaluation Parameter | How Satisfied in this Project |
| :--- | :--- |
| **Real-World Use Case** | Government Welfare Scheme Distribution Tracking System |
| **Smart Contract Rigor** | Solidity `0.8.20`, structs, mappings, enums, modifiers, events |
| **Blockchain Technology** | Ethereum-compatible EVM, Ganache local testnet, MetaMask |
| **Full-Stack Implementation** | Interactive Web3 dashboard built with React 19 and Ethers.js v6 |
| **Auditability & Verification** | Public verification portal and on-chain transaction block explorer |
| **Zero-Cost Delivery** | 100% free open-source tools with zero paid API dependencies |

---

## 23. Author
- **Author:** Jaison J  
- **Degree:** Bachelor of Engineering (B.E.), Computer Science & Engineering  
- **Course:** BIC702 Blockchain Technology — Activity 1
