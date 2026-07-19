import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const perm = await prisma.permission.findFirst({
    where: { module: 'PURCHASE_ORDERS', action: 'APPROVE' },
  });
  if (!perm) {
    throw new Error('PURCHASE_ORDERS:APPROVE permission not found');
  }

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: 'role-finance-manager',
        permissionId: perm.id,
      },
    },
    create: { roleId: 'role-finance-manager', permissionId: perm.id },
    update: {},
  });

  console.log('Granted PURCHASE_ORDERS:APPROVE to Finance Manager', perm.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
