"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { AlertCircle, PackageCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { useGoodsReceipts } from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatDate } from "@/lib/formatters";

interface GrnRow {
  id: string;
  serialNumber: string;
  status: string;
  receiptDate: string;
  grant?: { code?: string } | null;
  receivedBy?: { firstName?: string; lastName?: string } | null;
}

const columns: ColumnDef<GrnRow>[] = [
  {
    accessorKey: "serialNumber",
    header: "GRN Number",
    cell: ({ row }) => (
      <Link
        href={`/procurement/goods-receipt/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.serialNumber}
      </Link>
    ),
  },
  {
    accessorKey: "grant",
    header: "Grant",
    cell: ({ row }) => row.original.grant?.code ?? "—",
  },
  {
    accessorKey: "receiptDate",
    header: "Receipt Date",
    cell: ({ row }) => formatDate(row.original.receiptDate),
  },
  {
    id: "receivedBy",
    header: "Received By",
    cell: ({ row }) => {
      const u = row.original.receivedBy;
      return u ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—" : "—";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} />,
  },
];

export default function GoodsReceiptPage() {
  const { data, isLoading, isError } = useGoodsReceipts({ limit: 50 });
  const rows = getPaginatedItems(data) as GrnRow[];

  return (
    <div>
      <PageHeader
        title="Goods Receipt"
        description="Record warehouse receipts against issued POs (procurement)"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Procurement" },
          { label: "Goods Receipt" },
        ]}
        actions={
          <PermissionGate permission="GOODS_RECEIPTS:CREATE">
            <Button asChild>
              <Link href="/procurement/goods-receipt/new">
                <Plus className="h-4 w-4" />
                New GRN
              </Link>
            </Button>
          </PermissionGate>
        }
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load goods receipts.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <PackageCheck className="h-8 w-8" />
              <p className="text-sm">No goods receipts yet.</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={rows}
              searchKey="serialNumber"
              searchPlaceholder="Search GRNs..."
            />
          )}
        </>
      )}
    </div>
  );
}
