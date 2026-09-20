export enum BeneficiaryStatus {
  Registered = 0,
  Approved = 1,
  Distributed = 2
}

export interface Beneficiary {
  id: number;
  name: string;
  schemeName: string;
  amount: number;
  status: BeneficiaryStatus;
  registrationTimestamp: number;
  distributionTimestamp: number;
  exists: boolean;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  method: string;
  params: Record<string, any>;
  gasUsed: number;
  status: 'SUCCESS' | 'FAILED';
  eventName?: string;
  errorMessage?: string;
}

export interface BlockchainBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactionsCount: number;
  miner: string;
}

export type ProviderType = 'metamask' | 'ganache_rpc' | 'simulated';

export interface WalletState {
  isConnected: boolean;
  account: string;
  chainId: number | string;
  networkName: string;
  balance: string;
  isAdmin: boolean;
  providerType: ProviderType;
  contractAddress: string;
  isContractConnected: boolean;
}
