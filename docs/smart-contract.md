# Smart Contract Specification: `WelfareDistribution.sol`

**Author:** Jaison J (BE Computer Science - BIC702 Activity 1)  
**Solidity Version:** `^0.8.20`  
**License:** MIT

---

## 1. Data Structures & Types

### 1.1 `enum BeneficiaryStatus`
Represents the three strict sequential lifecycle phases of a beneficiary record:
- `Registered (0)`: Citizen has been enrolled by the authority; verification is pending.
- `Approved (1)`: Eligibility verified and approved by the government authority.
- `Distributed (2)`: Welfare benefit has been disbursed and permanently locked.

### 1.2 `struct Beneficiary`
```solidity
struct Beneficiary {
    uint256 id;                      // Unique sequential beneficiary identifier
    string name;                     // Citizen demo identifier / name
    string schemeName;               // Name of the welfare scheme (e.g. Student Scholarship)
    uint256 amount;                  // Benefit disbursed (in currency units / INR demo)
    BeneficiaryStatus status;        // Registered / Approved / Distributed
    uint256 registrationTimestamp;   // Block timestamp upon registration
    uint256 distributionTimestamp;   // Block timestamp upon disbursement
    bool exists;                     // Existence flag for O(1) validation
}
```

---

## 2. State Variables

| Variable Name | Type | Visibility | Description |
| :--- | :--- | :--- | :--- |
| `admin` | `address` | `public` | Authorized government nodal authority address. |
| `_beneficiaryIdCounter` | `uint256` | `private` | Auto-incrementing counter generating unique IDs. |
| `beneficiaries` | `mapping(uint256 => Beneficiary)` | `private` | Primary storage mapping ID to Beneficiary struct. |
| `allBeneficiaryIds` | `uint256[]` | `private` | Dynamic array tracking all IDs for enumeration. |

---

## 3. Function Specifications

### `registerBeneficiary(string memory _name, string memory _schemeName) external onlyAdmin returns (uint256 newId)`
- **Access:** Only authorized `admin` address.
- **Preconditions:**
  - `bytes(_name).length > 0`
  - `bytes(_schemeName).length > 0`
- **Postconditions:**
  - Increments `_beneficiaryIdCounter`.
  - Writes new `Beneficiary` struct with `status = BeneficiaryStatus.Registered`.
  - Sets `registrationTimestamp = block.timestamp`.
  - Appends `newId` to `allBeneficiaryIds`.
  - Emits `BeneficiaryRegistered` event.

---

### `approveBeneficiary(uint256 _id) external onlyAdmin beneficiaryExists(_id)`
- **Access:** Only authorized `admin` address.
- **Preconditions:**
  - Beneficiary ID must exist (`beneficiaries[_id].exists == true`).
  - Current status must be `Registered` (`b.status == BeneficiaryStatus.Registered`).
- **Postconditions:**
  - Updates `b.status = BeneficiaryStatus.Approved`.
  - Emits `BeneficiaryApproved` event.

---

### `distributeBenefit(uint256 _id, uint256 _amount) external onlyAdmin beneficiaryExists(_id)`
- **Access:** Only authorized `admin` address.
- **Preconditions:**
  - Beneficiary ID must exist.
  - Beneficiary must NOT be in `Registered` status (`"Beneficiary has not been approved yet"`).
  - Beneficiary must NOT be in `Distributed` status (`"Welfare benefit has already been distributed"`).
  - Beneficiary must be strictly in `Approved` status.
  - `_amount > 0`.
- **Postconditions:**
  - Updates `b.amount = _amount`.
  - Updates `b.status = BeneficiaryStatus.Distributed`.
  - Sets `b.distributionTimestamp = block.timestamp`.
  - Emits `BenefitDistributed` event.

---

### `getBeneficiary(uint256 _id) external view returns (...)`
- **Access:** Public read (Zero gas when queried off-chain).
- **Returns:** Tuple containing `id`, `name`, `schemeName`, `amount`, `status`, `registrationTimestamp`, and `distributionTimestamp`.

---

### `verifyBeneficiary(uint256 _id) external view returns (bool exists, ...)`
- **Access:** Public read.
- **Behavior:** Safe non-reverting verification lookup returning `exists = false` if the ID does not exist in the mapping.

---

### `getAllBeneficiaries() external view returns (Beneficiary[] memory)`
- **Access:** Public read.
- **Returns:** Full array of all registered beneficiaries for frontend dashboard binding.

---

## 4. Events & Signatures

```solidity
event BeneficiaryRegistered(uint256 indexed id, string name, string schemeName, uint256 timestamp, address indexed registeredBy);
event BeneficiaryApproved(uint256 indexed id, uint256 timestamp, address indexed approvedBy);
event BenefitDistributed(uint256 indexed id, uint256 amount, uint256 timestamp, address indexed distributedBy);
event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);
```
