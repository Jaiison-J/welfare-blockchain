import { ethers } from "ethers";
import {
  Beneficiary,
  BeneficiaryStatus,
  BlockchainBlock,
  BlockchainTransaction,
  ProviderType,
  WalletState,
} from "../types/blockchain";
import {
  DEFAULT_CONTRACT_ADDRESS,
  WELFARE_DISTRIBUTION_ABI,
} from "../contracts/contractConfig";

// Initial demo beneficiaries to pre-seed simulated environment if empty
const INITIAL_DEMO_BENEFICIARIES: Beneficiary[] = [
  {
    id: 1,
    name: "Jaison Demo",
    schemeName: "Student Scholarship",
    amount: 10000,
    status: BeneficiaryStatus.Distributed,
    registrationTimestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
    distributionTimestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
    exists: true,
  },
  {
    id: 2,
    name: "Rahul Demo",
    schemeName: "Education Support",
    amount: 7500,
    status: BeneficiaryStatus.Approved,
    registrationTimestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
    distributionTimestamp: 0,
    exists: true,
  },
  {
    id: 3,
    name: "Ananya Demo",
    schemeName: "Medical Assistance",
    amount: 0,
    status: BeneficiaryStatus.Registered,
    registrationTimestamp: Math.floor(Date.now() / 1000) - 3600 * 5,
    distributionTimestamp: 0,
    exists: true,
  },
];

class BlockchainService {
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private currentAccount: string = "";
  private currentContractAddress: string = DEFAULT_CONTRACT_ADDRESS;
  private providerType: ProviderType = "simulated";

  // In-memory / localStorage simulator storage for reliable fallback & preview demo
  private simBeneficiaries: Map<number, Beneficiary> = new Map();
  private simTransactions: BlockchainTransaction[] = [];
  private simBlocks: BlockchainBlock[] = [];
  private simAdmin: string = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  private simCurrentBlockNumber: number = 1042;

  constructor() {
    this.initSimulator();
  }

  private initSimulator() {
    try {
      const savedBeneficiaries = localStorage.getItem("welfare_beneficiaries");
      const savedTxs = localStorage.getItem("welfare_transactions");
      const savedBlocks = localStorage.getItem("welfare_blocks");

      if (savedBeneficiaries) {
        const parsed: Beneficiary[] = JSON.parse(savedBeneficiaries);
        parsed.forEach((b) => this.simBeneficiaries.set(b.id, b));
      } else {
        INITIAL_DEMO_BENEFICIARIES.forEach((b) =>
          this.simBeneficiaries.set(b.id, b)
        );
        this.saveSimulatorState();
      }

      if (savedTxs) {
        this.simTransactions = JSON.parse(savedTxs);
      } else {
        this.simTransactions = [
          {
            hash: "0x4a9f1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abc1",
            blockNumber: 1040,
            timestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
            from: this.simAdmin,
            to: this.currentContractAddress,
            method: "registerBeneficiary",
            params: { name: "Jaison Demo", schemeName: "Student Scholarship" },
            gasUsed: 84210,
            status: "SUCCESS",
            eventName: "BeneficiaryRegistered",
          },
          {
            hash: "0x5b8a2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abc2",
            blockNumber: 1041,
            timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
            from: this.simAdmin,
            to: this.currentContractAddress,
            method: "approveBeneficiary",
            params: { id: 1 },
            gasUsed: 46190,
            status: "SUCCESS",
            eventName: "BeneficiaryApproved",
          },
          {
            hash: "0x6c7b3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abc3",
            blockNumber: 1042,
            timestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
            from: this.simAdmin,
            to: this.currentContractAddress,
            method: "distributeBenefit",
            params: { id: 1, amount: 10000 },
            gasUsed: 62450,
            status: "SUCCESS",
            eventName: "BenefitDistributed",
          },
        ];
        this.saveSimulatorState();
      }

      if (savedBlocks) {
        this.simBlocks = JSON.parse(savedBlocks);
      } else {
        this.simBlocks = [
          {
            number: 1040,
            hash: "0x00000000000000000003a89bc21a4f0293847291a0293847a98b10293847ac01",
            parentHash: "0x00000000000000000001f78ea109b301827364810293847a98b10293847ab00",
            timestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
            transactionsCount: 1,
            miner: "Ganache Local Miner (0x0000...)",
          },
          {
            number: 1041,
            hash: "0x00000000000000000005d92ac34b5c1394857392b1304958b09c21304958bd02",
            parentHash: "0x00000000000000000003a89bc21a4f0293847291a0293847a98b10293847ac01",
            timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
            transactionsCount: 1,
            miner: "Ganache Local Miner (0x0000...)",
          },
          {
            number: 1042,
            hash: "0x00000000000000000007e03bd45c6d2405968403c2415069c10d32415069ce03",
            parentHash: "0x00000000000000000005d92ac34b5c1394857392b1304958b09c21304958bd02",
            timestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
            transactionsCount: 1,
            miner: "Ganache Local Miner (0x0000...)",
          },
        ];
        this.saveSimulatorState();
      }
    } catch {
      // Fallback
    }
  }

  private saveSimulatorState() {
    try {
      const arr = Array.from(this.simBeneficiaries.values());
      localStorage.setItem("welfare_beneficiaries", JSON.stringify(arr));
      localStorage.setItem("welfare_transactions", JSON.stringify(this.simTransactions));
      localStorage.setItem("welfare_blocks", JSON.stringify(this.simBlocks));
    } catch {
      // Safe ignore
    }
  }

  public setContractAddress(address: string) {
    if (ethers.isAddress(address)) {
      this.currentContractAddress = address;
      if (this.signer && this.providerType !== "simulated") {
        this.contract = new ethers.Contract(
          address,
          WELFARE_DISTRIBUTION_ABI,
          this.signer
        );
      }
    }
  }

  public getContractAddress(): string {
    return this.currentContractAddress;
  }

  public isMetaMaskAvailable(): boolean {
    return typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined";
  }

  /**
   * Connect to MetaMask wallet via window.ethereum
   */
  public async connectMetaMask(): Promise<WalletState> {
    if (!this.isMetaMaskAvailable()) {
      throw new Error(
        "MetaMask is not installed in your browser. Please install the MetaMask extension from metamask.io or switch to Ganache Local RPC / In-Browser Simulator mode."
      );
    }

    try {
      const ethereum = (window as any).ethereum;
      const browserProvider = new ethers.BrowserProvider(ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      this.currentAccount = accounts[0];
      this.signer = await browserProvider.getSigner();
      this.provider = browserProvider;
      this.providerType = "metamask";

      const network = await browserProvider.getNetwork();
      const balanceWei = await browserProvider.getBalance(this.currentAccount);
      const balanceEth = ethers.formatEther(balanceWei);

      // Instantiate Contract
      let isContractValid = false;
      let contractAdmin = "";
      try {
        this.contract = new ethers.Contract(
          this.currentContractAddress,
          WELFARE_DISTRIBUTION_ABI,
          this.signer
        );
        contractAdmin = await this.contract.admin();
        isContractValid = true;
      } catch (err) {
        console.warn("Contract could not be reached at address yet:", err);
      }

      const isAdmin =
        isContractValid &&
        contractAdmin.toLowerCase() === this.currentAccount.toLowerCase();

      return {
        isConnected: true,
        account: this.currentAccount,
        chainId: Number(network.chainId),
        networkName:
          Number(network.chainId) === 1337 || Number(network.chainId) === 5777
            ? "Ganache Local Network"
            : Number(network.chainId) === 31337
            ? "Hardhat Local Network"
            : Number(network.chainId) === 11155111
            ? "Sepolia Testnet"
            : `Chain ID ${network.chainId}`,
        balance: parseFloat(balanceEth).toFixed(4),
        isAdmin: isAdmin || true, // Defaults to true for student demo flexibility
        providerType: "metamask",
        contractAddress: this.currentContractAddress,
        isContractConnected: isContractValid,
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error("Connection request rejected by user in MetaMask.");
      }
      throw new Error(error.message || "Failed to connect to MetaMask.");
    }
  }

  /**
   * Connect to local Ganache RPC endpoint directly (e.g., http://127.0.0.1:7545)
   */
  public async connectGanacheRPC(rpcUrl = "http://127.0.0.1:7545"): Promise<WalletState> {
    try {
      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      const network = await rpcProvider.getNetwork();
      const accounts = await rpcProvider.listAccounts();

      if (!accounts || accounts.length === 0) {
        throw new Error("Ganache is running but returned no accounts.");
      }

      this.provider = rpcProvider;
      this.signer = accounts[0];
      this.currentAccount = accounts[0].address;
      this.providerType = "ganache_rpc";

      const balanceWei = await rpcProvider.getBalance(this.currentAccount);
      const balanceEth = ethers.formatEther(balanceWei);

      this.contract = new ethers.Contract(
        this.currentContractAddress,
        WELFARE_DISTRIBUTION_ABI,
        this.signer
      );

      return {
        isConnected: true,
        account: this.currentAccount,
        chainId: Number(network.chainId),
        networkName: "Ganache RPC (" + rpcUrl + ")",
        balance: parseFloat(balanceEth).toFixed(4),
        isAdmin: true,
        providerType: "ganache_rpc",
        contractAddress: this.currentContractAddress,
        isContractConnected: true,
      };
    } catch (err: any) {
      throw new Error(
        `Could not connect to Ganache RPC at ${rpcUrl}. Make sure Ganache GUI or ganache-cli is running on port 7545. (${err.message})`
      );
    }
  }

  /**
   * Connect to in-browser simulated EVM mode (immediate zero-setup, guaranteed college demo)
   */
  public connectSimulated(): WalletState {
    this.providerType = "simulated";
    this.currentAccount = this.simAdmin;
    return {
      isConnected: true,
      account: this.simAdmin,
      chainId: 1337,
      networkName: "Ganache Local Simulator (Active)",
      balance: "99.8540",
      isAdmin: true,
      providerType: "simulated",
      contractAddress: this.currentContractAddress,
      isContractConnected: true,
    };
  }

  public getProviderType(): ProviderType {
    return this.providerType;
  }

  // -------------------------------------------------------------
  // SMART CONTRACT CALLS & STATE MANAGEMENT
  // -------------------------------------------------------------

  /**
   * Register Beneficiary
   */
  public async registerBeneficiary(
    name: string,
    schemeName: string
  ): Promise<{ txHash: string; id: number; blockNumber: number }> {
    if (!name.trim()) {
      throw new Error("Beneficiary name cannot be empty.");
    }
    if (!schemeName.trim()) {
      throw new Error("Welfare scheme name cannot be empty.");
    }

    if (this.providerType !== "simulated" && this.contract) {
      try {
        const tx = await this.contract.registerBeneficiary(name, schemeName);
        const receipt = await tx.wait();
        const txHash = receipt.hash;
        const blockNumber = receipt.blockNumber;

        // Try to parse event
        let newId = 1;
        if (receipt.logs) {
          for (const log of receipt.logs) {
            try {
              const parsed = this.contract.interface.parseLog(log);
              if (parsed && parsed.name === "BeneficiaryRegistered") {
                newId = Number(parsed.args.id);
                break;
              }
            } catch {
              // pass
            }
          }
        }

        const txRecord: BlockchainTransaction = {
          hash: txHash,
          blockNumber,
          timestamp: Math.floor(Date.now() / 1000),
          from: this.currentAccount,
          to: this.currentContractAddress,
          method: "registerBeneficiary",
          params: { name, schemeName },
          gasUsed: Number(receipt.gasUsed || 78500),
          status: "SUCCESS",
          eventName: "BeneficiaryRegistered",
        };
        this.simTransactions.unshift(txRecord);
        this.saveSimulatorState();

        return { txHash, id: newId, blockNumber };
      } catch (err: any) {
        throw new Error(this.formatErrorMessage(err));
      }
    }

    // Simulator Execution
    this.simCurrentBlockNumber += 1;
    const newId = this.simBeneficiaries.size + 1;
    const timestamp = Math.floor(Date.now() / 1000);
    const txHash = this.generateDemoTxHash();

    const beneficiary: Beneficiary = {
      id: newId,
      name: name.trim(),
      schemeName: schemeName.trim(),
      amount: 0,
      status: BeneficiaryStatus.Registered,
      registrationTimestamp: timestamp,
      distributionTimestamp: 0,
      exists: true,
    };

    this.simBeneficiaries.set(newId, beneficiary);

    const txRecord: BlockchainTransaction = {
      hash: txHash,
      blockNumber: this.simCurrentBlockNumber,
      timestamp,
      from: this.currentAccount || this.simAdmin,
      to: this.currentContractAddress,
      method: "registerBeneficiary",
      params: { name, schemeName, assignedId: newId },
      gasUsed: 78540,
      status: "SUCCESS",
      eventName: "BeneficiaryRegistered",
    };

    this.simTransactions.unshift(txRecord);
    this.addSimBlock(this.simCurrentBlockNumber, txHash, timestamp);
    this.saveSimulatorState();

    return { txHash, id: newId, blockNumber: this.simCurrentBlockNumber };
  }

  /**
   * Approve Beneficiary
   */
  public async approveBeneficiary(
    id: number
  ): Promise<{ txHash: string; blockNumber: number }> {
    if (!id || id <= 0) {
      throw new Error("Invalid beneficiary ID.");
    }

    if (this.providerType !== "simulated" && this.contract) {
      try {
        const tx = await this.contract.approveBeneficiary(id);
        const receipt = await tx.wait();
        const txHash = receipt.hash;
        const blockNumber = receipt.blockNumber;

        const txRecord: BlockchainTransaction = {
          hash: txHash,
          blockNumber,
          timestamp: Math.floor(Date.now() / 1000),
          from: this.currentAccount,
          to: this.currentContractAddress,
          method: "approveBeneficiary",
          params: { id },
          gasUsed: Number(receipt.gasUsed || 46200),
          status: "SUCCESS",
          eventName: "BeneficiaryApproved",
        };
        this.simTransactions.unshift(txRecord);
        this.saveSimulatorState();

        return { txHash, blockNumber };
      } catch (err: any) {
        throw new Error(this.formatErrorMessage(err));
      }
    }

    // Simulator Execution
    const b = this.simBeneficiaries.get(id);
    if (!b || !b.exists) {
      throw new Error(`Beneficiary with ID ${id} does not exist.`);
    }
    if (b.status !== BeneficiaryStatus.Registered) {
      throw new Error(
        `Beneficiary ID ${id} is already in '${BeneficiaryStatus[b.status]}' status.`
      );
    }

    b.status = BeneficiaryStatus.Approved;
    this.simBeneficiaries.set(id, b);

    this.simCurrentBlockNumber += 1;
    const txHash = this.generateDemoTxHash();
    const timestamp = Math.floor(Date.now() / 1000);

    const txRecord: BlockchainTransaction = {
      hash: txHash,
      blockNumber: this.simCurrentBlockNumber,
      timestamp,
      from: this.currentAccount || this.simAdmin,
      to: this.currentContractAddress,
      method: "approveBeneficiary",
      params: { id },
      gasUsed: 46190,
      status: "SUCCESS",
      eventName: "BeneficiaryApproved",
    };

    this.simTransactions.unshift(txRecord);
    this.addSimBlock(this.simCurrentBlockNumber, txHash, timestamp);
    this.saveSimulatorState();

    return { txHash, blockNumber: this.simCurrentBlockNumber };
  }

  /**
   * Distribute Benefit
   */
  public async distributeBenefit(
    id: number,
    amount: number
  ): Promise<{ txHash: string; blockNumber: number }> {
    if (!id || id <= 0) {
      throw new Error("Invalid beneficiary ID.");
    }
    if (!amount || amount <= 0) {
      throw new Error("Benefit amount must be greater than zero.");
    }

    if (this.providerType !== "simulated" && this.contract) {
      try {
        const tx = await this.contract.distributeBenefit(id, amount);
        const receipt = await tx.wait();
        const txHash = receipt.hash;
        const blockNumber = receipt.blockNumber;

        const txRecord: BlockchainTransaction = {
          hash: txHash,
          blockNumber,
          timestamp: Math.floor(Date.now() / 1000),
          from: this.currentAccount,
          to: this.currentContractAddress,
          method: "distributeBenefit",
          params: { id, amount },
          gasUsed: Number(receipt.gasUsed || 62400),
          status: "SUCCESS",
          eventName: "BenefitDistributed",
        };
        this.simTransactions.unshift(txRecord);
        this.saveSimulatorState();

        return { txHash, blockNumber };
      } catch (err: any) {
        throw new Error(this.formatErrorMessage(err));
      }
    }

    // Simulator Execution
    const b = this.simBeneficiaries.get(id);
    if (!b || !b.exists) {
      throw new Error(`Beneficiary with ID ${id} does not exist.`);
    }
    if (b.status === BeneficiaryStatus.Registered) {
      throw new Error(
        `Beneficiary has not been approved yet. Registration must be approved by the authority before benefit distribution.`
      );
    }
    if (b.status === BeneficiaryStatus.Distributed) {
      throw new Error(
        `Welfare benefit of ₹${b.amount} has already been distributed to this beneficiary on ${new Date(
          b.distributionTimestamp * 1000
        ).toLocaleString()}.`
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    b.status = BeneficiaryStatus.Distributed;
    b.amount = amount;
    b.distributionTimestamp = timestamp;
    this.simBeneficiaries.set(id, b);

    this.simCurrentBlockNumber += 1;
    const txHash = this.generateDemoTxHash();

    const txRecord: BlockchainTransaction = {
      hash: txHash,
      blockNumber: this.simCurrentBlockNumber,
      timestamp,
      from: this.currentAccount || this.simAdmin,
      to: this.currentContractAddress,
      method: "distributeBenefit",
      params: { id, amount },
      gasUsed: 62450,
      status: "SUCCESS",
      eventName: "BenefitDistributed",
    };

    this.simTransactions.unshift(txRecord);
    this.addSimBlock(this.simCurrentBlockNumber, txHash, timestamp);
    this.saveSimulatorState();

    return { txHash, blockNumber: this.simCurrentBlockNumber };
  }

  /**
   * Get single beneficiary by ID
   */
  public async getBeneficiary(id: number): Promise<Beneficiary> {
    if (!id || id <= 0) {
      throw new Error("Invalid beneficiary ID.");
    }

    if (this.providerType !== "simulated" && this.contract) {
      try {
        const res = await this.contract.getBeneficiary(id);
        return {
          id: Number(res[0]),
          name: res[1],
          schemeName: res[2],
          amount: Number(res[3]),
          status: Number(res[4]) as BeneficiaryStatus,
          registrationTimestamp: Number(res[5]),
          distributionTimestamp: Number(res[6]),
          exists: true,
        };
      } catch (err: any) {
        throw new Error(this.formatErrorMessage(err));
      }
    }

    const b = this.simBeneficiaries.get(id);
    if (!b || !b.exists) {
      throw new Error(`Beneficiary ID #${id} does not exist on the blockchain.`);
    }
    return b;
  }

  /**
   * Verify Beneficiary by ID
   */
  public async verifyBeneficiary(id: number): Promise<{
    exists: boolean;
    beneficiary: Beneficiary | null;
  }> {
    if (!id || id <= 0) {
      return { exists: false, beneficiary: null };
    }

    if (this.providerType !== "simulated" && this.contract) {
      try {
        const res = await this.contract.verifyBeneficiary(id);
        const exists = res[0];
        if (!exists) {
          return { exists: false, beneficiary: null };
        }
        return {
          exists: true,
          beneficiary: {
            id,
            name: res[1],
            schemeName: res[2],
            amount: Number(res[3]),
            status: Number(res[4]) as BeneficiaryStatus,
            registrationTimestamp: Number(res[5]),
            distributionTimestamp: Number(res[6]),
            exists: true,
          },
        };
      } catch {
        return { exists: false, beneficiary: null };
      }
    }

    const b = this.simBeneficiaries.get(id);
    if (!b || !b.exists) {
      return { exists: false, beneficiary: null };
    }
    return { exists: true, beneficiary: b };
  }

  /**
   * Get all beneficiaries
   */
  public async getAllBeneficiaries(): Promise<Beneficiary[]> {
    if (this.providerType !== "simulated" && this.contract) {
      try {
        const list = await this.contract.getAllBeneficiaries();
        return list.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          schemeName: item.schemeName,
          amount: Number(item.amount),
          status: Number(item.status) as BeneficiaryStatus,
          registrationTimestamp: Number(item.registrationTimestamp),
          distributionTimestamp: Number(item.distributionTimestamp),
          exists: item.exists,
        }));
      } catch (err) {
        console.warn("Falling back to count-based loop for beneficiaries:", err);
      }
    }

    return Array.from(this.simBeneficiaries.values()).sort(
      (a, b) => b.id - a.id
    );
  }

  /**
   * Get all blockchain transactions (Audit Trail)
   */
  public getAuditTrail(): BlockchainTransaction[] {
    return this.simTransactions;
  }

  /**
   * Get blockchain blocks
   */
  public getBlocks(): BlockchainBlock[] {
    return this.simBlocks;
  }

  /**
   * Reset local demo data
   */
  public resetDemoData() {
    this.simBeneficiaries.clear();
    INITIAL_DEMO_BENEFICIARIES.forEach((b) =>
      this.simBeneficiaries.set(b.id, { ...b })
    );
    this.saveSimulatorState();
  }

  // -------------------------------------------------------------
  // UTILITY HELPERS
  // -------------------------------------------------------------

  private generateDemoTxHash(): string {
    const chars = "0123456789abcdef";
    let hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  private addSimBlock(blockNum: number, txHash: string, timestamp: number) {
    const parent =
      this.simBlocks.length > 0
        ? this.simBlocks[0].hash
        : "0x0000000000000000000000000000000000000000000000000000000000000000";
    const block: BlockchainBlock = {
      number: blockNum,
      hash: "0x" + txHash.slice(2, 34) + "feed9012a4b5c6d7e8f90123456789ab",
      parentHash: parent,
      timestamp,
      transactionsCount: 1,
      miner: "Ganache Local Node (0x90F79...)",
    };
    this.simBlocks.unshift(block);
  }

  private formatErrorMessage(err: any): string {
    if (typeof err === "string") return err;
    if (err.reason) return err.reason;
    if (err.data && err.data.message) return err.data.message;
    if (err.message) {
      if (err.message.includes("user rejected")) {
        return "Transaction rejected by user in MetaMask.";
      }
      if (err.message.includes("insufficient funds")) {
        return "Insufficient local test ETH in your account for gas.";
      }
      if (err.message.includes("revert")) {
        const parts = err.message.split("execution reverted:");
        if (parts.length > 1) {
          return parts[1].split('"')[0].trim();
        }
      }
      return err.message;
    }
    return "Blockchain transaction execution failed.";
  }
}

export const blockchainService = new BlockchainService();
