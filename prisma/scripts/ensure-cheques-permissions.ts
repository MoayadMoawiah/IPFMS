/**
 * One-off: ensure CHEQUES (+ BANK_TRANSFERS) permissions exist and are assigned.
 *
 * Run from backend: npx tsx ../prisma/scripts/ensure-cheques-permissions.ts
 */
import { PrismaClient, PermissionAction, PermissionModule } from '@prisma/client';

const prisma = new PrismaClient();

const PERMS: Array<{ module: PermissionModule; action: PermissionAction }> = [
  { module: 'CHEQUES', action: 'READ' },
  { module: 'CHEQUES', action: 'UPDATE' },
  { module: 'BANK_TRANSFERS', action: 'READ' },
  { module: 'BANK_TRANSFERS', action: 'UPDATE' },
];

const ROLE_KEYS: Record<string, string[]> = {
  'role-country-director': ['CHEQUES:READ', 'BANK_TRANSFERS:READ'],
  'role-finance-manager': [
    'CHEQUES:READ',
    'CHEQUES:UPDATE',
    'BANK_TRANSFERS:READ',
    'BANK_TRANSFERS:UPDATE',
  ],
  'role-finance-officer': [
    'CHEQUES:READ',
    'CHEQUES:UPDATE',
    'BANK_TRANSFERS:READ',
    'BANK_TRANSFERS:UPDATE',
  ],
  'role-super-admin': [
    'CHEQUES:READ',
    'CHEQUES:UPDATE',
    'BANK_TRANSFERS:READ',
    'BANK_TRANSFERS:UPDATE',
  ],
};

async function ensurePermission(module: PermissionModule, action: PermissionAction) {
  const key = `${module}:${action}`;
  const existing = await prisma.permission.findFirst({
    where: { module, action, resource: null },
  });
  if (existing) return { key, id: existing.id };

  const created = await prisma.permission.create({
    data: { module, action, resource: null, description: key },
  });
  return { key, id: created.id };
}

async function main() {
  const byKey = new Map<string, string>();

  for (const perm of PERMS) {
    const { key, id } = await ensurePermission(perm.module, perm.action);
    byKey.set(key, id);
    console.log(`  ✓ permission ${key}`);
  }

  for (const [roleId, keys] of Object.entries(ROLE_KEYS)) {
    for (const key of keys) {
      const permissionId = byKey.get(key);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
    }
    console.log(`  ✓ assigned to ${roleId}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
