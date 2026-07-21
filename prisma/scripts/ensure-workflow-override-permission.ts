/**
 * One-off: ensure WORKFLOW:OVERRIDE permission exists (Super Admin only via seed-all / *).
 *
 * Run from backend: npx tsx ../prisma/scripts/ensure-workflow-override-permission.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Use raw SQL so this works even before regenerate picks up the new enum value.
  await prisma.$executeRawUnsafe(`
    INSERT INTO permissions (id, module, action, resource, description, "createdAt")
    SELECT gen_random_uuid()::text, 'WORKFLOW'::"PermissionModule", 'OVERRIDE'::"PermissionAction", NULL, 'WORKFLOW:OVERRIDE', NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM permissions
      WHERE module = 'WORKFLOW' AND action = 'OVERRIDE' AND resource IS NULL
    )
  `);

  const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT id FROM permissions WHERE module = 'WORKFLOW' AND action = 'OVERRIDE' AND resource IS NULL LIMIT 1`,
  );
  const permId = rows[0]?.id;
  if (!permId) throw new Error('Failed to create WORKFLOW:OVERRIDE permission');

  console.log(`  ✓ WORKFLOW:OVERRIDE (${permId})`);

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO role_permissions ("roleId", "permissionId")
    SELECT 'role-super-admin', $1
    WHERE NOT EXISTS (
      SELECT 1 FROM role_permissions
      WHERE "roleId" = 'role-super-admin' AND "permissionId" = $1
    )
  `,
    permId,
  );
  console.log('  ✓ assigned to role-super-admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
