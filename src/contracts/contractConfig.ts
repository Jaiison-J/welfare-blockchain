/**
 * Smart Contract ABI & Configuration for WelfareDistribution
 * BIC702 Blockchain Technology - Activity 1
 * Author: Jaison J
 */

export const CONTRACT_NAME = "WelfareDistribution";

export const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const WELFARE_DISTRIBUTION_ABI = [
  // Constructor
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "schemeName", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "registeredBy", "type": "address" }
    ],
    "name": "BeneficiaryRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "approvedBy", "type": "address" }
    ],
    "name": "BeneficiaryApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "distributedBy", "type": "address" }
    ],
    "name": "BenefitDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousAdmin", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newAdmin", "type": "address" }
    ],
    "name": "AdminTransferred",
    "type": "event"
  },
  // View & Admin Functions
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_schemeName", "type": "string" }
    ],
    "name": "registerBeneficiary",
    "outputs": [{ "internalType": "uint256", "name": "newId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "approveBeneficiary",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "distributeBenefit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getBeneficiary",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "schemeName", "type": "string" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "registrationTimestamp", "type": "uint256" },
      { "internalType": "uint256", "name": "distributionTimestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBeneficiaryCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBeneficiaries",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "schemeName", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "registrationTimestamp", "type": "uint256" },
          { "internalType": "uint256", "name": "distributionTimestamp", "type": "uint256" },
          { "internalType": "bool", "name": "exists", "type": "bool" }
        ],
        "internalType": "struct WelfareDistribution.Beneficiary[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "verifyBeneficiary",
    "outputs": [
      { "internalType": "bool", "name": "exists", "type": "bool" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "schemeName", "type": "string" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "registrationTimestamp", "type": "uint256" },
      { "internalType": "uint256", "name": "distributionTimestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_newAdmin", "type": "address" }],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const SOLIDITY_SOURCE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WelfareDistribution
 * @author Jaison J (BE Computer Science - BIC702 Blockchain Technology Assignment)
 * @dev Smart contract for tracking and verifying government welfare scheme distributions on an immutable ledger.
 */
contract WelfareDistribution {
    address public admin;
    uint256 private _beneficiaryIdCounter;

    enum BeneficiaryStatus {
        Registered,  // 0
        Approved,    // 1
        Distributed  // 2
    }

    struct Beneficiary {
        uint256 id;
        string name;
        string schemeName;
        uint256 amount;
        BeneficiaryStatus status;
        uint256 registrationTimestamp;
        uint256 distributionTimestamp;
        bool exists;
    }

    mapping(uint256 => Beneficiary) private beneficiaries;
    uint256[] private allBeneficiaryIds;

    event BeneficiaryRegistered(uint256 indexed id, string name, string schemeName, uint256 timestamp, address indexed registeredBy);
    event BeneficiaryApproved(uint256 indexed id, uint256 timestamp, address indexed approvedBy);
    event BenefitDistributed(uint256 indexed id, uint256 amount, uint256 timestamp, address indexed distributedBy);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Error: Caller is not the authorized government admin");
        _;
    }

    modifier beneficiaryExists(uint256 _id) {
        require(beneficiaries[_id].exists, "Error: Beneficiary ID does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        _beneficiaryIdCounter = 0;
    }

    function registerBeneficiary(string memory _name, string memory _schemeName) external onlyAdmin returns (uint256 newId) {
        require(bytes(_name).length > 0, "Error: Beneficiary name cannot be empty");
        require(bytes(_schemeName).length > 0, "Error: Welfare scheme name cannot be empty");

        _beneficiaryIdCounter += 1;
        newId = _beneficiaryIdCounter;

        beneficiaries[newId] = Beneficiary({
            id: newId,
            name: _name,
            schemeName: _schemeName,
            amount: 0,
            status: BeneficiaryStatus.Registered,
            registrationTimestamp: block.timestamp,
            distributionTimestamp: 0,
            exists: true
        });

        allBeneficiaryIds.push(newId);
        emit BeneficiaryRegistered(newId, _name, _schemeName, block.timestamp, msg.sender);
    }

    function approveBeneficiary(uint256 _id) external onlyAdmin beneficiaryExists(_id) {
        Beneficiary storage b = beneficiaries[_id];
        require(b.status == BeneficiaryStatus.Registered, "Error: Beneficiary must be in Registered state to be approved");
        b.status = BeneficiaryStatus.Approved;
        emit BeneficiaryApproved(_id, block.timestamp, msg.sender);
    }

    function distributeBenefit(uint256 _id, uint256 _amount) external onlyAdmin beneficiaryExists(_id) {
        Beneficiary storage b = beneficiaries[_id];
        require(b.status != BeneficiaryStatus.Registered, "Error: Beneficiary has not been approved yet");
        require(b.status != BeneficiaryStatus.Distributed, "Error: Welfare benefit has already been distributed to this beneficiary");
        require(b.status == BeneficiaryStatus.Approved, "Error: Beneficiary is not eligible for distribution");
        require(_amount > 0, "Error: Benefit amount must be greater than zero");

        b.amount = _amount;
        b.status = BeneficiaryStatus.Distributed;
        b.distributionTimestamp = block.timestamp;
        emit BenefitDistributed(_id, _amount, block.timestamp, msg.sender);
    }

    function getBeneficiary(uint256 _id) external view beneficiaryExists(_id) returns (
        uint256 id,
        string memory name,
        string memory schemeName,
        uint256 amount,
        BeneficiaryStatus status,
        uint256 registrationTimestamp,
        uint256 distributionTimestamp
    ) {
        Beneficiary memory b = beneficiaries[_id];
        return (b.id, b.name, b.schemeName, b.amount, b.status, b.registrationTimestamp, b.distributionTimestamp);
    }

    function getBeneficiaryCount() external view returns (uint256) {
        return _beneficiaryIdCounter;
    }

    function getAllBeneficiaries() external view returns (Beneficiary[] memory) {
        uint256 total = allBeneficiaryIds.length;
        Beneficiary[] memory list = new Beneficiary[](total);
        for (uint256 i = 0; i < total; i++) {
            list[i] = beneficiaries[allBeneficiaryIds[i]];
        }
        return list;
    }

    function verifyBeneficiary(uint256 _id) external view returns (
        bool exists,
        string memory name,
        string memory schemeName,
        uint256 amount,
        BeneficiaryStatus status,
        uint256 registrationTimestamp,
        uint256 distributionTimestamp
    ) {
        if (!beneficiaries[_id].exists) {
            return (false, "", "", 0, BeneficiaryStatus.Registered, 0, 0);
        }
        Beneficiary memory b = beneficiaries[_id];
        return (true, b.name, b.schemeName, b.amount, b.status, b.registrationTimestamp, b.distributionTimestamp);
    }

    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Error: New admin address cannot be zero address");
        require(_newAdmin != admin, "Error: New admin is already current admin");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminTransferred(oldAdmin, _newAdmin);
    }
}`;
