# 01 — System Architecture

## G-GPFMS: Gaderon Grants, Procurement & Financial Management ERP

### Overview

G-GPFMS is a single-tenant enterprise ERP purpose-built for Gaderon Organization for Development. It manages the complete lifecycle from grant receipt through procurement, payment, accounting, and donor reporting. The system is comparable in scope and capability to Microsoft Dynamics 365 Non-Profit, Oracle Fusion, and SAP Business One.

---

## Architecture Style

**Layered Monorepo** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT TIER                             │
│  Next.js 15 (App Router) + React 19 + TanStack Query        │
│  Gaderon Design System · shadcn/ui · Recharts               │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS REST + JWT Bearer
┌────────────────────────────▼────────────────────────────────┐
│                    APPLICATION TIER                          │
│  NestJS 10 · Swagger/OpenAPI · JWT Guards · RBAC Guards      │
│  Workflow Engine · Serial Engine · Audit Interceptor         │
│  PDF Service · Notification Service · Search Service         │
└──────┬─────────────────────┬──────────────────────┬─────────┘
       │ Prisma ORM           │ BullMQ               │ MinIO SDK
┌──────▼──────┐   ┌──────────▼──────────┐   ┌──────▼──────┐
│ PostgreSQL  │   │    Redis            │   │   MinIO     │
│ 16          │   │ Sessions/Job Queue  │   │ File Store  │
└─────────────┘   └─────────────────────┘   └─────────────┘
                             │ SMTP
                    ┌────────▼────────┐
                    │  Email Server   │
                    └─────────────────┘
```

---

## Repository Layout

```
IPFMS/                              ← Git root
├── src/                            ← Next.js 15 frontend
│   ├── app/                        ← App Router (30+ pages)
│   ├── components/                 ← Gaderon UI components
│   ├── hooks/                      ← React hooks
│   ├── lib/
│   │   ├── api/                    ← Axios client + TanStack Query hooks
│   │   ├── auth.ts                 ← Zustand auth store (replaces localStorage)
│   │   ├── utils.ts
│   │   └── formatters.ts
│   └── types/
│       └── index.ts                ← Domain TypeScript types
│
├── backend/                        ← NestJS 10 application
│   ├── src/
│   │   ├── auth/                   ← JWT, refresh tokens, Argon2
│   │   ├── users/                  ← User management
│   │   ├── rbac/                   ← Dynamic RBAC
│   │   ├── grants/                 ← Grant management
│   │   ├── projects/               ← Projects + Activities
│   │   ├── procurement/            ← Full procurement pipeline
│   │   │   ├── annual-plan/
│   │   │   ├── requisitions/
│   │   │   ├── vendors/
│   │   │   ├── rfq/
│   │   │   ├── purchase-orders/
│   │   │   ├── goods-receipt/
│   │   │   └── contracts/
│   │   ├── finance/                ← Full accounting module
│   │   │   ├── chart-of-accounts/
│   │   │   ├── journal-entries/
│   │   │   └── payments/
│   │   ├── inventory/
│   │   ├── assets/
│   │   ├── workflow/               ← Configurable workflow engine
│   │   ├── serial/                 ← Serial number engine
│   │   ├── pdf/                    ← PDF generation
│   │   ├── notifications/          ← Email + in-app
│   │   ├── audit/                  ← Audit log
│   │   ├── reports/
│   │   ├── prisma/                 ← Prisma service
│   │   └── common/                 ← Guards, filters, decorators, pipes
│   ├── package.json
│   └── tsconfig.json
│
├── prisma/                         ← Shared Prisma schema
│   ├── schema.prisma               ← 85-table schema
│   ├── migrations/
│   └── seed/
│       ├── index.ts
│       ├── users.ts
│       ├── grants.ts
│       └── lookup-data.ts
│
├── docs/                           ← This folder (10 spec docs)
├── .env                            ← Runtime secrets (gitignored)
├── .env.example                    ← Template (committed)
└── package.json                    ← Root workspace scripts
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend Framework | Next.js | 15.x | App Router, SSR, SSG |
| Frontend Language | TypeScript | 5.x | Type safety |
| UI Component Library | shadcn/ui + Radix UI | latest | Accessible components |
| Styling | TailwindCSS | 3.x | Utility-first CSS |
| Data Fetching | TanStack Query | 5.x | Server state, caching |
| Forms | React Hook Form + Zod | latest | Validation |
| Charts | Recharts | latest | Dashboards |
| Animation | Framer Motion | latest | UI transitions |
| Backend Framework | NestJS | 10.x | Modular enterprise backend |
| Backend Language | TypeScript | 5.x | Full type safety |
| ORM | Prisma | 5.x | Type-safe DB access |
| Database | PostgreSQL | 16.x | Primary data store |
| Auth | JWT + Argon2 | — | Secure authentication |
| Job Queue | BullMQ | latest | Async tasks, notifications |
| Cache/Sessions | Redis | 7.x | Session store, queue broker |
| File Storage | MinIO | latest | Documents, PDFs, attachments |
| API Documentation | Swagger/OpenAPI | 3.x | Auto-generated API docs |
| PDF Generation | @react-pdf/renderer | latest | Branded document PDFs |

---

## Architectural Principles

1. **Clean Architecture** — Domain logic separated from infrastructure
2. **Repository Pattern** — Data access abstracted behind service layer
3. **SOLID** — Single responsibility, open/closed, dependency injection throughout NestJS
4. **CQRS** — Applied in high-read modules (reports, dashboards) via separate query services
5. **Domain-Driven Design** — Modules align with business domains (Grants, Procurement, Finance)
6. **Event-Driven** — Workflow transitions emit domain events; notification service subscribes
7. **API-First** — All business logic exposed via documented REST endpoints
8. **Security by Default** — JWT required on all routes; RBAC checked per endpoint; audit on all mutations

---

## Security Architecture

```
Request → TLS/HTTPS
       → JWT Guard (validates Bearer token)
       → RBAC Guard (checks module:action permission)
       → Request Validation (class-validator pipes)
       → Business Logic
       → Audit Interceptor (logs mutation after response)
       → Response
```

- Tokens: JWT (15 min access) + Refresh Token (7 days, stored hashed in DB)
- Passwords: Argon2id with random salt
- HTTP-only cookies available as alternative to Authorization header
- All PII fields encrypted at rest where required by donor compliance
- Rate limiting: 100 req/min per IP on auth endpoints

---

## Data Flow: Procurement Example

```
User submits PR (POST /api/procurement/requisitions)
  → JWT validated
  → RBAC: procurement:requisition:create checked
  → Zod DTO validation
  → Budget availability checked (BudgetService)
  → Serial number generated (SerialService: GRANT-YYYY-PR-NNNN)
  → PR created in DB (status: DRAFT)
  → Workflow instance created (WorkflowService)
  → Audit log written (AuditInterceptor)
  → Notification sent to requester (NotificationService via BullMQ)
  → PR returned to client

User submits PR for approval (POST /api/procurement/requisitions/:id/submit)
  → Workflow advances to Step 1 (Department Head)
  → Email notification to approver
  → Escalation timer started (BullMQ delayed job)

Approver approves (POST /api/procurement/requisitions/:id/approve)
  → DigitalSignature created (IP, browser, device, timestamp)
  → Workflow advances
  → Budget committed (BudgetService.commit())
  → Auto-advance or next approver notified
```

---

## Scalability Notes

- Frontend and backend can be deployed independently (separate containers)
- PostgreSQL read replicas can be added for reporting queries
- BullMQ workers can be scaled horizontally
- MinIO supports cluster mode for file storage scaling
- Redis Sentinel for high availability
- CDN in front of Next.js for static asset caching
