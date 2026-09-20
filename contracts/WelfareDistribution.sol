// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WelfareDistribution
 * @author Jaison J (BE Computer Science - BIC702 Blockchain Technology Assignment)
 * @dev Smart contract for tracking and verifying government welfare scheme distributions on an immutable ledger.
 * This contract ensures transparent beneficiary registration, approval workflow, and recorded disbursement of welfare funds.
 */
contract WelfareDistribution {
    // -------------------------------------------------------------
    // STATE VARIABLES & ENUMS
    // -------------------------------------------------------------

    address public admin;
    uint256 private _beneficiaryIdCounter;

    enum BeneficiaryStatus {
        Registered,  // 0: Registered by authority, pending verification/approval
        Approved,    // 1: Verified and approved by authority, eligible for benefit
        Distributed  // 2: Benefit successfully disbursed and recorded on blockchain
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

    // Mapping from Beneficiary ID => Beneficiary Details
    mapping(uint256 => Beneficiary) private beneficiaries;

    // Array of all beneficiary IDs for enumeration and audit trail
    uint256[] private allBeneficiaryIds;

    // -------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------

    event BeneficiaryRegistered(
        uint256 indexed id,
        string name,
        string schemeName,
        uint256 timestamp,
        address indexed registeredBy
    );

    event BeneficiaryApproved(
        uint256 indexed id,
        uint256 timestamp,
        address indexed approvedBy
    );

    event BenefitDistributed(
        uint256 indexed id,
        uint256 amount,
        uint256 timestamp,
        address indexed distributedBy
    );

    event AdminTransferred(
        address indexed previousAdmin,
        address indexed newAdmin
    );

    // -------------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------------

    modifier onlyAdmin() {
        require(msg.sender == admin, "Error: Caller is not the authorized government admin");
        _;
    }

    modifier beneficiaryExists(uint256 _id) {
        require(beneficiaries[_id].exists, "Error: Beneficiary ID does not exist");
        _;
    }

    // -------------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------------

    /**
     * @dev Sets the deploying account as the initial system administrator / government nodal authority.
     */
    constructor() {
        admin = msg.sender;
        _beneficiaryIdCounter = 0;
    }

    // -------------------------------------------------------------
    // CORE FUNCTIONS (ACTIVITY 1 REQUIREMENTS)
    // -------------------------------------------------------------

    /**
     * @notice Registers a new citizen beneficiary into the welfare system.
     * @dev Only the authorized government admin can register. State begins at Registered.
     * @param _name Beneficiary name or demo identifier (no sensitive personal Aadhaar/PAN data)
     * @param _schemeName Name of the welfare initiative (e.g. Student Scholarship, Farmers Relief)
     * @return newId The auto-incremented unique Beneficiary ID
     */
    function registerBeneficiary(
        string memory _name,
        string memory _schemeName
    ) external onlyAdmin returns (uint256 newId) {
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

    /**
     * @notice Approves a registered beneficiary after official verification.
     * @dev Only admin can approve. Beneficiary must currently be in Registered status.
     * @param _id Unique Beneficiary ID
     */
    function approveBeneficiary(uint256 _id) external onlyAdmin beneficiaryExists(_id) {
        Beneficiary storage b = beneficiaries[_id];

        require(
            b.status == BeneficiaryStatus.Registered,
            "Error: Beneficiary must be in Registered state to be approved"
        );

        b.status = BeneficiaryStatus.Approved;

        emit BeneficiaryApproved(_id, block.timestamp, msg.sender);
    }

    /**
     * @notice Distributes the allocated welfare scheme benefit and updates the immutable audit record.
     * @dev Beneficiary MUST be approved prior to disbursement. Prevents double distribution.
     * @param _id Unique Beneficiary ID
     * @param _amount Monetary benefit amount in currency unit (e.g. INR / demo units)
     */
    function distributeBenefit(
        uint256 _id,
        uint256 _amount
    ) external onlyAdmin beneficiaryExists(_id) {
        Beneficiary storage b = beneficiaries[_id];

        require(
            b.status != BeneficiaryStatus.Registered,
            "Error: Beneficiary has not been approved yet"
        );
        require(
            b.status != BeneficiaryStatus.Distributed,
            "Error: Welfare benefit has already been distributed to this beneficiary"
        );
        require(b.status == BeneficiaryStatus.Approved, "Error: Beneficiary is not eligible for distribution");
        require(_amount > 0, "Error: Benefit amount must be greater than zero");

        b.amount = _amount;
        b.status = BeneficiaryStatus.Distributed;
        b.distributionTimestamp = block.timestamp;

        emit BenefitDistributed(_id, _amount, block.timestamp, msg.sender);
    }

    /**
     * @notice Retrieves the full record of a beneficiary by ID for verification.
     * @param _id Unique Beneficiary ID
     */
    function getBeneficiary(uint256 _id)
        external
        view
        beneficiaryExists(_id)
        returns (
            uint256 id,
            string memory name,
            string memory schemeName,
            uint256 amount,
            BeneficiaryStatus status,
            uint256 registrationTimestamp,
            uint256 distributionTimestamp
        )
    {
        Beneficiary memory b = beneficiaries[_id];
        return (
            b.id,
            b.name,
            b.schemeName,
            b.amount,
            b.status,
            b.registrationTimestamp,
            b.distributionTimestamp
        );
    }

    /**
     * @notice Returns total number of registered beneficiaries in the contract.
     */
    function getBeneficiaryCount() external view returns (uint256) {
        return _beneficiaryIdCounter;
    }

    /**
     * @notice Helper function returning all beneficiary records for dashboard transparency.
     */
    function getAllBeneficiaries() external view returns (Beneficiary[] memory) {
        uint256 total = allBeneficiaryIds.length;
        Beneficiary[] memory list = new Beneficiary[](total);

        for (uint256 i = 0; i < total; i++) {
            list[i] = beneficiaries[allBeneficiaryIds[i]];
        }

        return list;
    }

    /**
     * @notice Checks if a beneficiary ID exists and returns current status.
     * @param _id Beneficiary ID to verify
     */
    function verifyBeneficiary(uint256 _id)
        external
        view
        returns (
            bool exists,
            string memory name,
            string memory schemeName,
            uint256 amount,
            BeneficiaryStatus status,
            uint256 registrationTimestamp,
            uint256 distributionTimestamp
        )
    {
        if (!beneficiaries[_id].exists) {
            return (false, "", "", 0, BeneficiaryStatus.Registered, 0, 0);
        }
        Beneficiary memory b = beneficiaries[_id];
        return (
            true,
            b.name,
            b.schemeName,
            b.amount,
            b.status,
            b.registrationTimestamp,
            b.distributionTimestamp
        );
    }

    /**
     * @notice Transfers admin rights to a new government authority address.
     * @param _newAdmin Address of the new administrator
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Error: New admin address cannot be zero address");
        require(_newAdmin != admin, "Error: New admin is already current admin");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminTransferred(oldAdmin, _newAdmin);
    }
}
