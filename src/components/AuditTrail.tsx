import React, { useState } from "react";
import {
  Layers,
  Copy,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  Database,
  Cpu,
  Clock,
  Hash,
  Boxes
} from "lucide-react";
import {
  BlockchainBlock,
  BlockchainTransaction,
  WalletState,
} from "../types/blockchain";
import { blockchainService } from "../services/blockchain";

interface AuditTrailProps {
  walletState: WalletState;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ walletState }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeView, setActiveView] = useState<"transactions" | "blocks">("transactions");

  const transactions = blockchainService.getAuditTrail();
  const blocks = blockchainService.getBlocks();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesMethod =
      filterMethod === "ALL" || tx.method === filterMethod;
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(tx.params).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            Immutable Distributed Ledger
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Blockchain Transaction History & Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Every administrative action (registration, approval, disbursement) produces
            a cryptographically signed transaction mined into an Ethereum-compatible
            block.
          </p>
        </div>

        {/* View Switcher Tabs (Transactions vs Blocks) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveView("transactions")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeView === "transactions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveView("blocks")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeView === "blocks"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            Blocks ({blocks.length})
          </button>
        </div>
      </div>

      {activeView === "transactions" ? (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search tx hash, scheme, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium whitespace-nowrap">
                <Filter className="w-3.5 h-3.5" /> Method:
              </span>
              <button
                onClick={() => setFilterMethod("ALL")}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                  filterMethod === "ALL"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                All Methods
              </button>
              <button
                onClick={() => setFilterMethod("registerBeneficiary")}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                  filterMethod === "registerBeneficiary"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                registerBeneficiary
              </button>
              <button
                onClick={() => setFilterMethod("approveBeneficiary")}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                  filterMethod === "approveBeneficiary"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                approveBeneficiary
              </button>
              <button
                onClick={() => setFilterMethod("distributeBenefit")}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                  filterMethod === "distributeBenefit"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                distributeBenefit
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Tx Hash</th>
                    <th className="px-5 py-3">Block #</th>
                    <th className="px-5 py-3">Method / Action</th>
                    <th className="px-5 py-3">Payload Details</th>
                    <th className="px-5 py-3">Gas Used</th>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.hash} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-blue-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </span>
                          <button
                            onClick={() => handleCopy(tx.hash, tx.hash)}
                            className="text-slate-400 hover:text-slate-700"
                            title="Copy Tx Hash"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedHash === tx.hash && (
                            <span className="text-[10px] text-emerald-600 font-sans">
                              Copied!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                        #{tx.blockNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                            tx.method === "registerBeneficiary"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : tx.method === "approveBeneficiary"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {tx.method}()
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-xs truncate text-slate-600 font-mono text-[11px]">
                        {JSON.stringify(tx.params)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {tx.gasUsed.toLocaleString()} units
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(tx.timestamp * 1000).toLocaleTimeString()} (
                        {new Date(tx.timestamp * 1000).toLocaleDateString()})
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-8 text-center text-slate-400 italic"
                      >
                        No transactions found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Blocks View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((b) => (
            <div
              key={b.number}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Block #{b.number}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(b.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {b.transactionsCount} tx
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">
                    Block Hash:
                  </span>
                  <span className="font-mono text-slate-700 text-[11px] break-all">
                    {b.hash}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">
                    Parent Hash:
                  </span>
                  <span className="font-mono text-slate-700 text-[11px] break-all">
                    {b.parentHash}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">
                    Validated By (Miner):
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    {b.miner}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
