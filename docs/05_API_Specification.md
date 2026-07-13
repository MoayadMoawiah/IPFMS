# 05 — API Specification

## G-GPFMS REST API Specification

**Base URL:** `http://localhost:3001/api`  
**Auth:** Bearer JWT token in `Authorization` header  
**Format:** JSON (`Content-Type: application/json`)  
**Docs:** Swagger UI at `http://localhost:3001/api/docs`

---

## Standard Response Envelopes

### Paginated List
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Single Resource
```json
{
  "data": { ... }
}
```

### Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "amount", "message": "Must be positive" }],
  "timestamp": "2026-01-01T00:00:00Z",
  "path": "/api/procurement/requisitions"
}
```

---

## Standard Query Parameters (all list endpoints)

| Parameter | Type | Description |
|---|---|---|
| `page` | Int | Page number (default: 1) |
| `limit` | Int | Items per page (default: 20, max: 100) |
| `sortBy` | String | Field name to sort by |
| `sortOrder` | asc/desc | Sort direction (default: desc) |
| `search` | String | Full-text search across key fields |
| `status` | String | Filter by status |
| `grantId` | String | Filter by grant |
| `startDate` | ISO Date | Filter by date range start |
| `endDate` | ISO Date | Filter by date range end |

---

## Auth Endpoints

```
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/me/password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### POST /api/auth/login
```json
Request:  { "email": "string", "password": "string" }
Response: { "accessToken": "jwt", "refreshToken": "jwt", "user": { ... } }
```

---

## User & RBAC Endpoints

```
GET    /api/users                  List users (paginated)
POST   /api/users                  Create user
GET    /api/users/:id              Get user detail
PATCH  /api/users/:id              Update user
DELETE /api/users/:id              Soft delete user
POST   /api/users/:id/activate     Activate user
POST   /api/users/:id/deactivate   Deactivate user
GET    /api/users/:id/permissions  Get user effective permissions

GET    /api/roles                  List roles
POST   /api/roles                  Create role
GET    /api/roles/:id              Get role with permissions
PATCH  /api/roles/:id              Update role
DELETE /api/roles/:id              Delete role
POST   /api/roles/:id/permissions  Assign permissions to role

GET    /api/permissions            List all permissions
```

---

## Grant Endpoints

```
GET    /api/grants                         List grants
POST   /api/grants                         Create grant
GET    /api/grants/:id                     Get grant detail
PATCH  /api/grants/:id                     Update grant
DELETE /api/grants/:id                     Soft delete grant
POST   /api/grants/:id/submit              Submit for approval
POST   /api/grants/:id/approve             Approve grant
POST   /api/grants/:id/close              Close grant
GET    /api/grants/:id/budget              Get budget summary
GET    /api/grants/:id/budget/lines        Get budget lines
POST   /api/grants/:id/budget/lines        Add budget line
PATCH  /api/grants/:id/budget/lines/:lineId Update budget line
GET    /api/grants/:id/amendments          List amendments
POST   /api/grants/:id/amendments          Create amendment
GET    /api/grants/:id/extensions          List extensions
POST   /api/grants/:id/extensions          Create extension
GET    /api/grants/:id/transactions        All financial transactions
GET    /api/grants/:id/report              Grant financial report
GET    /api/grants/:id/export/pdf          Export grant report PDF
GET    /api/grants/:id/history             Version history
GET    /api/grants/:id/audit               Audit trail
POST   /api/grants/:id/duplicate           Duplicate grant structure

GET    /api/donors                         List donors
POST   /api/donors                         Create donor
GET    /api/donors/:id                     Donor detail
PATCH  /api/donors/:id                     Update donor
```

---

## Projects & Activities Endpoints

```
GET    /api/projects                       List projects
POST   /api/projects                       Create project
GET    /api/projects/:id                   Project detail with activities
PATCH  /api/projects/:id                   Update project
DELETE /api/projects/:id                   Soft delete

GET    /api/projects/:id/milestones        List milestones
POST   /api/projects/:id/milestones        Add milestone
PATCH  /api/projects/:id/milestones/:mid   Update milestone
POST   /api/projects/:id/milestones/:mid/complete  Mark complete

GET    /api/activities                     List activities
POST   /api/activities                     Create activity
GET    /api/activities/:id                 Activity detail
PATCH  /api/activities/:id                 Update activity
DELETE /api/activities/:id                 Soft delete
PATCH  /api/activities/:id/progress        Update progress %
GET    /api/activities/:id/budget          Activity budget summary
```

---

## Procurement Endpoints

### Annual Procurement Plan
```
GET    /api/procurement/annual-plans
POST   /api/procurement/annual-plans
GET    /api/procurement/annual-plans/:id
PATCH  /api/procurement/annual-plans/:id
POST   /api/procurement/annual-plans/:id/submit
POST   /api/procurement/annual-plans/:id/approve
GET    /api/procurement/annual-plans/:id/items
POST   /api/procurement/annual-plans/:id/items
PATCH  /api/procurement/annual-plans/:id/items/:itemId
DELETE /api/procurement/annual-plans/:id/items/:itemId
GET    /api/procurement/annual-plans/:id/export/pdf
GET    /api/procurement/annual-plans/:id/export/excel
```

### Purchase Requisitions
```
GET    /api/procurement/requisitions
POST   /api/procurement/requisitions
GET    /api/procurement/requisitions/:id
PATCH  /api/procurement/requisitions/:id
DELETE /api/procurement/requisitions/:id
POST   /api/procurement/requisitions/:id/submit
POST   /api/procurement/requisitions/:id/approve
POST   /api/procurement/requisitions/:id/reject
POST   /api/procurement/requisitions/:id/return
GET    /api/procurement/requisitions/:id/items
POST   /api/procurement/requisitions/:id/items
PATCH  /api/procurement/requisitions/:id/items/:itemId
DELETE /api/procurement/requisitions/:id/items/:itemId
GET    /api/procurement/requisitions/:id/export/pdf
GET    /api/procurement/requisitions/:id/history
GET    /api/procurement/requisitions/:id/audit
```

### Vendors
```
GET    /api/procurement/vendors
POST   /api/procurement/vendors
GET    /api/procurement/vendors/:id
PATCH  /api/procurement/vendors/:id
DELETE /api/procurement/vendors/:id
POST   /api/procurement/vendors/:id/blacklist
POST   /api/procurement/vendors/:id/remove-blacklist
GET    /api/procurement/vendors/:id/documents
POST   /api/procurement/vendors/:id/documents
DELETE /api/procurement/vendors/:id/documents/:docId
GET    /api/procurement/vendors/:id/orders
GET    /api/procurement/vendors/:id/performance
GET    /api/procurement/vendors/expiring-documents
```

### RFQ
```
GET    /api/procurement/rfq
POST   /api/procurement/rfq
GET    /api/procurement/rfq/:id
PATCH  /api/procurement/rfq/:id
DELETE /api/procurement/rfq/:id
POST   /api/procurement/rfq/:id/issue
POST   /api/procurement/rfq/:id/close
GET    /api/procurement/rfq/:id/vendors
POST   /api/procurement/rfq/:id/vendors
PATCH  /api/procurement/rfq/:id/vendors/:rfqVendorId
POST   /api/procurement/rfq/:id/vendors/:rfqVendorId/award
GET    /api/procurement/rfq/:id/comparison
GET    /api/procurement/rfq/:id/evaluation
POST   /api/procurement/rfq/:id/evaluation
```

### Purchase Orders
```
GET    /api/procurement/purchase-orders
POST   /api/procurement/purchase-orders
GET    /api/procurement/purchase-orders/:id
PATCH  /api/procurement/purchase-orders/:id
DELETE /api/procurement/purchase-orders/:id
POST   /api/procurement/purchase-orders/:id/submit
POST   /api/procurement/purchase-orders/:id/approve
POST   /api/procurement/purchase-orders/:id/reject
POST   /api/procurement/purchase-orders/:id/return
POST   /api/procurement/purchase-orders/:id/issue
GET    /api/procurement/purchase-orders/:id/items
POST   /api/procurement/purchase-orders/:id/items
GET    /api/procurement/purchase-orders/:id/receipts
GET    /api/procurement/purchase-orders/:id/invoices
GET    /api/procurement/purchase-orders/:id/payment-status
GET    /api/procurement/purchase-orders/:id/export/pdf
```

### Goods Receipts
```
GET    /api/procurement/goods-receipts
POST   /api/procurement/goods-receipts
GET    /api/procurement/goods-receipts/:id
PATCH  /api/procurement/goods-receipts/:id
POST   /api/procurement/goods-receipts/:id/submit
POST   /api/procurement/goods-receipts/:id/approve
POST   /api/procurement/goods-receipts/:id/reject
GET    /api/procurement/goods-receipts/:id/items
GET    /api/procurement/goods-receipts/:id/export/pdf
```

### Contracts
```
GET    /api/procurement/contracts
POST   /api/procurement/contracts
GET    /api/procurement/contracts/:id
PATCH  /api/procurement/contracts/:id
DELETE /api/procurement/contracts/:id
POST   /api/procurement/contracts/:id/activate
POST   /api/procurement/contracts/:id/terminate
GET    /api/procurement/contracts/expiring
GET    /api/procurement/contracts/:id/export/pdf
```

---

## Finance Endpoints

### Chart of Accounts
```
GET    /api/finance/accounts
POST   /api/finance/accounts
GET    /api/finance/accounts/:id
PATCH  /api/finance/accounts/:id
DELETE /api/finance/accounts/:id
GET    /api/finance/accounts/:id/ledger
GET    /api/finance/accounts/tree
```

### Journal Entries
```
GET    /api/finance/journal-entries
POST   /api/finance/journal-entries
GET    /api/finance/journal-entries/:id
PATCH  /api/finance/journal-entries/:id
POST   /api/finance/journal-entries/:id/post
POST   /api/finance/journal-entries/:id/reverse
GET    /api/finance/journal-entries/:id/export/pdf
```

### Payments
```
GET    /api/finance/payment-requests
POST   /api/finance/payment-requests
GET    /api/finance/payment-requests/:id
PATCH  /api/finance/payment-requests/:id
POST   /api/finance/payment-requests/:id/submit
POST   /api/finance/payment-requests/:id/approve
POST   /api/finance/payment-requests/:id/reject

GET    /api/finance/payment-vouchers
POST   /api/finance/payment-vouchers
GET    /api/finance/payment-vouchers/:id
PATCH  /api/finance/payment-vouchers/:id
POST   /api/finance/payment-vouchers/:id/submit
POST   /api/finance/payment-vouchers/:id/approve
POST   /api/finance/payment-vouchers/:id/mark-paid
GET    /api/finance/payment-vouchers/:id/export/pdf

GET    /api/finance/cheques
POST   /api/finance/cheques
GET    /api/finance/cheques/:id
POST   /api/finance/cheques/:id/issue
POST   /api/finance/cheques/:id/clear
POST   /api/finance/cheques/:id/bounce
POST   /api/finance/cheques/:id/cancel
GET    /api/finance/cheques/:id/print

GET    /api/finance/bank-transfers
POST   /api/finance/bank-transfers
GET    /api/finance/bank-transfers/:id
POST   /api/finance/bank-transfers/:id/complete
```

### Banking & Reconciliation
```
GET    /api/finance/bank-accounts
POST   /api/finance/bank-accounts
GET    /api/finance/bank-accounts/:id
PATCH  /api/finance/bank-accounts/:id
GET    /api/finance/bank-accounts/:id/transactions
GET    /api/finance/bank-accounts/:id/reconciliations

POST   /api/finance/reconciliations
GET    /api/finance/reconciliations/:id
POST   /api/finance/reconciliations/:id/complete
```

### Reports
```
GET    /api/finance/reports/trial-balance
GET    /api/finance/reports/income-statement
GET    /api/finance/reports/balance-sheet
GET    /api/finance/reports/cash-flow
GET    /api/finance/reports/general-ledger
GET    /api/finance/reports/cash-book
GET    /api/finance/reports/accounts-payable
GET    /api/finance/reports/grant-statement
GET    /api/finance/reports/budget-vs-actual
```

---

## Inventory Endpoints

```
GET    /api/inventory/items
POST   /api/inventory/items
GET    /api/inventory/items/:id
PATCH  /api/inventory/items/:id
DELETE /api/inventory/items/:id
GET    /api/inventory/items/:id/movements
GET    /api/inventory/items/:id/stock-card
POST   /api/inventory/items/:id/issue
POST   /api/inventory/items/:id/adjust
GET    /api/inventory/items/:id/barcode
GET    /api/inventory/items/low-stock

GET    /api/inventory/warehouses
POST   /api/inventory/warehouses
GET    /api/inventory/warehouses/:id
GET    /api/inventory/warehouses/:id/stock

GET    /api/inventory/movements
POST   /api/inventory/stock-adjustments
GET    /api/inventory/stock-adjustments/:id
POST   /api/inventory/stock-adjustments/:id/approve
```

---

## Fixed Assets Endpoints

```
GET    /api/assets
POST   /api/assets
GET    /api/assets/:id
PATCH  /api/assets/:id
DELETE /api/assets/:id
POST   /api/assets/:id/assign
GET    /api/assets/:id/assignments
POST   /api/assets/:id/return
GET    /api/assets/:id/depreciation
POST   /api/assets/:id/depreciate     Run depreciation for period
POST   /api/assets/:id/maintenance
GET    /api/assets/:id/maintenance
POST   /api/assets/:id/dispose
GET    /api/assets/:id/barcode
POST   /api/assets/verify-batch       Physical verification
GET    /api/assets/report/schedule    Depreciation schedule report

GET    /api/assets/categories
POST   /api/assets/categories
GET    /api/assets/categories/:id
PATCH  /api/assets/categories/:id
```

---

## Workflow Endpoints

```
GET    /api/workflow/templates
POST   /api/workflow/templates
GET    /api/workflow/templates/:id
PATCH  /api/workflow/templates/:id
DELETE /api/workflow/templates/:id

GET    /api/workflow/instances
GET    /api/workflow/instances/:id
GET    /api/workflow/pending                My pending approvals
POST   /api/workflow/instances/:id/approve
POST   /api/workflow/instances/:id/reject
POST   /api/workflow/instances/:id/return
POST   /api/workflow/instances/:id/delegate
GET    /api/workflow/instances/:id/history
```

---

## Serial Number Engine

```
POST   /api/serial/next          { grantCode, docType } → serialNumber
GET    /api/serial/sequences     List all sequences
```

---

## Notifications

```
GET    /api/notifications                  My notifications (paginated)
POST   /api/notifications/:id/read         Mark as read
POST   /api/notifications/read-all         Mark all as read
DELETE /api/notifications/:id              Delete notification
GET    /api/notifications/preferences      My notification preferences
PUT    /api/notifications/preferences      Update preferences
```

---

## Audit Log

```
GET    /api/audit                  List audit logs (admin only)
GET    /api/audit/:resourceType/:resourceId  Audit for a specific document
```

---

## Dashboard

```
GET    /api/dashboard/executive    Executive KPIs
GET    /api/dashboard/finance      Finance KPIs + charts
GET    /api/dashboard/procurement  Procurement KPIs + charts
GET    /api/dashboard/projects     Project KPIs + charts
GET    /api/dashboard/inventory    Inventory KPIs
GET    /api/dashboard/assets       Asset KPIs
GET    /api/dashboard/donor/:grantId  Donor portal dashboard
```

---

## Global Search

```
GET    /api/search?q=:query&types=grants,pr,po,...
```

Returns up to 5 results per entity type with highlighted matches.
