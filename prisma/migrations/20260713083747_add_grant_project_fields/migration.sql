-- AlterTable
ALTER TABLE "grants" ADD COLUMN     "coverageArea" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "targetBeneficiaries" INTEGER;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "committedBudget" DECIMAL(20,4) NOT NULL DEFAULT 0,
ADD COLUMN     "progressPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "spentBudget" DECIMAL(20,4) NOT NULL DEFAULT 0,
ADD COLUMN     "targetBeneficiaries" INTEGER;
