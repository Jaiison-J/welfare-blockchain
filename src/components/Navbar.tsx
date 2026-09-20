import React from "react";
import {
  ShieldCheck,
  Wallet,
  Cpu,
  Layers,
  Search,
  Code2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { WalletState } from "../types/blockchain";

interface NavbarProps {
  walletState: WalletState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onConnectWallet: () => void;
  onOpenContractConfig: () => void;
  onResetDemoData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletState,
  activeTab,
  setActiveTab,
  onConnectWallet,
  onOpenContractConfig,
  onResetDemoData,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Top Academic Sub-header */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/50">
            BIC702
          </span>
          <span className="font-medium text-slate-300">
            Blockchain Technology Assignment • Activity 1: Real-World Use Cases
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Topic: Welfare Scheme Distribution Tracking System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">
            Author: <strong className="text-white font-semibold">Jaison J</strong> (BE CS)
          </span>
          <button
            onClick={onResetDemoData}
            title="Reset to default demo data"
            className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset Demo
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("admin")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  WelfareChain
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Solidity EVM
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Government Welfare Scheme Distribution & Verification System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Admin Dashboard
            </button>
            <button
              id="nav-tab-verify"
              onClick={() => setActiveTab("verify")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "verify"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Public Verification
            </button>
            <button
              id="nav-tab-audit"
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "audit"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Blockchain Audit Trail
            </button>
          </nav>

          {/* Wallet / Network Status Section */}
          <div className="flex items-center gap-2.5">
            {/* Contract Config Link */}
            <button
              id="btn-contract-config"
              onClick={onOpenContractConfig}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="View contract ABI, address, and deployment details"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-mono">
                {walletState.contractAddress.slice(0, 6)}...{walletState.contractAddress.slice(-4)}
              </span>
            </button>

            {/* Wallet Button */}
            <button
              id="btn-connect-wallet"
              onClick={onConnectWallet}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 border transition-all ${
                walletState.isConnected
                  ? "bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60"
                  : "bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-sm"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  walletState.isConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                }`}
              />
              <Wallet className="w-3.5 h-3.5" />
              <div className="text-left leading-tight">
                {walletState.isConnected ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono">
                      {walletState.account.slice(0, 6)}...{walletState.account.slice(-4)}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-normal">
                      ({walletState.balance} ETH)
                    </span>
                  </div>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === "admin" ? "bg-blue-600 text-white" : "text-slate-300"
            }`}
          >
            Admin Dashboard
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === "verify" ? "bg-blue-600 text-white" : "text-slate-300"
            }`}
          >
            Public Verification
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === "audit" ? "bg-blue-600 text-white" : "text-slate-300"
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>
    </header>
  );
};
