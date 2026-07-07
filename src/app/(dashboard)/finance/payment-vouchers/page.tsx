"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { paymentVouchers } from "@/lib/mock-data/finance";
import type { PaymentVoucher } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: ColumnDef<PaymentVoucher>[] = [
  {
    accessorKey: "number",
    header: "PV Number",
    cell: ({ row }) => (
      <Link href={`/finance/payment-vouchers/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.original.number}
      </Link>
    ),
  },
  { accessorKey: "payee", header: "Payee" },
  { accessorKey: "grantName", header: "Grant" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  { accessorKey: "paymentMethod", header: "Method", cell: ({ row }) => row.original.paymentMethod.replace("_", " ") },
  {
    accessorKey: "requestDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.requestDate),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/finance/payment-vouchers/${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
];

export default function PaymentVouchersPage() {
  return (
    <div>
      <PageHeader
        title="Payment Vouchers"
        description="Create and track payment vouchers with multi-stage approval"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Finance" },
          { label: "Payment Vouchers" },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        }
      />
      <DataTable columns={columns} data={paymentVouchers} searchKey="payee" />
    </div>
  );
}
