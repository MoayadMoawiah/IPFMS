"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import { usePaymentRequests } from "@/hooks/use-finance";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatCurrency, formatDate } from "@/lib/formatters";

type PaymentRequestRow = {
  id: string;
  serialNumber: string;
  status: string;
  totalAmount: number | string;
  currency: string;
  requestDate: string;
  grant?: { code?: string } | null;
  invoice?: {
    serialNumber?: string;
    invoiceNumber?: string;
    vendor?: { name?: string } | null;
  } | null;
};

const columns: ColumnDef<PaymentRequestRow>[] = [
  {
    accessorKey: "serialNumber",
    header: "Request #",
    cell: ({ row }) => (
      <Link
        href={`/finance/payment-requests/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.serialNumber}
      </Link>
    ),
  },
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) =>
      row.original.invoice?.serialNumber ||
      row.original.invoice?.invoiceNumber ||
      "—",
  },
  {
    id: "vendor",
    header: "Vendor",
    cell: ({ row }) => row.original.invoice?.vendor?.name ?? "—",
  },
  {
    id: "grant",
    header: "Grant",
    cell: ({ row }) => row.original.grant?.code ?? "—",
  },
  {
    accessorKey: "requestDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.requestDate),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) =>
      formatCurrency(Number(row.original.totalAmount), row.original.currency),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status.toLowerCase()} />
    ),
  },
];

export default function PaymentRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError } = usePaymentRequests({
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    limit: 50,
  });

  const rows = getPaginatedItems(data) as PaymentRequestRow[];

  return (
    <div>
      <PageHeader
        title="Payment Requests"
        description="Request payment against approved, three-way-matched invoices"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Payment Requests" },
        ]}
        actions={
          <PermissionGate permission="PAYMENTS:CREATE">
            <Button asChild>
              <Link href="/finance/payment-requests/new">
                <Plus className="h-4 w-4" />
                New Payment Request
              </Link>
            </Button>
          </PermissionGate>
        }
      />

      {isLoading && <LoadingSkeleton variant="table" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm">Failed to load payment requests</p>
        </div>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={rows}
          searchKey="serialNumber"
          searchPlaceholder="Search payment requests..."
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
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}
