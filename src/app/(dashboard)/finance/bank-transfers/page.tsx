"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { bankTransfers } from "@/lib/mock-data/finance";
import type { BankTransfer } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<BankTransfer>[] = [
  { accessorKey: "reference", header: "Reference" },
  { accessorKey: "beneficiary", header: "Beneficiary" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  { accessorKey: "bankName", header: "Bank" },
  {
    accessorKey: "transferDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.transferDate),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function BankTransfersPage() {
  return (
    <div>
      <PageHeader
        title="Bank Transfers"
        description="Manage bank transfer payments to vendors and partners"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Bank Transfers" },
        ]}
      />
      <DataTable columns={columns} data={bankTransfers} searchKey="beneficiary" />
    </div>
  );
}
