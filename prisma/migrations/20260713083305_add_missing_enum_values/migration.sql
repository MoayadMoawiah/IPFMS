-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionAction" ADD VALUE 'CLOSE';
ALTER TYPE "PermissionAction" ADD VALUE 'MANAGE_BUDGET';
ALTER TYPE "PermissionAction" ADD VALUE 'BLACKLIST';
ALTER TYPE "PermissionAction" ADD VALUE 'ISSUE';
ALTER TYPE "PermissionAction" ADD VALUE 'EVALUATE';
ALTER TYPE "PermissionAction" ADD VALUE 'POST';
ALTER TYPE "PermissionAction" ADD VALUE 'PAY';
ALTER TYPE "PermissionAction" ADD VALUE 'REVERSE';
ALTER TYPE "PermissionAction" ADD VALUE 'RECONCILE';
ALTER TYPE "PermissionAction" ADD VALUE 'ADJUST';
ALTER TYPE "PermissionAction" ADD VALUE 'DEPRECIATE';
ALTER TYPE "PermissionAction" ADD VALUE 'DISPOSE';
ALTER TYPE "PermissionAction" ADD VALUE 'ACTIVATE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionModule" ADD VALUE 'DONORS';
ALTER TYPE "PermissionModule" ADD VALUE 'PURCHASE_REQUISITIONS';
ALTER TYPE "PermissionModule" ADD VALUE 'FIXED_ASSETS';
ALTER TYPE "PermissionModule" ADD VALUE 'DONOR_PORTAL';
