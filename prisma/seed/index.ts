import { PrismaClient } from '@prisma/client';
import { seedLookupData } from './lookup-data';
import { seedUsers } from './users';
import { seedGrants } from './grants';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 Starting Gaderon G-GPFMS database seed...\n');

  try {
    // Order matters: lookup data first, then users, then business data
    await seedLookupData();
    await seedUsers();
    await seedGrants();

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Admin credentials:');
    console.log('  Email: admin@gaderon.org');
    console.log('  Password: Admin@Gaderon2026!\n');
    console.log('Demo user credentials (all use: Demo@Gaderon2026!):');
    console.log('  finance@gaderon.org — Finance Manager');
    console.log('  procurement@gaderon.org — Procurement Manager');
    console.log('  projects@gaderon.org — Project Manager');
    console.log('  auditor@gaderon.org — Internal Auditor');
    console.log('  depthead@gaderon.org — Department Head (PR step 1)');
    console.log('  proc.officer@gaderon.org — Procurement Officer (PR step 2)');
    console.log('  finance.officer@gaderon.org — Finance Officer (PR step 3)');
    console.log('  director@gaderon.org — Country Director (PR step 4)\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
