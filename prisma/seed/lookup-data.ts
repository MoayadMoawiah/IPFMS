import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedLookupData() {
  console.log('Seeding lookup data...');

  // ── Currencies ────────────────────────────────────────
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', isBase: true, isActive: true },
    { code: 'SDG', name: 'Sudanese Pound', symbol: 'SDG', isBase: false, isActive: true },
    { code: 'EUR', name: 'Euro', symbol: '€', isBase: false, isActive: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', isBase: false, isActive: true },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', isBase: false, isActive: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', isBase: false, isActive: true },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }
  console.log(`  ✓ ${currencies.length} currencies`);

  // ── Procurement Methods ────────────────────────────────
  const procurementMethods = [
    {
      name: 'Petty Cash',
      code: 'PETTY_CASH',
      description: 'Small purchases below petty cash threshold',
      minThreshold: 0,
      maxThreshold: 500,
      minVendors: 1,
      requiresCommittee: false,
    },
    {
      name: 'Request for Quotation (RFQ)',
      code: 'RFQ',
      description: 'Competitive quotations from multiple vendors',
      minThreshold: 501,
      maxThreshold: 10000,
      minVendors: 3,
      requiresCommittee: false,
    },
    {
      name: 'Competitive Bidding',
      code: 'COMPETITIVE_BIDDING',
      description: 'Open competitive bidding for large procurements',
      minThreshold: 10001,
      maxThreshold: 50000,
      minVendors: 3,
      requiresCommittee: true,
    },
    {
      name: 'Restricted Tender',
      code: 'RESTRICTED_TENDER',
      description: 'Invitation to selected vendors only',
      minThreshold: 50001,
      maxThreshold: 150000,
      minVendors: 3,
      requiresCommittee: true,
    },
    {
      name: 'Direct Contracting',
      code: 'DIRECT',
      description: 'Single source procurement with justification',
      minThreshold: 0,
      maxThreshold: null,
      minVendors: 1,
      requiresCommittee: false,
    },
    {
      name: 'Long-Term Agreement (LTA)',
      code: 'LTA',
      description: 'Framework agreement for recurring purchases',
      minThreshold: 0,
      maxThreshold: null,
      minVendors: 1,
      requiresCommittee: true,
    },
    {
      name: 'Framework Agreement',
      code: 'FRAMEWORK',
      description: 'Pre-qualified vendor pool framework',
      minThreshold: 0,
      maxThreshold: null,
      minVendors: 3,
      requiresCommittee: true,
    },
    {
      name: 'Service Contract',
      code: 'SERVICE_CONTRACT',
      description: 'Professional services contract',
      minThreshold: 0,
      maxThreshold: null,
      minVendors: 2,
      requiresCommittee: false,
    },
    {
      name: 'Consultancy',
      code: 'CONSULTANCY',
      description: 'Individual or firm consultancy services',
      minThreshold: 0,
      maxThreshold: null,
      minVendors: 2,
      requiresCommittee: false,
    },
  ];

  for (const method of procurementMethods) {
    await prisma.procurementMethod.upsert({
      where: { code: method.code },
      update: {},
      create: {
        ...method,
        maxThreshold: method.maxThreshold,
        isActive: true,
      },
    });
  }
  console.log(`  ✓ ${procurementMethods.length} procurement methods`);

  // ── Fiscal Year ────────────────────────────────────────
  const currentYear = new Date().getFullYear();
  const fiscalYear = await prisma.fiscalYear.upsert({
    where: { id: 'fy-2026' },
    update: {},
    create: {
      id: 'fy-2026',
      name: `FY ${currentYear}`,
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      status: 'OPEN',
    },
  });

  // Create 12 accounting periods
  for (let month = 1; month <= 12; month++) {
    const periodId = `ap-${currentYear}-${month.toString().padStart(2, '0')}`;
    const startDate = new Date(currentYear, month - 1, 1);
    const endDate = new Date(currentYear, month, 0); // Last day of month
    const names = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

    await prisma.accountingPeriod.upsert({
      where: { id: periodId },
      update: {},
      create: {
        id: periodId,
        fiscalYearId: fiscalYear.id,
        name: `${names[month - 1]} ${currentYear}`,
        periodNumber: month,
        startDate,
        endDate,
        status: 'OPEN',
      },
    });
  }
  console.log(`  ✓ Fiscal year ${currentYear} with 12 accounting periods`);

  // ── Organization ────────────────────────────────────────
  await prisma.organization.upsert({
    where: { id: 'org-gaderon' },
    update: {},
    create: {
      id: 'org-gaderon',
      name: 'Gaderon Organization for Development',
      shortName: 'Gaderon',
      address: 'Khartoum, Sudan',
      country: 'Sudan',
      baseCurrency: 'USD',
      secondaryCurrency: 'SDG',
    },
  });
  console.log('  ✓ Organization');

  // ── Departments ────────────────────────────────────────
  const departments = [
    { id: 'dept-finance', code: 'FIN', name: 'Finance Department', parentId: null },
    { id: 'dept-procurement', code: 'PROC', name: 'Procurement Department', parentId: null },
    { id: 'dept-programs', code: 'PROG', name: 'Programs Department', parentId: null },
    { id: 'dept-admin', code: 'ADMIN', name: 'Administration', parentId: null },
    { id: 'dept-hr', code: 'HR', name: 'Human Resources', parentId: null },
    { id: 'dept-it', code: 'IT', name: 'Information Technology', parentId: null },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: {},
      create: { ...dept, organizationId: 'org-gaderon' },
    });
  }
  console.log(`  ✓ ${departments.length} departments`);

  // ── System Settings ────────────────────────────────────
  const settings = [
    { key: 'org.name', value: 'Gaderon Organization for Development', description: 'Organization name', isPublic: true },
    { key: 'org.baseCurrency', value: 'USD', description: 'Base currency code', isPublic: true },
    { key: 'org.secondaryCurrency', value: 'SDG', description: 'Secondary currency', isPublic: true },
    { key: 'org.timezone', value: 'Africa/Khartoum', description: 'Default timezone', isPublic: true },
    { key: 'org.dateFormat', value: 'DD/MM/YYYY', description: 'Date display format', isPublic: true },
    { key: 'budget.warningThreshold', value: 90, description: 'Budget warning at % utilization', isPublic: false },
    { key: 'vendor.expiryAlertDays', value: [30, 60, 90], description: 'Document expiry alert days', isPublic: false },
    { key: 'contract.expiryAlertDays', value: [30, 60, 90], description: 'Contract expiry alert days', isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value as any, description: setting.description, isPublic: setting.isPublic },
    });
  }
  console.log(`  ✓ ${settings.length} system settings`);

  // ── Workflow Templates ────────────────────────────────────────
  const workflowTemplates = [
    {
      id: 'wf-pr',
      name: 'Purchase Requisition Approval',
      documentType: 'PURCHASE_REQUISITION',
      steps: [
        { stepNumber: 1, name: 'Department Head Review', approverRoleId: 'role-department-head', slaHours: 48, escalationHours: 72, allowReturn: true, allowReject: false },
        { stepNumber: 2, name: 'Procurement Officer Review', approverRoleId: 'role-procurement-officer', slaHours: 24, escalationHours: 48, allowReturn: true, allowReject: false },
        { stepNumber: 3, name: 'Finance Officer Budget Confirmation', approverRoleId: 'role-finance-officer', slaHours: 24, escalationHours: 48, allowReturn: true, allowReject: true },
        { stepNumber: 4, name: 'Country Director Final Approval', approverRoleId: 'role-country-director', slaHours: 48, escalationHours: 72, allowReturn: true, allowReject: true },
      ],
    },
    {
      id: 'wf-po',
      name: 'Purchase Order Approval',
      documentType: 'PURCHASE_ORDER',
      steps: [
        { stepNumber: 1, name: 'Procurement Manager Review', approverRoleId: 'role-procurement-manager', slaHours: 24, escalationHours: 48, allowReturn: true, allowReject: false },
        { stepNumber: 2, name: 'Finance Manager Financial Approval', approverRoleId: 'role-finance-manager', slaHours: 24, escalationHours: 48, allowReturn: true, allowReject: true },
        { stepNumber: 3, name: 'Country Director Sign-off', approverRoleId: 'role-country-director', slaHours: 48, escalationHours: 72, allowReturn: true, allowReject: true },
      ],
    },
    {
      id: 'wf-pv',
      name: 'Payment Voucher Approval',
      documentType: 'PAYMENT_VOUCHER',
      steps: [
        { stepNumber: 1, name: 'Finance Manager Review', approverRoleId: 'role-finance-manager', slaHours: 24, escalationHours: 48, allowReturn: true, allowReject: true },
        { stepNumber: 2, name: 'Country Director Authorize Payment', approverRoleId: 'role-country-director', slaHours: 48, escalationHours: 72, allowReturn: true, allowReject: true },
      ],
    },
    {
      id: 'wf-payreq',
      name: 'Payment Request Approval',
      documentType: 'PAYMENT_REQUEST',
      steps: [
        {
          stepNumber: 1,
          name: 'Finance Manager Review',
          approverRoleId: 'role-finance-manager',
          slaHours: 24,
          escalationHours: 48,
          allowReturn: true,
          allowReject: true,
        },
        {
          stepNumber: 2,
          name: 'Country Director Authorize',
          approverRoleId: 'role-country-director',
          slaHours: 48,
          escalationHours: 72,
          allowReturn: true,
          allowReject: true,
        },
      ],
    },
    {
      id: 'wf-grn',
      name: 'Goods Receipt Approval',
      documentType: 'GOODS_RECEIPT',
      steps: [
        {
          stepNumber: 1,
          name: 'Warehouse Receipt Confirmation',
          approverRoleId: 'role-procurement-officer',
          slaHours: 24,
          escalationHours: 48,
          allowReturn: true,
          allowReject: true,
        },
        {
          stepNumber: 2,
          name: 'Procurement Finalization',
          approverRoleId: 'role-procurement-manager',
          slaHours: 24,
          escalationHours: 24,
          allowReturn: true,
          allowReject: true,
        },
      ],
    },
    {
      id: 'wf-invoice',
      name: 'Vendor Invoice Approval',
      documentType: 'VENDOR_INVOICE',
      steps: [
        {
          stepNumber: 1,
          name: 'Procurement Match to PO/GRN',
          approverRoleId: 'role-procurement-officer',
          slaHours: 24,
          escalationHours: 48,
          allowReturn: true,
          allowReject: true,
        },
        {
          stepNumber: 2,
          name: 'Procurement Manager Approval',
          approverRoleId: 'role-procurement-manager',
          slaHours: 24,
          escalationHours: 48,
          allowReturn: true,
          allowReject: true,
        },
      ],
    },
  ];

  for (const template of workflowTemplates) {
    const { steps, ...templateData } = template;
    await prisma.workflowTemplate.upsert({
      where: { id: template.id },
      update: {
        name: templateData.name,
        documentType: templateData.documentType,
        isActive: true,
      },
      create: {
        ...templateData,
        isActive: true,
      },
    });

    for (const step of steps) {
      await prisma.workflowStep.upsert({
        where: {
          templateId_stepNumber: {
            templateId: template.id,
            stepNumber: step.stepNumber,
          },
        },
        update: {
          name: step.name,
          approverRoleId: step.approverRoleId,
          slaHours: step.slaHours,
          escalationHours: step.escalationHours,
          allowReturn: step.allowReturn,
          allowReject: step.allowReject,
          isParallel: false,
          isMandatory: true,
          allowDelegate: true,
        },
        create: {
          templateId: template.id,
          ...step,
          isParallel: false,
          isMandatory: true,
          allowDelegate: true,
        },
      });
    }

    // Drop template steps that are no longer defined (e.g. removed auditor step).
    const keepStepNumbers = steps.map((s) => s.stepNumber);
    await prisma.workflowStep.deleteMany({
      where: {
        templateId: template.id,
        stepNumber: { notIn: keepStepNumbers },
      },
    });
  }
  console.log(`  ✓ ${workflowTemplates.length} workflow templates`);

  // ── Sample Chart of Accounts (Basic IFRS-Compliant COA) ─────
  const accounts = [
    // ASSETS
    { id: 'coa-1000', code: '1000', name: 'Assets', accountType: 'ASSET', level: 1, isLeaf: false, normalBalance: 'DEBIT' },
    { id: 'coa-1100', code: '1100', name: 'Current Assets', accountType: 'ASSET', parentId: 'coa-1000', level: 2, isLeaf: false, normalBalance: 'DEBIT' },
    { id: 'coa-1101', code: '1101', name: 'Cash in Hand', accountType: 'ASSET', parentId: 'coa-1100', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1102', code: '1102', name: 'Cash at Bank - USD', accountType: 'ASSET', parentId: 'coa-1100', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1103', code: '1103', name: 'Cash at Bank - SDG', accountType: 'ASSET', parentId: 'coa-1100', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1200', code: '1200', name: 'Accounts Receivable', accountType: 'ASSET', parentId: 'coa-1000', level: 2, isLeaf: false, normalBalance: 'DEBIT' },
    { id: 'coa-1201', code: '1201', name: 'Advances to Staff', accountType: 'ASSET', parentId: 'coa-1200', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1300', code: '1300', name: 'Inventory', accountType: 'ASSET', parentId: 'coa-1000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1400', code: '1400', name: 'Prepaid Expenses', accountType: 'ASSET', parentId: 'coa-1000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1500', code: '1500', name: 'Fixed Assets', accountType: 'ASSET', parentId: 'coa-1000', level: 2, isLeaf: false, normalBalance: 'DEBIT' },
    { id: 'coa-1501', code: '1501', name: 'Equipment', accountType: 'ASSET', parentId: 'coa-1500', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1502', code: '1502', name: 'Vehicles', accountType: 'ASSET', parentId: 'coa-1500', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-1503', code: '1503', name: 'Accumulated Depreciation', accountType: 'ASSET', parentId: 'coa-1500', level: 3, isLeaf: true, normalBalance: 'CREDIT' },
    // LIABILITIES
    { id: 'coa-2000', code: '2000', name: 'Liabilities', accountType: 'LIABILITY', level: 1, isLeaf: false, normalBalance: 'CREDIT' },
    { id: 'coa-2100', code: '2100', name: 'Accounts Payable', accountType: 'LIABILITY', parentId: 'coa-2000', level: 2, isLeaf: false, normalBalance: 'CREDIT' },
    { id: 'coa-2101', code: '2101', name: 'Vendor Payables', accountType: 'LIABILITY', parentId: 'coa-2100', level: 3, isLeaf: true, normalBalance: 'CREDIT' },
    { id: 'coa-2102', code: '2102', name: 'Accrued Expenses', accountType: 'LIABILITY', parentId: 'coa-2100', level: 3, isLeaf: true, normalBalance: 'CREDIT' },
    { id: 'coa-2200', code: '2200', name: 'Deferred Grant Revenue', accountType: 'LIABILITY', parentId: 'coa-2000', level: 2, isLeaf: true, normalBalance: 'CREDIT' },
    // EQUITY
    { id: 'coa-3000', code: '3000', name: 'Equity', accountType: 'EQUITY', level: 1, isLeaf: false, normalBalance: 'CREDIT' },
    { id: 'coa-3100', code: '3100', name: 'Retained Earnings', accountType: 'EQUITY', parentId: 'coa-3000', level: 2, isLeaf: true, normalBalance: 'CREDIT' },
    // REVENUE
    { id: 'coa-4000', code: '4000', name: 'Revenue', accountType: 'REVENUE', level: 1, isLeaf: false, normalBalance: 'CREDIT' },
    { id: 'coa-4100', code: '4100', name: 'Grant Revenue', accountType: 'REVENUE', parentId: 'coa-4000', level: 2, isLeaf: true, normalBalance: 'CREDIT' },
    { id: 'coa-4200', code: '4200', name: 'Interest Income', accountType: 'REVENUE', parentId: 'coa-4000', level: 2, isLeaf: true, normalBalance: 'CREDIT' },
    // EXPENSES
    { id: 'coa-5000', code: '5000', name: 'Expenses', accountType: 'EXPENSE', level: 1, isLeaf: false, normalBalance: 'DEBIT' },
    { id: 'coa-5100', code: '5100', name: 'Staff Costs', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: false, normalBalance: 'DEBIT' },
    { id: 'coa-5101', code: '5101', name: 'Salaries', accountType: 'EXPENSE', parentId: 'coa-5100', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5102', code: '5102', name: 'Benefits & Allowances', accountType: 'EXPENSE', parentId: 'coa-5100', level: 3, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5200', code: '5200', name: 'Travel & Transportation', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5300', code: '5300', name: 'Supplies & Materials', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5400', code: '5400', name: 'Equipment & Furniture', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5500', code: '5500', name: 'Services & Consultancies', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5600', code: '5600', name: 'Rent & Utilities', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5700', code: '5700', name: 'Depreciation', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5800', code: '5800', name: 'Overhead & Indirect Costs', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
    { id: 'coa-5900', code: '5900', name: 'Bank Charges & Exchange Loss', accountType: 'EXPENSE', parentId: 'coa-5000', level: 2, isLeaf: true, normalBalance: 'DEBIT' },
  ];

  for (const account of accounts) {
    await prisma.chartOfAccount.upsert({
      where: { id: account.id },
      update: {},
      create: account as any,
    });
  }
  console.log(`  ✓ ${accounts.length} chart of accounts`);

  // ── Bank Account ────────────────────────────────────────
  await prisma.bankAccount.upsert({
    where: { id: 'bank-usd-001' },
    update: {},
    create: {
      id: 'bank-usd-001',
      accountName: 'Gaderon Main Operating Account',
      bankName: 'Bank of Khartoum',
      accountNumber: '0001234567890',
      currency: 'USD',
      currentBalance: 250000,
      glAccountId: 'coa-1102',
      isActive: true,
    },
  });
  console.log('  ✓ Bank account');

  console.log('Lookup data seeded successfully.');
}
