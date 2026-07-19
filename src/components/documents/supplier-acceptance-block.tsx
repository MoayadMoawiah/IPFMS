import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface SupplierAcceptanceBlockProps {
  vendorName?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  branchName?: string | null;
  accountNumber?: string | null;
  date?: string | Date | null;
  className?: string;
}

export function SupplierAcceptanceBlock({
  vendorName,
  bankName,
  accountName,
  branchName,
  accountNumber,
  date,
  className,
}: SupplierAcceptanceBlockProps) {
  return (
    <div className={cn("print-supplier border border-black p-3 text-sm", className)}>
      <p className="mb-3 text-sm font-bold underline">Supplier Acceptance / Stamp</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Name:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {vendorName || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Date:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {date ? formatDate(date) : "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <span className="shrink-0 font-medium">Stamp:</span>
          <span className="min-h-[3rem] flex-1 border border-dashed border-black/40" />
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Bank Name:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {bankName || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Account Name:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {accountName || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Branch Name:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {branchName || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Account No:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {accountNumber || "\u00a0"}
          </span>
        </div>
      </div>
    </div>
  );
}
