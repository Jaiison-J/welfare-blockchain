import React, { useState } from "react";
import {
  X,
  Wallet,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Cpu,
  RefreshCw,
  Layers,
  ArrowRight
} from "lucide-react";
import { blockchainService } from "../services/blockchain";
import { WalletState } from "../types/blockchain";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
  onWalletUpdated: (newState: WalletState) => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  walletState,
  onWalletUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rpcInput, setRpcInput] = useState("http://127.0.0.1:7545");

  if (!isOpen) return null;

  const isMetaMaskAvailable = blockchainService.isMetaMaskAvailable();

  const handleConnectMetaMask = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const state = await blockchainService.connectMetaMask();
      onWalletUpdated(state);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "MetaMask connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGanacheRPC = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const state = await blockchainService.connectGanacheRPC(rpcInput.trim());
      onWalletUpdated(state);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Could not connect to Ganache RPC endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSimulated = () => {
    const state = blockchainService.connectSimulated();
    onWalletUpdated(state);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Connect Web3 Wallet</h3>
              <p className="text-[11px] text-slate-400">
                Ethereum-compatible node or browser extension
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {errorMessage}
              </div>
            </div>
          )}

          {/* Option 1: MetaMask */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                  🦊
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    MetaMask Extension
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {isMetaMaskAvailable ? "Extension detected in browser" : "Not detected in browser"}
                  </span>
                </div>
              </div>
              {walletState.providerType === "metamask" && walletState.isConnected && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Connected
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Standard Web3 connection via <code className="font-mono bg-slate-100 px-1">window.ethereum</code>.
              Sign real transactions with your Ganache account.
            </p>

            <button
              onClick={handleConnectMetaMask}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 2: Ganache Direct RPC */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Ganache Direct RPC
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Connects directly to local node (port 7545)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 mb-2">
              <input
                type="text"
                value={rpcInput}
                onChange={(e) => setRpcInput(e.target.value)}
                placeholder="http://127.0.0.1:7545"
                className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleConnectGanacheRPC}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors"
              >
                Connect RPC
              </button>
            </div>
          </div>

          {/* Option 3: In-Browser EVM Simulator (Zero-Setup Preview) */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">
                    Ganache EVM Simulator (Active)
                  </h4>
                  <span className="text-[10px] text-emerald-700">
                    Zero-cost, immediate browser testing
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>

            <p className="text-[11px] text-emerald-900/80 mb-3">
              Mines real blocks, generates valid Keccak hashes, and enforces
              all smart contract rules with zero setup required.
            </p>

            <button
              onClick={handleConnectSimulated}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Use Active Simulator Mode
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Student assignment demo mode</span>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
