# 06 — RBAC Permissions

## G-GPFMS Role-Based Access Control Specification

---

## System Roles

| Role | Code | Description |
|---|---|---|
| Super Administrator | SUPER_ADMIN | Full access to all modules including system configuration |
| Country Director | COUNTRY_DIRECTOR | Executive approval authority; view all |
| Finance Manager | FINANCE_MANAGER | Full finance/accounting; approve payments |
| Finance Officer | FINANCE_OFFICER | Enter transactions, prepare vouchers |
| Procurement Manager | PROCUREMENT_MANAGER | Full procurement; approve POs |
| Procurement Officer | PROCUREMENT_OFFICER | Create/manage PRs, RFQs, POs |
| Project Manager | PROJECT_MANAGER | Manage projects, activities, create PRs |
| Program Officer | PROGRAM_OFFICER | View grants, manage activities |
| Warehouse Officer | WAREHOUSE_OFFICER | Manage inventory, GRNs |
| Asset Manager | ASSET_MANAGER | Manage fixed assets |
| Internal Auditor | INTERNAL_AUDITOR | Read-all + audit trail access |
| Donor | DONOR | Read-only donor portal access |

---

## Permission Structure

Permissions follow the pattern: `MODULE:ACTION[:RESOURCE]`

### Modules
```
GRANTS, PROJECTS, ACTIVITIES, PROCUREMENT, VENDORS, RFQ, PURCHASE_ORDERS,
GOODS_RECEIPTS, CONTRACTS, INVOICES, FINANCE, PAYMENTS, CHEQUES,
BANK_TRANSFERS, JOURNAL_ENTRIES, CHART_OF_ACCOUNTS, BANK_ACCOUNTS,
INVENTORY, ASSETS, WORKFLOW, REPORTS, AUDIT, USERS, ROLES, SETTINGS,
SERIAL, NOTIFICATIONS, DOCUMENTS, COMMENTS
```

### Actions
```
CREATE, READ, UPDATE, DELETE, SUBMIT, APPROVE, REJECT, RETURN,
EXPORT, IMPORT, PRINT, DELEGATE, CONFIGURE, RESTORE
```

---

## Full RBAC Matrix

### Grant Management

| Permission | SUPER_ADMIN | COUNTRY_DIRECTOR | FINANCE_MANAGER | PROCUREMENT_MANAGER | PROJECT_MANAGER | PROGRAM_OFFICER | INTERNAL_AUDITOR | DONOR |
|---|---|---|---|---|---|---|---|---|
| GRANTS:CREATE | ✓ | ✓ | ✓ | — | — | — | — | — |
| GRANTS:READ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* |
| GRANTS:UPDATE | ✓ | ✓ | ✓ | — | — | — | — | — |
| GRANTS:DELETE | ✓ | — | — | — | — | — | — | — |
| GRANTS:APPROVE | ✓ | ✓ | ✓ | — | — | — | — | — |
| GRANTS:EXPORT | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* |

*Donor can only read their own assigned grants.

### Procurement

| Permission | SUPER_ADMIN | COUNTRY_DIRECTOR | FINANCE_MANAGER | PROCUREMENT_MANAGER | PROCUREMENT_OFFICER | PROJECT_MANAGER | INTERNAL_AUDITOR | DONOR |
|---|---|---|---|---|---|---|---|---|
| PROCUREMENT:CREATE | ✓ | — | — | ✓ | ✓ | ✓ | — | — |
| PROCUREMENT:READ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* |
| PROCUREMENT:UPDATE | ✓ | — | — | ✓ | ✓ | ✓ | — | — |
| PROCUREMENT:DELETE | ✓ | — | — | ✓ | — | — | — | — |
| PROCUREMENT:APPROVE | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| PROCUREMENT:EXPORT | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* |
| VENDORS:CREATE | ✓ | — | — | ✓ | ✓ | — | — | — |
| VENDORS:BLACKLIST | ✓ | — | — | ✓ | — | — | — | — |
| PURCHASE_ORDERS:APPROVE | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| PURCHASE_ORDERS:ISSUE | ✓ | — | — | ✓ | ✓ | — | — | — |

### Finance

| Permission | SUPER_ADMIN | COUNTRY_DIRECTOR | FINANCE_MANAGER | FINANCE_OFFICER | PROCUREMENT_MANAGER | PROJECT_MANAGER | INTERNAL_AUDITOR | DONOR |
|---|---|---|---|---|---|---|---|---|
| FINANCE:CREATE | ✓ | — | ✓ | ✓ | — | — | — | — |
| FINANCE:READ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* |
| FINANCE:UPDATE | ✓ | — | ✓ | ✓ | — | — | — | — |
| FINANCE:DELETE | ✓ | — | ✓ | — | — | — | — | — |
| PAYMENTS:APPROVE | ✓ | ✓ | ✓ | — | — | — | — | — |
| PAYMENTS:EXECUTE | ✓ | — | ✓ | ✓ | — | — | — | — |
| JOURNAL_ENTRIES:POST | ✓ | — | ✓ | ✓ | — | — | — | — |
| JOURNAL_ENTRIES:REVERSE | ✓ | — | ✓ | — | — | — | — | — |
| CHART_OF_ACCOUNTS:CREATE | ✓ | — | ✓ | — | — | — | — | — |
| BANK_ACCOUNTS:CREATE | ✓ | — | ✓ | — | — | — | — | — |
| FINANCE:EXPORT | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓* |

### Inventory & Assets

| Permission | SUPER_ADMIN | PROCUREMENT_MANAGER | WAREHOUSE_OFFICER | ASSET_MANAGER | PROJECT_MANAGER | INTERNAL_AUDITOR |
|---|---|---|---|---|---|---|
| INVENTORY:CREATE | ✓ | ✓ | ✓ | — | — | — |
| INVENTORY:READ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| INVENTORY:UPDATE | ✓ | ✓ | ✓ | — | — | — |
| INVENTORY:APPROVE | ✓ | ✓ | — | — | — | — |
| ASSETS:CREATE | ✓ | — | — | ✓ | — | — |
| ASSETS:READ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ASSETS:UPDATE | ✓ | — | — | ✓ | — | — |
| ASSETS:DISPOSE | ✓ | — | — | ✓ | — | — |

### System Administration

| Permission | SUPER_ADMIN | COUNTRY_DIRECTOR | INTERNAL_AUDITOR |
|---|---|---|---|
| USERS:CREATE | ✓ | — | — |
| USERS:READ | ✓ | ✓ | ✓ |
| USERS:UPDATE | ✓ | — | — |
| USERS:DELETE | ✓ | — | — |
| ROLES:CONFIGURE | ✓ | — | — |
| SETTINGS:UPDATE | ✓ | — | — |
| WORKFLOW:CONFIGURE | ✓ | — | — |
| AUDIT:READ | ✓ | ✓ | ✓ |
| AUDIT:EXPORT | ✓ | — | ✓ |

---

## RBAC Implementation

### Permission Check (NestJS Guard)

```typescript
// Usage on controller method:
@UseGuards(JwtAuthGuard, RbacGuard)
@RequirePermissions('PROCUREMENT:CREATE')
@Post()
async createPR(@Body() dto: CreatePrDto) { ... }
```

### Guard Logic
```typescript
// RbacGuard checks:
// 1. Get user's roles from JWT payload
// 2. Load role_permissions from cache (Redis, TTL 5min)
// 3. Check if any role has the required permission
// 4. If resource-scoped: check grant/project assignment
// 5. Throw ForbiddenException if no match
```

### Caching Strategy
- Permission sets cached in Redis per role (5-minute TTL)
- Cache invalidated on role_permissions change
- JWT payload includes role IDs (not full permissions, to keep token small)

---

## Donor Portal Scoping

Donors have a special `DONOR` role that:
- Can ONLY read grants they are explicitly linked to (via `donorId` on grant)
- Cannot access any procurement, finance, or user management
- Can access: their grants, grant activities, grant procurement list (read-only), grant financial report
- Can download PDFs of reports linked to their grants
- Can leave comments on grant reports (optional)

---

## Grant-Level Scoping

Some users may be granted access to specific grants only:
- `user_grant_access` table (userId, grantId) — optional, if empty = all grants
- Finance Officer may be restricted to specific grants
- Project Manager only sees their assigned projects/grants

---

## Permission Seed Data

Initial permissions seeded at startup (see `/prisma/seed/lookup-data.ts`):
- One permission record per `MODULE:ACTION` combination
- System roles created with pre-assigned permissions
- Super Admin role linked to ALL permissions
- Donor role linked to READ-only grant and report permissions
