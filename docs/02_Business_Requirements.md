# 02 — Business Requirements

## G-GPFMS Business Requirements Specification

### Organization Context

**Organization:** Gaderon Organization for Development
**Sector:** Humanitarian / NGO
**Primary Activities:** Development projects funded by international donors (USAID, EU, UN agencies, bilateral donors)
**Base Currencies:** USD (primary), SDG (Sudanese Pound)
**System Users:** Finance, Procurement, Project, Management, Audit teams + external Donor read-only access

---

## BR-001: Grant Management

| ID | Requirement | Priority |
|---|---|---|
| BR-001.1 | Register grants with code, donor, amount, currency, start/end dates, objectives | MUST |
| BR-001.2 | Support grant budget broken into budget lines per activity/cost category | MUST |
| BR-001.3 | Track real-time budget availability: Total − Committed − Spent = Available | MUST |
| BR-001.4 | Support grant amendments (budget revision, date extension, scope change) | MUST |
| BR-001.5 | Support multiple currencies per grant with versioned exchange rates | MUST |
| BR-001.6 | Generate grant financial reports per donor reporting templates | MUST |
| BR-001.7 | Track grant closure with final reconciliation checklist | MUST |
| BR-001.8 | Block any expenditure exceeding available grant budget | MUST |
| BR-001.9 | Support exchange rate revision without changing historical transactions | MUST |
| BR-001.10 | Alert when grant is within 30/60/90 days of expiry | SHOULD |

---

## BR-002: Project & Activity Management

| ID | Requirement | Priority |
|---|---|---|
| BR-002.1 | Each grant can have multiple projects; each project has activities | MUST |
| BR-002.2 | Activities are linked to budget lines for cost tracking | MUST |
| BR-002.3 | Projects support quarterly milestones (Q1–Q4) with deliverables | MUST |
| BR-002.4 | Milestone payment percentage triggers payment requests | MUST |
| BR-002.5 | Progress tracking per activity (% completion, actual vs planned) | MUST |
| BR-002.6 | Staff assignment to projects with role designation | SHOULD |

---

## BR-003: Procurement

| ID | Requirement | Priority |
|---|---|---|
| BR-003.1 | Annual Procurement Plan (APP) created per grant/fiscal year | MUST |
| BR-003.2 | Purchase Requisitions (PR) created against APP items and budget lines | MUST |
| BR-003.3 | Budget verification before PR can be submitted for approval | MUST |
| BR-003.4 | Procurement method determined by threshold (configurable, never hardcoded) | MUST |
| BR-003.5 | Supported methods: Petty Cash, RFQ, Competitive Bidding, Restricted Tender, Direct, LTA, Framework, Service Contract, Consultancy | MUST |
| BR-003.6 | RFQ sent to minimum 3 vendors (configurable per method) | MUST |
| BR-003.7 | Vendor quotation comparison with scoring (technical + committee scores) | MUST |
| BR-003.8 | Purchasing Analysis Committee (PAC) review and recommendation | MUST |
| BR-003.9 | Purchase Order (PO) generated from approved PR + PAC recommendation | MUST |
| BR-003.10 | Goods Received Note (GRN) with quantity accepted/rejected/damaged | MUST |
| BR-003.11 | Three-way matching: PO ↔ GRN ↔ Invoice before payment | MUST |
| BR-003.12 | Service Completion Certificate for service contracts | MUST |
| BR-003.13 | Contract management: LTA, framework agreements, service contracts | MUST |
| BR-003.14 | Serial numbers: GRANT-YYYY-PR-NNNN, PO-NNNN, GRN-NNNN (no duplicates) | MUST |

---

## BR-004: Vendor Management

| ID | Requirement | Priority |
|---|---|---|
| BR-004.1 | Vendor registration with full profile (legal name, address, contacts) | MUST |
| BR-004.2 | Store and track: Tax certificate, Bank info, National ID, Authorization letter, Code of Conduct, TSA Clearance, Contract documents | MUST |
| BR-004.3 | Document expiry alerts (30/60/90 days) | MUST |
| BR-004.4 | Vendor performance rating after each PO | SHOULD |
| BR-004.5 | Vendor blacklist with reason and date | MUST |
| BR-004.6 | Prevent blacklisted vendors from receiving quotation invitations | MUST |

---

## BR-005: Finance & Accounting

| ID | Requirement | Priority |
|---|---|---|
| BR-005.1 | Full Chart of Accounts (hierarchical: class → group → account → sub-account) | MUST |
| BR-005.2 | Fiscal year and accounting period management | MUST |
| BR-005.3 | Journal entries with debit/credit validation (must balance) | MUST |
| BR-005.4 | Automatic journal posting on: PO approval, GRN, payment | MUST |
| BR-005.5 | General Ledger with balance and transaction history per account | MUST |
| BR-005.6 | Cash book and bank book | MUST |
| BR-005.7 | Accounts Payable aging report | MUST |
| BR-005.8 | Bank reconciliation (import statement, auto-match, manual adjust) | MUST |
| BR-005.9 | Multi-currency with exchange gain/loss auto-calculation | MUST |
| BR-005.10 | Budget control: block payments exceeding budget availability | MUST |
| BR-005.11 | Trial Balance, Income Statement, Balance Sheet, Cash Flow Statement | MUST |
| BR-005.12 | Grant financial statements per donor format | MUST |

---

## BR-006: Payments

| ID | Requirement | Priority |
|---|---|---|
| BR-006.1 | Payment Request generated from approved invoice + 3-way match | MUST |
| BR-006.2 | Payment Voucher with multi-level approval workflow | MUST |
| BR-006.3 | Support: Cheque, Cash, Bank Transfer | MUST |
| BR-006.4 | Partial payments allowed | MUST |
| BR-006.5 | Multiple exchange rates per payment | MUST |
| BR-006.6 | Payment Declaration document generated | MUST |
| BR-006.7 | Serial numbers: GRANT-YYYY-PV-NNNN, CHQ-NNNN, BT-NNNN | MUST |

---

## BR-007: Inventory

| ID | Requirement | Priority |
|---|---|---|
| BR-007.1 | Warehouse and stock location management | MUST |
| BR-007.2 | Stock receiving from GRN, issue, transfer, adjustment | MUST |
| BR-007.3 | Stock card per item with full movement history | MUST |
| BR-007.4 | Barcode and QR code generation per item | SHOULD |
| BR-007.5 | Batch/lot tracking | SHOULD |

---

## BR-008: Fixed Assets

| ID | Requirement | Priority |
|---|---|---|
| BR-008.1 | Asset registration with serial number, category, purchase details | MUST |
| BR-008.2 | Asset assignment to department/custodian | MUST |
| BR-008.3 | Depreciation schedules (straight-line and reducing balance) | MUST |
| BR-008.4 | Maintenance records and warranty tracking | SHOULD |
| BR-008.5 | Asset disposal with approval workflow | MUST |
| BR-008.6 | Physical verification with checklist | SHOULD |
| BR-008.7 | Barcode/QR on each asset | SHOULD |

---

## BR-009: Workflow & Approvals

| ID | Requirement | Priority |
|---|---|---|
| BR-009.1 | Configurable workflow templates per document type | MUST |
| BR-009.2 | Unlimited approval levels | MUST |
| BR-009.3 | Sequential and parallel approval modes | MUST |
| BR-009.4 | Delegation (temporary reassignment) | MUST |
| BR-009.5 | Escalation on SLA breach | MUST |
| BR-009.6 | Email and in-app notifications at each step | MUST |
| BR-009.7 | Electronic digital signature on every approval | MUST |
| BR-009.8 | Approval history with timestamps and comments | MUST |

---

## BR-010: Digital Signatures

| ID | Requirement | Priority |
|---|---|---|
| BR-010.1 | Every approval action stores: approver, timestamp, IP, browser, device, comment | MUST |
| BR-010.2 | Signature displayed on generated PDFs | MUST |
| BR-010.3 | Signature is immutable (cannot be edited after capture) | MUST |

---

## BR-011: PDF Generation

| ID | Requirement | Priority |
|---|---|---|
| BR-011.1 | Generate branded PDFs for: PR, PO, GRN, Service Certificate, Payment Voucher, Cheque, Reports | MUST |
| BR-011.2 | Every PDF includes: Gaderon logo, document number, QR code, digital signatures, approval timeline, watermark, revision number, footer | MUST |
| BR-011.3 | PDFs are generated server-side and stored in MinIO | MUST |

---

## BR-012: Donor Portal

| ID | Requirement | Priority |
|---|---|---|
| BR-012.1 | Donors access a read-only portal via separate login | MUST |
| BR-012.2 | Donors can view: grants, activities, procurement, reports, financial statements | MUST |
| BR-012.3 | Donors can download PDFs | MUST |
| BR-012.4 | Donors cannot edit any data | MUST |
| BR-012.5 | Donors can leave comments on reports | SHOULD |

---

## BR-013: Audit & Compliance

| ID | Requirement | Priority |
|---|---|---|
| BR-013.1 | Every data mutation is logged (user, action, before/after values, IP, timestamp) | MUST |
| BR-013.2 | No hard deletes — all records use soft delete (deletedAt) | MUST |
| BR-013.3 | Audit log is immutable (no edits or deletes on audit_logs table) | MUST |
| BR-013.4 | Complete audit trail accessible per document | MUST |

---

## BR-014: Notifications

| ID | Requirement | Priority |
|---|---|---|
| BR-014.1 | In-app notifications for: pending approvals, budget warnings, document expiry | MUST |
| BR-014.2 | Email notifications for: workflow actions, escalations, expiry alerts | MUST |
| BR-014.3 | Notification preferences configurable per user | SHOULD |

---

## BR-015: RBAC

| ID | Requirement | Priority |
|---|---|---|
| BR-015.1 | Roles: Super Admin, Finance Manager, Procurement Manager, Project Manager, Auditor, Donor | MUST |
| BR-015.2 | Permissions stored in DB per module/action/resource | MUST |
| BR-015.3 | Permissions configurable without code deployment | MUST |
| BR-015.4 | Grant-level and project-level permission scoping | SHOULD |

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | List pages load in < 2s; dashboards < 3s |
| **Availability** | 99.5% uptime during business hours |
| **Security** | OWASP Top 10 compliance; all secrets in environment variables |
| **Data Integrity** | All financial amounts stored as Decimal(20,4); no floating point |
| **Internationalization** | English (LTR) primary; Arabic (RTL, Cairo font) ready |
| **Accessibility** | WCAG 2.1 AA on all user-facing screens |
| **Backup** | Daily PostgreSQL backup; MinIO versioning enabled |
