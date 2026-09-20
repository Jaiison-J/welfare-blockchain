import React, { useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  Send,
  ExternalLink,
  Copy,
  Clock,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Coins
} from "lucide-react";
import { Beneficiary, BeneficiaryStatus, WalletState } from "../types/blockchain";
import { blockchainService } from "../services/blockchain";

interface AdminDashboardProps {
  walletState: WalletState;
  beneficiaries: Beneficiary[];
  onRefresh: () => void;
  onNavigateToAudit: () => void;
  onNavigateToVerify: (id: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  walletState,
  beneficiaries,
  onRefresh,
  onNavigateToAudit,
  onNavigateToVerify,
}) => {
  // Form states
  const [registerName, setRegisterName] = useState("");
  const [registerScheme, setRegisterScheme] = useState("");
  const [approveId, setApproveId] = useState<string>("");
  const [distributeId, setDistributeId] = useState<string>("");
  const [distributeAmount, setDistributeAmount] = useState<string>("");

  // UI state
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestTx, setLatestTx] = useState<{
    hash: string;
    action: string;
    blockNumber: number;
    details: string;
  } | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Quick Demo Autofills
  const handleAutofill = (name: string, scheme: string) => {
    setRegisterName(name);
    setRegisterScheme(scheme);
  };

  // 1. Register Beneficiary
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLatestTx(null);

    if (!registerName.trim()) {
      setErrorMessage("Beneficiary name is required.");
      return;
    }
    if (!registerScheme.trim()) {
      setErrorMessage("Welfare scheme name is required.");
      return;
    }

    try {
      setLoadingAction("register");
      const result = await blockchainService.registerBeneficiary(
        registerName,
        registerScheme
      );
      setLatestTx({
        hash: result.txHash,
        action: "Beneficiary Registered",
        blockNumber: result.blockNumber,
        details: `Beneficiary "${registerName}" registered with assigned ID #${result.id} for "${registerScheme}". Status: REGISTERED.`,
      });
      setRegisterName("");
      setRegisterScheme("");
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed on blockchain.");
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Approve Beneficiary
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLatestTx(null);

    const idNum = parseInt(approveId, 10);
    if (isNaN(idNum) || idNum <= 0) {
      setErrorMessage("Please enter a valid positive Beneficiary ID.");
      return;
    }

    try {
      setLoadingAction("approve");
      const result = await blockchainService.approveBeneficiary(idNum);
      setLatestTx({
        hash: result.txHash,
        action: "Beneficiary Approved",
        blockNumber: result.blockNumber,
        details: `Beneficiary ID #${idNum} has been verified and approved by government authority. Status: APPROVED (Eligible for Benefit).`,
      });
      setApproveId("");
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Approval failed on blockchain.");
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Distribute Benefit
  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLatestTx(null);

    const idNum = parseInt(distributeId, 10);
    const amountNum = parseFloat(distributeAmount);

    if (isNaN(idNum) || idNum <= 0) {
      setErrorMessage("Please enter a valid Beneficiary ID.");
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage("Please enter a valid benefit amount greater than 0.");
      return;
    }

    try {
      setLoadingAction("distribute");
      const result = await blockchainService.distributeBenefit(idNum, amountNum);
      setLatestTx({
        hash: result.txHash,
        action: "Benefit Distributed",
        blockNumber: result.blockNumber,
        details: `Welfare disbursement of ₹${amountNum.toLocaleString()} recorded on blockchain for Beneficiary ID #${idNum}. Status: DISTRIBUTED.`,
      });
      setDistributeId("");
      setDistributeAmount("");
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Disbursement failed on blockchain.");
    } finally {
      setLoadingAction(null);
    }
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Summary Metrics
  const totalCount = beneficiaries.length;
  const registeredCount = beneficiaries.filter(
    (b) => b.status === BeneficiaryStatus.Registered
  ).length;
  const approvedCount = beneficiaries.filter(
    (b) => b.status === BeneficiaryStatus.Approved
  ).length;
  const distributedCount = beneficiaries.filter(
    (b) => b.status === BeneficiaryStatus.Distributed
  ).length;
  const totalDisbursedAmount = beneficiaries
    .filter((b) => b.status === BeneficiaryStatus.Distributed)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / System Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              Nodal Authority Management Console
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              WELFARE BLOCKCHAIN ADMIN
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Execute smart contract transactions to register citizens, verify and
              approve eligibility, and disburse welfare benefits recorded on the
              Ethereum-compatible ledger.
            </p>
          </div>

          {/* Connected Network & Contract Status Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Wallet Tile */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Wallet Status
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    walletState.isConnected ? "bg-emerald-400" : "bg-rose-500"
                  }`}
                />
                <span className="text-sm font-semibold text-white">
                  {walletState.isConnected ? "Connected" : "Not Connected"}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                {walletState.account}
              </div>
            </div>

            {/* Network Tile */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Blockchain Network
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-sm font-semibold text-white truncate max-w-[150px]">
                  {walletState.networkName || "Ganache Local Network"}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Chain ID: {walletState.chainId}
              </div>
            </div>

            {/* Contract Tile */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Smart Contract
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    walletState.isContractConnected ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span className="text-sm font-semibold text-white">
                  {walletState.isContractConnected ? "Active & Linked" : "Simulated"}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                {walletState.contractAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-800/40">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Total Registered</div>
              <div className="text-xl font-bold text-white">{totalCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/40 text-amber-400 border border-amber-800/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Pending Approval</div>
              <div className="text-xl font-bold text-amber-300">{registeredCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Approved (Ready)</div>
              <div className="text-xl font-bold text-emerald-300">{approvedCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-900/40 text-purple-400 border border-purple-800/40">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Disbursed Funds</div>
              <div className="text-xl font-bold text-purple-300">
                ₹{totalDisbursedAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold">Transaction Error</h4>
            <p className="text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Latest Transaction Receipt Card */}
      {latestTx && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Block #{latestTx.blockNumber} Confirmed
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {latestTx.action}
                </h4>
              </div>
            </div>
            <button
              onClick={onNavigateToAudit}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              View in Blockchain Explorer <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-700 font-medium mb-3">
            {latestTx.details}
          </p>

          <div className="bg-white border border-emerald-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-600 font-mono truncate">
              <span className="font-semibold text-slate-800">Tx Hash:</span>{" "}
              {latestTx.hash}
            </div>
            <button
              onClick={() => copyTxHash(latestTx.hash)}
              className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 self-start sm:self-auto transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedHash ? "Copied!" : "Copy Hash"}
            </button>
          </div>
        </div>
      )}

      {/* 3 Core Workflow Actions: Register, Approve, Distribute */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========================================================= */}
        {/* 1. REGISTER BENEFICIARY SECTION */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  REGISTER BENEFICIARY
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Step 1
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enrolls a citizen into a government welfare initiative. Writes a
              new beneficiary struct to the contract storage.
            </p>

            {/* Quick Demo Data Autofill Buttons */}
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick Demo Test Data:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleAutofill("Jaison Demo", "Student Scholarship")
                  }
                  className="text-[11px] px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors"
                >
                  Jaison Demo (Scholarship)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAutofill("Rahul Demo", "Education Support")
                  }
                  className="text-[11px] px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors"
                >
                  Rahul Demo (Education)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAutofill("Ananya Demo", "Medical Assistance")
                  }
                  className="text-[11px] px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded border border-slate-200 transition-colors"
                >
                  Ananya Demo (Medical)
                </button>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiary Name:
                </label>
                <input
                  id="input-beneficiary-name"
                  type="text"
                  placeholder="e.g. Jaison Demo"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Welfare Scheme:
                </label>
                <input
                  id="input-welfare-scheme"
                  type="text"
                  placeholder="e.g. Student Scholarship"
                  value={registerScheme}
                  onChange={(e) => setRegisterScheme(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                id="btn-register-beneficiary"
                type="submit"
                disabled={loadingAction === "register"}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {loadingAction === "register" ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mining Transaction...
                  </span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    [ Register Beneficiary ]
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Emits: <code className="font-mono text-slate-600">BeneficiaryRegistered</code> event
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. APPROVE BENEFICIARY SECTION */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  APPROVE BENEFICIARY
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Step 2
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Authorized verification step. Moves status from{" "}
              <span className="font-semibold text-slate-700">REGISTERED</span>{" "}
              to{" "}
              <span className="font-semibold text-emerald-700">APPROVED</span>.
              Beneficiary cannot receive funds without this approval.
            </p>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiary ID:
                </label>
                <input
                  id="input-approve-id"
                  type="number"
                  placeholder="e.g. 1, 2, 3..."
                  value={approveId}
                  onChange={(e) => setApproveId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              {/* Pending Approvals quick select */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  Registered IDs Pending Approval:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {beneficiaries
                    .filter((b) => b.status === BeneficiaryStatus.Registered)
                    .map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setApproveId(b.id.toString())}
                        className="text-[11px] px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded border border-amber-200 font-mono"
                      >
                        #{b.id} ({b.name})
                      </button>
                    ))}
                  {beneficiaries.filter((b) => b.status === BeneficiaryStatus.Registered)
                    .length === 0 && (
                    <span className="text-[11px] text-slate-400 italic">
                      No beneficiaries currently pending approval.
                    </span>
                  )}
                </div>
              </div>

              <button
                id="btn-approve-beneficiary"
                type="submit"
                disabled={loadingAction === "approve"}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {loadingAction === "approve" ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mining Transaction...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    [ Approve Beneficiary ]
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Emits: <code className="font-mono text-slate-600">BeneficiaryApproved</code> event
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. DISTRIBUTE BENEFIT SECTION */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  DISTRIBUTE BENEFIT
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Step 3
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Disburses the welfare benefit. Contract strictly enforces that the
              beneficiary must have status{" "}
              <span className="font-semibold text-emerald-700">APPROVED</span>.
            </p>

            <form onSubmit={handleDistribute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiary ID:
                </label>
                <input
                  id="input-distribute-id"
                  type="number"
                  placeholder="e.g. 1, 2, 3..."
                  value={distributeId}
                  onChange={(e) => setDistributeId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount (₹):
                </label>
                <input
                  id="input-distribute-amount"
                  type="number"
                  placeholder="e.g. 10000"
                  value={distributeAmount}
                  onChange={(e) => setDistributeAmount(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  required
                />
              </div>

              {/* Eligible Beneficiaries quick select */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  Approved IDs Ready for Disbursement:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {beneficiaries
                    .filter((b) => b.status === BeneficiaryStatus.Approved)
                    .map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setDistributeId(b.id.toString());
                          setDistributeAmount(
                            b.schemeName.includes("Scholarship")
                              ? "10000"
                              : b.schemeName.includes("Medical")
                              ? "12000"
                              : "7500"
                          );
                        }}
                        className="text-[11px] px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded border border-emerald-200 font-mono"
                      >
                        #{b.id} ({b.name})
                      </button>
                    ))}
                  {beneficiaries.filter((b) => b.status === BeneficiaryStatus.Approved)
                    .length === 0 && (
                    <span className="text-[11px] text-slate-400 italic">
                      No approved beneficiaries ready for disbursement.
                    </span>
                  )}
                </div>
              </div>

              <button
                id="btn-distribute-benefit"
                type="submit"
                disabled={loadingAction === "distribute"}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {loadingAction === "distribute" ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mining Transaction...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    [ Distribute Benefit ]
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Emits: <code className="font-mono text-slate-600">BenefitDistributed</code> event
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BENEFICIARY REGISTRATION & DISBURSEMENT LEDGER TABLE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              On-Chain Beneficiary Registry
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live state stored directly in the Solidity smart contract mapping
              and enumerated dynamically.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            Refresh Ledger Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Beneficiary</th>
                <th className="px-5 py-3">Welfare Scheme</th>
                <th className="px-5 py-3">Benefit (₹)</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Registered On</th>
                <th className="px-5 py-3">Disbursed On</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {beneficiaries.map((b) => {
                const isRegistered = b.status === BeneficiaryStatus.Registered;
                const isApproved = b.status === BeneficiaryStatus.Approved;
                const isDistributed = b.status === BeneficiaryStatus.Distributed;

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      #{b.id}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {b.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {b.schemeName}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-800">
                      {b.amount > 0 ? `₹${b.amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {isRegistered && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          REGISTERED
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          APPROVED
                        </span>
                      )}
                      {isDistributed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                          DISTRIBUTED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(b.registrationTimestamp * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {b.distributionTimestamp > 0
                        ? new Date(
                            b.distributionTimestamp * 1000
                          ).toLocaleDateString()
                        : "Pending"}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isRegistered && (
                          <button
                            onClick={() => setApproveId(b.id.toString())}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded text-[11px] border border-emerald-200 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {isApproved && (
                          <button
                            onClick={() => {
                              setDistributeId(b.id.toString());
                              setDistributeAmount("10000");
                            }}
                            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded text-[11px] border border-purple-200 transition-colors"
                          >
                            Distribute
                          </button>
                        )}
                        <button
                          onClick={() => onNavigateToVerify(b.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-[11px] transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {beneficiaries.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-slate-400 italic"
                  >
                    No beneficiaries registered yet. Fill out the "Register
                    Beneficiary" form above to write the first record to the
                    blockchain.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
