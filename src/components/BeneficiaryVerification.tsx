import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  FileCheck,
  Coins,
  Copy,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Beneficiary, BeneficiaryStatus, WalletState } from "../types/blockchain";
import { blockchainService } from "../services/blockchain";

interface BeneficiaryVerificationProps {
  initialId?: number | null;
  walletState: WalletState;
  onNavigateToAudit: () => void;
}

export const BeneficiaryVerification: React.FC<BeneficiaryVerificationProps> = ({
  initialId,
  walletState,
  onNavigateToAudit,
}) => {
  const [searchId, setSearchId] = useState<string>(
    initialId ? initialId.toString() : "1"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedRecord, setSearchedRecord] = useState<Beneficiary | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedContract, setCopiedContract] = useState<boolean>(false);

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId.toString());
      performVerification(initialId);
    } else {
      // Auto-verify ID 1 for instant demo on load
      performVerification(1);
    }
  }, [initialId]);

  const performVerification = async (id: number) => {
    setLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const res = await blockchainService.verifyBeneficiary(id);
      if (res.exists && res.beneficiary) {
        setSearchedRecord(res.beneficiary);
      } else {
        setSearchedRecord(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error reading verification data from blockchain.");
      setSearchedRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId, 10);
    if (isNaN(id) || id <= 0) {
      setErrorMessage("Please enter a valid numeric Beneficiary ID (e.g., 1, 2, 3).");
      setSearchedRecord(null);
      return;
    }
    performVerification(id);
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(walletState.contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Public On-Chain Verification Portal
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Verify Welfare Beneficiary Status
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Query the Ethereum-compatible smart contract directly using a Beneficiary
          ID. The returned records are retrieved in real-time from the immutable
          ledger.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="input-verify-id"
              type="number"
              placeholder="Enter Beneficiary ID (e.g. 1, 2, 3)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <button
            id="btn-verify-beneficiary"
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Querying Blockchain...
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                [ Verify Beneficiary ]
              </>
            )}
          </button>
        </form>

        {/* Quick Demo ID links */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium">Quick verification demo IDs:</span>
          <button
            type="button"
            onClick={() => {
              setSearchId("1");
              performVerification(1);
            }}
            className="font-mono text-blue-600 hover:underline px-1 py-0.5 bg-blue-50 rounded"
          >
            #1 (Jaison Demo)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchId("2");
              performVerification(2);
            }}
            className="font-mono text-blue-600 hover:underline px-1 py-0.5 bg-blue-50 rounded"
          >
            #2 (Rahul Demo)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchId("3");
              performVerification(3);
            }}
            className="font-mono text-blue-600 hover:underline px-1 py-0.5 bg-blue-50 rounded"
          >
            #3 (Ananya Demo)
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {hasSearched && (
        <div>
          {searchedRecord ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden transition-all animate-fadeIn">
              {/* Card Header with Status Ribbon */}
              <div
                className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  searchedRecord.status === BeneficiaryStatus.Distributed
                    ? "bg-purple-900 text-white border-purple-800"
                    : searchedRecord.status === BeneficiaryStatus.Approved
                    ? "bg-emerald-900 text-white border-emerald-800"
                    : "bg-amber-900 text-white border-amber-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-white/80">
                      Blockchain Verified Record
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">
                      Beneficiary #{searchedRecord.id}
                    </h3>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {searchedRecord.status === BeneficiaryStatus.Registered && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-sm">
                      <Clock className="w-4 h-4" /> STATUS: REGISTERED
                    </span>
                  )}
                  {searchedRecord.status === BeneficiaryStatus.Approved && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 shadow-sm">
                      <CheckCircle className="w-4 h-4" /> STATUS: APPROVED
                    </span>
                  )}
                  {searchedRecord.status === BeneficiaryStatus.Distributed && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-300 text-purple-950 shadow-sm">
                      <Coins className="w-4 h-4" /> STATUS: DISTRIBUTED
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body - Beneficiary Details */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beneficiary Name */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Beneficiary Name
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {searchedRecord.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Enrolled citizen identity
                    </div>
                  </div>

                  {/* Welfare Scheme */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Welfare Scheme
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {searchedRecord.schemeName}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Government initiative category
                    </div>
                  </div>

                  {/* Benefit Amount */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Benefit Amount
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {searchedRecord.amount > 0
                        ? `₹${searchedRecord.amount.toLocaleString()}`
                        : "Pending Disbursement"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {searchedRecord.status === BeneficiaryStatus.Distributed
                        ? "Disbursed and locked on blockchain"
                        : "Awaiting disbursement transaction"}
                    </div>
                  </div>

                  {/* Current Status Explanation */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Lifecycle Stage
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {searchedRecord.status === BeneficiaryStatus.Registered &&
                        "Registered by Authority (Pending Verification)"}
                      {searchedRecord.status === BeneficiaryStatus.Approved &&
                        "Verified & Approved by Authority (Eligible for Benefit)"}
                      {searchedRecord.status === BeneficiaryStatus.Distributed &&
                        "Benefit Distributed (Disbursement Complete)"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Solidity Enum Value: {searchedRecord.status}
                    </div>
                  </div>
                </div>

                {/* Timestamps & Smart Contract Proof */}
                <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Registration Timestamp */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        Registration Timestamp
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {new Date(
                          searchedRecord.registrationTimestamp * 1000
                        ).toLocaleString()}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Unix Epoch: {searchedRecord.registrationTimestamp}
                      </div>
                    </div>
                  </div>

                  {/* Distribution Timestamp */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        Distribution Timestamp
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {searchedRecord.distributionTimestamp > 0
                          ? new Date(
                              searchedRecord.distributionTimestamp * 1000
                            ).toLocaleString()
                          : "Not Yet Distributed"}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {searchedRecord.distributionTimestamp > 0
                          ? `Unix Epoch: ${searchedRecord.distributionTimestamp}`
                          : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Contract Verification Details */}
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      Smart Contract Ledger Address:
                    </span>
                    <button
                      onClick={copyContractAddress}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedContract ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-400 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {walletState.contractAddress}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>EVM Network: {walletState.networkName}</span>
                    <button
                      onClick={onNavigateToAudit}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View Blockchain Transaction Logs <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Beneficiary #{searchId} Not Found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No record exists on the blockchain for Beneficiary ID #{searchId}.
                Verify the ID entered or register this citizen from the Admin
                Dashboard.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Critical Academic Blockchain Notice: The "Oracle" & Truthfulness Concept */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 text-amber-900 space-y-2 text-xs leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          Academic & Security Context: Blockchain Truthfulness & Identity Verification
        </div>
        <p>
          <strong>Why blockchain guarantees integrity, but not initial truth:</strong>{" "}
          A common misconception is that blockchain automatically prevents fake data
          entry. In reality, blockchain guarantees <em>data immutability</em>,{" "}
          <em>non-repudiation</em>, and <em>tamper-resistance</em> once data is written
          by an authorized government key. However, it cannot guarantee that the
          underlying physical information entered by a human was truthful (known as
          the <strong>"Garbage In, Garbage Out" / Blockchain Oracle Problem</strong>).
        </p>
        <p>
          In a real-world government deployment, rigorous off-chain identity verification
          (e.g., biometric authentication, multi-signatory nodal approval) would still
          be required before authorized nodal officers invoke the smart contract.
        </p>
      </div>
    </div>
  );
};
