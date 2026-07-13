# 04 — Database Design

## G-GPFMS Database Design (PostgreSQL 16 + Prisma 5)

### Design Principles

1. All PKs use `cuid()` string IDs (collision-resistant, URL-safe)
2. All tables include `createdAt`, `updatedAt`, `deletedAt` (soft delete)
3. All monetary values stored as `Decimal(20,4)` — never Float
4. All relations have explicit `@relation` with named constraints
5. All FK columns have `@@index` for query performance
6. Enum values stored as PostgreSQL native enums

---

## Domain 1: Core (9 tables)

### organizations
```
id, name, shortName, logo, address, country, phone, email,
website, taxNumber, registrationNumber,
baseCurrency (USD), secondaryCurrency (SDG),
createdAt, updatedAt
```

### departments
```
id, organizationId→organizations, parentId→departments(nullable),
name, code, description, headUserId→users(nullable),
createdAt, updatedAt, deletedAt
```

### users
```
id, email (unique), passwordHash, firstName, lastName, arabicName,
phone, avatar, departmentId→departments, organizationId→organizations,
isActive, isEmailVerified, lastLoginAt, lastLoginIp,
refreshTokenHash (nullable),
createdAt, updatedAt, deletedAt
```

### roles
```
id, name (unique), displayName, description, isSystem (immutable system roles),
createdAt, updatedAt
```

### permissions
```
id, module (enum), action (enum: CREATE/READ/UPDATE/DELETE/APPROVE/EXPORT/IMPORT),
resource (nullable — specific resource type), description,
@@unique([module, action, resource])
```

### user_roles (junction)
```
userId→users, roleId→roles, grantedBy→users, grantedAt,
@@id([userId, roleId])
```

### role_permissions (junction)
```
roleId→roles, permissionId→permissions,
@@id([roleId, permissionId])
```

### settings
```
id, key (unique), value (Json), description, isPublic,
updatedBy→users, createdAt, updatedAt
```

### serial_sequences
```
id, grantCode, docType (enum: PR/PO/GRN/PV/CHQ/BT/JE/SCC/RFQ/APP/CNT),
lastNumber, prefix, format,
@@unique([grantCode, docType])
```

---

## Domain 2: Grants (9 tables)

### donors
```
id, name, code (unique), country, contactName, contactEmail, contactPhone,
address, donorType (enum: BILATERAL/MULTILATERAL/PRIVATE/FOUNDATION/GOVERNMENT),
createdAt, updatedAt, deletedAt
```

### currencies
```
id, code (unique, ISO 4217), name, symbol, isBase, isActive,
createdAt, updatedAt
```

### exchange_rates
```
id, fromCurrencyId→currencies, toCurrencyId→currencies,
rate Decimal(20,8), effectiveDate, source (MANUAL/CENTRAL_BANK),
grantId→grants(nullable), createdBy→users,
createdAt, updatedAt
@@index([fromCurrencyId, toCurrencyId, effectiveDate])
```

### fiscal_years
```
id, name, startDate, endDate, status (OPEN/CLOSED/LOCKED),
createdAt, updatedAt
```

### accounting_periods
```
id, fiscalYearId→fiscal_years, name, periodNumber, startDate, endDate,
status (OPEN/CLOSED), closedBy→users(nullable), closedAt(nullable),
createdAt, updatedAt
```

### grants
```
id, code (unique), name, donorId→donors, fiscalYearId→fiscal_years,
currency (default USD), totalBudget Decimal(20,4),
committedAmount Decimal(20,4) default 0,
spentAmount Decimal(20,4) default 0,
startDate, endDate, signedDate,
status (enum: DRAFT/ACTIVE/SUSPENDED/CLOSED/CANCELLED),
objectives, conditions, reportingRequirements,
grantManagerId→users, projectCoordinatorId→users,
createdBy→users, createdAt, updatedAt, deletedAt
```

### grant_budget_lines
```
id, grantId→grants, activityId→activities(nullable),
code, description, category (STAFF/TRAVEL/SUPPLIES/EQUIPMENT/SERVICES/OVERHEAD/OTHER),
totalBudget Decimal(20,4), committedAmount Decimal(20,4) default 0,
spentAmount Decimal(20,4) default 0,
currency, notes,
createdBy→users, createdAt, updatedAt, deletedAt
```

### grant_amendments
```
id, grantId→grants, amendmentNumber, title, description,
amendmentType (BUDGET_REVISION/DATE_EXTENSION/SCOPE_CHANGE/OTHER),
effectiveDate, previousValue Json, newValue Json,
status (DRAFT/SUBMITTED/APPROVED/REJECTED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, approvedBy→users(nullable), approvedAt(nullable),
createdAt, updatedAt
```

### grant_extensions
```
id, grantId→grants, extensionNumber,
previousEndDate, newEndDate, reason,
status (DRAFT/SUBMITTED/APPROVED/REJECTED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, approvedBy→users(nullable),
createdAt, updatedAt
```

---

## Domain 3: Projects (5 tables)

### projects
```
id, grantId→grants, code (unique), name, description,
startDate, endDate, budget Decimal(20,4),
status (PLANNING/ACTIVE/COMPLETED/SUSPENDED/CANCELLED),
projectManagerId→users,
createdBy→users, createdAt, updatedAt, deletedAt
```

### project_milestones
```
id, projectId→projects, title, description,
quarter (Q1/Q2/Q3/Q4), dueDate,
deliverables Json, budget Decimal(20,4), paymentPercent Decimal(5,2),
status (PENDING/IN_PROGRESS/COMPLETED/OVERDUE),
completedAt(nullable), approvedBy→users(nullable),
createdAt, updatedAt
```

### activities
```
id, projectId→projects, budgetLineId→grant_budget_lines(nullable),
code, name, description,
startDate, endDate, plannedBudget Decimal(20,4),
actualSpent Decimal(20,4) default 0,
progressPercent Decimal(5,2) default 0,
status (PLANNING/IN_PROGRESS/REVIEW/COMPLETED/CANCELLED),
responsibleUserId→users,
createdBy→users, createdAt, updatedAt, deletedAt
```

### activity_budget_lines
```
id, activityId→activities, budgetLineId→grant_budget_lines,
allocatedAmount Decimal(20,4),
createdAt, updatedAt
@@unique([activityId, budgetLineId])
```

### project_staff
```
id, projectId→projects, userId→users,
role, startDate, endDate(nullable),
createdAt, updatedAt
```

---

## Domain 4: Procurement (18 tables)

### procurement_methods
```
id, name (unique), code (unique), description,
minThreshold Decimal(20,4), maxThreshold Decimal(20,4)(nullable),
minVendors Int default 1, requiresCommittee Boolean,
isActive, createdAt, updatedAt
```

### annual_procurement_plans
```
id, serialNumber (unique), grantId→grants, fiscalYearId→fiscal_years,
title, description, totalBudget Decimal(20,4),
status (DRAFT/SUBMITTED/APPROVED/ACTIVE/CLOSED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt, deletedAt
```

### app_items
```
id, appId→annual_procurement_plans, activityId→activities,
budgetLineId→grant_budget_lines, description,
procurementMethodId→procurement_methods,
estimatedAmount Decimal(20,4), currency,
plannedQuarter (Q1/Q2/Q3/Q4), unit, quantity,
status (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED),
createdAt, updatedAt
```

### purchase_requisitions
```
id, serialNumber (unique), appItemId→app_items(nullable),
grantId→grants, activityId→activities, budgetLineId→grant_budget_lines,
title, description, requestedBy→users, departmentId→departments,
procurementMethodId→procurement_methods,
totalEstimatedAmount Decimal(20,4), currency,
requiredByDate, justification,
status (DRAFT/SUBMITTED/RETURNED/APPROVED/REJECTED/CANCELLED),
workflowInstanceId→workflow_instances(nullable),
createdAt, updatedAt, deletedAt
```

### pr_items
```
id, prId→purchase_requisitions, description,
specification, unit, quantity, estimatedUnitPrice Decimal(20,4),
totalEstimated Decimal(20,4), budgetLineId→grant_budget_lines(nullable),
createdAt, updatedAt
```

### vendors
```
id, registrationNumber (unique), name, arabicName,
vendorType (SUPPLIER/SERVICE_PROVIDER/CONSULTANT/CONTRACTOR),
country, address, city, phone, email, website,
taxNumber, bankName, bankAccount, bankIban, bankSwift,
isBlacklisted, blacklistReason, blacklistDate,
rating Decimal(3,2) default 0,
createdBy→users, createdAt, updatedAt, deletedAt
```

### vendor_documents
```
id, vendorId→vendors,
documentType (TAX_CERT/NATIONAL_ID/AUTHORIZATION_LETTER/CODE_OF_CONDUCT/TSA_CLEARANCE/BANK_LETTER/REGISTRATION/OTHER),
documentNumber, issueDate, expiryDate(nullable),
fileUrl, fileName, fileSize,
isVerified, verifiedBy→users(nullable), verifiedAt(nullable),
createdAt, updatedAt
```

### vendor_bank_accounts
```
id, vendorId→vendors, bankName, accountName, accountNumber,
iban, swiftCode, currency, country,
isPrimary, createdAt, updatedAt
```

### rfqs
```
id, serialNumber (unique), prId→purchase_requisitions,
grantId→grants, title, description,
issuedDate, submissionDeadline, openingDate(nullable),
status (DRAFT/ISSUED/EVALUATING/AWARDED/CLOSED/CANCELLED),
procurementMethodId→procurement_methods,
createdBy→users, createdAt, updatedAt, deletedAt
```

### rfq_vendors
```
id, rfqId→rfqs, vendorId→vendors,
invitedAt, respondedAt(nullable),
quotedAmount Decimal(20,4)(nullable), currency,
deliveryDays Int(nullable), warrantyTerms,
technicalScore Decimal(5,2) default 0,
financialScore Decimal(5,2) default 0,
committeeScore Decimal(5,2) default 0,
totalScore Decimal(5,2) default 0,
isShortlisted, isWinner,
notes, fileUrl(nullable),
createdAt, updatedAt
```

### rfq_evaluations
```
id, rfqId→rfqs, rfqVendorId→rfq_vendors, evaluatorId→users,
criteriaName, weight Decimal(5,2), score Decimal(5,2),
weightedScore Decimal(5,2), notes,
createdAt, updatedAt
```

### purchase_analysis_forms
```
id, rfqId→rfqs, prId→purchase_requisitions,
recommendedVendorId→vendors, totalAmount Decimal(20,4),
currency, justification, committeeMembers Json,
status (DRAFT/SUBMITTED/APPROVED/REJECTED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt
```

### purchase_orders
```
id, serialNumber (unique), prId→purchase_requisitions(nullable),
rfqId→rfqs(nullable), pafId→purchase_analysis_forms(nullable),
vendorId→vendors, grantId→grants,
budgetLineId→grant_budget_lines, contractId→contracts(nullable),
title, deliveryAddress, deliveryDate,
currency, subtotal Decimal(20,4), taxAmount Decimal(20,4) default 0,
totalAmount Decimal(20,4), paidAmount Decimal(20,4) default 0,
terms, notes,
status (DRAFT/SUBMITTED/APPROVED/ISSUED/PARTIAL/COMPLETED/CANCELLED),
workflowInstanceId→workflow_instances(nullable),
issuedBy→users(nullable), issuedAt(nullable),
createdBy→users, createdAt, updatedAt, deletedAt
```

### po_items
```
id, poId→purchase_orders, description, specification,
unit, orderedQuantity Decimal(10,3),
receivedQuantity Decimal(10,3) default 0,
unitPrice Decimal(20,4), totalPrice Decimal(20,4),
budgetLineId→grant_budget_lines(nullable),
createdAt, updatedAt
```

### goods_receipts
```
id, serialNumber (unique), poId→purchase_orders,
grantId→grants, warehouseId→warehouses(nullable),
receiptDate, deliveryNote, notes,
status (DRAFT/SUBMITTED/APPROVED/REJECTED),
workflowInstanceId→workflow_instances(nullable),
receivedBy→users, createdAt, updatedAt, deletedAt
```

### grn_items
```
id, grnId→goods_receipts, poItemId→po_items,
description, orderedQuantity Decimal(10,3),
deliveredQuantity Decimal(10,3), acceptedQuantity Decimal(10,3),
rejectedQuantity Decimal(10,3) default 0,
damagedQuantity Decimal(10,3) default 0,
notes, createdAt, updatedAt
```

### contracts
```
id, serialNumber (unique), vendorId→vendors, grantId→grants,
contractType (LTA/FRAMEWORK/SERVICE/CONSULTANCY/SUPPLY/OTHER),
title, description, startDate, endDate,
totalValue Decimal(20,4), currency,
paymentTerms, deliverables,
status (DRAFT/ACTIVE/COMPLETED/TERMINATED/EXPIRED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt, deletedAt
```

### vendor_invoices
```
id, serialNumber (unique), poId→purchase_orders, vendorId→vendors,
grantId→grants, invoiceNumber, invoiceDate, dueDate,
currency, subtotal Decimal(20,4), taxAmount Decimal(20,4) default 0,
totalAmount Decimal(20,4), paidAmount Decimal(20,4) default 0,
isThreeWayMatched, matchedAt(nullable), matchedBy→users(nullable),
status (RECEIVED/MATCHED/APPROVED/PAID/CANCELLED),
workflowInstanceId→workflow_instances(nullable),
fileUrl(nullable), notes,
createdBy→users, createdAt, updatedAt, deletedAt
```

---

## Domain 5: Finance (14 tables)

### chart_of_accounts
```
id, code (unique), name, arabicName, accountType (ASSET/LIABILITY/EQUITY/REVENUE/EXPENSE),
accountClass (enum: detailed type), parentId→chart_of_accounts(nullable),
level Int, isLeaf, isActive, description,
normalBalance (DEBIT/CREDIT),
createdAt, updatedAt, deletedAt
```

### journal_entries
```
id, serialNumber (unique), entryDate, description,
reference, sourceType (MANUAL/PO/GRN/PAYMENT/DEPRECIATION/OPENING/CLOSING),
sourceId (nullable), grantId→grants(nullable), periodId→accounting_periods,
currency, totalDebit Decimal(20,4), totalCredit Decimal(20,4),
isPosted, postedAt(nullable), postedBy→users(nullable),
isReversed, reversedBy→journal_entries(nullable),
status (DRAFT/POSTED/REVERSED),
createdBy→users, createdAt, updatedAt
```

### journal_lines
```
id, journalEntryId→journal_entries, accountId→chart_of_accounts,
description, debitAmount Decimal(20,4) default 0,
creditAmount Decimal(20,4) default 0,
currency, exchangeRate Decimal(20,8) default 1,
baseDebit Decimal(20,4) default 0, baseCredit Decimal(20,4) default 0,
grantId→grants(nullable), activityId→activities(nullable),
lineNumber Int, createdAt, updatedAt
```

### bank_accounts
```
id, accountName, bankName, accountNumber, iban(nullable),
swiftCode(nullable), currency, currentBalance Decimal(20,4) default 0,
glAccountId→chart_of_accounts,
isActive, notes, createdAt, updatedAt
```

### bank_statements
```
id, bankAccountId→bank_accounts, statementDate,
openingBalance Decimal(20,4), closingBalance Decimal(20,4),
fileUrl(nullable), importedAt, importedBy→users,
createdAt, updatedAt
```

### bank_statement_lines
```
id, statementId→bank_statements, transactionDate,
description, reference, debitAmount Decimal(20,4) default 0,
creditAmount Decimal(20,4) default 0, balance Decimal(20,4),
isReconciled, reconciledWith(nullable), createdAt
```

### bank_reconciliations
```
id, bankAccountId→bank_accounts, periodId→accounting_periods,
reconciliationDate, bookBalance Decimal(20,4), bankBalance Decimal(20,4),
adjustedBookBalance Decimal(20,4), adjustedBankBalance Decimal(20,4),
difference Decimal(20,4), status (DRAFT/COMPLETED),
reconciledBy→users, createdAt, updatedAt
```

### payment_requests
```
id, serialNumber (unique), invoiceId→vendor_invoices,
grantId→grants, requestDate, totalAmount Decimal(20,4),
currency, paymentMethod (CHEQUE/BANK_TRANSFER/CASH),
bankAccountId→bank_accounts(nullable), notes,
status (DRAFT/SUBMITTED/APPROVED/REJECTED/CANCELLED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt, deletedAt
```

### payment_vouchers
```
id, serialNumber (unique), paymentRequestId→payment_requests(nullable),
grantId→grants, payeeType (VENDOR/EMPLOYEE/OTHER),
payeeId (nullable), payeeName, paymentDate,
currency, amount Decimal(20,4), exchangeRate Decimal(20,8) default 1,
baseAmount Decimal(20,4), description, reference,
status (DRAFT/SUBMITTED/APPROVED/PAID/CANCELLED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt, deletedAt
```

### payments
```
id, paymentVoucherId→payment_vouchers,
paymentMethod (CHEQUE/BANK_TRANSFER/CASH),
paymentDate, amount Decimal(20,4), currency,
exchangeRate Decimal(20,8) default 1, baseAmount Decimal(20,4),
reference, bankAccountId→bank_accounts(nullable),
journalEntryId→journal_entries(nullable),
status (PENDING/PROCESSING/COMPLETED/FAILED/REVERSED),
createdBy→users, createdAt, updatedAt
```

### cheques
```
id, paymentId→payments, serialNumber (unique),
chequeNumber, bankAccountId→bank_accounts,
payeeName, amount Decimal(20,4), currency,
chequeDate, memo(nullable),
status (DRAFT/ISSUED/PRESENTED/CLEARED/BOUNCED/CANCELLED/VOIDED),
printedAt(nullable), issuedAt(nullable), clearedAt(nullable),
fileUrl(nullable), createdAt, updatedAt
```

### bank_transfers
```
id, paymentId→payments, serialNumber (unique),
fromBankAccountId→bank_accounts, toBankAccount, toBankName,
toAccountName, currency, amount Decimal(20,4),
exchangeRate Decimal(20,8) default 1, baseAmount Decimal(20,4),
transferDate, reference, swiftRef(nullable),
status (PENDING/PROCESSING/COMPLETED/FAILED/REVERSED),
fileUrl(nullable), completedAt(nullable), createdAt, updatedAt
```

### payment_declarations
```
id, paymentId→payments, declarationDate, signatoryId→users,
amount Decimal(20,4), currency, purpose, notes,
fileUrl(nullable), createdAt, updatedAt
```

---

## Domain 6: Workflow (8 tables)

### workflow_templates
```
id, name (unique), documentType (enum), description,
isActive, version Int default 1,
createdBy→users, createdAt, updatedAt
```

### workflow_steps
```
id, templateId→workflow_templates, stepNumber, name,
approverRole→roles(nullable), approverUserId→users(nullable),
isParallel, isMandatory, slaHours Int,
escalationHours Int(nullable), escalationRoleId→roles(nullable),
allowDelegate, allowReturn, allowReject,
conditions Json(nullable), createdAt, updatedAt
```

### workflow_instances
```
id, templateId→workflow_templates, documentType, documentId,
currentStepNumber Int default 1,
status (PENDING/IN_PROGRESS/APPROVED/REJECTED/RETURNED/CANCELLED),
startedAt, completedAt(nullable),
createdAt, updatedAt
```

### workflow_instance_steps
```
id, instanceId→workflow_instances, stepNumber, stepName,
assignedUserId→users(nullable), assignedRoleId→roles(nullable),
status (PENDING/IN_PROGRESS/APPROVED/REJECTED/RETURNED/SKIPPED/ESCALATED),
startedAt(nullable), completedAt(nullable), dueAt(nullable),
action(nullable), comment(nullable),
digitalSignatureId→digital_signatures(nullable),
createdAt, updatedAt
```

### workflow_actions
```
id, instanceId→workflow_instances, instanceStepId→workflow_instance_steps,
actorId→users, action (SUBMIT/APPROVE/REJECT/RETURN/DELEGATE/ESCALATE/COMMENT),
comment(nullable), actionAt,
digitalSignatureId→digital_signatures(nullable),
createdAt
```

### digital_signatures
```
id, userId→users, documentType, documentId, action,
ipAddress, userAgent, deviceFingerprint(nullable),
signedAt, certificate(nullable),
createdAt
```

### workflow_delegates
```
id, fromUserId→users, toUserId→users,
documentType(nullable), startDate, endDate,
reason, isActive,
createdBy→users, createdAt, updatedAt
```

### workflow_escalations
```
id, instanceStepId→workflow_instance_steps,
escalatedFromUserId→users(nullable), escalatedToUserId→users,
reason, escalatedAt, resolvedAt(nullable), isResolved,
createdAt
```

---

## Domain 7: Inventory (7 tables)

### warehouses
```
id, name (unique), code (unique), address, managerId→users(nullable),
isActive, notes, createdAt, updatedAt, deletedAt
```

### inventory_categories
```
id, name, code, parentId→inventory_categories(nullable),
description, createdAt, updatedAt
```

### inventory_items
```
id, sku (unique), name, description, categoryId→inventory_categories,
unit, reorderLevel Decimal(10,3) default 0,
currentStock Decimal(10,3) default 0,
unitCost Decimal(20,4) default 0, totalValue Decimal(20,4) default 0,
warehouseId→warehouses, locationCode(nullable),
barcodeType (QR/BARCODE/NONE), barcodeValue(nullable),
isActive, createdAt, updatedAt, deletedAt
```

### stock_movements
```
id, itemId→inventory_items, warehouseId→warehouses,
movementType (RECEIPT/ISSUE/TRANSFER/ADJUSTMENT/RETURN/DISPOSAL),
quantity Decimal(10,3), unitCost Decimal(20,4),
totalCost Decimal(20,4), balanceAfter Decimal(10,3),
reference, referenceId(nullable), referenceType(nullable),
grantId→grants(nullable), notes,
createdBy→users, createdAt
```

### stock_adjustments
```
id, serialNumber (unique), warehouseId→warehouses,
adjustmentDate, reason,
status (DRAFT/SUBMITTED/APPROVED/REJECTED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt
```

### inventory_batches
```
id, itemId→inventory_items, batchNumber (unique),
expiryDate(nullable), quantity Decimal(10,3),
receivedDate, notes, createdAt, updatedAt
```

### warehouse_locations
```
id, warehouseId→warehouses, code, name,
row(nullable), shelf(nullable), bin(nullable),
isActive, createdAt, updatedAt
```

---

## Domain 8: Fixed Assets (8 tables)

### asset_categories
```
id, name, code (unique), parentId→asset_categories(nullable),
depreciationMethod (STRAIGHT_LINE/REDUCING_BALANCE),
usefulLifeYears Int, residualValuePercent Decimal(5,2) default 0,
glAccountId→chart_of_accounts(nullable),
depreciationGlAccountId→chart_of_accounts(nullable),
createdAt, updatedAt
```

### fixed_assets
```
id, serialNumber (unique), assetCode (unique), name, description,
categoryId→asset_categories, grantId→grants(nullable),
purchaseDate, purchasePrice Decimal(20,4), currency,
currentBookValue Decimal(20,4),
depreciationMethod (STRAIGHT_LINE/REDUCING_BALANCE),
usefulLifeYears Int, residualValue Decimal(20,4) default 0,
depreciationStartDate, lastDepreciationDate(nullable),
warehouseId→warehouses(nullable), locationCode(nullable),
barcodeType, barcodeValue(nullable),
status (ACTIVE/DISPOSED/TRANSFERRED/LOST/WRITTEN_OFF),
purchaseOrderId→purchase_orders(nullable),
createdBy→users, createdAt, updatedAt, deletedAt
```

### asset_assignments
```
id, assetId→fixed_assets, assignedToUserId→users,
departmentId→departments, assignedDate, returnDate(nullable),
condition (EXCELLENT/GOOD/FAIR/POOR), notes,
assignedBy→users, createdAt, updatedAt
```

### asset_maintenance
```
id, assetId→fixed_assets, maintenanceType (PREVENTIVE/CORRECTIVE/UPGRADE),
scheduledDate, completedDate(nullable), description,
cost Decimal(20,4) default 0, vendorId→vendors(nullable),
status (SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED),
performedBy(nullable), notes, createdAt, updatedAt
```

### asset_depreciation_schedules
```
id, assetId→fixed_assets, period, depreciationAmount Decimal(20,4),
accumulatedDepreciation Decimal(20,4), bookValue Decimal(20,4),
isPosted, journalEntryId→journal_entries(nullable),
postedAt(nullable), createdAt, updatedAt
```

### asset_depreciation_entries
```
id, assetId→fixed_assets, periodId→accounting_periods,
depreciationAmount Decimal(20,4), bookValueBefore Decimal(20,4),
bookValueAfter Decimal(20,4), journalEntryId→journal_entries(nullable),
isPosted, createdAt
```

### asset_disposals
```
id, assetId→fixed_assets, disposalDate, disposalMethod (SALE/DONATION/SCRAP/WRITE_OFF),
saleAmount Decimal(20,4) default 0, bookValueAtDisposal Decimal(20,4),
gainLoss Decimal(20,4), reason, approvedBy→users(nullable),
journalEntryId→journal_entries(nullable),
status (DRAFT/SUBMITTED/APPROVED/COMPLETED),
workflowInstanceId→workflow_instances(nullable),
createdBy→users, createdAt, updatedAt
```

### asset_verifications
```
id, assetId→fixed_assets, verificationDate, verifiedBy→users,
condition (EXCELLENT/GOOD/FAIR/POOR/MISSING),
location(nullable), notes, photoUrl(nullable),
createdAt
```

---

## Domain 9: Collaboration (6 tables)

### document_attachments
```
id, documentType, documentId, fileName, originalName,
fileSize Int, mimeType, fileUrl, storageKey,
uploadedBy→users, createdAt, deletedAt
```

### document_versions
```
id, documentType, documentId, versionNumber Int,
changesSummary, snapshotData Json,
createdBy→users, createdAt
```

### comments
```
id, documentType, documentId, parentId→comments(nullable),
content, isInternal, isResolved,
createdBy→users, createdAt, updatedAt, deletedAt
```

### comment_mentions
```
id, commentId→comments, mentionedUserId→users,
isRead, createdAt
```

### notifications
```
id, userId→users, type (INFO/SUCCESS/WARNING/ERROR/APPROVAL_REQUEST/ESCALATION),
title, message, actionUrl(nullable),
documentType(nullable), documentId(nullable),
isRead, readAt(nullable),
channel (IN_APP/EMAIL), sentAt(nullable),
createdAt
```

### notification_preferences
```
id, userId→users,
module, eventType, emailEnabled, inAppEnabled,
createdAt, updatedAt
@@unique([userId, module, eventType])
```

---

## Domain 10: Audit (1 table)

### audit_logs
```
id, userId→users(nullable), userEmail(nullable),
action (CREATE/READ/UPDATE/DELETE/SUBMIT/APPROVE/REJECT/RETURN/LOGIN/LOGOUT/EXPORT/IMPORT),
module, resource, resourceId(nullable),
oldValues Json(nullable), newValues Json(nullable),
ipAddress, userAgent, sessionId(nullable),
requestId(nullable), duration Int(nullable),
createdAt
```
*Note: audit_logs has NO deletedAt — records are immutable.*

---

## Key Indexes (Performance Critical)

```sql
-- Grants
CREATE INDEX ON grants(status, deletedAt);
CREATE INDEX ON grants(donorId, fiscalYearId);

-- Procurement
CREATE INDEX ON purchase_requisitions(grantId, status, deletedAt);
CREATE INDEX ON purchase_orders(vendorId, status, deletedAt);
CREATE INDEX ON purchase_orders(grantId, status);

-- Finance
CREATE INDEX ON journal_lines(accountId, createdAt);
CREATE INDEX ON payments(paymentDate, status);

-- Audit
CREATE INDEX ON audit_logs(userId, createdAt);
CREATE INDEX ON audit_logs(module, resource, resourceId);
CREATE INDEX ON audit_logs(createdAt);

-- Notifications
CREATE INDEX ON notifications(userId, isRead, createdAt);

-- Workflow
CREATE INDEX ON workflow_instances(documentType, documentId);
CREATE INDEX ON workflow_instance_steps(instanceId, status);
```
