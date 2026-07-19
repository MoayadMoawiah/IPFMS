# IPFMS  Integrated Procurement & Finance Management System

Premium UI/UX prototype for **Gaderon Organization for Development** (EF8E) B'/1HF DD*FEJ)).

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui + Radix UI
- Recharts, Framer Motion, TanStack Table, React Hook Form, Zod

## Getting Started

### Prerequisites

Install [Node.js LTS](https://nodejs.org/) (v18+ recommended).

### Installation

```bash
cd c:\xampp\htdocs\IPFMS
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login

Use any email/password on the login screen. Pre-filled credentials:

- **Email:** moayad@gaderon.org
- **Password:** demo123

## Features

- Executive dashboard with KPIs, charts, and activity timeline
- Grant management with budget utilization
- Projects & activities (Kanban + table views)
- Procurement module (PR wizard, RFQ comparison, PO print layout, goods receipt, inventory)
- Finance module (payment vouchers, cheques, bank transfers, GL)
- Reports with export simulation
- Settings & user management
- Audit log
- Dark mode
- Responsive layout (desktop-first)

## Project Structure

```
src/
  app/           # Next.js routes
  components/    # UI, layout, module components
  lib/           # Utils, mock data, formatters
  hooks/         # Shared hooks
  types/         # TypeScript interfaces
public/brand/    # Gaderon logo & illustrations
```

## Notes

This is a **presentation prototype** with static mock data. No backend or database is connected.

Arabic/RTL support is planned for a future phase.

## Running Services

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Running |
| Backend API | http://localhost:3001/api | Running |
| Swagger Docs | http://localhost:3001/api/docs | Running |

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@gaderon.org | Admin@Gaderon2026! |
| Finance Manager | finance@gaderon.org | Demo@Gaderon2026! |
| Procurement Manager | procurement@gaderon.org | Demo@Gaderon2026! |
| Project Manager | projects@gaderon.org | Demo@Gaderon2026! |
| Internal Auditor | auditor@gaderon.org | Demo@Gaderon2026! |
| Department Head | depthead@gaderon.org | Demo@Gaderon2026! |
| Procurement Officer | proc.officer@gaderon.org | Demo@Gaderon2026! |
| Finance Officer | finance.officer@gaderon.org | `Demo@Gaderon2026!` |
| Country Director | director@gaderon.org | Demo@Gaderon2026! |

## User Roles

IPFMS uses **Role-Based Access Control (RBAC)**. Each user can have one or more roles. Permissions follow the pattern `MODULE:ACTION` (e.g. `PROCUREMENT:CREATE`, `FINANCE:APPROVE`).

### Built-in Roles

| Role | Main purpose | Access level |
|------|--------------|--------------|
| **Super Admin** | System administrator | Full access to everything |
| **Country Director** | Executive / final approver | Read + approve across all modules |
| **Finance Manager** | Finance & accounting lead | Full finance control + approvals |
| **Finance Officer** | Finance operations | Create/edit financial records (no final approval) |
| **Procurement Manager** | Procurement lead | Full procurement cycle + approvals |
| **Procurement Officer** | Procurement operations | Create/manage PRs, RFQs, POs |
| **Project Manager** | Grant/project delivery | Manage projects, activities, budgets |
| **Department Head** | Department-level approver | Approve department documents |
| **Internal Auditor** | Compliance & audit | Read-only everywhere + audit trail |
| **Donor** | External donor portal | Read-only for their own grants |
| **Staff** | General employee | Raise purchase requisitions only |
| **Warehouse Manager** | Inventory & stock | Manage inventory and goods receipts |
| **Asset Manager** | Fixed assets | Manage assets, depreciation, disposals |

### Role Details

#### Super Admin
- Full system access — all modules, all actions
- Can manage users, roles, settings, and workflow configuration
- Bypasses all permission checks (`*:*` wildcard)

#### Country Director
- Final approval authority for all documents
- Can read and approve grants, procurement, finance, payments, contracts, and workflows
- Cannot create/edit most records or manage system settings

#### Finance Manager
- Manages finance, accounting, payments, and bank reconciliation
- Can create/post journal entries, manage chart of accounts, approve & execute payments
- Cannot manage procurement or system administration

#### Finance Officer
- Creates and processes financial documents
- Can create/update finance records, payments, and journal entries (draft level)
- Cannot final-approve payments, post journals, or manage chart of accounts

#### Procurement Manager
- Manages the full procurement cycle
- Can manage vendors (including blacklist), approve PRs/POs/contracts/GRNs, evaluate RFQs
- Cannot approve finance or manage system administration

#### Procurement Officer
- Creates and processes procurement documents
- Can create/submit PRs, create POs & RFQs, receive goods
- Cannot approve documents or blacklist vendors

#### Project Manager
- Manages assigned projects, activities, and budgets
- Can create/update projects & activities, create/submit PRs
- Cannot manage full procurement or finance

#### Department Head
- Approves department-level documents
- Can read grants/projects/finance and approve purchase requisitions and workflows
- Cannot create records or manage modules

#### Internal Auditor
- Read-only access to all modules plus full audit trail
- Can read and export everything; cannot create, update, delete, or approve

#### Donor
- Read-only access to the donor portal for their own grants
- Can view grants, projects, and reports linked to their donor account
- Cannot access procurement, finance, or user management

#### Staff
- Can raise purchase requisitions and view own documents
- Most limited internal role — PR create/submit/read and inventory read only

#### Warehouse Manager
- Manages inventory and stock movements
- Can create/update/adjust inventory and create goods receipts

#### Asset Manager
- Manages fixed assets, depreciation, and disposals
- Full fixed asset lifecycle; read-only on inventory and reports

### Quick Comparison

| Function | Who can do it |
|----------|---------------|
| System setup (users, roles, settings) | Super Admin only |
| Final approvals (all modules) | Country Director, Super Admin |
| Approve payments | Country Director, Finance Manager |
| Create purchase requisitions | Staff, Project Manager, Procurement Officer |
| Approve purchase orders | Country Director, Finance Manager, Procurement Manager |
| Post journal entries | Finance Manager |
| View audit trail | Internal Auditor, Finance Manager, Country Director |
| Donor portal | Donor only |

### How RBAC Works

- Users can have **multiple roles**; permissions from all roles are combined
- API endpoints enforce permissions via `@RequirePermissions('MODULE:ACTION')`
- The UI hides actions using `PermissionGate` based on the same permissions
- Role and permission definitions are seeded in `prisma/seed/users.ts`
- Full RBAC specification: `docs/06_RBAC_Permissions.md`

## What's in the Database

- 13 roles + 111 permissions + full RBAC
- 4 donors (USAID, UNICEF, EU, OCHA)
- 3 sample grants with budget lines
- 1 project with milestones
- 2 sample vendors
- Full chart of accounts (35 accounts)
- Fiscal year 2026 with 12 accounting periods
- All currencies, procurement methods, workflow templates

Go to http://localhost:3000 and log in with `admin@gaderon.org` / `Admin@Gaderon2026!`

