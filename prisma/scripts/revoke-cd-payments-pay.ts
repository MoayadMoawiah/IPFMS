/**
 * One-off: Mark paid (PAYMENTS:PAY) is finance-only.
 * - Remove from Country Director
 * - Ensure Finance Manager + Finance Officer have it
 *
 * Run from backend: npx tsx ../prisma/scripts/revoke-cd-payments-pay.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const payPerm = await prisma.permission.findFirst({
    where: { module: 'PAYMENTS', action: 'PAY', resource: null },
  });
  if (!payPerm) {
    throw new Error('PAYMENTS:PAY permission not found — run seed first');
  }

  const removed = await prisma.rolePermission.deleteMany({
    where: { roleId: 'role-country-director', permissionId: payPerm.id },
  });
  console.log(`  ✓ Removed PAYMENTS:PAY from Country Director (${removed.count})`);

  for (const roleId of ['role-finance-manager', 'role-finance-officer'] as const) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId, permissionId: payPerm.id },
      },
      update: {},
      create: { roleId, permissionId: payPerm.id },
    });
    console.log(`  ✓ Ensured PAYMENTS:PAY on ${roleId}`);
  }

  const holders = await prisma.rolePermission.findMany({
    where: { permissionId: payPerm.id },
    include: { role: { select: { id: true, name: true } } },
  });
  console.log(
    '  Current PAYMENTS:PAY holders:',
    holders.map((h) => h.role.name).join(', ') || '(none)',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
