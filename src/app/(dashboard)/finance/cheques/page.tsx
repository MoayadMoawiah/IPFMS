"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { cheques } from "@/lib/mock-data/finance";
import type { Cheque } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<Cheque>[] = [
  { accessorKey: "number", header: "Cheque Number" },
  { accessorKey: "payee", header: "Payee" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
    cell: ({ row }) => formatDate(row.original.issueDate),
  },
  { accessorKey: "bankAccount", header: "Bank Account" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function ChequesPage() {
  return (
    <div>
      <PageHeader
        title="Cheque Management"
        description="Track issued cheques and clearance status"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Cheques" },
        ]}
      />
      <DataTable columns={columns} data={cheques} searchKey="payee" />
    </div>
  );
}
