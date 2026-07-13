-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'RETURNED', 'APPROVED', 'REJECTED', 'CANCELLED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkflowAction" AS ENUM ('SUBMIT', 'APPROVE', 'REJECT', 'RETURN', 'DELEGATE', 'ESCALATE', 'COMMENT');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'RETURNED', 'SKIPPED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'SUBMIT', 'APPROVE', 'REJECT', 'RETURN', 'EXPORT', 'IMPORT', 'PRINT', 'DELEGATE', 'CONFIGURE', 'RESTORE');

-- CreateEnum
CREATE TYPE "PermissionModule" AS ENUM ('GRANTS', 'PROJECTS', 'ACTIVITIES', 'PROCUREMENT', 'VENDORS', 'RFQ', 'PURCHASE_ORDERS', 'GOODS_RECEIPTS', 'CONTRACTS', 'INVOICES', 'FINANCE', 'PAYMENTS', 'CHEQUES', 'BANK_TRANSFERS', 'JOURNAL_ENTRIES', 'CHART_OF_ACCOUNTS', 'BANK_ACCOUNTS', 'INVENTORY', 'ASSETS', 'WORKFLOW', 'REPORTS', 'AUDIT', 'USERS', 'ROLES', 'SETTINGS', 'SERIAL', 'NOTIFICATIONS', 'DOCUMENTS', 'COMMENTS');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "NormalBalance" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "JournalSource" AS ENUM ('MANUAL', 'PURCHASE_ORDER', 'GOODS_RECEIPT', 'PAYMENT', 'DEPRECIATION', 'OPENING_BALANCE', 'CLOSING', 'BANK_RECONCILIATION');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CHEQUE', 'BANK_TRANSFER', 'CASH', 'PETTY_CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "ChequeStatus" AS ENUM ('DRAFT', 'ISSUED', 'PRESENTED', 'CLEARED', 'BOUNCED', 'CANCELLED', 'VOIDED');

-- CreateEnum
CREATE TYPE "BankTransferStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "DonorType" AS ENUM ('BILATERAL', 'MULTILATERAL', 'PRIVATE', 'FOUNDATION', 'GOVERNMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExchangeRateSource" AS ENUM ('MANUAL', 'CENTRAL_BANK', 'API');

-- CreateEnum
CREATE TYPE "FiscalYearStatus" AS ENUM ('OPEN', 'CLOSED', 'LOCKED');

-- CreateEnum
CREATE TYPE "PeriodStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Quarter" AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');

-- CreateEnum
CREATE TYPE "BudgetCategory" AS ENUM ('STAFF', 'TRAVEL', 'SUPPLIES', 'EQUIPMENT', 'SERVICES', 'OVERHEAD', 'INDIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "AmendmentType" AS ENUM ('BUDGET_REVISION', 'DATE_EXTENSION', 'SCOPE_CHANGE', 'DONOR_CHANGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProcurementDocType" AS ENUM ('PR', 'PO', 'GRN', 'PV', 'CHQ', 'BT', 'JE', 'SCC', 'RFQ', 'APP', 'CNT', 'INV', 'PAF');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('SUPPLIER', 'SERVICE_PROVIDER', 'CONSULTANT', 'CONTRACTOR', 'NGO', 'OTHER');

-- CreateEnum
CREATE TYPE "VendorDocumentType" AS ENUM ('TAX_CERTIFICATE', 'NATIONAL_ID', 'AUTHORIZATION_LETTER', 'CODE_OF_CONDUCT', 'TSA_CLEARANCE', 'BANK_LETTER', 'REGISTRATION_CERTIFICATE', 'TRADE_LICENSE', 'OTHER');

-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('DRAFT', 'ISSUED', 'EVALUATING', 'AWARDED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('LTA', 'FRAMEWORK_AGREEMENT', 'SERVICE_CONTRACT', 'CONSULTANCY', 'SUPPLY', 'WORKS', 'OTHER');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'TERMINATED', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('RECEIVED', 'MATCHED', 'APPROVED', 'PAID', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('RECEIPT', 'ISSUE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT_INCREASE', 'ADJUSTMENT_DECREASE', 'RETURN', 'DISPOSAL');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'DISPOSED', 'TRANSFERRED', 'LOST', 'WRITTEN_OFF', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "DepreciationMethod" AS ENUM ('STRAIGHT_LINE', 'REDUCING_BALANCE', 'UNITS_OF_PRODUCTION');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'MISSING');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'UPGRADE', 'INSPECTION');

-- CreateEnum
CREATE TYPE "DisposalMethod" AS ENUM ('SALE', 'DONATION', 'SCRAP', 'WRITE_OFF', 'TRANSFER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'APPROVAL_REQUEST', 'ESCALATION', 'BUDGET_ALERT', 'EXPIRY_ALERT');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'BOTH');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'SUBMIT', 'APPROVE', 'REJECT', 'RETURN', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'PRINT', 'ESCALATE', 'DELEGATE');

-- CreateEnum
CREATE TYPE "PayeeType" AS ENUM ('VENDOR', 'EMPLOYEE', 'PETTY_CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "BarcodeType" AS ENUM ('QR', 'BARCODE_128', 'BARCODE_39', 'NONE');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "logo" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Sudan',
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "taxNumber" TEXT,
    "registrationNumber" TEXT,
    "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
    "secondaryCurrency" TEXT NOT NULL DEFAULT 'SDG',
    "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "headUserId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "arabicName" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "organizationId" TEXT,
    "departmentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "refreshTokenHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "module" "PermissionModule" NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "resource" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "grantedBy" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serial_sequences" (
    "id" TEXT NOT NULL,
    "grantCode" TEXT NOT NULL,
    "docType" "ProcurementDocType" NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "prefix" TEXT,
    "format" TEXT NOT NULL DEFAULT '{grantCode}-{docType}-{number:4}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "serial_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT,
    "donorType" "DonorType" NOT NULL DEFAULT 'OTHER',
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "isBase" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" TEXT NOT NULL,
    "fromCurrencyId" TEXT NOT NULL,
    "toCurrencyId" TEXT NOT NULL,
    "rate" DECIMAL(20,8) NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "source" "ExchangeRateSource" NOT NULL DEFAULT 'MANUAL',
    "grantId" TEXT,
    "createdById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_years" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "FiscalYearStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_periods" (
    "id" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "periodNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "PeriodStatus" NOT NULL DEFAULT 'OPEN',
    "closedById" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grants" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "fiscalYearId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalBudget" DECIMAL(20,4) NOT NULL,
    "committedAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "spentAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "signedDate" TIMESTAMP(3),
    "status" "GrantStatus" NOT NULL DEFAULT 'DRAFT',
    "objectives" TEXT,
    "conditions" TEXT,
    "reportingRequirements" TEXT,
    "grantManagerId" TEXT,
    "projectCoordinatorId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_budget_lines" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "activityId" TEXT,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "BudgetCategory" NOT NULL DEFAULT 'OTHER',
    "totalBudget" DECIMAL(20,4) NOT NULL,
    "committedAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "spentAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "grant_budget_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_amendments" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "amendmentNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amendmentType" "AmendmentType" NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "previousValue" JSONB,
    "newValue" JSONB,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grant_amendments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_extensions" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "extensionNumber" INTEGER NOT NULL,
    "previousEndDate" TIMESTAMP(3) NOT NULL,
    "newEndDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grant_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budget" DECIMAL(20,4) NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "projectManagerId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quarter" "Quarter" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "deliverables" JSONB,
    "budget" DECIMAL(20,4) NOT NULL,
    "paymentPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "plannedBudget" DECIMAL(20,4) NOT NULL,
    "actualSpent" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "progressPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" "ActivityStatus" NOT NULL DEFAULT 'PLANNING',
    "responsibleUserId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_budget_lines" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "budgetLineId" TEXT NOT NULL,
    "allocatedAmount" DECIMAL(20,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_budget_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_staff" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "minThreshold" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "maxThreshold" DECIMAL(20,4),
    "minVendors" INTEGER NOT NULL DEFAULT 1,
    "requiresCommittee" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annual_procurement_plans" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalBudget" DECIMAL(20,4) NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "annual_procurement_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_items" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "activityId" TEXT,
    "budgetLineId" TEXT,
    "description" TEXT NOT NULL,
    "procurementMethodId" TEXT,
    "estimatedAmount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "plannedQuarter" "Quarter" NOT NULL,
    "unit" TEXT,
    "quantity" DECIMAL(10,3),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_requisitions" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "appItemId" TEXT,
    "grantId" TEXT NOT NULL,
    "activityId" TEXT,
    "budgetLineId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requestedById" TEXT NOT NULL,
    "departmentId" TEXT,
    "procurementMethodId" TEXT,
    "totalEstimatedAmount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "requiredByDate" TIMESTAMP(3),
    "justification" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "purchase_requisitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pr_items" (
    "id" TEXT NOT NULL,
    "prId" TEXT NOT NULL,
    "budgetLineId" TEXT,
    "description" TEXT NOT NULL,
    "specification" TEXT,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "estimatedUnitPrice" DECIMAL(20,4) NOT NULL,
    "totalEstimated" DECIMAL(20,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pr_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arabicName" TEXT,
    "vendorType" "VendorType" NOT NULL DEFAULT 'SUPPLIER',
    "country" TEXT,
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "taxNumber" TEXT,
    "isBlacklisted" BOOLEAN NOT NULL DEFAULT false,
    "blacklistReason" TEXT,
    "blacklistDate" TIMESTAMP(3),
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_documents" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "documentType" "VendorDocumentType" NOT NULL,
    "documentNumber" TEXT,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_bank_accounts" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "iban" TEXT,
    "swiftCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "country" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfqs" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "prId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "issuedDate" TIMESTAMP(3),
    "submissionDeadline" TIMESTAMP(3) NOT NULL,
    "openingDate" TIMESTAMP(3),
    "status" "RfqStatus" NOT NULL DEFAULT 'DRAFT',
    "procurementMethodId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_vendors" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "quotedAmount" DECIMAL(20,4),
    "currency" TEXT,
    "deliveryDays" INTEGER,
    "warrantyTerms" TEXT,
    "technicalScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "financialScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "committeeScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "totalScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "isShortlisted" BOOLEAN NOT NULL DEFAULT false,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfq_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_evaluations" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "rfqVendorId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "criteriaName" TEXT NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "weightedScore" DECIMAL(5,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfq_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_analysis_forms" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "prId" TEXT NOT NULL,
    "rfqVendorId" TEXT,
    "recommendedVendorId" TEXT,
    "totalAmount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "justification" TEXT NOT NULL,
    "committeeMembers" JSONB,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_analysis_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "prId" TEXT,
    "rfqId" TEXT,
    "pafId" TEXT,
    "vendorId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "budgetLineId" TEXT,
    "contractId" TEXT,
    "title" TEXT NOT NULL,
    "deliveryAddress" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotal" DECIMAL(20,4) NOT NULL,
    "taxAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(20,4) NOT NULL,
    "paidAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "terms" TEXT,
    "notes" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "issuedById" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_items" (
    "id" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "budgetLineId" TEXT,
    "description" TEXT NOT NULL,
    "specification" TEXT,
    "unit" TEXT NOT NULL,
    "orderedQuantity" DECIMAL(10,3) NOT NULL,
    "receivedQuantity" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(20,4) NOT NULL,
    "totalPrice" DECIMAL(20,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "po_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipts" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "warehouseId" TEXT,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "deliveryNote" TEXT,
    "notes" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "receivedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "goods_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_items" (
    "id" TEXT NOT NULL,
    "grnId" TEXT NOT NULL,
    "poItemId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderedQuantity" DECIMAL(10,3) NOT NULL,
    "deliveredQuantity" DECIMAL(10,3) NOT NULL,
    "acceptedQuantity" DECIMAL(10,3) NOT NULL,
    "rejectedQuantity" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "damagedQuantity" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grn_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL DEFAULT 'SERVICE_CONTRACT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalValue" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentTerms" TEXT,
    "deliverables" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_invoices" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotal" DECIMAL(20,4) NOT NULL,
    "taxAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(20,4) NOT NULL,
    "paidAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "isThreeWayMatched" BOOLEAN NOT NULL DEFAULT false,
    "matchedAt" TIMESTAMP(3),
    "matchedById" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'RECEIVED',
    "workflowInstanceId" TEXT,
    "fileUrl" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vendor_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_of_accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arabicName" TEXT,
    "accountType" "AccountType" NOT NULL,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isLeaf" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "normalBalance" "NormalBalance" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "sourceType" "JournalSource" NOT NULL DEFAULT 'MANUAL',
    "sourceId" TEXT,
    "grantId" TEXT,
    "periodId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalDebit" DECIMAL(20,4) NOT NULL,
    "totalCredit" DECIMAL(20,4) NOT NULL,
    "isPosted" BOOLEAN NOT NULL DEFAULT false,
    "postedAt" TIMESTAMP(3),
    "postedById" TEXT,
    "isReversed" BOOLEAN NOT NULL DEFAULT false,
    "reversedById" TEXT,
    "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_lines" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT,
    "debitAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "creditAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DECIMAL(20,8) NOT NULL DEFAULT 1,
    "baseDebit" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "baseCredit" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "grantId" TEXT,
    "activityId" TEXT,
    "budgetLineId" TEXT,
    "lineNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "iban" TEXT,
    "swiftCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currentBalance" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "glAccountId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_statements" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "statementDate" TIMESTAMP(3) NOT NULL,
    "openingBalance" DECIMAL(20,4) NOT NULL,
    "closingBalance" DECIMAL(20,4) NOT NULL,
    "fileUrl" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_statement_lines" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "debitAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "creditAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "balance" DECIMAL(20,4) NOT NULL,
    "isReconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconciledWith" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_statement_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_reconciliations" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "reconciliationDate" TIMESTAMP(3) NOT NULL,
    "bookBalance" DECIMAL(20,4) NOT NULL,
    "bankBalance" DECIMAL(20,4) NOT NULL,
    "adjustedBookBalance" DECIMAL(20,4) NOT NULL,
    "adjustedBankBalance" DECIMAL(20,4) NOT NULL,
    "difference" DECIMAL(20,4) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "reconciledById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_requests" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CHEQUE',
    "bankAccountId" TEXT,
    "notes" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_vouchers" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "paymentRequestId" TEXT,
    "grantId" TEXT NOT NULL,
    "payeeType" "PayeeType" NOT NULL DEFAULT 'VENDOR',
    "payeeId" TEXT,
    "payeeName" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amount" DECIMAL(20,4) NOT NULL,
    "exchangeRate" DECIMAL(20,8) NOT NULL DEFAULT 1,
    "baseAmount" DECIMAL(20,4) NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payment_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "paymentVoucherId" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DECIMAL(20,8) NOT NULL DEFAULT 1,
    "baseAmount" DECIMAL(20,4) NOT NULL,
    "reference" TEXT,
    "bankAccountId" TEXT,
    "journalEntryId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cheques" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "chequeNumber" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "payeeName" TEXT NOT NULL,
    "amount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "chequeDate" TIMESTAMP(3) NOT NULL,
    "memo" TEXT,
    "status" "ChequeStatus" NOT NULL DEFAULT 'DRAFT',
    "printedAt" TIMESTAMP(3),
    "issuedAt" TIMESTAMP(3),
    "clearedAt" TIMESTAMP(3),
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cheques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_transfers" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "fromBankAccountId" TEXT NOT NULL,
    "toBankAccount" TEXT NOT NULL,
    "toBankName" TEXT NOT NULL,
    "toAccountName" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amount" DECIMAL(20,4) NOT NULL,
    "exchangeRate" DECIMAL(20,8) NOT NULL DEFAULT 1,
    "baseAmount" DECIMAL(20,4) NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "swiftRef" TEXT,
    "status" "BankTransferStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_declarations" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "declarationDate" TIMESTAMP(3) NOT NULL,
    "signatoryId" TEXT NOT NULL,
    "amount" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "purpose" TEXT NOT NULL,
    "notes" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_declarations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_steps" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "approverRoleId" TEXT,
    "approverUserId" TEXT,
    "isParallel" BOOLEAN NOT NULL DEFAULT false,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "slaHours" INTEGER NOT NULL DEFAULT 48,
    "escalationHours" INTEGER,
    "escalationRoleId" TEXT,
    "allowDelegate" BOOLEAN NOT NULL DEFAULT true,
    "allowReturn" BOOLEAN NOT NULL DEFAULT true,
    "allowReject" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_instances" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "currentStepNumber" INTEGER NOT NULL DEFAULT 1,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_instance_steps" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "stepName" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "assignedRoleId" TEXT,
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "action" TEXT,
    "comment" TEXT,
    "digitalSignatureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_instance_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_action_logs" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "instanceStepId" TEXT,
    "actorId" TEXT NOT NULL,
    "action" "WorkflowAction" NOT NULL,
    "comment" TEXT,
    "actionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "digitalSignatureId" TEXT,

    CONSTRAINT "workflow_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_signatures" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "deviceFingerprint" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "certificate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_delegates" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "documentType" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_delegates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_escalations" (
    "id" TEXT NOT NULL,
    "instanceStepId" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "escalatedFromUserId" TEXT,
    "escalatedToUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "escalatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "managerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "unit" TEXT NOT NULL,
    "reorderLevel" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "currentStock" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "totalValue" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "warehouseId" TEXT,
    "locationCode" TEXT,
    "barcodeType" "BarcodeType" NOT NULL DEFAULT 'NONE',
    "barcodeValue" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "movementType" "MovementType" NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unitCost" DECIMAL(20,4) NOT NULL,
    "totalCost" DECIMAL(20,4) NOT NULL,
    "balanceAfter" DECIMAL(10,3) NOT NULL,
    "reference" TEXT,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "grantId" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "adjustmentDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_batches" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "quantity" DECIMAL(10,3) NOT NULL,
    "receivedDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_locations" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "row" TEXT,
    "shelf" TEXT,
    "bin" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "parentId" TEXT,
    "depreciationMethod" "DepreciationMethod" NOT NULL DEFAULT 'STRAIGHT_LINE',
    "usefulLifeYears" INTEGER NOT NULL DEFAULT 5,
    "residualValuePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "glAccountId" TEXT,
    "depreciationGlAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_assets" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "grantId" TEXT,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "purchasePrice" DECIMAL(20,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currentBookValue" DECIMAL(20,4) NOT NULL,
    "depreciationMethod" "DepreciationMethod" NOT NULL DEFAULT 'STRAIGHT_LINE',
    "usefulLifeYears" INTEGER NOT NULL,
    "residualValue" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "depreciationStartDate" TIMESTAMP(3) NOT NULL,
    "lastDepreciationDate" TIMESTAMP(3),
    "warehouseId" TEXT,
    "locationCode" TEXT,
    "barcodeType" "BarcodeType" NOT NULL DEFAULT 'NONE',
    "barcodeValue" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "purchaseOrderId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fixed_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_assignments" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "departmentId" TEXT,
    "assignedDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "condition" "AssetCondition" NOT NULL DEFAULT 'GOOD',
    "notes" TEXT,
    "assignedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_maintenance" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "maintenanceType" "MaintenanceType" NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "cost" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "vendorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "performedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_depreciation_schedules" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "depreciationAmount" DECIMAL(20,4) NOT NULL,
    "accumulatedDepreciation" DECIMAL(20,4) NOT NULL,
    "bookValue" DECIMAL(20,4) NOT NULL,
    "isPosted" BOOLEAN NOT NULL DEFAULT false,
    "journalEntryId" TEXT,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_depreciation_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_depreciation_entries" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "depreciationAmount" DECIMAL(20,4) NOT NULL,
    "bookValueBefore" DECIMAL(20,4) NOT NULL,
    "bookValueAfter" DECIMAL(20,4) NOT NULL,
    "journalEntryId" TEXT,
    "isPosted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_depreciation_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_disposals" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "disposalDate" TIMESTAMP(3) NOT NULL,
    "disposalMethod" "DisposalMethod" NOT NULL,
    "saleAmount" DECIMAL(20,4) NOT NULL DEFAULT 0,
    "bookValueAtDisposal" DECIMAL(20,4) NOT NULL,
    "gainLoss" DECIMAL(20,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "approvedById" TEXT,
    "journalEntryId" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "workflowInstanceId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_disposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_verifications" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "verificationDate" TIMESTAMP(3) NOT NULL,
    "verifiedById" TEXT NOT NULL,
    "condition" "AssetCondition" NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_attachments" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "document_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changesSummary" TEXT,
    "snapshotData" JSONB NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_mentions" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "mentionedUserId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "documentType" TEXT,
    "documentId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" "AuditAction" NOT NULL,
    "module" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "requestId" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE INDEX "departments_organizationId_idx" ON "departments"("organizationId");

-- CreateIndex
CREATE INDEX "departments_parentId_idx" ON "departments"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- CreateIndex
CREATE INDEX "users_departmentId_idx" ON "users"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "permissions_module_idx" ON "permissions"("module");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_module_action_resource_key" ON "permissions"("module", "action", "resource");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "serial_sequences_grantCode_docType_key" ON "serial_sequences"("grantCode", "docType");

-- CreateIndex
CREATE UNIQUE INDEX "donors_code_key" ON "donors"("code");

-- CreateIndex
CREATE INDEX "donors_code_idx" ON "donors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE INDEX "exchange_rates_fromCurrencyId_toCurrencyId_effectiveDate_idx" ON "exchange_rates"("fromCurrencyId", "toCurrencyId", "effectiveDate");

-- CreateIndex
CREATE INDEX "exchange_rates_grantId_idx" ON "exchange_rates"("grantId");

-- CreateIndex
CREATE INDEX "accounting_periods_fiscalYearId_status_idx" ON "accounting_periods"("fiscalYearId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "grants_code_key" ON "grants"("code");

-- CreateIndex
CREATE INDEX "grants_status_deletedAt_idx" ON "grants"("status", "deletedAt");

-- CreateIndex
CREATE INDEX "grants_donorId_idx" ON "grants"("donorId");

-- CreateIndex
CREATE INDEX "grants_code_idx" ON "grants"("code");

-- CreateIndex
CREATE INDEX "grant_budget_lines_grantId_idx" ON "grant_budget_lines"("grantId");

-- CreateIndex
CREATE INDEX "grant_budget_lines_activityId_idx" ON "grant_budget_lines"("activityId");

-- CreateIndex
CREATE INDEX "grant_amendments_grantId_idx" ON "grant_amendments"("grantId");

-- CreateIndex
CREATE INDEX "grant_extensions_grantId_idx" ON "grant_extensions"("grantId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

-- CreateIndex
CREATE INDEX "projects_grantId_status_idx" ON "projects"("grantId", "status");

-- CreateIndex
CREATE INDEX "project_milestones_projectId_status_idx" ON "project_milestones"("projectId", "status");

-- CreateIndex
CREATE INDEX "activities_projectId_status_idx" ON "activities"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "activity_budget_lines_activityId_budgetLineId_key" ON "activity_budget_lines"("activityId", "budgetLineId");

-- CreateIndex
CREATE INDEX "project_staff_projectId_idx" ON "project_staff"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_staff_projectId_userId_key" ON "project_staff"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_methods_name_key" ON "procurement_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_methods_code_key" ON "procurement_methods"("code");

-- CreateIndex
CREATE UNIQUE INDEX "annual_procurement_plans_serialNumber_key" ON "annual_procurement_plans"("serialNumber");

-- CreateIndex
CREATE INDEX "annual_procurement_plans_grantId_status_idx" ON "annual_procurement_plans"("grantId", "status");

-- CreateIndex
CREATE INDEX "annual_procurement_plans_fiscalYearId_idx" ON "annual_procurement_plans"("fiscalYearId");

-- CreateIndex
CREATE INDEX "app_items_appId_idx" ON "app_items"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_requisitions_serialNumber_key" ON "purchase_requisitions"("serialNumber");

-- CreateIndex
CREATE INDEX "purchase_requisitions_grantId_status_deletedAt_idx" ON "purchase_requisitions"("grantId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "purchase_requisitions_requestedById_idx" ON "purchase_requisitions"("requestedById");

-- CreateIndex
CREATE INDEX "purchase_requisitions_workflowInstanceId_idx" ON "purchase_requisitions"("workflowInstanceId");

-- CreateIndex
CREATE INDEX "pr_items_prId_idx" ON "pr_items"("prId");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_registrationNumber_key" ON "vendors"("registrationNumber");

-- CreateIndex
CREATE INDEX "vendors_isBlacklisted_deletedAt_idx" ON "vendors"("isBlacklisted", "deletedAt");

-- CreateIndex
CREATE INDEX "vendor_documents_vendorId_documentType_idx" ON "vendor_documents"("vendorId", "documentType");

-- CreateIndex
CREATE INDEX "vendor_documents_expiryDate_idx" ON "vendor_documents"("expiryDate");

-- CreateIndex
CREATE INDEX "vendor_bank_accounts_vendorId_idx" ON "vendor_bank_accounts"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_serialNumber_key" ON "rfqs"("serialNumber");

-- CreateIndex
CREATE INDEX "rfqs_prId_status_idx" ON "rfqs"("prId", "status");

-- CreateIndex
CREATE INDEX "rfqs_grantId_idx" ON "rfqs"("grantId");

-- CreateIndex
CREATE INDEX "rfq_vendors_rfqId_idx" ON "rfq_vendors"("rfqId");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_vendors_rfqId_vendorId_key" ON "rfq_vendors"("rfqId", "vendorId");

-- CreateIndex
CREATE INDEX "rfq_evaluations_rfqId_rfqVendorId_idx" ON "rfq_evaluations"("rfqId", "rfqVendorId");

-- CreateIndex
CREATE INDEX "purchase_analysis_forms_rfqId_idx" ON "purchase_analysis_forms"("rfqId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_serialNumber_key" ON "purchase_orders"("serialNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_vendorId_status_deletedAt_idx" ON "purchase_orders"("vendorId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "purchase_orders_grantId_status_idx" ON "purchase_orders"("grantId", "status");

-- CreateIndex
CREATE INDEX "purchase_orders_prId_idx" ON "purchase_orders"("prId");

-- CreateIndex
CREATE INDEX "po_items_poId_idx" ON "po_items"("poId");

-- CreateIndex
CREATE UNIQUE INDEX "goods_receipts_serialNumber_key" ON "goods_receipts"("serialNumber");

-- CreateIndex
CREATE INDEX "goods_receipts_poId_status_idx" ON "goods_receipts"("poId", "status");

-- CreateIndex
CREATE INDEX "goods_receipts_grantId_idx" ON "goods_receipts"("grantId");

-- CreateIndex
CREATE INDEX "grn_items_grnId_idx" ON "grn_items"("grnId");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_serialNumber_key" ON "contracts"("serialNumber");

-- CreateIndex
CREATE INDEX "contracts_vendorId_status_idx" ON "contracts"("vendorId", "status");

-- CreateIndex
CREATE INDEX "contracts_grantId_idx" ON "contracts"("grantId");

-- CreateIndex
CREATE INDEX "contracts_endDate_idx" ON "contracts"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_invoices_serialNumber_key" ON "vendor_invoices"("serialNumber");

-- CreateIndex
CREATE INDEX "vendor_invoices_poId_status_idx" ON "vendor_invoices"("poId", "status");

-- CreateIndex
CREATE INDEX "vendor_invoices_vendorId_idx" ON "vendor_invoices"("vendorId");

-- CreateIndex
CREATE INDEX "vendor_invoices_grantId_idx" ON "vendor_invoices"("grantId");

-- CreateIndex
CREATE UNIQUE INDEX "chart_of_accounts_code_key" ON "chart_of_accounts"("code");

-- CreateIndex
CREATE INDEX "chart_of_accounts_accountType_isLeaf_idx" ON "chart_of_accounts"("accountType", "isLeaf");

-- CreateIndex
CREATE INDEX "chart_of_accounts_parentId_idx" ON "chart_of_accounts"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_serialNumber_key" ON "journal_entries"("serialNumber");

-- CreateIndex
CREATE INDEX "journal_entries_grantId_entryDate_idx" ON "journal_entries"("grantId", "entryDate");

-- CreateIndex
CREATE INDEX "journal_entries_periodId_status_idx" ON "journal_entries"("periodId", "status");

-- CreateIndex
CREATE INDEX "journal_entries_sourceType_sourceId_idx" ON "journal_entries"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "journal_lines_journalEntryId_idx" ON "journal_lines"("journalEntryId");

-- CreateIndex
CREATE INDEX "journal_lines_accountId_createdAt_idx" ON "journal_lines"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "bank_statements_bankAccountId_statementDate_idx" ON "bank_statements"("bankAccountId", "statementDate");

-- CreateIndex
CREATE INDEX "bank_statement_lines_statementId_isReconciled_idx" ON "bank_statement_lines"("statementId", "isReconciled");

-- CreateIndex
CREATE INDEX "bank_reconciliations_bankAccountId_periodId_idx" ON "bank_reconciliations"("bankAccountId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_requests_serialNumber_key" ON "payment_requests"("serialNumber");

-- CreateIndex
CREATE INDEX "payment_requests_grantId_status_idx" ON "payment_requests"("grantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_vouchers_serialNumber_key" ON "payment_vouchers"("serialNumber");

-- CreateIndex
CREATE INDEX "payment_vouchers_grantId_status_idx" ON "payment_vouchers"("grantId", "status");

-- CreateIndex
CREATE INDEX "payments_paymentVoucherId_idx" ON "payments"("paymentVoucherId");

-- CreateIndex
CREATE INDEX "payments_paymentDate_status_idx" ON "payments"("paymentDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cheques_serialNumber_key" ON "cheques"("serialNumber");

-- CreateIndex
CREATE INDEX "cheques_status_idx" ON "cheques"("status");

-- CreateIndex
CREATE INDEX "cheques_chequeDate_idx" ON "cheques"("chequeDate");

-- CreateIndex
CREATE UNIQUE INDEX "bank_transfers_serialNumber_key" ON "bank_transfers"("serialNumber");

-- CreateIndex
CREATE INDEX "bank_transfers_status_transferDate_idx" ON "bank_transfers"("status", "transferDate");

-- CreateIndex
CREATE INDEX "payment_declarations_paymentId_idx" ON "payment_declarations"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_templates_name_key" ON "workflow_templates"("name");

-- CreateIndex
CREATE INDEX "workflow_templates_documentType_isActive_idx" ON "workflow_templates"("documentType", "isActive");

-- CreateIndex
CREATE INDEX "workflow_steps_templateId_idx" ON "workflow_steps"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_steps_templateId_stepNumber_key" ON "workflow_steps"("templateId", "stepNumber");

-- CreateIndex
CREATE INDEX "workflow_instances_documentType_documentId_idx" ON "workflow_instances"("documentType", "documentId");

-- CreateIndex
CREATE INDEX "workflow_instances_status_idx" ON "workflow_instances"("status");

-- CreateIndex
CREATE INDEX "workflow_instance_steps_instanceId_status_idx" ON "workflow_instance_steps"("instanceId", "status");

-- CreateIndex
CREATE INDEX "workflow_action_logs_instanceId_idx" ON "workflow_action_logs"("instanceId");

-- CreateIndex
CREATE INDEX "workflow_action_logs_actorId_idx" ON "workflow_action_logs"("actorId");

-- CreateIndex
CREATE INDEX "digital_signatures_userId_documentId_idx" ON "digital_signatures"("userId", "documentId");

-- CreateIndex
CREATE INDEX "digital_signatures_documentType_documentId_idx" ON "digital_signatures"("documentType", "documentId");

-- CreateIndex
CREATE INDEX "workflow_delegates_fromUserId_isActive_idx" ON "workflow_delegates"("fromUserId", "isActive");

-- CreateIndex
CREATE INDEX "workflow_delegates_endDate_idx" ON "workflow_delegates"("endDate");

-- CreateIndex
CREATE INDEX "workflow_escalations_instanceStepId_idx" ON "workflow_escalations"("instanceStepId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_name_key" ON "warehouses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_categories_code_key" ON "inventory_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_sku_key" ON "inventory_items"("sku");

-- CreateIndex
CREATE INDEX "inventory_items_categoryId_idx" ON "inventory_items"("categoryId");

-- CreateIndex
CREATE INDEX "inventory_items_warehouseId_isActive_idx" ON "inventory_items"("warehouseId", "isActive");

-- CreateIndex
CREATE INDEX "stock_movements_itemId_createdAt_idx" ON "stock_movements"("itemId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_warehouseId_idx" ON "stock_movements"("warehouseId");

-- CreateIndex
CREATE INDEX "stock_movements_referenceType_referenceId_idx" ON "stock_movements"("referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_adjustments_serialNumber_key" ON "stock_adjustments"("serialNumber");

-- CreateIndex
CREATE INDEX "stock_adjustments_warehouseId_status_idx" ON "stock_adjustments"("warehouseId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_batches_batchNumber_key" ON "inventory_batches"("batchNumber");

-- CreateIndex
CREATE INDEX "inventory_batches_itemId_idx" ON "inventory_batches"("itemId");

-- CreateIndex
CREATE INDEX "inventory_batches_expiryDate_idx" ON "inventory_batches"("expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_locations_warehouseId_code_key" ON "warehouse_locations"("warehouseId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_code_key" ON "asset_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_assets_serialNumber_key" ON "fixed_assets"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_assets_assetCode_key" ON "fixed_assets"("assetCode");

-- CreateIndex
CREATE INDEX "fixed_assets_categoryId_status_idx" ON "fixed_assets"("categoryId", "status");

-- CreateIndex
CREATE INDEX "fixed_assets_grantId_idx" ON "fixed_assets"("grantId");

-- CreateIndex
CREATE INDEX "asset_assignments_assetId_idx" ON "asset_assignments"("assetId");

-- CreateIndex
CREATE INDEX "asset_assignments_assignedToId_idx" ON "asset_assignments"("assignedToId");

-- CreateIndex
CREATE INDEX "asset_maintenance_assetId_status_idx" ON "asset_maintenance"("assetId", "status");

-- CreateIndex
CREATE INDEX "asset_maintenance_scheduledDate_idx" ON "asset_maintenance"("scheduledDate");

-- CreateIndex
CREATE INDEX "asset_depreciation_schedules_assetId_period_idx" ON "asset_depreciation_schedules"("assetId", "period");

-- CreateIndex
CREATE INDEX "asset_depreciation_entries_assetId_periodId_idx" ON "asset_depreciation_entries"("assetId", "periodId");

-- CreateIndex
CREATE INDEX "asset_disposals_assetId_status_idx" ON "asset_disposals"("assetId", "status");

-- CreateIndex
CREATE INDEX "asset_verifications_assetId_idx" ON "asset_verifications"("assetId");

-- CreateIndex
CREATE INDEX "document_attachments_documentType_documentId_idx" ON "document_attachments"("documentType", "documentId");

-- CreateIndex
CREATE INDEX "document_attachments_uploadedById_idx" ON "document_attachments"("uploadedById");

-- CreateIndex
CREATE INDEX "document_versions_documentType_documentId_versionNumber_idx" ON "document_versions"("documentType", "documentId", "versionNumber");

-- CreateIndex
CREATE INDEX "comments_documentType_documentId_idx" ON "comments"("documentType", "documentId");

-- CreateIndex
CREATE INDEX "comments_createdById_idx" ON "comments"("createdById");

-- CreateIndex
CREATE INDEX "comment_mentions_mentionedUserId_isRead_idx" ON "comment_mentions"("mentionedUserId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_createdAt_idx" ON "notifications"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_documentType_documentId_idx" ON "notifications"("documentType", "documentId");

-- CreateIndex
CREATE INDEX "notification_preferences_userId_idx" ON "notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_module_eventType_key" ON "notification_preferences"("userId", "module", "eventType");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_module_resource_resourceId_idx" ON "audit_logs"("module", "resource", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_headUserId_fkey" FOREIGN KEY ("headUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_fromCurrencyId_fkey" FOREIGN KEY ("fromCurrencyId") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_toCurrencyId_fkey" FOREIGN KEY ("toCurrencyId") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_periods" ADD CONSTRAINT "accounting_periods_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "fiscal_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "fiscal_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_grantManagerId_fkey" FOREIGN KEY ("grantManagerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_projectCoordinatorId_fkey" FOREIGN KEY ("projectCoordinatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_budget_lines" ADD CONSTRAINT "grant_budget_lines_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_budget_lines" ADD CONSTRAINT "grant_budget_lines_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_amendments" ADD CONSTRAINT "grant_amendments_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_amendments" ADD CONSTRAINT "grant_amendments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_amendments" ADD CONSTRAINT "grant_amendments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_amendments" ADD CONSTRAINT "grant_amendments_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_extensions" ADD CONSTRAINT "grant_extensions_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_extensions" ADD CONSTRAINT "grant_extensions_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_budget_lines" ADD CONSTRAINT "activity_budget_lines_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_budget_lines" ADD CONSTRAINT "activity_budget_lines_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "grant_budget_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_staff" ADD CONSTRAINT "project_staff_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_staff" ADD CONSTRAINT "project_staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_procurement_plans" ADD CONSTRAINT "annual_procurement_plans_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_procurement_plans" ADD CONSTRAINT "annual_procurement_plans_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "fiscal_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_procurement_plans" ADD CONSTRAINT "annual_procurement_plans_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_items" ADD CONSTRAINT "app_items_appId_fkey" FOREIGN KEY ("appId") REFERENCES "annual_procurement_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_items" ADD CONSTRAINT "app_items_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_items" ADD CONSTRAINT "app_items_procurementMethodId_fkey" FOREIGN KEY ("procurementMethodId") REFERENCES "procurement_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_appItemId_fkey" FOREIGN KEY ("appItemId") REFERENCES "app_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_procurementMethodId_fkey" FOREIGN KEY ("procurementMethodId") REFERENCES "procurement_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pr_items" ADD CONSTRAINT "pr_items_prId_fkey" FOREIGN KEY ("prId") REFERENCES "purchase_requisitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pr_items" ADD CONSTRAINT "pr_items_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "grant_budget_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_documents" ADD CONSTRAINT "vendor_documents_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_bank_accounts" ADD CONSTRAINT "vendor_bank_accounts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_prId_fkey" FOREIGN KEY ("prId") REFERENCES "purchase_requisitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_procurementMethodId_fkey" FOREIGN KEY ("procurementMethodId") REFERENCES "procurement_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_vendors" ADD CONSTRAINT "rfq_vendors_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_vendors" ADD CONSTRAINT "rfq_vendors_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_evaluations" ADD CONSTRAINT "rfq_evaluations_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_evaluations" ADD CONSTRAINT "rfq_evaluations_rfqVendorId_fkey" FOREIGN KEY ("rfqVendorId") REFERENCES "rfq_vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_analysis_forms" ADD CONSTRAINT "purchase_analysis_forms_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_analysis_forms" ADD CONSTRAINT "purchase_analysis_forms_prId_fkey" FOREIGN KEY ("prId") REFERENCES "purchase_requisitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_analysis_forms" ADD CONSTRAINT "purchase_analysis_forms_rfqVendorId_fkey" FOREIGN KEY ("rfqVendorId") REFERENCES "rfq_vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_analysis_forms" ADD CONSTRAINT "purchase_analysis_forms_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_prId_fkey" FOREIGN KEY ("prId") REFERENCES "purchase_requisitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_pafId_fkey" FOREIGN KEY ("pafId") REFERENCES "purchase_analysis_forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_items" ADD CONSTRAINT "po_items_poId_fkey" FOREIGN KEY ("poId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_items" ADD CONSTRAINT "po_items_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "grant_budget_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_poId_fkey" FOREIGN KEY ("poId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "goods_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_poItemId_fkey" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_poId_fkey" FOREIGN KEY ("poId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "accounting_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_reversedById_fkey" FOREIGN KEY ("reversedById") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "chart_of_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "grant_budget_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_glAccountId_fkey" FOREIGN KEY ("glAccountId") REFERENCES "chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "bank_statements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "accounting_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "vendor_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_vouchers" ADD CONSTRAINT "payment_vouchers_paymentRequestId_fkey" FOREIGN KEY ("paymentRequestId") REFERENCES "payment_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_vouchers" ADD CONSTRAINT "payment_vouchers_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_vouchers" ADD CONSTRAINT "payment_vouchers_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_paymentVoucherId_fkey" FOREIGN KEY ("paymentVoucherId") REFERENCES "payment_vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheques" ADD CONSTRAINT "cheques_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_fromBankAccountId_fkey" FOREIGN KEY ("fromBankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_declarations" ADD CONSTRAINT "payment_declarations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workflow_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_approverRoleId_fkey" FOREIGN KEY ("approverRoleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_escalationRoleId_fkey" FOREIGN KEY ("escalationRoleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instances" ADD CONSTRAINT "workflow_instances_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workflow_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instance_steps" ADD CONSTRAINT "workflow_instance_steps_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "workflow_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_instance_steps" ADD CONSTRAINT "workflow_instance_steps_digitalSignatureId_fkey" FOREIGN KEY ("digitalSignatureId") REFERENCES "digital_signatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_action_logs" ADD CONSTRAINT "workflow_action_logs_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "workflow_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_action_logs" ADD CONSTRAINT "workflow_action_logs_instanceStepId_fkey" FOREIGN KEY ("instanceStepId") REFERENCES "workflow_instance_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_action_logs" ADD CONSTRAINT "workflow_action_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_action_logs" ADD CONSTRAINT "workflow_action_logs_digitalSignatureId_fkey" FOREIGN KEY ("digitalSignatureId") REFERENCES "digital_signatures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_escalations" ADD CONSTRAINT "workflow_escalations_instanceStepId_fkey" FOREIGN KEY ("instanceStepId") REFERENCES "workflow_instance_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_escalations" ADD CONSTRAINT "workflow_escalations_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "workflow_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "inventory_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "inventory_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_locations" ADD CONSTRAINT "warehouse_locations_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "asset_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_glAccountId_fkey" FOREIGN KEY ("glAccountId") REFERENCES "chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_depreciationGlAccountId_fkey" FOREIGN KEY ("depreciationGlAccountId") REFERENCES "chart_of_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "asset_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_maintenance" ADD CONSTRAINT "asset_maintenance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_maintenance" ADD CONSTRAINT "asset_maintenance_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_depreciation_schedules" ADD CONSTRAINT "asset_depreciation_schedules_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_depreciation_entries" ADD CONSTRAINT "asset_depreciation_entries_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_depreciation_entries" ADD CONSTRAINT "asset_depreciation_entries_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "accounting_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_depreciation_entries" ADD CONSTRAINT "asset_depreciation_entries_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_disposals" ADD CONSTRAINT "asset_disposals_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_disposals" ADD CONSTRAINT "asset_disposals_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_disposals" ADD CONSTRAINT "asset_disposals_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "workflow_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_verifications" ADD CONSTRAINT "asset_verifications_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_attachments" ADD CONSTRAINT "document_attachments_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_mentions" ADD CONSTRAINT "comment_mentions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
