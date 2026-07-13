# 03 — Workflows

## G-GPFMS Workflow Specifications

All workflows are database-driven via `workflow_templates` and `workflow_steps` tables. No approval logic is hardcoded. The `WorkflowService` evaluates the current step and advances or rolls back the document state accordingly.

---

## Master Business Flow

```
Grant Registration
  ↓
Project Setup → Activities → Budget Allocation
  ↓
Annual Procurement Plan (APP)
  ↓
Purchase Requisition (PR) ← Budget Verified
  ↓  [PR Approval Workflow]
Vendor Quotations / RFQ
  ↓
Purchasing Analysis Committee (PAC)
  ↓
Purchase Order (PO) ← Auto-serial, linked to PR
  ↓  [PO Approval Workflow]
Goods Received Note (GRN) / Service Certificate
  ↓
Vendor Invoice → Three-Way Match (PO ↔ GRN ↔ Invoice)
  ↓
Payment Request
  ↓  [Payment Approval Workflow]
Payment Voucher
  ↓
Cheque / Bank Transfer
  ↓
Journal Entry → General Ledger
  ↓
Financial Statements → Grant Report → Grant Closure
```

---

## Document Status Machine

All 17 business documents share this state machine:

```
                    ┌─────────────┐
                    │    DRAFT    │◄──────────────────┐
                    └──────┬──────┘                   │
                           │ submit()                  │ return()
                    ┌──────▼──────┐                   │
                    │  SUBMITTED  │───────────────────►┘
                    └──────┬──────┘
                           │
              ┌────────────┼─────────────┐
         approve()    reject()      return()
              │            │             │
       ┌──────▼──────┐ ┌───▼─────┐  [back to DRAFT]
       │  APPROVED   │ │REJECTED │
       └──────┬──────┘ └─────────┘
              │
    ┌─────────┼──────────┐
 close()  cancel()   archive()
    │         │           │
┌───▼────┐ ┌──▼──────┐ ┌──▼──────┐
│ CLOSED │ │CANCELLED│ │ARCHIVED │
└────────┘ └─────────┘ └─────────┘
```

Every transition is recorded in `audit_logs` and a `digital_signature` is captured on approve/reject/return actions.

---

## WF-001: Purchase Requisition Workflow

**Trigger:** User submits PR (status DRAFT → SUBMITTED)
**Template:** `PR_APPROVAL`

| Step | Actor | Action | SLA | On Timeout |
|---|---|---|---|---|
| 1 | Requester | Submit | — | — |
| 2 | Department Head | Review & Approve | 2 business days | Escalate to Director |
| 3 | Procurement Officer | Technical Review | 1 business day | Escalate to Procurement Manager |
| 4 | Finance Officer | Budget Confirmation | 1 business day | Escalate to Finance Manager |
| 5 | Country Director / Authorized Signatory | Final Approval | 2 business days | Escalate to Executive Director |

**Budget Check:** Before Step 2, system verifies budget availability. If insufficient, PR is auto-returned to requester with budget warning.

**Outcome on Final Approval:**
- PR status → APPROVED
- Budget line committed amount increased
- RFQ/quotation process begins automatically

---

## WF-002: Purchase Order Workflow

**Trigger:** Procurement Officer creates PO from approved PAC recommendation
**Template:** `PO_APPROVAL`

| Step | Actor | Action | SLA |
|---|---|---|---|
| 1 | Procurement Officer | Create & Submit | — |
| 2 | Procurement Manager | Review | 1 business day |
| 3 | Finance Manager | Financial Approval | 1 business day |
| 4 | Country Director | Final Sign-off | 2 business days |

**Outcome on Final Approval:**
- PO status → APPROVED → ISSUED
- Serial number finalized: GRANT-YYYY-PO-NNNN
- Vendor notified by email
- Automatic journal entry: Debit Commitment Account, Credit Accounts Payable

---

## WF-003: Payment Voucher Workflow

**Trigger:** Finance creates payment voucher after 3-way match passes
**Template:** `PAYMENT_APPROVAL`

| Step | Actor | Action | SLA |
|---|---|---|---|
| 1 | Finance Officer | Prepare & Submit | — |
| 2 | Finance Manager | Review & Verify | 1 business day |
| 3 | Internal Auditor | Compliance Check | 1 business day |
| 4 | Country Director | Authorize Payment | 2 business days |
| 5 | Cashier/Accountant | Execute Payment | Same day |

**Three-Way Match Gate:** Payment workflow cannot start if GRN quantity < invoice quantity or amounts differ beyond tolerance (configurable: default 0%).

**Outcome on Final Approval:**
- Payment Voucher status → PAID
- Cheque/Bank Transfer record created
- Journal Entry posted: Debit AP, Credit Bank/Cash
- Bank register updated

---

## WF-004: Goods Receipt Note (GRN) Workflow

**Trigger:** Warehouse staff records goods receipt against PO
**Template:** `GRN_APPROVAL`

| Step | Actor | Action | SLA |
|---|---|---|---|
| 1 | Warehouse Officer | Record Receipt | — |
| 2 | Requesting Department | Inspect & Confirm | 1 business day |
| 3 | Procurement Officer | Finalize GRN | Same day |

**Outcome:**
- GRN status → APPROVED
- Inventory stock increased
- PO partially or fully fulfilled (PO status → PARTIAL or COMPLETED)

---

## WF-005: Vendor Invoice Workflow

**Trigger:** Finance enters vendor invoice
**Template:** `INVOICE_APPROVAL`

| Step | Actor | Action | SLA |
|---|---|---|---|
| 1 | Finance Officer | Enter & Submit | — |
| 2 | Procurement Officer | Match to PO/GRN | 1 business day |
| 3 | Finance Manager | Approve for Payment | 1 business day |

---

## WF-006: Grant Amendment Workflow

| Step | Actor | Action | SLA |
|---|---|---|---|
| 1 | Program Officer | Prepare Amendment | — |
| 2 | Finance Manager | Budget Impact Review | 2 business days |
| 3 | Country Director | Approve | 3 business days |
| 4 | Donor Notification | Auto-notify donor contact | — |

---

## WF-007: Asset Disposal Workflow

| Step | Actor | Action | SLA |
|---|---|---|---|
| 1 | Asset Manager | Initiate Disposal | — |
| 2 | Finance Manager | Valuation Approval | 2 business days |
| 3 | Country Director | Final Approval | 3 business days |

---

## Workflow Engine Implementation Details

### WorkflowTemplate Schema
```typescript
{
  id, name, documentType, description,
  steps: WorkflowStep[] {
    id, stepNumber, name, approverRole, approverUserId?,
    isParallel, isMandatory, slaHours,
    escalationHours, escalationRole,
    allowDelegate, allowReturn, allowReject
  }
}
```

### WorkflowInstance Schema
```typescript
{
  id, templateId, documentType, documentId,
  currentStepNumber, status,
  steps: WorkflowInstanceStep[] {
    id, stepNumber, assignedUserId, status,
    startedAt, completedAt, dueAt,
    action, comment, digitalSignatureId
  }
}
```

### Workflow Engine Service Methods
```typescript
WorkflowService.startWorkflow(documentType, documentId, userId)
WorkflowService.advance(instanceId, action, userId, comment)
WorkflowService.getNextApprovers(instanceId)
WorkflowService.checkSLABreaches()  // Called by BullMQ cron
WorkflowService.delegate(instanceId, stepId, toUserId, reason)
WorkflowService.escalate(instanceId, stepId)
```

### Escalation Cron Job
BullMQ repeatable job runs every 30 minutes:
1. Query all `workflow_instance_steps` where status=PENDING and dueAt < NOW()
2. For each: send escalation notification to escalationRole
3. Optionally auto-advance to escalation approver
4. Log escalation in audit_logs

---

## Delegation Rules

- Any approver can delegate their pending approvals to another user of same or higher role
- Delegation is time-bounded (start date + end date)
- Original approver receives notification when delegated item is acted upon
- Delegation is recorded in `workflow_delegates` table
- Delegation does NOT grant permanent role permissions — only specific instance access

---

## Notification Triggers

| Event | Recipients | Channel |
|---|---|---|
| New approval pending | Assigned approver | Email + In-App |
| Approval reminder (50% SLA elapsed) | Assigned approver | Email |
| SLA breach escalation | Escalation role | Email + In-App |
| Document approved | Requester + all previous approvers | In-App |
| Document rejected | Requester | Email + In-App |
| Document returned | Requester | Email + In-App |
| Budget warning (>90% utilized) | Finance Manager + Project Manager | In-App |
| Grant expiry (30/60/90 days) | Finance Manager + Program Officer | Email + In-App |
| Vendor document expiry | Procurement Officer | Email + In-App |
| Contract expiry | Procurement Manager | Email + In-App |
