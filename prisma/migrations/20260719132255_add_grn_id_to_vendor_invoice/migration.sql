-- AlterTable
ALTER TABLE "vendor_invoices" ADD COLUMN     "grnId" TEXT;

-- CreateIndex
CREATE INDEX "vendor_invoices_grnId_idx" ON "vendor_invoices"("grnId");

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "goods_receipts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
