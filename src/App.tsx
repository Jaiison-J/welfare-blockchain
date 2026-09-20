import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { AdminDashboard } from "./components/AdminDashboard";
import { BeneficiaryVerification } from "./components/BeneficiaryVerification";
import { AuditTrail } from "./components/AuditTrail";
import { ContractModal } from "./components/ContractModal";
import { WalletConnectModal } from "./components/WalletConnectModal";
import { blockchainService } from "./services/blockchain";
import { Beneficiary, WalletState } from "./types/blockchain";

export default function App() {
  const [walletState, setWalletState] = useState<WalletState>(
    blockchainService.connectSimulated()
  );
  const [activeTab, setActiveTab] = useState<string>("admin");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [verifyBeneficiaryId, setVerifyBeneficiaryId] = useState<number | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  const fetchLedgerData = async () => {
    try {
      const data = await blockchainService.getAllBeneficiaries();
      setBeneficiaries(data);
    } catch (err) {
      console.error("Failed to load beneficiaries from blockchain:", err);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, [walletState]);

  const handleNavigateToVerify = (id: number) => {
    setVerifyBeneficiaryId(id);
    setActiveTab("verify");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateContractAddress = (address: string) => {
    blockchainService.setContractAddress(address);
    setWalletState((prev) => ({
      ...prev,
      contractAddress: address,
      isContractConnected: true,
    }));
    fetchLedgerData();
  };

  const handleResetDemoData = () => {
    if (window.confirm("Reset all test beneficiaries and blockchain blocks back to default demo state?")) {
      blockchainService.resetDemoData();
      fetchLedgerData();
    }
  };

  const handleConnectProvider = async (type: "metamask" | "ganache_rpc" | "simulated") => {
    if (type === "metamask") {
      try {
        const state = await blockchainService.connectMetaMask();
        setWalletState(state);
      } catch (err: any) {
        alert(err.message);
      }
    } else if (type === "ganache_rpc") {
      try {
        const state = await blockchainService.connectGanacheRPC();
        setWalletState(state);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      const state = blockchainService.connectSimulated();
      setWalletState(state);
    }
    fetchLedgerData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Primary Navigation */}
      <Navbar
        walletState={walletState}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onOpenContractConfig={() => setIsContractModalOpen(true)}
        onResetDemoData={handleResetDemoData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === "admin" && (
          <AdminDashboard
            walletState={walletState}
            beneficiaries={beneficiaries}
            onRefresh={fetchLedgerData}
            onNavigateToAudit={() => setActiveTab("audit")}
            onNavigateToVerify={handleNavigateToVerify}
          />
        )}

        {activeTab === "verify" && (
          <BeneficiaryVerification
            initialId={verifyBeneficiaryId}
            walletState={walletState}
            onNavigateToAudit={() => setActiveTab("audit")}
          />
        )}

        {activeTab === "audit" && <AuditTrail walletState={walletState} />}
      </main>

      {/* Modals */}
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        walletState={walletState}
        onUpdateContractAddress={handleUpdateContractAddress}
        onConnectProvider={handleConnectProvider}
      />

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletState={walletState}
        onWalletUpdated={(newState) => {
          setWalletState(newState);
          fetchLedgerData();
        }}
      />

      {/* College Project Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                W
              </div>
              <span className="font-semibold text-slate-200">
                WelfareChain Tracking System
              </span>
              <span className="text-slate-600">|</span>
              <span>BE Computer Science & Engineering</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
              <span>
                Course: <strong className="text-slate-300">BIC702 Blockchain Technology</strong>
              </span>
              <span>
                Activity: <strong className="text-slate-300">Activity 1 (Real-World Use Cases)</strong>
              </span>
              <span>
                Author: <strong className="text-white">Jaison J</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsContractModalOpen(true)}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Contract Details
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
            Educational College Prototype • Solidity 0.8.20 • Ethers.js v6 • Ethereum Ganache Localhost / MetaMask
          </div>
        </div>
      </footer>
    </div>
  );
}
