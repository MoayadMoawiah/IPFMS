import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGrants() {
  console.log('Seeding sample grants and donors...');

  // ── Donors ─────────────────────────────────────────────
  const donors = [
    {
      id: 'donor-usaid',
      code: 'USAID',
      name: 'United States Agency for International Development',
      shortName: 'USAID',
      country: 'USA',
      contactEmail: 'grants@usaid.gov',
      reportingCurrency: 'USD',
    },
    {
      id: 'donor-unicef',
      code: 'UNICEF',
      name: 'United Nations Children\'s Fund',
      shortName: 'UNICEF',
      country: 'USA',
      contactEmail: 'grants@unicef.org',
      reportingCurrency: 'USD',
    },
    {
      id: 'donor-eu',
      code: 'EU',
      name: 'European Union - ECHO',
      shortName: 'EU-ECHO',
      country: 'Belgium',
      contactEmail: 'echo@ec.europa.eu',
      reportingCurrency: 'EUR',
    },
    {
      id: 'donor-ocha',
      code: 'OCHA',
      name: 'United Nations Office for the Coordination of Humanitarian Affairs',
      shortName: 'OCHA',
      country: 'USA',
      contactEmail: 'grants@ocha.un.org',
      reportingCurrency: 'USD',
    },
  ];

  for (const donor of donors) {
    const { shortName: _shortName, reportingCurrency: _rc, ...donorData } = donor as typeof donor & { shortName?: string; reportingCurrency?: string };
    await prisma.donor.upsert({
      where: { id: donorData.id },
      update: {},
      create: donorData,
    });
  }
  console.log(`  ✓ ${donors.length} donors`);

  // ── Exchange Rates ────────────────────────────────────────────
  const exchangeRates = [
    { fromCurrency: 'USD', toCurrency: 'SDG', rate: 580, effectiveDate: new Date('2026-01-01') },
    { fromCurrency: 'EUR', toCurrency: 'USD', rate: 1.08, effectiveDate: new Date('2026-01-01') },
    { fromCurrency: 'GBP', toCurrency: 'USD', rate: 1.27, effectiveDate: new Date('2026-01-01') },
    { fromCurrency: 'SAR', toCurrency: 'USD', rate: 0.267, effectiveDate: new Date('2026-01-01') },
  ];

  for (const rate of exchangeRates) {
    await prisma.exchangeRate.create({ data: { ...rate, source: 'MANUAL', createdById: 'user-admin' } })
      .catch(() => {/* skip if exists */});
  }
  console.log(`  ✓ ${exchangeRates.length} exchange rates`);

  // ── Sample Grant 1 — USAID Active ───────────────────────────────
  const grant1 = await prisma.grant.upsert({
    where: { code: 'USAID-2026-001' },
    update: {},
    create: {
      code: 'USAID-2026-001',
      name: 'Emergency Food Security and Nutrition Program',
      donorId: 'donor-usaid',
      status: 'ACTIVE',
      currency: 'USD',
      totalBudget: 1200000,
      committedAmount: 180000,
      spentAmount: 95000,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      signedDate: new Date('2025-12-15'),
      description: 'Emergency food assistance and nutrition support for conflict-affected populations in Darfur and South Kordofan regions.',
      objectives: 'Provide food security assistance to 50,000 beneficiaries; Deliver nutrition support to 15,000 children under 5; Strengthen community resilience.',
      targetBeneficiaries: 65000,
      coverageArea: 'Darfur, South Kordofan, Blue Nile states',
      reportingRequirements: 'Monthly financial reports; Quarterly narrative reports; Semi-annual donor visits; Annual audit',
      createdById: 'user-admin',
      budgetLines: {
        create: [
          { code: 'USAID-2026-001-S01', description: 'Staff Costs', totalBudget: 240000, committedAmount: 36000, spentAmount: 19000, currency: 'USD' },
          { code: 'USAID-2026-001-T01', description: 'Travel & Transportation', totalBudget: 120000, committedAmount: 18000, spentAmount: 9500, currency: 'USD' },
          { code: 'USAID-2026-001-S02', description: 'Supplies & NFIs', totalBudget: 480000, committedAmount: 72000, spentAmount: 38000, currency: 'USD' },
          { code: 'USAID-2026-001-E01', description: 'Equipment', totalBudget: 180000, committedAmount: 27000, spentAmount: 14250, currency: 'USD' },
          { code: 'USAID-2026-001-I01', description: 'Indirect Costs (7%)', totalBudget: 84000, committedAmount: 12600, spentAmount: 6650, currency: 'USD' },
          { code: 'USAID-2026-001-O01', description: 'Other Direct Costs', totalBudget: 96000, committedAmount: 14400, spentAmount: 7600, currency: 'USD' },
        ],
      },
    },
  });
  console.log(`  ✓ Grant: ${grant1.code}`);

  // ── Sample Grant 2 — UNICEF Active ─────────────────────────────
  const grant2 = await prisma.grant.upsert({
    where: { code: 'UNICEF-2026-001' },
    update: {},
    create: {
      code: 'UNICEF-2026-001',
      name: 'Child Protection and Education Program',
      donorId: 'donor-unicef',
      status: 'ACTIVE',
      currency: 'USD',
      totalBudget: 850000,
      committedAmount: 95000,
      spentAmount: 42000,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2027-01-31'),
      signedDate: new Date('2026-01-20'),
      description: 'Child protection services and access to quality education for vulnerable children.',
      objectives: 'Establish 20 child-friendly spaces; Enroll 10,000 out-of-school children; Train 200 teachers.',
      targetBeneficiaries: 12000,
      coverageArea: 'Khartoum, Kassala states',
      reportingRequirements: 'Monthly progress reports; Quarterly financial reports; Annual programmatic review',
      createdById: 'user-admin',
      budgetLines: {
        create: [
          { code: 'UNICEF-2026-001-S01', description: 'Staff Costs', totalBudget: 250000, committedAmount: 28000, spentAmount: 12400, currency: 'USD' },
          { code: 'UNICEF-2026-001-P01', description: 'Program Activities', totalBudget: 350000, committedAmount: 39200, spentAmount: 17360, currency: 'USD' },
          { code: 'UNICEF-2026-001-S02', description: 'Supplies & Learning Materials', totalBudget: 150000, committedAmount: 16800, spentAmount: 7440, currency: 'USD' },
          { code: 'UNICEF-2026-001-O01', description: 'Overhead (12%)', totalBudget: 100000, committedAmount: 11200, spentAmount: 4960, currency: 'USD' },
        ],
      },
    },
  });
  console.log(`  ✓ Grant: ${grant2.code}`);

  // ── Sample Grant 3 — EU Draft ─────────────────────────────────
  const grant3 = await prisma.grant.upsert({
    where: { code: 'EU-2026-001' },
    update: {},
    create: {
      code: 'EU-2026-001',
      name: 'WASH and Livelihood Recovery Initiative',
      donorId: 'donor-eu',
      status: 'DRAFT',
      currency: 'EUR',
      totalBudget: 2000000,
      committedAmount: 0,
      spentAmount: 0,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2028-05-31'),
      description: 'Water, sanitation, hygiene and livelihood recovery for conflict-affected communities.',
      objectives: 'Provide clean water access to 100,000 people; Construct 500 latrines; Support 5,000 households with livelihood grants.',
      targetBeneficiaries: 100000,
      coverageArea: 'Darfur region',
      reportingRequirements: 'Quarterly financial reports; Bi-annual narrative reports',
      createdById: 'user-admin',
    },
  });
  console.log(`  ✓ Grant: ${grant3.code}`);

  // ── Sample Project for Grant 1 (1:1 mirror of grant) ─────────
  const project1 = await prisma.project.upsert({
    where: { grantId: grant1.id },
    update: {
      code: grant1.code,
      name: grant1.name,
      startDate: grant1.startDate,
      endDate: grant1.endDate,
      budget: grant1.totalBudget,
      targetBeneficiaries: 65000,
      description: grant1.description,
      projectManagerId: 'user-project-mgr',
    },
    create: {
      code: grant1.code,
      name: grant1.name,
      grantId: grant1.id,
      status: 'ACTIVE',
      startDate: grant1.startDate,
      endDate: grant1.endDate,
      budget: grant1.totalBudget,
      committedBudget: 52500,
      spentBudget: 27600,
      targetBeneficiaries: 65000,
      progressPercent: 35,
      description: grant1.description,
      projectManagerId: 'user-project-mgr',
      createdById: 'user-admin',
      milestones: {
        create: [
          { title: 'Beneficiary Registration Complete', dueDate: new Date('2026-02-28'), quarter: 'Q1', budget: 10000, status: 'COMPLETED', completedAt: new Date('2026-02-25') },
          { title: 'First Food Distribution Round', dueDate: new Date('2026-03-31'), quarter: 'Q1', budget: 80000, status: 'COMPLETED', completedAt: new Date('2026-03-28') },
          { title: 'Second Food Distribution Round', dueDate: new Date('2026-04-30'), quarter: 'Q2', budget: 90000, status: 'PENDING' },
          { title: 'Mid-term Review', dueDate: new Date('2026-05-15'), quarter: 'Q2', budget: 5000, status: 'PENDING' },
          { title: 'Final Distribution and Closure', dueDate: new Date('2026-06-30'), quarter: 'Q2', budget: 95000, status: 'PENDING' },
        ],
      },
    },
  });
  console.log(`  ✓ Project: ${project1.code}`);

  // ── Sample Activities for Grant 1 Project ─────────────────────
  const activities = [
    {
      code: 'USAID-2026-001-ACT01',
      name: 'Beneficiary Registration',
      description: 'Register and verify 25,000 beneficiary households across Darfur region.',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-02-28'),
      plannedBudget: 80000,
      progressPercent: 100,
      status: 'COMPLETED' as const,
    },
    {
      code: 'USAID-2026-001-ACT02',
      name: 'Food Distribution Round 1',
      description: 'First monthly food ration distribution to registered beneficiaries.',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
      plannedBudget: 250000,
      progressPercent: 100,
      status: 'COMPLETED' as const,
    },
    {
      code: 'USAID-2026-001-ACT03',
      name: 'Food Distribution Round 2',
      description: 'Second monthly food ration distribution cycle.',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-30'),
      plannedBudget: 280000,
      progressPercent: 45,
      status: 'IN_PROGRESS' as const,
    },
    {
      code: 'USAID-2026-001-ACT04',
      name: 'Nutrition Screening',
      description: 'Screen children under 5 for malnutrition and refer to treatment programs.',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-31'),
      plannedBudget: 350000,
      progressPercent: 0,
      status: 'PLANNING' as const,
    },
    {
      code: 'USAID-2026-001-ACT05',
      name: 'Community Resilience Training',
      description: 'Train community leaders on food security and livelihood resilience.',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-11-30'),
      plannedBudget: 240000,
      progressPercent: 0,
      status: 'PLANNING' as const,
    },
  ];

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: {
        projectId_code: {
          projectId: project1.id,
          code: activity.code,
        },
      },
      update: {},
      create: {
        ...activity,
        projectId: project1.id,
        responsibleUserId: 'user-project-mgr',
        createdById: 'user-admin',
      },
    });
  }
  console.log(`  ✓ ${activities.length} activities for ${project1.code}`);

  // ── Auto-create mirrored projects for Grant 2 & 3 ─────────────
  for (const grant of [grant2, grant3]) {
    await prisma.project.upsert({
      where: { grantId: grant.id },
      update: {
        code: grant.code,
        name: grant.name,
        startDate: grant.startDate,
        endDate: grant.endDate,
        budget: grant.totalBudget,
        targetBeneficiaries: grant.targetBeneficiaries,
        description: grant.description,
      },
      create: {
        code: grant.code,
        name: grant.name,
        grantId: grant.id,
        status: grant.status === 'ACTIVE' ? 'ACTIVE' : 'PLANNING',
        startDate: grant.startDate,
        endDate: grant.endDate,
        budget: grant.totalBudget,
        targetBeneficiaries: grant.targetBeneficiaries,
        description: grant.description,
        createdById: 'user-admin',
      },
    });
  }
  console.log('  ✓ Mirrored projects for UNICEF and EU grants');

  // ── Sample Vendor ─────────────────────────────────────────────
  await prisma.vendor.upsert({
    where: { registrationNumber: 'VND-2026-001' },
    update: {},
    create: {
      registrationNumber: 'VND-2026-001',
      name: 'Al-Nour Trading Company',
      taxNumber: '123456789',
      vendorType: 'SUPPLIER',
      country: 'Sudan',
      city: 'Khartoum',
      email: 'info@alnour-trading.com',
      phone: '+249-912-345-678',
      isBlacklisted: false,
      createdById: 'user-admin',
    },
  });

  await prisma.vendor.upsert({
    where: { registrationNumber: 'VND-2026-002' },
    update: {},
    create: {
      registrationNumber: 'VND-2026-002',
      name: 'Khartoum Supplies International',
      taxNumber: '987654321',
      vendorType: 'SUPPLIER',
      country: 'Sudan',
      city: 'Khartoum',
      email: 'procurement@ksi.com',
      phone: '+249-922-345-678',
      isBlacklisted: false,
      createdById: 'user-admin',
    },
  });
  console.log('  ✓ 2 sample vendors');

  console.log('Grants and sample data seeded successfully.');
}
