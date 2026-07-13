"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { usePaymentVouchers } from "@/hooks/use-finance";
import { getPaginatedItems } from "@/lib/api/pagination";
import { mapPaymentVoucherRow } from "@/lib/mappers/api-list-mappers";
import { formatCurrency, formatDate } from "@/lib/formatters";

type PV = ReturnType<typeof mapPaymentVoucherRow>;

const columns: ColumnDef<PV>[] = [
  {
    accessorKey: "pvNumber",
    header: "PV Number",
    cell: ({ row }) => (
      <Link href={`/finance/payment-vouchers/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.original.pvNumber}
      </Link>
    ),
  },
  { accessorKey: "payee", header: "Payee", cell: ({ row }) => row.original.payee ?? '—' },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "grantCode", header: "Grant", cell: ({ row }) => row.original.grantCode ?? '—' },
  { accessorKey: "createdAt", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency) },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} /> },
];

export default function PaymentVouchersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError } = usePaymentVouchers({
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 50,
  });

  const pvs = getPaginatedItems(data).map((pv) =>
    mapPaymentVoucherRow(pv as Record<string, unknown>)
  );

  return (
    <div>
      <PageHeader
        title="Payment Vouchers"
        description="Manage payment requests, approvals, and disbursements"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Payment Vouchers" },
        ]}
        actions={
          <Button asChild>
            <Link href="/finance/payment-vouchers/new">
              <Plus className="h-4 w-4" />
              New Payment Voucher
            </Link>
          </Button>
        }
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load payment vouchers</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={pvs}
          searchKey="pvNumber"
          searchPlaceholder="Search payment vouchers..."
          filters={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}
