# 10 — Testing Strategy

## G-GPFMS Testing Strategy

---

## Testing Pyramid

```
                    ┌─────────────┐
                    │  E2E Tests  │  5%  (Cypress/Playwright)
                    └──────┬──────┘
               ┌───────────▼──────────┐
               │  Integration Tests   │  25%  (Supertest + Test DB)
               └────────────┬─────────┘
          ┌─────────────────▼──────────────────┐
          │         Unit Tests                 │  70%  (Jest)
          └────────────────────────────────────┘
```

---

## Unit Tests (Backend — NestJS Jest)

### Coverage Targets
- Service files: 80%+ line coverage
- Critical business logic: 100% (budget calculations, serial numbers, 3-way match)

### Key Test Suites

#### SerialService
```typescript
describe('SerialService', () => {
  it('generates first number as 0001', async () => {
    const result = await svc.next('USAID-2026', 'PR');
    expect(result).toBe('USAID-2026-PR-0001');
  });

  it('increments atomically under concurrency', async () => {
    const results = await Promise.all(
      Array(10).fill(null).map(() => svc.next('USAID-2026', 'PO'))
    );
    const unique = new Set(results);
    expect(unique.size).toBe(10); // No duplicates
  });
});
```

#### BudgetService
```typescript
describe('BudgetService', () => {
  it('throws when budget is insufficient', async () => {
    await expect(svc.checkAvailability('line-id', 99999)).rejects.toThrow(
      'Insufficient budget: available 500.00, requested 99999.00'
    );
  });

  it('commits budget after PR approval', async () => {
    await svc.commit('line-id', 500);
    const line = await prisma.grantBudgetLine.findUnique({ where: { id: 'line-id' } });
    expect(line.committedAmount).toBe(500);
  });
});
```

#### ThreeWayMatchService
```typescript
describe('ThreeWayMatchService', () => {
  it('passes when PO, GRN, and invoice amounts match', async () => {
    await expect(svc.validate('po-id', 'grn-id', 'inv-id')).resolves.toBe(true);
  });

  it('fails when invoice exceeds GRN', async () => {
    await expect(svc.validate('po-id', 'partial-grn-id', 'full-inv-id'))
      .rejects.toThrow('Invoice amount exceeds received quantity');
  });
});
```

#### WorkflowService
```typescript
describe('WorkflowService', () => {
  it('starts workflow and creates instance steps', async () => {
    const instance = await svc.startWorkflow('PURCHASE_REQUISITION', 'pr-id', 'user-id');
    expect(instance.status).toBe('IN_PROGRESS');
    expect(instance.steps).toHaveLength(4);
  });

  it('advances to next step on approve', async () => {
    await svc.advance('instance-id', 'APPROVE', 'approver-id', 'Looks good');
    const instance = await prisma.workflowInstance.findUnique({ where: { id: 'instance-id' } });
    expect(instance.currentStepNumber).toBe(2);
  });

  it('marks instance as APPROVED when final step approved', async () => {
    // ... test final approval
    expect(instance.status).toBe('APPROVED');
  });
});
```

---

## Integration Tests (Backend — Supertest + Test Database)

### Setup
```typescript
// test/setup.ts
beforeAll(async () => {
  app = await createTestApp();
  prisma = app.get(PrismaService);
  await prisma.$executeRaw`TRUNCATE TABLE ... CASCADE`;
  await seedTestData(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});
```

### Key Integration Test Files

```
backend/test/
├── auth.e2e-spec.ts           Login, refresh, logout, me
├── grants.e2e-spec.ts         CRUD + budget + workflow
├── procurement.e2e-spec.ts    PR → PO → GRN → Invoice flow
├── payments.e2e-spec.ts       Payment Request → Voucher → Cheque
├── workflow.e2e-spec.ts       Full approval chain
├── rbac.e2e-spec.ts           Permission enforcement
└── serial.e2e-spec.ts         Uniqueness under load
```

### Example: Procurement Flow Integration Test
```typescript
describe('Procurement E2E', () => {
  let prId: string;
  let poId: string;
  let grnId: string;

  it('creates PR and submits for approval', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/procurement/requisitions')
      .set('Authorization', `Bearer ${procurementOfficerToken}`)
      .send({ title: 'Test PR', grantId, budgetLineId, totalEstimatedAmount: '1000' });
    expect(res.status).toBe(201);
    prId = res.body.data.id;
    await request(app.getHttpServer())
      .post(`/api/procurement/requisitions/${prId}/submit`)
      .set('Authorization', `Bearer ${procurementOfficerToken}`);
  });

  it('approves PR through all workflow steps', async () => {
    for (const token of [deptHeadToken, procMgrToken, financeToken, directorToken]) {
      await request(app.getHttpServer())
        .post(`/api/workflow/instances/${workflowInstanceId}/approve`)
        .set('Authorization', `Bearer ${token}`)
        .send({ comment: 'Approved' });
    }
    const pr = await request(app.getHttpServer())
      .get(`/api/procurement/requisitions/${prId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(pr.body.data.status).toBe('APPROVED');
  });

  // ... continues through PO creation, GRN, 3-way match, payment
});
```

---

## Frontend Tests (React Testing Library)

### Component Test Example
```typescript
// src/components/procurement/__tests__/PRForm.test.tsx
describe('Purchase Requisition Form', () => {
  it('shows validation errors for empty required fields', async () => {
    render(<PRForm />);
    fireEvent.click(screen.getByText('Save Draft'));
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Select a grant')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    server.use(http.post('/api/procurement/requisitions', () => HttpResponse.json({ data: mockPR })));
    render(<PRForm />);
    await userEvent.type(screen.getByLabelText('Title'), 'Office Supplies');
    await userEvent.selectOptions(screen.getByLabelText('Grant'), ['grant-123']);
    await userEvent.click(screen.getByText('Save Draft'));
    await waitFor(() => expect(screen.getByText('PR created successfully')).toBeInTheDocument());
  });
});
```

---

## Test Data Factories

```typescript
// test/factories.ts
export const createTestGrant = (overrides = {}) => ({
  code: 'TEST-2026',
  name: 'Test Grant',
  donorId: 'donor-1',
  totalBudget: 100000,
  currency: 'USD',
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-12-31'),
  status: 'ACTIVE',
  ...overrides,
});

export const createTestUser = (role: string, overrides = {}) => ({
  email: `${role}@test.com`,
  passwordHash: argon2Hash('TestPass123!'),
  firstName: 'Test',
  lastName: role,
  isActive: true,
  ...overrides,
});
```

---

## Running Tests

```bash
# Backend unit tests
cd backend && npm run test

# Backend unit tests with coverage
cd backend && npm run test:cov

# Backend integration tests (requires test DB)
cd backend && npm run test:e2e

# Frontend tests
npm run test

# All tests
npm run test:all
```

---

## CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/test.yml
on: [push, pull_request]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_DB: gpfms_test, POSTGRES_PASSWORD: test }
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd backend && npm ci
      - run: cd backend && npx prisma migrate deploy
        env: { DATABASE_URL: postgresql://postgres:test@localhost/gpfms_test }
      - run: cd backend && npm run test:cov
      - run: cd backend && npm run test:e2e

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

---

## Manual QA Checklist (Before Release)

### Authentication
- [ ] Login with valid credentials → JWT issued
- [ ] Login with invalid credentials → 401 error
- [ ] Token expiry → refresh token used automatically
- [ ] Logout → refresh token invalidated
- [ ] Access protected route without token → redirect to login

### Procurement Flow
- [ ] Create PR → correct serial number generated
- [ ] Budget check blocks PR if insufficient
- [ ] PR approval workflow: all 4 steps work
- [ ] Digital signature captured on each approval
- [ ] PO created from approved PR
- [ ] GRN created, updates inventory
- [ ] 3-way match blocks payment if mismatch
- [ ] Payment Voucher → Cheque flow completes
- [ ] Journal entries auto-posted

### Finance
- [ ] Chart of accounts hierarchical view
- [ ] Journal entry debits = credits validation
- [ ] Trial balance sums to zero
- [ ] Bank reconciliation marks matched items
- [ ] Grant financial report generates correctly

### Access Control
- [ ] Donor cannot access finance module
- [ ] Finance Officer cannot approve payments (only submit)
- [ ] Procurement Officer cannot access COA
- [ ] Audit trail visible for each document
