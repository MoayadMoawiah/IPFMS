import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const ROLES = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system access — all modules, all actions',
    isSystem: true,
  },
  {
    id: 'role-country-director',
    name: 'Country Director',
    description: 'Final approval authority for all documents',
    isSystem: true,
  },
  {
    id: 'role-finance-manager',
    name: 'Finance Manager',
    description: 'Manages finance, accounting, payments, bank reconciliation',
    isSystem: true,
  },
  {
    id: 'role-finance-officer',
    name: 'Finance Officer',
    description: 'Creates and processes financial documents',
    isSystem: true,
  },
  {
    id: 'role-procurement-manager',
    name: 'Procurement Manager',
    description: 'Manages full procurement cycle',
    isSystem: true,
  },
  {
    id: 'role-procurement-officer',
    name: 'Procurement Officer',
    description: 'Creates and processes procurement documents',
    isSystem: true,
  },
  {
    id: 'role-project-manager',
    name: 'Project Manager',
    description: 'Manages assigned projects, activities, and budgets',
    isSystem: true,
  },
  {
    id: 'role-department-head',
    name: 'Department Head',
    description: 'Approves department-level documents',
    isSystem: true,
  },
  {
    id: 'role-auditor',
    name: 'Internal Auditor',
    description: 'Read-only access to all modules, full audit trail',
    isSystem: true,
  },
  {
    id: 'role-donor',
    name: 'Donor',
    description: 'Read-only access to donor portal for own grants',
    isSystem: true,
  },
  {
    id: 'role-staff',
    name: 'Staff',
    description: 'Can raise purchase requisitions and view own documents',
    isSystem: true,
  },
  {
    id: 'role-warehouse-manager',
    name: 'Warehouse Manager',
    description: 'Manages inventory and stock movements',
    isSystem: true,
  },
  {
    id: 'role-asset-manager',
    name: 'Asset Manager',
    description: 'Manages fixed assets, depreciation, disposals',
    isSystem: true,
  },
];

// Comprehensive permission set — MODULE:ACTION[:RESOURCE]
const PERMISSIONS = [
  // ── GRANTS ────────────────────────────────────────────
  { module: 'GRANTS', action: 'CREATE', resource: null },
  { module: 'GRANTS', action: 'READ', resource: null },
  { module: 'GRANTS', action: 'UPDATE', resource: null },
  { module: 'GRANTS', action: 'DELETE', resource: null },
  { module: 'GRANTS', action: 'APPROVE', resource: null },
  { module: 'GRANTS', action: 'SUBMIT', resource: null },
  { module: 'GRANTS', action: 'CLOSE', resource: null },
  { module: 'GRANTS', action: 'EXPORT', resource: null },
  { module: 'GRANTS', action: 'IMPORT', resource: null },
  { module: 'GRANTS', action: 'MANAGE_BUDGET', resource: null },

  // ── DONORS ────────────────────────────────────────────
  { module: 'DONORS', action: 'CREATE', resource: null },
  { module: 'DONORS', action: 'READ', resource: null },
  { module: 'DONORS', action: 'UPDATE', resource: null },
  { module: 'DONORS', action: 'DELETE', resource: null },

  // ── PROJECTS ─────────────────────────────────────────
  { module: 'PROJECTS', action: 'CREATE', resource: null },
  { module: 'PROJECTS', action: 'READ', resource: null },
  { module: 'PROJECTS', action: 'UPDATE', resource: null },
  { module: 'PROJECTS', action: 'DELETE', resource: null },
  { module: 'PROJECTS', action: 'APPROVE', resource: null },

  // ── ACTIVITIES ────────────────────────────────────────
  { module: 'ACTIVITIES', action: 'CREATE', resource: null },
  { module: 'ACTIVITIES', action: 'READ', resource: null },
  { module: 'ACTIVITIES', action: 'UPDATE', resource: null },
  { module: 'ACTIVITIES', action: 'DELETE', resource: null },

  // ── PROCUREMENT ──────────────────────────────────────
  { module: 'PROCUREMENT', action: 'CREATE', resource: null },
  { module: 'PROCUREMENT', action: 'READ', resource: null },
  { module: 'PROCUREMENT', action: 'UPDATE', resource: null },
  { module: 'PROCUREMENT', action: 'DELETE', resource: null },
  { module: 'PROCUREMENT', action: 'APPROVE', resource: null },
  { module: 'PROCUREMENT', action: 'EXPORT', resource: null },

  // ── VENDORS ─────────────────────────────────────────
  { module: 'VENDORS', action: 'CREATE', resource: null },
  { module: 'VENDORS', action: 'READ', resource: null },
  { module: 'VENDORS', action: 'UPDATE', resource: null },
  { module: 'VENDORS', action: 'DELETE', resource: null },
  { module: 'VENDORS', action: 'BLACKLIST', resource: null },

  // ── PURCHASE_REQUISITIONS ─────────────────────────────
  { module: 'PURCHASE_REQUISITIONS', action: 'CREATE', resource: null },
  { module: 'PURCHASE_REQUISITIONS', action: 'READ', resource: null },
  { module: 'PURCHASE_REQUISITIONS', action: 'UPDATE', resource: null },
  { module: 'PURCHASE_REQUISITIONS', action: 'DELETE', resource: null },
  { module: 'PURCHASE_REQUISITIONS', action: 'SUBMIT', resource: null },
  { module: 'PURCHASE_REQUISITIONS', action: 'APPROVE', resource: null },

  // ── PURCHASE_ORDERS ───────────────────────────────────
  { module: 'PURCHASE_ORDERS', action: 'CREATE', resource: null },
  { module: 'PURCHASE_ORDERS', action: 'READ', resource: null },
  { module: 'PURCHASE_ORDERS', action: 'UPDATE', resource: null },
  { module: 'PURCHASE_ORDERS', action: 'DELETE', resource: null },
  { module: 'PURCHASE_ORDERS', action: 'SUBMIT', resource: null },
  { module: 'PURCHASE_ORDERS', action: 'APPROVE', resource: null },
  { module: 'PURCHASE_ORDERS', action: 'ISSUE', resource: null },

  // ── GOODS_RECEIPTS ────────────────────────────────────
  { module: 'GOODS_RECEIPTS', action: 'CREATE', resource: null },
  { module: 'GOODS_RECEIPTS', action: 'READ', resource: null },
  { module: 'GOODS_RECEIPTS', action: 'UPDATE', resource: null },
  { module: 'GOODS_RECEIPTS', action: 'SUBMIT', resource: null },
  { module: 'GOODS_RECEIPTS', action: 'APPROVE', resource: null },
  { module: 'GOODS_RECEIPTS', action: 'DELETE', resource: null },

  // ── INVOICES (vendor invoices) ─────────────────────────
  { module: 'INVOICES', action: 'CREATE', resource: null },
  { module: 'INVOICES', action: 'READ', resource: null },
  { module: 'INVOICES', action: 'UPDATE', resource: null },
  { module: 'INVOICES', action: 'SUBMIT', resource: null },
  { module: 'INVOICES', action: 'APPROVE', resource: null },
  { module: 'INVOICES', action: 'DELETE', resource: null },

  // ── CONTRACTS ─────────────────────────────────────────
  { module: 'CONTRACTS', action: 'CREATE', resource: null },
  { module: 'CONTRACTS', action: 'READ', resource: null },
  { module: 'CONTRACTS', action: 'UPDATE', resource: null },
  { module: 'CONTRACTS', action: 'DELETE', resource: null },
  { module: 'CONTRACTS', action: 'APPROVE', resource: null },

  // ── RFQ ──────────────────────────────────────────────
  { module: 'RFQ', action: 'CREATE', resource: null },
  { module: 'RFQ', action: 'READ', resource: null },
  { module: 'RFQ', action: 'UPDATE', resource: null },
  { module: 'RFQ', action: 'EVALUATE', resource: null },
  { module: 'RFQ', action: 'APPROVE', resource: null },

  // ── FINANCE ─────────────────────────────────────────
  { module: 'FINANCE', action: 'CREATE', resource: null },
  { module: 'FINANCE', action: 'READ', resource: null },
  { module: 'FINANCE', action: 'UPDATE', resource: null },
  { module: 'FINANCE', action: 'DELETE', resource: null },
  { module: 'FINANCE', action: 'APPROVE', resource: null },
  { module: 'FINANCE', action: 'POST', resource: null },
  { module: 'FINANCE', action: 'EXPORT', resource: null },

  // ── PAYMENTS ─────────────────────────────────────────
  { module: 'PAYMENTS', action: 'CREATE', resource: null },
  { module: 'PAYMENTS', action: 'READ', resource: null },
  { module: 'PAYMENTS', action: 'UPDATE', resource: null },
  { module: 'PAYMENTS', action: 'SUBMIT', resource: null },
  { module: 'PAYMENTS', action: 'APPROVE', resource: null },
  { module: 'PAYMENTS', action: 'PAY', resource: null },

  // ── CHEQUES ──────────────────────────────────────────
  { module: 'CHEQUES', action: 'READ', resource: null },
  { module: 'CHEQUES', action: 'UPDATE', resource: null },

  // ── BANK_TRANSFERS ───────────────────────────────────
  { module: 'BANK_TRANSFERS', action: 'READ', resource: null },
  { module: 'BANK_TRANSFERS', action: 'UPDATE', resource: null },

  // ── CHART_OF_ACCOUNTS ────────────────────────────────
  { module: 'CHART_OF_ACCOUNTS', action: 'CREATE', resource: null },
  { module: 'CHART_OF_ACCOUNTS', action: 'READ', resource: null },
  { module: 'CHART_OF_ACCOUNTS', action: 'UPDATE', resource: null },

  // ── JOURNAL_ENTRIES ──────────────────────────────────
  { module: 'JOURNAL_ENTRIES', action: 'CREATE', resource: null },
  { module: 'JOURNAL_ENTRIES', action: 'READ', resource: null },
  { module: 'JOURNAL_ENTRIES', action: 'POST', resource: null },
  { module: 'JOURNAL_ENTRIES', action: 'REVERSE', resource: null },

  // ── BANK_ACCOUNTS ────────────────────────────────────
  { module: 'BANK_ACCOUNTS', action: 'CREATE', resource: null },
  { module: 'BANK_ACCOUNTS', action: 'READ', resource: null },
  { module: 'BANK_ACCOUNTS', action: 'RECONCILE', resource: null },

  // ── INVENTORY ────────────────────────────────────────
  { module: 'INVENTORY', action: 'CREATE', resource: null },
  { module: 'INVENTORY', action: 'READ', resource: null },
  { module: 'INVENTORY', action: 'UPDATE', resource: null },
  { module: 'INVENTORY', action: 'DELETE', resource: null },
  { module: 'INVENTORY', action: 'ADJUST', resource: null },

  // ── FIXED_ASSETS ─────────────────────────────────────
  { module: 'FIXED_ASSETS', action: 'CREATE', resource: null },
  { module: 'FIXED_ASSETS', action: 'READ', resource: null },
  { module: 'FIXED_ASSETS', action: 'UPDATE', resource: null },
  { module: 'FIXED_ASSETS', action: 'DELETE', resource: null },
  { module: 'FIXED_ASSETS', action: 'DEPRECIATE', resource: null },
  { module: 'FIXED_ASSETS', action: 'DISPOSE', resource: null },

  // ── WORKFLOW ──────────────────────────────────────────
  { module: 'WORKFLOW', action: 'READ', resource: null },
  { module: 'WORKFLOW', action: 'APPROVE', resource: null },
  { module: 'WORKFLOW', action: 'CONFIGURE', resource: null },
  { module: 'WORKFLOW', action: 'DELEGATE', resource: null },
  { module: 'WORKFLOW', action: 'OVERRIDE', resource: null },

  // ── USERS ────────────────────────────────────────────
  { module: 'USERS', action: 'CREATE', resource: null },
  { module: 'USERS', action: 'READ', resource: null },
  { module: 'USERS', action: 'UPDATE', resource: null },
  { module: 'USERS', action: 'DELETE', resource: null },
  { module: 'USERS', action: 'ACTIVATE', resource: null },

  // ── ROLES ────────────────────────────────────────────
  { module: 'ROLES', action: 'CREATE', resource: null },
  { module: 'ROLES', action: 'READ', resource: null },
  { module: 'ROLES', action: 'UPDATE', resource: null },
  { module: 'ROLES', action: 'DELETE', resource: null },

  // ── AUDIT ────────────────────────────────────────────
  { module: 'AUDIT', action: 'READ', resource: null },
  { module: 'AUDIT', action: 'EXPORT', resource: null },

  // ── REPORTS ──────────────────────────────────────────
  { module: 'REPORTS', action: 'READ', resource: null },
  { module: 'REPORTS', action: 'EXPORT', resource: null },

  // ── SETTINGS ─────────────────────────────────────────
  { module: 'SETTINGS', action: 'READ', resource: null },
  { module: 'SETTINGS', action: 'UPDATE', resource: null },

  // ── DONOR_PORTAL ─────────────────────────────────────
  { module: 'DONOR_PORTAL', action: 'READ', resource: null },
];

// Role → Permission mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'role-super-admin': ['*'], // All permissions — handled specially
  'role-country-director': [
    'GRANTS:READ', 'GRANTS:APPROVE', 'GRANTS:CLOSE', 'GRANTS:EXPORT',
    'DONORS:READ',
    'PROJECTS:READ', 'PROJECTS:APPROVE',
    'ACTIVITIES:READ',
    'PROCUREMENT:READ', 'PROCUREMENT:APPROVE', 'PROCUREMENT:EXPORT',
    'VENDORS:READ',
    'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:APPROVE',
    'PURCHASE_ORDERS:READ', 'PURCHASE_ORDERS:APPROVE', 'PURCHASE_ORDERS:ISSUE',
    'GOODS_RECEIPTS:READ', 'GOODS_RECEIPTS:APPROVE',
    'CONTRACTS:READ', 'CONTRACTS:APPROVE',
    'RFQ:READ',
    'FINANCE:READ', 'FINANCE:APPROVE', 'FINANCE:EXPORT',
    // Approve/authorize only — Mark paid is finance execution (PAYMENTS:PAY)
    'PAYMENTS:READ', 'PAYMENTS:APPROVE',
    'CHEQUES:READ',
    'BANK_TRANSFERS:READ',
    'CHART_OF_ACCOUNTS:READ',
    'JOURNAL_ENTRIES:READ',
    'BANK_ACCOUNTS:READ',
    'INVENTORY:READ',
    'FIXED_ASSETS:READ',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE', 'WORKFLOW:DELEGATE',
    'USERS:READ',
    'AUDIT:READ',
    'REPORTS:READ', 'REPORTS:EXPORT',
    'SETTINGS:READ',
  ],
  'role-finance-manager': [
    'GRANTS:READ', 'GRANTS:MANAGE_BUDGET', 'GRANTS:EXPORT',
    'DONORS:READ',
    'PROJECTS:READ', 'ACTIVITIES:READ',
    'PROCUREMENT:READ',
    'PURCHASE_REQUISITIONS:READ',
    'PURCHASE_ORDERS:READ', 'PURCHASE_ORDERS:APPROVE',
    'GOODS_RECEIPTS:READ',
    'INVOICES:READ', 'INVOICES:APPROVE',
    'CONTRACTS:READ',
    'RFQ:READ',
    'FINANCE:CREATE', 'FINANCE:READ', 'FINANCE:UPDATE', 'FINANCE:APPROVE', 'FINANCE:POST', 'FINANCE:EXPORT',
    'PAYMENTS:CREATE', 'PAYMENTS:READ', 'PAYMENTS:UPDATE', 'PAYMENTS:SUBMIT', 'PAYMENTS:APPROVE', 'PAYMENTS:PAY',
    'CHEQUES:READ', 'CHEQUES:UPDATE',
    'BANK_TRANSFERS:READ', 'BANK_TRANSFERS:UPDATE',
    'CHART_OF_ACCOUNTS:CREATE', 'CHART_OF_ACCOUNTS:READ', 'CHART_OF_ACCOUNTS:UPDATE',
    'JOURNAL_ENTRIES:CREATE', 'JOURNAL_ENTRIES:READ', 'JOURNAL_ENTRIES:POST', 'JOURNAL_ENTRIES:REVERSE',
    'BANK_ACCOUNTS:CREATE', 'BANK_ACCOUNTS:READ', 'BANK_ACCOUNTS:RECONCILE',
    'INVENTORY:READ',
    'FIXED_ASSETS:READ', 'FIXED_ASSETS:DEPRECIATE',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
    'USERS:READ',
    'AUDIT:READ', 'AUDIT:EXPORT',
    'REPORTS:READ', 'REPORTS:EXPORT',
    'SETTINGS:READ',
  ],
  'role-finance-officer': [
    'GRANTS:READ',
    'PROJECTS:READ', 'ACTIVITIES:READ',
    'PROCUREMENT:READ',
    'PURCHASE_ORDERS:READ', 'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:APPROVE',
    'RFQ:READ',
    'INVOICES:READ',
    'FINANCE:CREATE', 'FINANCE:READ', 'FINANCE:UPDATE',
    'PAYMENTS:CREATE', 'PAYMENTS:READ', 'PAYMENTS:UPDATE', 'PAYMENTS:SUBMIT', 'PAYMENTS:PAY',
    'CHEQUES:READ', 'CHEQUES:UPDATE',
    'BANK_TRANSFERS:READ', 'BANK_TRANSFERS:UPDATE',
    'CHART_OF_ACCOUNTS:READ',
    'JOURNAL_ENTRIES:CREATE', 'JOURNAL_ENTRIES:READ',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
    'BANK_ACCOUNTS:READ',
    'REPORTS:READ',
  ],
  'role-procurement-manager': [
    'GRANTS:READ',
    'PROJECTS:READ', 'ACTIVITIES:READ',
    'PROCUREMENT:CREATE', 'PROCUREMENT:READ', 'PROCUREMENT:UPDATE', 'PROCUREMENT:APPROVE', 'PROCUREMENT:EXPORT',
    'VENDORS:CREATE', 'VENDORS:READ', 'VENDORS:UPDATE', 'VENDORS:BLACKLIST',
    'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:APPROVE',
    'PURCHASE_ORDERS:CREATE', 'PURCHASE_ORDERS:READ', 'PURCHASE_ORDERS:UPDATE', 'PURCHASE_ORDERS:SUBMIT', 'PURCHASE_ORDERS:APPROVE', 'PURCHASE_ORDERS:ISSUE',
    'GOODS_RECEIPTS:CREATE', 'GOODS_RECEIPTS:READ', 'GOODS_RECEIPTS:UPDATE', 'GOODS_RECEIPTS:SUBMIT', 'GOODS_RECEIPTS:APPROVE', 'GOODS_RECEIPTS:DELETE',
    'INVOICES:CREATE', 'INVOICES:READ', 'INVOICES:UPDATE', 'INVOICES:SUBMIT', 'INVOICES:APPROVE', 'INVOICES:DELETE',
    'CONTRACTS:CREATE', 'CONTRACTS:READ', 'CONTRACTS:UPDATE', 'CONTRACTS:APPROVE',
    'RFQ:CREATE', 'RFQ:READ', 'RFQ:UPDATE', 'RFQ:EVALUATE', 'RFQ:APPROVE',
    'INVENTORY:CREATE', 'INVENTORY:READ', 'INVENTORY:UPDATE', 'INVENTORY:ADJUST',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
    'REPORTS:READ',
  ],
  'role-procurement-officer': [
    'GRANTS:READ',
    'PROCUREMENT:CREATE', 'PROCUREMENT:READ', 'PROCUREMENT:UPDATE',
    'VENDORS:READ',
    'PURCHASE_REQUISITIONS:CREATE', 'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:UPDATE', 'PURCHASE_REQUISITIONS:SUBMIT', 'PURCHASE_REQUISITIONS:APPROVE',
    'PURCHASE_ORDERS:CREATE', 'PURCHASE_ORDERS:READ', 'PURCHASE_ORDERS:UPDATE', 'PURCHASE_ORDERS:SUBMIT',
    'GOODS_RECEIPTS:CREATE', 'GOODS_RECEIPTS:READ', 'GOODS_RECEIPTS:UPDATE', 'GOODS_RECEIPTS:SUBMIT', 'GOODS_RECEIPTS:APPROVE',
    'INVOICES:CREATE', 'INVOICES:READ', 'INVOICES:UPDATE', 'INVOICES:SUBMIT', 'INVOICES:APPROVE',
    'CONTRACTS:READ',
    'RFQ:CREATE', 'RFQ:READ', 'RFQ:UPDATE',
    'INVENTORY:CREATE', 'INVENTORY:READ', 'INVENTORY:UPDATE',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
    'REPORTS:READ',
  ],
  'role-project-manager': [
    'GRANTS:READ', 'GRANTS:APPROVE',
    'DONORS:READ',
    'PROJECTS:CREATE', 'PROJECTS:READ', 'PROJECTS:UPDATE',
    'ACTIVITIES:CREATE', 'ACTIVITIES:READ', 'ACTIVITIES:UPDATE',
    'PURCHASE_REQUISITIONS:CREATE', 'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:SUBMIT',
    'PURCHASE_ORDERS:READ',
    'GOODS_RECEIPTS:READ',
    'CONTRACTS:READ',
    'RFQ:READ',
    'FINANCE:READ',
    'PAYMENTS:READ',
    'INVENTORY:READ',
    'FIXED_ASSETS:READ',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
    'REPORTS:READ',
  ],
  'role-department-head': [
    'GRANTS:READ',
    'PROJECTS:READ', 'ACTIVITIES:READ',
    'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:APPROVE',
    'PURCHASE_ORDERS:READ',
    'GOODS_RECEIPTS:READ', 'GOODS_RECEIPTS:APPROVE',
    'RFQ:READ',
    'FINANCE:READ',
    'PAYMENTS:READ',
    'INVENTORY:READ',
    'FIXED_ASSETS:READ',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
  ],
  'role-auditor': [
    'GRANTS:READ', 'GRANTS:EXPORT',
    'DONORS:READ',
    'PROJECTS:READ', 'ACTIVITIES:READ',
    'PROCUREMENT:READ', 'PROCUREMENT:EXPORT',
    'VENDORS:READ',
    'PURCHASE_REQUISITIONS:READ',
    'PURCHASE_ORDERS:READ',
    'GOODS_RECEIPTS:READ',
    'CONTRACTS:READ',
    'RFQ:READ',
    'FINANCE:READ', 'FINANCE:EXPORT',
    'PAYMENTS:READ', 'PAYMENTS:APPROVE',
    'CHART_OF_ACCOUNTS:READ',
    'JOURNAL_ENTRIES:READ',
    'BANK_ACCOUNTS:READ',
    'INVENTORY:READ',
    'FIXED_ASSETS:READ',
    'WORKFLOW:READ', 'WORKFLOW:APPROVE',
    'USERS:READ',
    'AUDIT:READ', 'AUDIT:EXPORT',
    'REPORTS:READ', 'REPORTS:EXPORT',
  ],
  'role-donor': [
    'DONOR_PORTAL:READ',
    'GRANTS:READ',
    'PROJECTS:READ',
    'REPORTS:READ',
  ],
  'role-staff': [
    'PURCHASE_REQUISITIONS:CREATE', 'PURCHASE_REQUISITIONS:READ', 'PURCHASE_REQUISITIONS:SUBMIT',
    'RFQ:READ',
    'INVENTORY:READ',
    'WORKFLOW:READ',
  ],
  'role-warehouse-manager': [
    'INVENTORY:CREATE', 'INVENTORY:READ', 'INVENTORY:UPDATE', 'INVENTORY:ADJUST',
    'GOODS_RECEIPTS:CREATE', 'GOODS_RECEIPTS:READ', 'GOODS_RECEIPTS:UPDATE', 'GOODS_RECEIPTS:SUBMIT',
    'PURCHASE_ORDERS:READ',
    'RFQ:READ',
    'WORKFLOW:READ',
  ],
  'role-asset-manager': [
    'FIXED_ASSETS:CREATE', 'FIXED_ASSETS:READ', 'FIXED_ASSETS:UPDATE', 'FIXED_ASSETS:DEPRECIATE', 'FIXED_ASSETS:DISPOSE',
    'INVENTORY:READ',
    'WORKFLOW:READ',
    'REPORTS:READ',
  ],
};

export async function seedUsers() {
  console.log('Seeding roles and permissions...');

  // ── Roles ────────────────────────────────────────────
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }
  console.log(`  ✓ ${ROLES.length} roles`);

  // ── Permissions ────────────────────────────────────────
  const createdPermissions: Map<string, string> = new Map();
  for (const perm of PERMISSIONS) {
    const key = `${perm.module}:${perm.action}`;
    const created = await prisma.permission.upsert({
      where: { module_action_resource: { module: perm.module, action: perm.action, resource: perm.resource || '' } },
      update: {},
      create: { module: perm.module, action: perm.action, resource: perm.resource, description: key },
    });
    createdPermissions.set(key, created.id);
  }
  console.log(`  ✓ ${PERMISSIONS.length} permissions`);

  // ── Role → Permission assignments ─────────────────────
  // Super Admin gets all permissions
  const allPermissionIds = Array.from(createdPermissions.values());
  const superAdminPerms = allPermissionIds.map((permId) => ({
    roleId: 'role-super-admin',
    permissionId: permId,
  }));

  await prisma.rolePermission.deleteMany({ where: { roleId: 'role-super-admin' } });
  await prisma.rolePermission.createMany({ data: superAdminPerms, skipDuplicates: true });
  console.log(`  ✓ Super Admin: ${superAdminPerms.length} permissions`);

  for (const [roleId, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    if (roleId === 'role-super-admin') continue;

    await prisma.rolePermission.deleteMany({ where: { roleId } });
    const assignments = permKeys
      .map((key) => {
        const permId = createdPermissions.get(key);
        return permId ? { roleId, permissionId: permId } : null;
      })
      .filter(Boolean) as { roleId: string; permissionId: string }[];

    if (assignments.length) {
      await prisma.rolePermission.createMany({ data: assignments, skipDuplicates: true });
    }
    console.log(`  ✓ ${roleId}: ${assignments.length} permissions`);
  }

  // ── Admin User ──────────────────────────────────────────
  const hashedPassword = await argon2.hash('Admin@Gaderon2026!');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gaderon.org' },
    update: {},
    create: {
      id: 'user-admin',
      email: 'admin@gaderon.org',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      isEmailVerified: true,
      departmentId: 'dept-admin',
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: 'role-super-admin' } },
    update: {},
    create: { userId: adminUser.id, roleId: 'role-super-admin' },
  });
  console.log('  ✓ Admin user: admin@gaderon.org / Admin@Gaderon2026!');

  // ── Demo Users ─────────────────────────────────────────
  const demoUsers = [
    {
      id: 'user-finance-mgr',
      email: 'finance@gaderon.org',
      username: 'finance_mgr',
      firstName: 'Sarah',
      lastName: 'Ahmed',
      departmentId: 'dept-finance',
      roleId: 'role-finance-manager',
    },
    {
      id: 'user-procurement-mgr',
      email: 'procurement@gaderon.org',
      username: 'proc_mgr',
      firstName: 'Omar',
      lastName: 'Hassan',
      departmentId: 'dept-procurement',
      roleId: 'role-procurement-manager',
    },
    {
      id: 'user-project-mgr',
      email: 'projects@gaderon.org',
      username: 'proj_mgr',
      firstName: 'Fatima',
      lastName: 'Ali',
      departmentId: 'dept-programs',
      roleId: 'role-project-manager',
    },
    {
      id: 'user-auditor',
      email: 'auditor@gaderon.org',
      username: 'int_auditor',
      firstName: 'Kamal',
      lastName: 'Ibrahim',
      departmentId: 'dept-admin',
      roleId: 'role-auditor',
    },
    {
      id: 'user-dept-head',
      email: 'depthead@gaderon.org',
      username: 'dept_head',
      firstName: 'Nadia',
      lastName: 'Farouk',
      departmentId: 'dept-programs',
      roleId: 'role-department-head',
    },
    {
      id: 'user-procurement-officer',
      email: 'proc.officer@gaderon.org',
      username: 'proc_officer',
      firstName: 'Ahmed',
      lastName: 'Saleh',
      departmentId: 'dept-procurement',
      roleId: 'role-procurement-officer',
    },
    {
      id: 'user-finance-officer',
      email: 'finance.officer@gaderon.org',
      username: 'finance_officer',
      firstName: 'Sarah',
      lastName: 'Al-Hassan',
      departmentId: 'dept-finance',
      roleId: 'role-finance-officer',
    },
    {
      id: 'user-country-director',
      email: 'director@gaderon.org',
      username: 'country_director',
      firstName: 'Dr. Omar',
      lastName: 'Khalil',
      departmentId: 'dept-admin',
      roleId: 'role-country-director',
    },
  ];

  const demoPassword = await argon2.hash('Demo@Gaderon2026!');
  for (const user of demoUsers) {
    const { roleId, ...userData } = user;
    const { username: _username, ...userDataClean } = userData as typeof userData & { username?: string };
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...userDataClean, passwordHash: demoPassword, isActive: true, isEmailVerified: true },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: created.id, roleId } },
      update: {},
      create: { userId: created.id, roleId },
    });
  }
  console.log(`  ✓ ${demoUsers.length} demo users`);

  console.log('Users, roles, and permissions seeded successfully.');
}
