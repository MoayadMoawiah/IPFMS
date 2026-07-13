# 08 — Coding Standards

## G-GPFMS Development Standards & Conventions

---

## Principles

1. **SOLID** — Every class/module has one reason to change
2. **Clean Architecture** — UI → Application → Domain → Infrastructure (no circular deps)
3. **Repository Pattern** — Data access only through service layer
4. **DRY** — Shared logic in common utilities; never copy-paste business logic
5. **Type Safety** — No `any` types except in Prisma raw query results (typed immediately)
6. **Fail Fast** — Validate input at the boundary (DTO level); never trust data deeper in the stack

---

## Backend (NestJS) Standards

### Module Structure
```
backend/src/{module}/
├── {module}.module.ts         # NestJS module declaration
├── {module}.controller.ts     # HTTP handlers; no business logic
├── {module}.service.ts        # Business logic; calls repository
├── {module}.repository.ts     # Prisma queries only
├── dto/
│   ├── create-{module}.dto.ts
│   ├── update-{module}.dto.ts
│   └── query-{module}.dto.ts
├── entities/
│   └── {module}.entity.ts    # Response type (Prisma type extension)
└── {module}.service.spec.ts  # Unit tests
```

### Controller Pattern
```typescript
@ApiTags('Purchase Requisitions')
@ApiBearerAuth()
@Controller('procurement/requisitions')
@UseGuards(JwtAuthGuard, RbacGuard)
export class RequisitionsController {
  constructor(private readonly svc: RequisitionsService) {}

  @Get()
  @RequirePermissions('PROCUREMENT:READ')
  @ApiOperation({ summary: 'List purchase requisitions' })
  findAll(@Query() query: QueryPrDto, @CurrentUser() user: UserPayload) {
    return this.svc.findAll(query, user);
  }

  @Post()
  @RequirePermissions('PROCUREMENT:CREATE')
  @ApiOperation({ summary: 'Create purchase requisition' })
  create(@Body() dto: CreatePrDto, @CurrentUser() user: UserPayload) {
    return this.svc.create(dto, user);
  }
}
```

### Service Pattern
```typescript
@Injectable()
export class RequisitionsService {
  constructor(
    private readonly repo: RequisitionsRepository,
    private readonly budgetSvc: BudgetService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
  ) {}

  async create(dto: CreatePrDto, user: UserPayload) {
    // 1. Check budget availability
    await this.budgetSvc.checkAvailability(dto.budgetLineId, dto.totalEstimatedAmount);
    // 2. Generate serial number
    const serialNumber = await this.serialSvc.next(dto.grantCode, 'PR');
    // 3. Persist
    const pr = await this.repo.create({ ...dto, serialNumber, createdById: user.id });
    // 4. Start workflow
    await this.workflowSvc.startWorkflow('PURCHASE_REQUISITION', pr.id, user.id);
    return pr;
  }
}
```

### Repository Pattern
```typescript
@Injectable()
export class RequisitionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPrDto, userId: string) {
    const { page = 1, limit = 20, search, status, grantId } = query;
    return this.prisma.purchaseRequisition.findMany({
      where: {
        deletedAt: null,
        ...(status && { status }),
        ...(grantId && { grantId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { serialNumber: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { grant: true, requestedBy: true, budgetLine: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

### DTO Validation
```typescript
export class CreatePrDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Office Supplies Q1' })
  title: string;

  @IsUUID()
  @ApiProperty()
  grantId: string;

  @IsDecimal({ decimal_digits: '0,4' })
  @IsPositive()
  @ApiProperty({ type: String, example: '1500.0000' })
  totalEstimatedAmount: string;  // String for Decimal precision
}
```

### Error Handling
```typescript
// Domain errors use typed exceptions:
throw new NotFoundException(`PR ${id} not found`);
throw new ForbiddenException('Insufficient budget');
throw new ConflictException('Document already submitted');
throw new BadRequestException('Three-way match failed: invoice amount exceeds GRN');

// Global exception filter catches all errors and formats:
// { statusCode, message, errors[], timestamp, path }
```

---

## Database Standards

### Naming Conventions
- Tables: `snake_case`, plural (e.g., `purchase_requisitions`)
- Columns: `camelCase` in Prisma model, `snake_case` in DB (mapped via `@map`)
- Relations: named explicitly: `@relation("UserGrants")`
- Indexes: `@@index([fieldA, fieldB])` on all FKs and common query combos

### Monetary Fields
```prisma
// ALWAYS use Decimal, NEVER Float
totalAmount  Decimal  @db.Decimal(20, 4)
exchangeRate Decimal  @db.Decimal(20, 8)
```

### Soft Delete Pattern
```prisma
model PurchaseRequisition {
  // ...
  deletedAt  DateTime?
  // Always filter: where: { deletedAt: null }
}
```

### Audit Pattern
Every service method that mutates data must call `AuditService.log()`:
```typescript
await this.auditSvc.log({
  userId: user.id,
  action: 'CREATE',
  module: 'PROCUREMENT',
  resource: 'PurchaseRequisition',
  resourceId: pr.id,
  newValues: pr,
  ipAddress: user.ipAddress,
  userAgent: user.userAgent,
});
```
*The global `AuditInterceptor` handles this automatically for all CRUD endpoints.*

---

## Frontend (Next.js) Standards

### File Naming
- Pages: `page.tsx` (Next.js App Router convention)
- Components: `PascalCase.tsx` (e.g., `PaymentVoucherForm.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-payment-vouchers.ts`)
- Types: exported from `src/types/index.ts` or module-specific `types.ts`
- API hooks: `src/lib/api/hooks/use-{module}.ts`

### TanStack Query Pattern
```typescript
// src/lib/api/hooks/use-purchase-requisitions.ts
export function usePurchaseRequisitions(query: QueryPrParams) {
  return useQuery({
    queryKey: ['purchase-requisitions', query],
    queryFn: () => apiClient.get('/procurement/requisitions', { params: query }),
    staleTime: 30_000,
  });
}

export function useCreatePR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePrDto) => apiClient.post('/procurement/requisitions', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-requisitions'] });
      toast.success('Purchase Requisition created successfully');
    },
    onError: (err: ApiError) => toast.error(err.message),
  });
}
```

### Form Pattern (React Hook Form + Zod)
```typescript
const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  grantId: z.string().uuid('Select a valid grant'),
  totalEstimatedAmount: z.string().refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    'Amount must be a positive number'
  ),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { title: '', grantId: '', totalEstimatedAmount: '' },
});
```

### Component Rules
- No business logic in components — only UI and event handlers
- Data fetching via TanStack Query hooks only
- Forms use React Hook Form + Zod only
- All monetary display formatted via `src/lib/formatters.ts`
- No `console.log` in production code
- No inline styles (use TailwindCSS classes only)

---

## Git Conventions

### Branch Naming
```
feature/phase1-prisma-schema
feature/phase2-grants-api
fix/pr-budget-calculation
chore/update-dependencies
```

### Commit Messages (Conventional Commits)
```
feat(grants): add budget line management API
feat(procurement): implement 3-way matching service
fix(workflow): correct escalation timer logic
refactor(auth): extract token refresh to interceptor
chore(deps): upgrade Prisma to 5.x
docs(api): update Swagger descriptions
test(finance): add payment voucher service tests
```

### PR Rules
- Every PR must reference a phase/todo
- All linter errors resolved before merge
- Migration files included if schema changes
- Seed data updated if new lookup data added

---

## Testing Standards

### Unit Tests (NestJS services)
```
backend/src/{module}/{module}.service.spec.ts
```
- Mock Prisma using `@prisma/client/testing` or jest mocks
- Mock external services (WorkflowService, SerialService)
- Test happy path + error cases + edge cases (zero budget, duplicate serial, etc.)

### Integration Tests
```
backend/test/{module}.e2e-spec.ts
```
- Use real test PostgreSQL database
- Seed test data in `beforeEach`
- Clean up in `afterEach`
- Test full request lifecycle through HTTP

### Frontend Tests
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
- Test: form validation, loading states, error states, successful submission

---

## Security Standards

1. Never log passwords, tokens, or sensitive PII
2. All secrets in environment variables (never in code or git)
3. Input validation on EVERY endpoint with class-validator
4. Parameterized queries only (Prisma handles this)
5. Rate limiting on auth endpoints
6. CORS restricted to frontend origin only
7. File uploads: validate MIME type and size server-side; store in MinIO (not public)
8. Soft delete on all records — no `DELETE` SQL ever executed on business data
