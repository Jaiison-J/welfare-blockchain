import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Code2,
  Cpu,
  Layers,
  ExternalLink,
  Settings,
  BookOpen,
  Terminal,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import {
  DEFAULT_CONTRACT_ADDRESS,
  SOLIDITY_SOURCE_CODE,
  WELFARE_DISTRIBUTION_ABI,
} from "../contracts/contractConfig";
import { blockchainService } from "../services/blockchain";
import { WalletState } from "../types/blockchain";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
  onUpdateContractAddress: (address: string) => void;
  onConnectProvider: (type: "metamask" | "ganache_rpc" | "simulated") => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onUpdateContractAddress,
  onConnectProvider,
}) => {
  const [addressInput, setAddressInput] = useState<string>(
    walletState.contractAddress
  );
  const [copiedAbi, setCopiedAbi] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "remix_guide" | "code" | "abi">("config");
  const [rpcUrlInput, setRpcUrlInput] = useState("http://127.0.0.1:7545");
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContractAddress(addressInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyABI = () => {
    navigator.clipboard.writeText(JSON.stringify(WELFARE_DISTRIBUTION_ABI, null, 2));
    setCopiedAbi(true);
    setTimeout(() => setCopiedAbi(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_SOURCE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletState.contractAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Smart Contract & Web3 Deployment Configuration
              </h3>
              <p className="text-xs text-slate-400">
                WelfareDistribution.sol • Solidity 0.8.20 • Ethereum / Ganache EVM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("config")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "config"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Connection & Contract Address
          </button>
          <button
            onClick={() => setActiveTab("remix_guide")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "remix_guide"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Remix & Ganache Setup Guide
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "code"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Solidity Source Code
          </button>
          <button
            onClick={() => setActiveTab("abi")}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "abi"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Smart Contract ABI
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === "config" && (
            <div className="space-y-6">
              {/* Provider Selection */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  1. Blockchain Provider & Environment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => onConnectProvider("metamask")}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      walletState.providerType === "metamask"
                        ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        MetaMask Extension
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Connects via browser window.ethereum to Ganache or testnet.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono mt-2 text-blue-700 font-semibold">
                      {walletState.providerType === "metamask" ? "● Active" : "Select"}
                    </span>
                  </button>

                  <button
                    onClick={() => onConnectProvider("ganache_rpc")}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      walletState.providerType === "ganache_rpc"
                        ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        Ganache Direct RPC
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Connects directly to http://127.0.0.1:7545 without extension.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono mt-2 text-blue-700 font-semibold">
                      {walletState.providerType === "ganache_rpc" ? "● Active" : "Select"}
                    </span>
                  </button>

                  <button
                    onClick={() => onConnectProvider("simulated")}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      walletState.providerType === "simulated"
                        ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        EVM Simulator
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Instant zero-setup testnet with mined blocks & local persistence.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono mt-2 text-blue-700 font-semibold">
                      {walletState.providerType === "simulated" ? "● Active" : "Select"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Contract Address Configuration */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  2. Deployed Contract Address
                </h4>
                <p className="text-slate-600">
                  When you deploy <code className="font-mono text-blue-700 font-semibold">WelfareDistribution.sol</code>{" "}
                  in Remix IDE or Ganache, paste your new contract address below:
                </p>

                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="0x..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-colors"
                    >
                      Update Address
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => {
                        setAddressInput(DEFAULT_CONTRACT_ADDRESS);
                        onUpdateContractAddress(DEFAULT_CONTRACT_ADDRESS);
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset to Default Demo Address
                    </button>
                    {saveSuccess && (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Address updated successfully!
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Current Status Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Address:</span>
                  <span className="font-semibold text-slate-800 break-all">
                    {walletState.contractAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connected Account:</span>
                  <span className="text-slate-700 truncate max-w-[240px]">
                    {walletState.account}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chain ID / Network:</span>
                  <span className="text-slate-700">
                    {walletState.chainId} ({walletState.networkName})
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "remix_guide" && (
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">
                Step-by-Step Deployment Instructions (Remix + Ganache + MetaMask)
              </h4>
              <ol className="list-decimal pl-4 space-y-2.5">
                <li>
                  <strong>Start Ganache:</strong> Open Ganache (GUI or CLI). Click{" "}
                  <em>Quickstart Ethereum</em>. It will start listening on{" "}
                  <code className="font-mono bg-slate-100 px-1 rounded">127.0.0.1:7545</code>{" "}
                  with Network ID <code className="font-mono bg-slate-100 px-1 rounded">5777</code> or <code className="font-mono bg-slate-100 px-1 rounded">1337</code>.
                </li>
                <li>
                  <strong>Configure MetaMask:</strong> In MetaMask, add a custom network:
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
                    <li>Network Name: Ganache Local</li>
                    <li>New RPC URL: http://127.0.0.1:7545</li>
                    <li>Chain ID: 1337 (or 5777)</li>
                    <li>Currency Symbol: ETH</li>
                  </ul>
                  Then import one test account from Ganache using its private key.
                </li>
                <li>
                  <strong>Open Remix IDE:</strong> Visit{" "}
                  <a
                    href="https://remix.ethereum.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline inline-flex items-center gap-0.5"
                  >
                    remix.ethereum.org <ExternalLink className="w-3 h-3" />
                  </a>
                  . Create a file named <code className="font-mono bg-slate-100 px-1 rounded">WelfareDistribution.sol</code>{" "}
                  in the contracts directory.
                </li>
                <li>
                  <strong>Paste Contract Code:</strong> Copy the Solidity code from the{" "}
                  <em>Solidity Source Code</em> tab of this dialog and paste it into Remix.
                </li>
                <li>
                  <strong>Compile:</strong> In Remix's Solidity Compiler tab, select compiler version{" "}
                  <code className="font-mono bg-slate-100 px-1 rounded">0.8.20</code> or higher and click{" "}
                  <em>Compile WelfareDistribution.sol</em>.
                </li>
                <li>
                  <strong>Deploy:</strong> In the <em>Deploy & Run Transactions</em> tab:
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
                    <li>Environment: Select <strong>Injected Provider - MetaMask</strong></li>
                    <li>Ensure your Ganache account is selected</li>
                    <li>Click the orange <strong>Deploy</strong> button and confirm in MetaMask!</li>
                  </ul>
                </li>
                <li>
                  <strong>Copy Address:</strong> Under <em>Deployed Contracts</em>, copy the contract address and paste it into the{" "}
                  <em>Connection & Contract Address</em> tab here.
                </li>
              </ol>
            </div>
          )}

          {activeTab === "code" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">
                  contracts/WelfareDistribution.sol
                </span>
                <button
                  onClick={copyCode}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? "Copied to Clipboard!" : "Copy Solidity Code"}
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
                {SOLIDITY_SOURCE_CODE}
              </pre>
            </div>
          )}

          {activeTab === "abi" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">
                  Application Binary Interface (ABI) JSON
                </span>
                <button
                  onClick={copyABI}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedAbi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAbi ? "Copied ABI!" : "Copy ABI JSON"}
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
                {JSON.stringify(WELFARE_DISTRIBUTION_ABI, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            BIC702 Assignment Prototype • Jaison J (BE CS)
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
